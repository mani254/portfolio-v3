import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { Blog } from "sanity-lib";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link 
      href={`/blogs/${blog.slug}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
        {blog.mainImage ? (
          <Image
            src={blog.mainImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
             <span className="text-primary/40 font-semibold">{blog.title.charAt(0)}</span>
          </div>
        )}
        
        {blog.categories && blog.categories.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap z-10">
            {blog.categories.slice(0, 2).map((cat) => (
              <span 
                key={cat.id} 
                className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1 rounded-full border border-border/50 shadow-sm"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}
        
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 flex flex-col grow relative z-10 bg-card">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3 font-medium">
          <span className="text-primary">{blog.author}</span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5 opacity-80">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog.readTime}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        
        {blog.overview && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 grow">
            {blog.overview}
          </p>
        )}
        
        <div className="mt-auto pt-4 border-t border-border/50 text-sm font-bold text-primary flex items-center transition-transform group-hover:translate-x-1">
          Read article <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
