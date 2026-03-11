import { MetadataRoute } from "next";
import { getAllBlogs } from "sanity-lib";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"; // Requires env config for prod

  // Initial standard routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const blogs = await getAllBlogs();

    // Append all dynamic blogs
    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...routes, ...blogRoutes];
  } catch (err) {
    console.error("Failed to generate sitemap for blogs:", err);
    return routes;
  }
}
