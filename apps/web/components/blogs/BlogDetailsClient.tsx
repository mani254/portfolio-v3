"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft, ArrowRight, BookOpen, Layers } from "lucide-react";
import { PortableText } from "@portabletext/react";
import CommonPortableTextComponent from "@/components/common/PortableTextComponent";
import { Blog } from "sanity-lib";

export default function BlogDetailsClient({ blog }: { blog: Blog }) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", label: "Overview", condition: !!blog.overview },
  ];

  if (blog.sections && blog.sections.length > 0) {
    blog.sections.forEach((sec, idx) => {
      if (sec.title && sec.description) {
        sections.push({ 
          id: `section-${idx}`, 
          label: sec.title, 
          condition: true 
        });
      }
    });
  }

  const visibleSections = sections.filter(s => s.condition);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    visibleSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-12">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto lg:mx-0 mb-8 sm:mb-10">
          <Link href="/blogs" className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Articles
          </Link>

          {/* Series badge if part of a multi-article journey */}
          {blog.series?.title && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>
                {blog.series.title} {blog.series.part ? `· Part ${blog.series.part}` : ""}
              </span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.category && (
              <span className="bg-primary/15 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/25">
                {blog.category.title}
              </span>
            )}
            {blog.categories?.filter(c => c.id !== blog.category?.id).map(cat => (
              <span key={cat.id} className="bg-card text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border/80 shadow-2xs">
                {cat.title}
              </span>
            ))}
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 leading-snug tracking-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/50 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
                {blog.author.charAt(0)}
              </div>
              <span className="font-semibold text-foreground">{blog.author}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border md:block hidden" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {/* Main Image */}
        {blog.mainImage && (
          <div className="relative w-full aspect-21/9 md:aspect-3/1 rounded-3xl overflow-hidden mb-16 shadow-2xl bg-muted border border-border">
            <Image
              src={blog.mainImage}
              alt={blog.mainImageAlt || blog.title || "Blog cover image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-16 relative">
          {/* Left Column - Content */}
          <div className="lg:w-3/4 pb-24 mx-auto lg:mx-0 min-w-0 w-full max-w-4xl px-4 lg:px-0">
            
            {/* Overview */}
            {blog.overview && (
              <section id="overview" className="scroll-mt-32 mb-16">
                 <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed border-l-4 border-primary pl-6 py-2">
                   {blog.overview}
                 </p>
              </section>
            )}

            {/* Sections */}
            {blog.sections?.map((section, idx) => {
              if (!section.title || !section.description) return null;
              
              return (
                <section id={`section-${idx}`} key={idx} className="scroll-mt-32 mb-20">
                  <h2 className="text-3xl font-bold text-foreground mb-8 pb-4 border-b border-border/30">{section.title}</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl prose-img:shadow-lg prose-pre:bg-muted prose-pre:border prose-pre:border-border text-muted-foreground">
                    <PortableText components={CommonPortableTextComponent} value={section.description} />
                  </div>
                </section>
              );
            })}

            {/* Tags & Topics */}
            {((blog.tags && blog.tags.length > 0) || (blog.keywords && blog.keywords.length > 0)) && (
              <div className="mt-14 pt-8 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Tags & Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-muted/70 text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg border border-border">
                      #{tag}
                    </span>
                  ))}
                  {blog.keywords?.filter(k => !blog.tags?.includes(k)).map(keyword => (
                    <span key={keyword} className="inline-flex items-center bg-muted/40 text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-lg border border-border/60">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Series Progression: Previous / Next Post */}
            {(blog.previousPost || blog.nextPost) && (
              <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blog.previousPost ? (
                  <Link
                    href={`/blogs/${blog.previousPost.slug}`}
                    className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 group-hover:text-primary transition-colors">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Previous Lesson
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.previousPost.title}
                      </h4>
                    </div>
                    {blog.previousPost.readTime && (
                      <span className="text-xs text-muted-foreground mt-3 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {blog.previousPost.readTime}
                      </span>
                    )}
                  </Link>
                ) : <div className="hidden sm:block" />}

                {blog.nextPost && (
                  <Link
                    href={`/blogs/${blog.nextPost.slug}`}
                    className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left sm:text-right"
                  >
                    <div>
                      <span className="inline-flex items-center sm:justify-end gap-1 text-[11px] font-bold uppercase tracking-wider text-primary mb-1.5">
                        Next Lesson <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.nextPost.title}
                      </h4>
                    </div>
                    {blog.nextPost.readTime && (
                      <span className="text-xs text-muted-foreground mt-3 flex items-center sm:justify-end gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {blog.nextPost.readTime}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            )}

            {/* Related / Recommended Posts */}
            {blog.relatedPosts && blog.relatedPosts.length > 0 && (
              <div className="mt-14 pt-8 border-t border-border">
                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Recommended Reading
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blog.relatedPosts.map(related => (
                    <Link
                      key={related.id}
                      href={`/blogs/${related.slug}`}
                      className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {related.title}
                      </h4>
                      {related.overview && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {related.overview}
                        </p>
                      )}
                      {related.readTime && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" /> {related.readTime}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* Right Column - Navigation */}
          {visibleSections.length > 1 && (
            <div className="lg:w-1/4 hidden lg:block border-l border-border/50 pl-8 relative">
              <div className="sticky top-32">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                  <span>Table of Contents</span>
                </h3>
                <nav className="flex flex-col space-y-4">
                  {visibleSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        const el = document.getElementById(section.id);
                        if (el) {
                          const top = el.getBoundingClientRect().top + window.scrollY - 100;
                          window.scrollTo({ top, behavior: "smooth" });
                        }
                      }}
                      className={`text-left text-sm transition-all duration-300 relative py-1 ${activeSection === section.id
                        ? "text-primary font-bold translate-x-1"
                        : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                        }`}
                    >
                      {activeSection === section.id && (
                        <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                      )}
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
