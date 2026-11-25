"use client";

import { TECH_CATEGORIES } from "@/lib/consts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import { Technology } from "sanity-lib";
import SectionHeader, { HighlightPill } from "./SectionHeader";
import { TechIcon } from "./TechIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillsProps {
  technologies?: Technology[];
}

export default function Skills({ technologies = [] }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Group technologies strictly from Sanity data
  const groupedTech = technologies.reduce(
    (acc: Record<string, Technology[]>, tech) => {
      const category = tech.category?.trim() || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(tech);
      return acc;
    },
    {}
  );

  // Priority sorting for known categories, followed by any other dynamic categories in Sanity
  const preferredOrder = [
    ...TECH_CATEGORIES,
    "Frontend",
    "Backend",
    "AI & Automation",
    "Infrastructure",
    "Product & Integrations",
  ];

  const categories = Object.keys(groupedTech).sort((a, b) => {
    const idxA = preferredOrder.indexOf(a);
    const idxB = preferredOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const categoryElements =
        gsap.utils.toArray<HTMLElement>(".skill-category");

      categoryElements.forEach((category) => {
        const heading = category.querySelector(".category-title");
        const pills = category.querySelectorAll(".tech-pill-container");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: category,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        if (heading) {
          tl.fromTo(
            heading,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        }

        if (pills.length > 0) {
          tl.fromTo(
            pills,
            { opacity: 0, scale: 0.9, y: 10 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              stagger: 0.03,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [categories.length]);

  return (
    <section
      ref={containerRef}
      className="unique-section"
    >
      <div className="max-w-5xl mx-auto">
        {/* Centered Top Header */}
        <div className="mb-10 sm:mb-14">
          <SectionHeader
            badge="MY SKILLS"
            badgeDot={true}
            headingId="skills-heading"
            center={true}
            title={
              <>
                The tools I use to{" "}
                <HighlightPill variant="coral">build</HighlightPill> &{" "}
                <HighlightPill variant="green">scale.</HighlightPill>
              </>
            }
          />
        </div>

        {/* Centered Skills Categories */}
        <div className="space-y-8 sm:space-y-11 max-w-4xl mx-auto">
          {categories.map((category) => {
            const techList = groupedTech[category] || [];

            return (
              <div
                key={category}
                className="skill-category text-center"
              >
                {/* Category Title */}
                <h3 className="category-title text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground/80 mb-3.5">
                  {category}
                </h3>

                {/* Tech Pills (Centered with slightly increased font size & padding) */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  {techList.map((tech) => (
                    <div
                      key={tech.id || tech.title}
                      className="tech-pill-container"
                    >
                      <div className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-border/80 bg-white/90 hover:border-[#111827]/40 hover:bg-white hover:shadow-xs transition-all duration-200 text-[13px] sm:text-sm font-medium text-foreground cursor-default select-none shadow-2xs">
                        <TechIcon
                          name={tech.title}
                          image={tech.image}
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:scale-110 transition-transform duration-200"
                        />
                        <span>{tech.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
