"use client";

import type { FormatedProject } from "@/app/projects/page";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TechIcon } from "../common/TechIcon";

interface MobileProjectsProps {
  projects: FormatedProject[];
}

export default function MobileProjects({ projects }: MobileProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-6 px-4 py-4">
      {projects.map((project, index) => (
        <Link
          key={project._id}
          href={`/projects/${project.slug}`}
          className="group block overflow-hidden rounded-2xl border border-border/80 bg-white/85 p-3.5 sm:p-4 shadow-2xs active:scale-[0.99] transition-all"
        >
          {/* 1. Project Visual with index badge */}
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted/20 border border-border/40 mb-3">
            {project.mainImage && (
              <Image
                src={project.mainImage}
                alt={project.mainImageAlt || `${project.title} - Project preview`}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            )}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-semibold text-white">
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>

          {/* 2. Project Name & Arrow */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-heading font-semibold text-base text-[#111827] tracking-tight group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/40 text-foreground group-hover:bg-[#111827] group-hover:text-white transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 3. Short Context (max 2 lines) */}
          {project.overview && (
            <p className="text-xs text-[#4b5563] line-clamp-2 leading-relaxed mb-3">
              {project.overview}
            </p>
          )}

          {/* 4. Technologies (compact pills) */}
          {project.toolsAndLanguages && project.toolsAndLanguages.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
              {project.toolsAndLanguages.slice(0, 4).map((tech) => (
                <div
                  key={tech.id || tech.title}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border/70 bg-white text-[10px] font-medium text-[#374151]"
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
      ))}
    </div>
  );
}
