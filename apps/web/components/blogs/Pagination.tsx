import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentCategory: string;
}

export default function Pagination({ currentPage, totalPages, currentCategory }: PaginationProps) {
  const getPageUrl = (page: number) => {
    let url = `/blogs?page=${page}`;
    if (currentCategory) {
      url += `&category=${encodeURIComponent(currentCategory)}`;
    }
    return url;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted/50 text-muted-foreground/50 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </div>
      )}

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Link
                key={page}
                href={getPageUrl(page)}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all ${page === currentPage
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
              >
                {page}
              </Link>
            );
          }

          if (page === 2 && currentPage > 3) {
            return <div key={page} className="flex items-end justify-center w-6 h-10 text-muted-foreground px-1">...</div>;
          }
          if (page === totalPages - 1 && currentPage < totalPages - 2) {
            return <div key={page} className="flex items-end justify-center w-6 h-10 text-muted-foreground px-1">...</div>;
          }

          return null;
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted/50 text-muted-foreground/50 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
