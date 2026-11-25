import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── Project scroll section colors (light-only palette) ── */
export const PROJECT_SECTION_COLORS = [
  {
    backgroundColor: "#FFF0F5",   // soft rose
    boxColor: "#FFD6E7",
    cursorColor: "#E91E63",
  },
  {
    backgroundColor: "#F3EEFF",   // soft lavender
    boxColor: "#D9C5FB",
    cursorColor: "#7C3AED",
  },
  {
    backgroundColor: "#FFF8EC",   // soft amber
    boxColor: "#FFE4A8",
    cursorColor: "#D97706",
  },
  {
    backgroundColor: "#EEFBF4",   // soft mint
    boxColor: "#BBF0D4",
    cursorColor: "#059669",
  },
  {
    backgroundColor: "#EEF4FF",   // soft sky
    boxColor: "#BFDBFE",
    cursorColor: "#1D4ED8",
  },
];

/* ── Cursor helpers (light-only) ── */
export function getCursorColor(): string {
  return "#1a1a1888";
}

export function getCursorBackgroundColor(): string {
  return "rgba(26, 26, 24, 0.06)";
}

/* ── Project section color getter (theme param kept for compat but always light) ── */
export const getProjectColor = (index: number, _theme = "light") => {
  return PROJECT_SECTION_COLORS[index % PROJECT_SECTION_COLORS.length];
};