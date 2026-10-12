import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "@/lib/api";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const site = await getSiteData();
        return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
