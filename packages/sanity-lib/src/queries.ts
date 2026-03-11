import { client } from "./client";
import { getImageUrl } from "./image";
import type { BlogPost, SanityBlog } from "./types";

export const ALL_BLOGS_QUERY = `*[_type == "blog" && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  excerpt
}`;

export const BLOG_BY_SLUG_QUERY = `*[_type == "blog" && slug.current == $slug && defined(publishedAt)][0] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  excerpt,
  body
}`;

function transformBlogToPost(sanityBlog: SanityBlog | null): BlogPost | null {
  if (!sanityBlog) return null;

  return {
    id: sanityBlog._id,
    title: sanityBlog.title || "Untitled Post",
    slug: sanityBlog.slug,
    // Provide a simple default main image if not present
    mainImage: sanityBlog.mainImage ? getImageUrl(sanityBlog.mainImage, 1200) : undefined,
    imageAlt: sanityBlog.mainImage?.alt || sanityBlog.title,
    publishedAt: sanityBlog.publishedAt,
    excerpt: sanityBlog.excerpt,
    body: sanityBlog.body,
  };
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    const sanityBlogs = await client.fetch<SanityBlog[]>(
      ALL_BLOGS_QUERY,
      {}
    );
    return sanityBlogs.map(b => transformBlogToPost(b)).filter((b): b is BlogPost => b !== null);
  } catch (error) {
    console.error("Error fetching all blogs from Sanity:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const sanityBlog = await client.fetch<SanityBlog | null>(
      BLOG_BY_SLUG_QUERY,
      { slug }
    );
    return transformBlogToPost(sanityBlog);
  } catch (error) {
    console.error("Error fetching blog by slug from Sanity:", error);
    return null;
  }
}
