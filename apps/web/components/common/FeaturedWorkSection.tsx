"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { FormatedProject } from "@/app/projects/page";
import SectionHeader, { HighlightPill } from "./SectionHeader";
import { TechIcon } from "./TechIcon";

interface FeaturedWorkSectionProps {
  projects: FormatedProject[];
}

export default function FeaturedWorkSection({
  projects = [],
}: FeaturedWorkSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Take top 4 projects for the featured showcase
  const featured = projects.slice(0, 4);

  const leftProjects = featured.filter((_, i) => i % 2 === 0);
  const rightProjects = featured.filter((_, i) => i % 2 === 1);

  // Smooth scroll-driven parallax using spring physics
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Column 1 and 2 move at subtly different speeds for continuous scroll glide
  const yLeft = useTransform(smoothProgress, [0, 1], [0, -25]);
  const yRight = useTransform(smoothProgress, [0, 1], [40, -60]);

  if (featured.length === 0) return null;

  return (
    <section id="work" ref={containerRef} className="unique-section">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
          <SectionHeader
            badge="FEATURED WORK"
            badgeDot={true}
            title={
              <>
                Selected <HighlightPill variant="green">projects</HighlightPill> &{" "}
                <HighlightPill variant="coral">craft.</HighlightPill>
              </>
            }
          />

          <Link
            href="/projects"
            className="group hidden md:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors pb-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Uneven Aligned 2-Column Grid with Increased Gap & Smooth Scroll Parallax ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-14 items-start">
          {/* Column 1 (Left) */}
          <motion.div
            style={{ y: yLeft }}
            className="space-y-10 sm:space-y-14 lg:space-y-20"
          >
            {leftProjects.map((project, idx) => {
              const originalIndex = idx * 2;
              return (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={originalIndex}
                />
              );
            })}
          </motion.div>

          {/* Column 2 (Right) — Pronounced uneven vertical offset */}
          <motion.div
            style={{ y: yRight }}
            className="space-y-10 sm:space-y-14 lg:space-y-20 md:pt-28 lg:pt-44"
          >
            {rightProjects.map((project, idx) => {
              const originalIndex = idx * 2 + 1;
              return (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={originalIndex}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/80 bg-white/80 text-xs font-semibold text-foreground shadow-2xs hover:bg-[#111827] hover:text-white transition-all duration-300"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: FormatedProject;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 45, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block overflow-hidden rounded-3xl border border-border/80 bg-white/80 hover:bg-white hover:border-[#111827]/40 p-4 sm:p-5 transition-all duration-400 ease-out hover:-translate-y-2 shadow-2xs hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.09)]"
      >
        {/* Visual Image */}
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-muted/20 border border-border/40 mb-4">
          {project.mainImage && (
            <Image
              src={project.mainImage}
              alt={project.mainImageAlt || `${project.title} - Featured project preview`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white tracking-wider">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Title & Arrow */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="font-heading font-semibold text-base sm:text-lg text-[#111827] tracking-tight group-hover:text-primary transition-colors duration-200">
            {project.title}
          </h3>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-white text-foreground group-hover:bg-[#111827] group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Context / Overview */}
        {project.overview && (
          <p className="text-xs sm:text-sm text-[#4b5563] line-clamp-2 leading-relaxed mb-3">
            {project.overview}
          </p>
        )}

        {/* Tech Tags */}
        {project.toolsAndLanguages && project.toolsAndLanguages.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-border/50">
            {project.toolsAndLanguages.slice(0, 4).map((tech) => (
              <div
                key={tech.id || tech.title}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-border/70 bg-white/80 text-[10px] sm:text-[11px] font-medium text-[#374151]"
              >
                <TechIcon name={tech.title} image={tech.image} className="w-3 h-3 shrink-0" />
                <span>{tech.title}</span>
              </div>
            ))}
            {project.toolsAndLanguages.length > 4 && (
              <span className="text-[10px] text-muted-foreground font-medium pl-0.5">
                +{project.toolsAndLanguages.length - 4}
              </span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
