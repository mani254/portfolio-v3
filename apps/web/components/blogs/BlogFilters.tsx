"use client";

import Link from "next/link";
import { type BlogCategory } from "sanity-lib";

interface BlogFiltersProps {
  categories: BlogCategory[];
  currentCategory: string;
}

export default function BlogFilters({ categories, currentCategory }: BlogFiltersProps) {
  return (
    <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4">Topics</h3>
      
      <div className="flex flex-wrap lg:flex-col gap-2">
        <Link
          href="/blogs"
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            !currentCategory
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          All Posts
        </Link>
        
        {categories.map((cat) => {
          const isActive = currentCategory === cat.title;
          
          return (
            <Link
              key={cat.id}
              href={`/blogs?category=${encodeURIComponent(cat.title)}`}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              {cat.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
