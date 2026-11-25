"use client";

import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface CompanyLogoProps {
  src?: string;
  name: string;
  className?: string;
}

export function CompanyLogo({ src, name, className }: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback initials if logo is unavailable
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-white shadow-2xs overflow-hidden transition-all duration-200 group-hover:border-[#111827]/40",
        className
      )}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={`${name} logo`}
          fill
          unoptimized
          sizes="(max-width: 640px) 32px, 36px"
          className="object-contain p-1 rounded-lg"
          onError={() => setImageError(true)}
        />
      ) : initials ? (
        <span className="text-[11px] font-bold text-[#111827] tracking-tight">
          {initials}
        </span>
      ) : (
        <Building2 className="h-4 w-4 text-[#4b5563]" />
      )}
    </div>
  );
}
