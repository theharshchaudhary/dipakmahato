import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Staggers an entrance animation (see the motion section of styles.css). */
export function delay(ms: number): CSSProperties {
  return { "--delay": `${ms}ms` } as CSSProperties;
}
