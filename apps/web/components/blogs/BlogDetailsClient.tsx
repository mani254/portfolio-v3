"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import CommonPortableTextComponent from "@/components/common/PortableTextComponent";
import { Blog } from "sanity-lib";
import CommonBanner from "@/components/common/CommonBanner";

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
      <CommonBanner title="Blog" />
      <div className="container py-12 md:py-20 lg:py-24">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto lg:mx-0 mb-12">
          <Link href="/blogs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.categories?.map(cat => (
              <span key={cat.id} className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                {cat.title}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-8 leading-tight">
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
              alt={blog.mainImageAlt || blog.title}
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

            {/* Keywords */}
            {blog.keywords && blog.keywords.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Related Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.keywords.map(keyword => (
                    <span key={keyword} className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer px-4 py-2 rounded-xl text-sm font-medium border border-border">
                      #{keyword}
                    </span>
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
