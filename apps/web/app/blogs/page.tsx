import Image from "next/image";
import Link from "next/link";
import { getAllBlogs } from "sanity-lib";

// Using ISR to continually regenerate pages so that the user does not need to explicitly run builds every time they edit
export const revalidate = 3600;

export const metadata = {
  title: "Our Blog | Portfolio",
  description: "Read the latest news and insights from our team.",
};

export default async function BlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Blog</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blog posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              href={`/blogs/${blog.slug}`}
              key={blog.id}
              className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {ifHasImage(blog) && (
                <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={blog.mainImage!}
                    alt={blog.imageAlt || blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </p>
                <h2 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-gray-600 line-clamp-3">
                    {blog.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ifHasImage(blog: any) {
  return blog.mainImage && typeof blog.mainImage === "string" && blog.mainImage.length > 0;
}
