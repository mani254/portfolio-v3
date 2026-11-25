import { cn } from "@/lib/utils";
import React from "react";

export interface HighlightPillProps {
  children: React.ReactNode;
  variant?: "green" | "coral" | "amber" | "sky" | "purple";
  className?: string;
}

export function HighlightPill({
  children,
  variant = "green",
  className,
}: HighlightPillProps) {
  const variantStyles = {
    green: "bg-[#dcfce7] text-[#111827]",
    coral: "bg-[#ffe4e6] text-[#111827]",
    amber: "bg-[#fef3c7] text-[#111827]",
    sky: "bg-[#e0f2fe] text-[#111827]",
    purple: "bg-[#ede9fe] text-[#111827]",
  };

  return (
    <span
      className={cn(
        "inline-block font-heading font-semibold rounded-full px-3.5 py-[2px] mx-0.5 align-baseline text-[0.88em]",
        variantStyles[variant] || variantStyles.green,
        className
      )}
    >
      {children}
    </span>
  );
}

export interface SectionHeaderProps {
  id?: string;
  headingId?: string;
  badge?: string;
  badgeDot?: boolean;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function SectionHeader({
  id,
  headingId,
  badge,
  badgeDot = true,
  title,
  subtitle,
  center = false,
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  return (
    <header
      id={id}
      className={cn(
        "space-y-3",
        center && "text-center flex flex-col items-center mx-auto",
        className
      )}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 mb-2">
          {badgeDot && (
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
          <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
            {badge}
          </span>
        </div>
      )}

      <h2
        id={headingId}
        className={cn(
          "leading-relaxed font-heading",
          center && "text-center",
          titleClassName
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "text-[#4b5563] text-sm md:text-base leading-relaxed max-w-2xl",
            center && "mx-auto text-center",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
