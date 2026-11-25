"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import type { Experience } from "sanity-lib";
import { CompanyLogo } from "./CompanyLogo";
import SectionHeader, { HighlightPill } from "./SectionHeader";
import { TechIcon } from "./TechIcon";

// Curated authentic tech stacks for Sai's experiences
const EXPERIENCE_TECH_MAP: Record<string, string[]> = {
  worldvisa: [
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "Convex",
    "Socket.IO",
    "Sanity",
    "OpenAI",
    "Perplexity",
    "Tailwind CSS",
  ],
  "mern stack consultant": [
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "AWS",
    "Redis",
    "Docker",
    "Tailwind CSS",
  ],
  webomindapps: [
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "HTML5",
    "CSS3",
    "Git",
    "REST APIs",
  ],
};

function formatMonthYear(dateStr?: string): string {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}.${year}`;
}

function calculateDuration(startDateStr: string, endDateStr?: string): string {
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : new Date();

  if (isNaN(start.getTime())) return "";

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;
  if (months <= 0) months = 1;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (remainingMonths > 0) parts.push(`${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`);

  return parts.join(" ") || "1 mo";
}

function parseExperienceDescription(description?: any[]) {
  if (!description || !Array.isArray(description)) {
    return { summary: null, bullets: [] };
  }

  let summary: string | null = null;
  const bullets: string[] = [];

  for (const block of description) {
    if (block._type !== "block" || !block.children) continue;

    const text = block.children
      .map((c: any) => c.text || "")
      .join("")
      .trim();

    if (!text) continue;

    // Filter out intermediate section labels
    const lower = text.toLowerCase();
    if (lower === "key contributions:" || lower === "key contributions") {
      continue;
    }

    if (block.listItem === "bullet" || block.listItem === "number") {
      bullets.push(text);
    } else if (!summary) {
      summary = text;
    } else {
      bullets.push(text);
    }
  }

  return { summary, bullets };
}

interface ExperienceSectionProps {
  experiences?: Experience[];
}

export default function ExperienceSection({
  experiences = [],
}: ExperienceSectionProps) {
  // First item open by default; clicking toggles, opening one closes others
  const [openId, setOpenId] = useState<string | null>(() =>
    experiences.length > 0 ? experiences[0].id || experiences[0].companyName : null
  );

  const toggleExpand = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (!experiences || experiences.length === 0) return null;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="unique-section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Editorial 2-column layout on Desktop; clean single column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-14 items-start">
          
          {/* Left Contextual Column (Sticky on desktop) */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <SectionHeader
              badge="EXPERIENCE"
              badgeDot={true}
              headingId="experience-heading"
              title={
                <>
                  Where I&apos;ve <HighlightPill variant="green">worked</HighlightPill> & what I&apos;ve{" "}
                  <HighlightPill variant="coral">built.</HighlightPill>
                </>
              }
            />

            {/* Contextual metadata & natural overview */}
            <div className="hidden lg:flex flex-col gap-2.5 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>3+ Years Professional Work</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span>Full-Stack & Systems Engineering</span>
              </div>
              <p className="text-[13px] text-muted-foreground/80 leading-relaxed pt-1">
                A breakdown of teams, engineering responsibilities, and tools used across full-time and freelance projects.
              </p>
            </div>
          </div>

          {/* Right Main Column: Timeline Accordion */}
          <div className="min-w-0">
            <div className="relative border-l border-border/80 ml-1.5 sm:ml-4 pl-4 sm:pl-7 space-y-7 sm:space-y-9">
              {experiences.map((exp, index) => {
                const expKey = exp.id || exp.companyName || String(index);
                const isOpen = openId === expKey;
                const contentId = `exp-content-${index}`;

                const startDate = formatMonthYear(exp.startDate);
                const endDate = exp.endDate ? formatMonthYear(exp.endDate) : "Present";
                const duration = calculateDuration(exp.startDate, exp.endDate);

                const { summary, bullets } = parseExperienceDescription(exp.description);

                // Lookup technologies or fallback to core stack
                const lookupKey = exp.companyName.toLowerCase();
                const techs =
                  EXPERIENCE_TECH_MAP[lookupKey] ||
                  EXPERIENCE_TECH_MAP[
                    Object.keys(EXPERIENCE_TECH_MAP).find((k) =>
                      lookupKey.includes(k)
                    ) || ""
                  ] || [
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Node.js",
                    "Tailwind CSS",
                  ];

                return (
                  <article
                    key={expKey}
                    className="relative group transition-all duration-200"
                  >
                    {/* Horizontal connector tick from vertical timeline to card */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-4 sm:-left-7 top-4 w-4 sm:w-7 h-[1px] bg-border/80"
                    />

                    {/* ── Accordion Header Button ── */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(expKey)}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      className="w-full text-left flex items-start justify-between gap-3 sm:gap-4 py-1 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
                        {/* Real Company Logo from Sanity */}
                        <CompanyLogo
                          src={exp.logo}
                          name={exp.companyName}
                          className="mt-0.5"
                        />

                        {/* Role, Company & Metadata */}
                        <div className="min-w-0">
                          <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-[#111827] tracking-tight leading-snug">
                            {exp.designation}{" "}
                            <span className="text-[#6b7280] font-normal text-xs sm:text-sm md:text-base">
                              — {exp.companyName}
                            </span>
                          </h3>

                          {/* Subtitle metadata */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-[#6b7280]">
                            <span>{exp.employmentType || "Full-time"}</span>
                            <span aria-hidden="true" className="text-border">|</span>
                            <span>
                              {startDate}—{endDate}
                            </span>
                            {duration && (
                              <>
                                <span aria-hidden="true" className="text-border">|</span>
                                <span>{duration}</span>
                              </>
                            )}
                            {exp.location && (
                              <>
                                <span aria-hidden="true" className="text-[#9ca3af]">·</span>
                                <span>{exp.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Accordion Chevron toggle icon */}
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-[#6b7280] group-hover/btn:text-[#111827] transition-colors">
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ease-out",
                            isOpen && "rotate-180"
                          )}
                        />
                      </div>
                    </button>

                    {/* ── Accordion Body (Collapsible Content) ── */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={contentId}
                          role="region"
                          aria-labelledby={`exp-heading-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 sm:pt-4 pl-10 sm:pl-12 space-y-3.5 sm:space-y-4">
                            {/* High-level summary paragraph */}
                            {summary && (
                              <p className="text-[#4b5563] text-xs sm:text-sm leading-relaxed">
                                {summary}
                              </p>
                            )}

                            {/* Bullet points with soft circular dots */}
                            {bullets.length > 0 && (
                              <ul className="space-y-2 sm:space-y-2.5">
                                {bullets.map((point, bulletIdx) => (
                                  <li
                                    key={bulletIdx}
                                    className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4b5563] leading-relaxed"
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#9ca3af] shrink-0"
                                    />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Tech pill badges matching reference image */}
                            {techs.length > 0 && (
                              <div className="pt-2 sm:pt-3">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                  {techs.map((tech) => (
                                    <div
                                      key={tech}
                                      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-border/80 bg-white/80 hover:bg-white hover:border-[#111827]/40 text-[11px] sm:text-xs font-medium text-[#374151] transition-all duration-200 shadow-2xs select-none"
                                    >
                                      <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                                      <span>{tech}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
