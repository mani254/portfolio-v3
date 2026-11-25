"use client";

import type { FormatedProject } from "@/app/projects/page";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import ProjectsGrid from "./ProjectsGrid";
import ScrollingProjects from "./ScrollingProjects";

interface ProjectsViewContainerProps {
  projects: FormatedProject[];
}

export default function ProjectsViewContainer({
  projects,
}: ProjectsViewContainerProps) {
  const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll");

  return (
    <div className="w-full">
      {/* View Mode Toggle Controls */}
      <div className="px-6 md:px-12 flex items-center justify-between pb-6 pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {projects.length} Selected Projects
        </span>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full border border-border/80 bg-white/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("scroll")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none",
              viewMode === "scroll"
                ? "bg-[#111827] text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={viewMode === "scroll"}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                viewMode === "scroll" ? "bg-emerald-400" : "bg-muted-foreground/50"
              )}
            />
            <span>View Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none",
              viewMode === "grid"
                ? "bg-[#111827] text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={viewMode === "grid"}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                viewMode === "grid" ? "bg-emerald-400" : "bg-muted-foreground/50"
              )}
            />
            <span>Grid Mode</span>
          </button>
        </div>
      </div>

      {/* Render Active View Mode */}
      {viewMode === "scroll" ? (
        <ScrollingProjects projects={projects} />
      ) : (
        <ProjectsGrid projects={projects} />
      )}
    </div>
  );
}
