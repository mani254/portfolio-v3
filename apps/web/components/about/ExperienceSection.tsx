"use client";

import { PortableText } from "@portabletext/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Calendar, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Experience } from "sanity-lib";
import SectionHeading from "../common/SectionHeading";
import ExperiencePortable from "./ExperiencePortable";

function ExperienceItem({ exp }: { exp: Experience }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if content is long enough to need "Show More"
  const isLong = (() => {
    if (!exp.description || !Array.isArray(exp.description)) return false;
    if (exp.description.length > 2) return true; // More than 2 paragraphs/blocks

    const textLength = exp.description.reduce((total: number, block: { children?: { text?: string }[] }) => {
      if (block.children && Array.isArray(block.children)) {
        return total + block.children.reduce((acc: number, child: { text?: string }) => acc + (child.text?.length || 0), 0);
      }
      return total;
    }, 0);

    return textLength > 200; // About 3-4 lines of text
  })();

  const startDate = new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const endDate = exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";

  return (
    <div className="flex flex-col md:flex-row w-full group relative">
      <div className="md:w-[25%] flex flex-col items-start md:items-end md:pr-10 md:text-right pl-6 md:pl-0">
        <div className="flex flex-row-reverse md:flex-row items-center gap-3 md:gap-4 mb-2 md:mb-3 self-start md:self-end">
          <h3 className="text-lg md:text-2xl font-bold text-foreground">{exp.companyName}</h3>
          {exp.logo && (
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg overflow-hidden bg-background border border-border shrink-0 relative">
              <Image
                src={exp.logo}
                alt={exp.companyName}
                fill
                unoptimized
                className="object-contain p-1 rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap md:flex-col items-center md:items-end gap-x-3 gap-y-1 md:gap-y-2 text-muted-foreground self-start md:self-end text-xs md:text-sm">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span>{startDate} - {endDate}</span>
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 order-first md:order-last shrink-0" />
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <span>{exp.location}</span>
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 order-first md:order-last shrink-0" />
          </div>

          {exp.employmentType && (
            <div className="flex items-center gap-1.5 md:gap-2">
              <span>{exp.employmentType}</span>
              <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 order-first md:order-last shrink-0" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-1 md:left-[25%] transform -translate-x-1/2 mt-2 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-[0_0_10px_rgba(var(--primary),0.3)] z-10 transition-transform duration-300 group-hover:scale-150" />

      <div className="md:w-[75%] pl-6 md:pl-10 pt-3 md:pt-0">
        <h4 className="text-lg md:text-2xl font-bold text-foreground mb-2 md:mb-3">{exp.designation}</h4>
        {exp.description && (
          <div className="flex flex-col items-start w-full">
            <div
              className={`prose prose-sm md:prose-base dark:prose-invert max-w-full text-muted-foreground w-full ${isLong && !isExpanded ? 'line-clamp-4' : ''}`}
            >
              <PortableText components={ExperiencePortable} value={exp.description} />
            </div>

            {isLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover-link text-primary text-sm font-semibold mt-2 focus:outline-none flex items-center gap-1"
              >
                {isExpanded ? "Show less" : "Show more"}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="page-section max-w-5xl relative w-full mx-auto" ref={containerRef}>
      <SectionHeading className="mb-16 text-center" heading="My Work" spanContent="Experience" breakBeforeSpan />

      <div className="relative">
        <div className="absolute left-1 md:left-[25%] top-0 bottom-0 w-[2px] bg-border transform -translate-x-1/2 rounded-full" />

        <motion.div
          className="absolute left-1 md:left-[25%] top-0 w-[2px] bg-primary transform -translate-x-1/2 rounded-full origin-top"
          style={{ height: progressHeight }}
        />

        <div className="flex flex-col gap-16 md:gap-24 relative z-10">
          {experiences.map((exp) => (
            <ExperienceItem key={exp.id} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
