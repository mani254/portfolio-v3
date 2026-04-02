import BlogDetailsClient from "@/components/blogs/BlogDetailsClient";
import SmoothScroll from "@/components/common/SmoothScroll";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getPaginatedBlogs } from "sanity-lib";


export const revalidate = 60;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const { blogs } = await getPaginatedBlogs(1, 100);
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Portfolio",
      description: "The blog post you're looking for does not exist.",
    };
  }

  const title = `${blog.title} | Portfolio Blog`;
  const description = blog.overview || `Read ${blog.title} by ${blog.author}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(blog.mainImage && {
        images: [
          {
            url: blog.mainImage,
            width: 1200,
            height: 630,
            alt: blog.mainImageAlt || blog.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(blog.mainImage && { images: [blog.mainImage] }),
    },
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return <SmoothScroll><BlogDetailsClient blog={blog} /></SmoothScroll>;
}
