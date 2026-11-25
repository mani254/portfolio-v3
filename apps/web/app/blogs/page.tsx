import BlogCard from "@/components/blogs/BlogCard";
import BlogFilters from "@/components/blogs/BlogFilters";
import Pagination from "@/components/blogs/Pagination";
import CtaPro from "@/components/common/Cta";
import SmoothScroll from "@/components/common/SmoothScroll";
import { getBlogCategories, getPaginatedBlogs } from "sanity-lib";

export const revalidate = 60;

export const metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, architecture, and the craft of building.",
};

interface BlogsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const category = resolvedSearchParams.category || "";
  const limit = 6;

  const [{ blogs, total }, categories] = await Promise.all([
    getPaginatedBlogs(page, limit, category),
    getBlogCategories(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <SmoothScroll>
      <div className="pt-16 md:pt-0">
        {/* Page header */}
        <div className="px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 md:pt-12 pb-6">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-[0.15em] uppercase mb-1.5">
            Writing
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            My Blog
          </h1>
        </div>

        <div className="px-4 sm:px-6 md:px-12 pb-16 md:pb-24">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Filters sidebar */}
            <div className="lg:w-56 shrink-0">
              <BlogFilters
                categories={categories}
                currentCategory={category}
              />
            </div>

            {/* Blog list */}
            <div className="flex-1 flex flex-col min-h-[50vh]">
              {blogs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {blogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-auto pt-8 border-t border-border">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        currentCategory={category}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border text-center bg-muted/20">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    No posts found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <CtaPro />
      </div>
    </SmoothScroll>
  );
}
