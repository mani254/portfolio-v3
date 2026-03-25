"use client";

import { motion } from "framer-motion";

interface HamburgerProps {
  isActive: boolean;
  toggle: () => void;
}

export function Hamburger({ isActive, toggle }: HamburgerProps) {
  return (
    <button
      onClick={toggle}
      className="cursor-pointer relative flex items-center justify-center w-8 h-7 focus:outline-none group active:scale-90 transition-transform rounded-full"
      aria-label={isActive ? "Close Menu" : "Open Menu"}
    >
      <div className="relative w-8 h-3.5 flex flex-col items-end pointer-events-none">
        <motion.span
          initial={false}
          animate={isActive
            ? { rotate: 45, y: 5 }
            : { rotate: 0, y: 0 }
          }
          className="absolute top-0 right-0 block h-1 bg-foreground rounded-full origin-center w-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <motion.span
          initial={false}
          animate={isActive
            ? { rotate: -45, y: -5, width: "100%" }
            : { rotate: 0, y: 0, width: "75%" }
          }
          className="absolute bottom-0 right-0 block h-1 bg-foreground rounded-full origin-center"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </button>
  );
}
