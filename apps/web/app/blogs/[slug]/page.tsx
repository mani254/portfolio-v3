import CommonPortableTextComponent from "@/components/common/PortableTextComponent";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogs, getBlogBySlug } from "sanity-lib";

export const revalidate = 3600;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const isDev = process.env.NODE_ENV === "development";
  try {
    const blogs = await getAllBlogs();
    const pages = blogs.map((blog) => ({
      slug: blog.slug,
    }));

    if (isDev) {
      console.log(`[generateStaticParams] Generated ${pages.length} blog pages for static generation`);
    }

    return pages;
  } catch (error) {
    if (isDev) {
      console.error("[generateStaticParams] Error generating static params for blogs:", error);
    }
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
  const description = blog.excerpt || `Read our latest blog post about ${blog.title}`;

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
            alt: blog.imageAlt || blog.title,
          },
        ],
      }),
      publishedTime: blog.publishedAt,
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

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/blogs" className="text-primary hover:text-primary/80 transition-colors mb-8 inline-block">
        &larr; Back to Blogs
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{blog.title}</h1>
        <div className="text-muted-foreground">
          <time dateTime={blog.publishedAt}>
            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {blog.mainImage && (
        <div className="mb-10 rounded-xl overflow-hidden shadow-md relative w-full aspect-video border border-border">
          <Image
            src={blog.mainImage}
            alt={blog.imageAlt || blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-none text-foreground">
        {blog.body && blog.body.length > 0 ? (
          <PortableText components={CommonPortableTextComponent} value={blog.body} />
        ) : (
          <p className="text-muted-foreground italic">This post has no additional content.</p>
        )}
      </div>
    </article>
  );
}
