import type { Article } from "@/types";

export function formatPublished(a: Article): string {
  if (!a.publishedAt) return "Draft · Not yet published";
  return new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
