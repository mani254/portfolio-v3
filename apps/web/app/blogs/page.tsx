import CommonBanner from "@/components/common/CommonBanner";
import CtaPro from "@/components/common/Cta";
import SmoothScroll from "@/components/common/SmoothScroll";
import { getBlogCategories, getPaginatedBlogs } from "sanity-lib";
import BlogCard from "@/components/blogs/BlogCard";
import BlogFilters from "@/components/blogs/BlogFilters";
import Pagination from "@/components/blogs/Pagination";


export const revalidate = 60; // Revalidate every minute instead of hour since blogs update often

export const metadata = {
  title: "Blogs | Portfolio",
  description: "Read my latest articles and thoughts on software engineering.",
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
      <div>
        <CommonBanner title="My Blog" />
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left/Top side: Filters */}
            <div className="lg:w-1/4 shrink-0">
              <BlogFilters categories={categories} currentCategory={category} />
            </div>

            {/* Right/Bottom side: Blog List */}
            <div className="lg:w-3/4 flex flex-col min-h-screen">
              {blogs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                     {blogs.map((blog) => (
                       <BlogCard key={blog.id} blog={blog} />
                     ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="mt-auto pt-8 border-t border-border">
                      <Pagination currentPage={page} totalPages={totalPages} currentCategory={category} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border text-center">
                   <h3 className="text-2xl font-bold mb-2 text-foreground">No blogs found</h3>
                   <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
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
