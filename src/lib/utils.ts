import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NarrativeMode } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function modeLabel(mode: NarrativeMode): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

export function modeAccentClass(mode: NarrativeMode): string {
  switch (mode) {
    case "punk": return "text-magenta";
    case "fashion": return "text-chalk";
    case "cinema": return "text-neon";
  }
}

export function modeBorderClass(mode: NarrativeMode): string {
  switch (mode) {
    case "punk": return "border-magenta";
    case "fashion": return "border-chalk";
    case "cinema": return "border-neon";
  }
}

export function modeBgClass(mode: NarrativeMode): string {
  switch (mode) {
    case "punk": return "bg-magenta";
    case "fashion": return "bg-chalk";
    case "cinema": return "bg-neon";
  }
}
