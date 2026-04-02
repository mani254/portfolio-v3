"use client";

import { useEffect, useRef } from "react";
import type { Education } from "sanity-lib";
import SectionHeading from "../common/SectionHeading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap } from "lucide-react";

export default function EducationSection({ educationList }: { educationList: Education[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-card", 
        {
          y: 50,
          opacity: 0,
        },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  if (!educationList || educationList.length === 0) return null;

  return (
    <section className="page-section relative" ref={containerRef}>
      <SectionHeading className="mb-16 text-center" heading="My Academic" spanContent="Journey" breakBeforeSpan />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
        {educationList.map((edu) => {
          const startYear = new Date(edu.startDate).getFullYear();
          const endYear = edu.endDate ? new Date(edu.endDate).getFullYear() : "Present";
          
          return (
            <div
              key={edu.id}
              className="edu-card opacity-0 relative group flex flex-col justify-between p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Glassmorphic Gradient Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="inline-flex py-1 px-3 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-semibold backdrop-blur-sm border border-border/50">
                    {startYear} — {endYear}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                  {edu.course}
                </h3>
                
                <h4 className="text-primary font-medium mb-6">
                  {edu.university}
                </h4>
              </div>

              <div className="relative z-10 space-y-3 pt-6 border-t border-border/50">
                {edu.stream && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Major</span>
                    <span className="font-semibold text-foreground text-right">{edu.stream}</span>
                  </div>
                )}
                {edu.percentage && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-semibold text-foreground text-right">{edu.percentage}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
}
