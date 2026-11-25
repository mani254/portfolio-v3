import { MetadataRoute } from "next";
import { getAllProjects, getAllBlogs } from "sanity-lib";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:1234")
  ).replace(/\/$/, "");

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [projects, blogs] = await Promise.all([
      getAllProjects().catch(() => []),
      getAllBlogs().catch(() => []),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = projects
      .filter((project) => Boolean(project.slug))
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    const blogRoutes: MetadataRoute.Sitemap = blogs
      .filter((blog) => Boolean(blog.slug))
      .map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...projectRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}

