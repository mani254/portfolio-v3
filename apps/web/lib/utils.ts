import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export const PROJECT_SECTION_COLORS = [
  {
    backgroundColor: "#F8BBD0",
    boxColor: "#F48FB1",
    cursorColor: "#E91E63",
  },
  {
    backgroundColor: "#D1C4E9",
    boxColor: "#9575CD",
    cursorColor: "#673AB7",
  },
  {
    backgroundColor: "#FFCC80",
    boxColor: "#FFB74D",
    cursorColor: "#F57C00",
  }, {
    backgroundColor: "#E1BEE7",
    boxColor: "#CE93D8",
    cursorColor: "#8E24AA",
  }, {
    backgroundColor: "#BBDEFB",
    boxColor: "#64B5F6",
    cursorColor: "#1E88E5",
  }

]

export const getProjectColor = (index: number) => {
  return PROJECT_SECTION_COLORS[index % PROJECT_SECTION_COLORS.length]
}