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
    light: {
      backgroundColor: "#F8BBD0",
      boxColor: "#F48FB1",
      cursorColor: "#E91E63",
    },
    dark: {
      backgroundColor: "#1a1013",
      boxColor: "#3d1c24",
      cursorColor: "#ff4081",
    }
  },
  {
    light: {
      backgroundColor: "#D1C4E9",
      boxColor: "#9575CD",
      cursorColor: "#673AB7",
    },
    dark: {
      backgroundColor: "#110e1a",
      boxColor: "#211a3d",
      cursorColor: "#b39ddb",
    }
  },
  {
    light: {
      backgroundColor: "#FFCC80",
      boxColor: "#FFB74D",
      cursorColor: "#F57C00",
    },
    dark: {
      backgroundColor: "#1a150e",
      boxColor: "#3d2e1c",
      cursorColor: "#ffb74d",
    }
  },
  {
    light: {
      backgroundColor: "#E1BEE7",
      boxColor: "#CE93D8",
      cursorColor: "#8E24AA",
    },
    dark: {
      backgroundColor: "#16111a",
      boxColor: "#2d1c3d",
      cursorColor: "#e1bee7",
    }
  },
  {
    light: {
      backgroundColor: "#BBDEFB",
      boxColor: "#64B5F6",
      cursorColor: "#1E88E5",
    },
    dark: {
      backgroundColor: "#0e131a",
      boxColor: "#1c2a3d",
      cursorColor: "#90caf9",
    }
  }
]

export function getCursorColor() {
  let theme = "light"
  if (typeof window !== "undefined") {
    theme = localStorage.getItem("theme") || "light"
  }
  if (theme == "light") {
    return "#35353B88"
  }
  else {
    return "#D5D5D988"
  }
}
export function getCursorBackgroundColor() {
  let theme = "light"
  if (typeof window !== "undefined") {
    theme = localStorage.getItem("theme") || "light"
  }
  if (theme == "light") {
    return "rgba(85,85,85,0.1)"
  }
  else {
    return "rgba(213,213,217,0.1)"
  }
}

export const getProjectColor = (index: number, theme: string = "light") => {
  const color = PROJECT_SECTION_COLORS[index % PROJECT_SECTION_COLORS.length];
  return theme === "dark" ? color.dark : color.light;
}