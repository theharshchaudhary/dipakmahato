import { createFileRoute } from "@tanstack/react-router";
import { getSiteData, getSitemapData } from "@/lib/api";

const escapeXml = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) => `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[c]};`,
  );

/** Built from the API on each request, so new essays appear as soon as they're published. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [site, entries] = await Promise.all([getSiteData(), getSitemapData()]);
        const urls = entries
          .map((e) => {
            const loc = escapeXml(`${site.siteUrl}${e.path}`);
            const lastmod = e.lastModified ? `<lastmod>${e.lastModified}</lastmod>` : "";
            return `  <url><loc>${loc}</loc>${lastmod}</url>`;
          })
          .join("\n");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=600",
            },
          },
        );
      },
    },
  },
});
