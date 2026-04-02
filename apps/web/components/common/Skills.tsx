"use client";

import { TECH_CATEGORIES } from "@/lib/consts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Technology } from "sanity-lib";
import SectionHeading from "./SectionHeading";
import TechPill from "./TechPill";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GroupedTechnologies {
  [key: string]: Technology[];
}

const Skills = ({ technologies }: { technologies: Technology[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const groupedTech = technologies.reduce((acc: GroupedTechnologies, tech) => {
    const category = tech.category && TECH_CATEGORIES.includes(tech.category)
      ? tech.category
      : "Other";

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {});

  const categories = TECH_CATEGORIES.filter(cat => groupedTech[cat] && groupedTech[cat].length > 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const categoryElements = gsap.utils.toArray<HTMLElement>(".skill-category");

      categoryElements.forEach((category) => {
        const heading = category.querySelector("h3");
        const pills = category.querySelectorAll(".tech-pill-container");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: category,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        });

        if (heading) {
          tl.fromTo(heading,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );
        }

        if (pills.length > 0) {
          tl.fromTo(pills,
            { opacity: 0, scale: 0.8, y: 20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.6,
              ease: "back.out(1.7)"
            },
            "-=0.6"
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [technologies]);

  return (
    <section ref={containerRef}>
      <div className="container py-12">
        <div className="text-center mb-6">
          <SectionHeading
            heading="Technologies"
            spanContent="Behind My Work"
            breakBeforeSpan={true}
          />
        </div>
        {categories.map((category) => (
          <div
            key={category}
            className="skill-category relative mb-6 max-w-4xl m-auto"
          >
            <h3 className="text-2xl text-center mb-3 text-foreground/30 font-bold">
              {category}
            </h3>

            <div className="flex gap-4 flex-wrap items-center justify-center">
              {groupedTech[category].map((tech) => (
                <div key={tech.id} className="tech-pill-container">
                  <TechPill tech={tech} className="backdrop-blur-[5px]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

