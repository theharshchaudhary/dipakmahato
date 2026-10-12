import type { Site } from "@/types";

/*
 * Search metadata for every page. The aim is that Google understands one
 * thing clearly: this site is the official home of the person named in
 * Site settings. That comes from consistent titles, a canonical URL per page,
 * and a schema.org graph that ties the site, the person and their profiles
 * (sameAs) together.
 */

type JsonLd = Record<string, unknown>;

export const personId = (site: Site) => `${site.siteUrl}/#person`;
export const websiteId = (site: Site) => `${site.siteUrl}/#website`;

export function personSchema(site: Site): JsonLd {
  return {
    "@type": "Person",
    "@id": personId(site),
    name: site.fullName,
    alternateName: site.alternateNames.length ? site.alternateNames : undefined,
    url: `${site.siteUrl}/`,
    image: site.portrait ?? undefined,
    jobTitle: site.jobTitle,
    description: site.positioning,
    worksFor: site.organization
      ? {
          "@type": "Organization",
          name: site.organization.name,
          url: site.organization.url ?? undefined,
        }
      : undefined,
    homeLocation: site.location ? { "@type": "Place", name: site.location } : undefined,
    sameAs: site.sameAs.length ? site.sameAs : undefined,
  };
}

export function websiteSchema(site: Site): JsonLd {
  return {
    "@type": "WebSite",
    "@id": websiteId(site),
    url: `${site.siteUrl}/`,
    name: site.fullName,
    alternateName: site.alternateNames.length ? site.alternateNames : undefined,
    publisher: { "@id": personId(site) },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(site: Site, trail: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.siteUrl}${item.path}`,
    })),
  };
}

export function defaultTitle(site: Site): string {
  const org = site.organization ? ` of ${site.organization.name}` : "";
  return `${site.fullName} — ${site.jobTitle}${org}`;
}

export interface HeadOptions {
  path: string;
  title?: string | null | undefined;
  description?: string | null | undefined;
  image?: string | null | undefined;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  publishedTime?: string | null | undefined;
  modifiedTime?: string | null | undefined;
  /** Extra schema.org nodes for this page, merged into one @graph. */
  schema?: JsonLd[];
}

export function buildHead(site: Site, opts: HeadOptions) {
  const url = `${site.siteUrl}${opts.path === "/" ? "/" : opts.path}`;
  // Every title carries the name, so each page can rank for searches of it.
  const names = [site.fullName, site.shortName, ...site.alternateNames].map((n) => n.toLowerCase());
  const baseTitle = opts.title || defaultTitle(site);
  const title = names.some((n) => baseTitle.toLowerCase().includes(n))
    ? baseTitle
    : `${baseTitle} — ${site.fullName}`;
  const description = opts.description || site.positioning;
  const image = opts.image || site.defaultOgImage || site.portrait;
  const type = opts.type ?? "website";

  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    {
      name: "robots",
      content: opts.noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
    },
    { property: "og:site_name", content: site.fullName },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  if (type === "article") {
    if (opts.publishedTime)
      meta.push({ property: "article:published_time", content: opts.publishedTime });
    if (opts.modifiedTime)
      meta.push({ property: "article:modified_time", content: opts.modifiedTime });
    meta.push({ property: "article:author", content: `${site.siteUrl}/about` });
  }

  const graph = [websiteSchema(site), personSchema(site), ...(opts.schema ?? [])];

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        // Escape "<" so content can never close the script tag early.
        children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
          /</g,
          "\\u003c",
        ),
      },
    ],
  };
}
