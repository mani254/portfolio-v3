"use client";

import { useState } from "react";
import { Hamburger } from "./Hamburger";
import { MobileMenuContent } from "./MobileMenuContent";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [menuActive, setMenuActive] = useState(false);

  return (
    <>
      {/* Top bar — mobile only, stays on top with z-[80] so the animated toggle is always visible and clickable */}
      <header
        className={cn(
          "flex md:hidden fixed top-0 left-0 right-0 z-[80] px-5 py-3.5 items-center justify-between transition-all duration-300",
          menuActive
            ? "bg-transparent"
            : "bg-background/85 backdrop-blur-md border-b border-border/60"
        )}
      >
        {/* Logo / Name */}
        <Link
          href="/"
          onClick={() => setMenuActive(false)}
          className="text-sm font-bold text-foreground tracking-tight select-none"
        >
          Sai Manikanta
        </Link>

        {/* Single animated toggle button that transforms into an 'X' */}
        <div className="flex items-center">
          <Hamburger
            isActive={menuActive}
            toggle={() => setMenuActive((v) => !v)}
          />
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <MobileMenuContent
        menuActive={menuActive}
        onClose={() => setMenuActive(false)}
      />
    </>
  );
}
