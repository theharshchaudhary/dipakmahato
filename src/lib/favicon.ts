import { initials } from "@/lib/format";
import type { Site } from "@/types";

const hex = (v: unknown, fallback: string) =>
  typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v) ? v : fallback;

/**
 * The default browser-tab icon: the person's monogram in the site's button
 * colours, so it follows the name and the Appearance settings automatically.
 */
export function monogramFavicon(site: Site): string {
  const bg = hex(site.theme?.light?.button, "#141a33");
  const fg = hex(site.theme?.light?.buttonText, "#f3f4f8");
  const letters = initials(site.fullName).slice(0, 2) || "•";
  const size = letters.length > 1 ? 30 : 38;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${bg}"/>
  <text x="32" y="${letters.length > 1 ? 42 : 45}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${size}" letter-spacing="-2" fill="${fg}">${letters}</text>
</svg>
`;
}

/** Where the tab icon lives: an uploaded icon if there is one, otherwise the generated monogram. */
export function faviconResponse(site: Site): Response {
  if (site.favicon) {
    return new Response(null, {
      status: 302,
      headers: { Location: site.favicon, "Cache-Control": "public, max-age=300" },
    });
  }
  return new Response(monogramFavicon(site), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
