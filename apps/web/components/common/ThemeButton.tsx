"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 flex items-center justify-center rounded-full shrink-0" />
    );
  }

  // currentTheme handles the system preference if enabled
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="cursor-pointer relative h-8 w-8 flex items-center justify-center active:scale-90 transition-transform shrink-0"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-[1.1rem] w-[1.1rem] text-primary" />
          ) : (
            <Sun className="h-[1.1rem] w-[1.1rem] text-amber-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
