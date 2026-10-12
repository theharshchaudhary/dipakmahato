import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import type {
  Article,
  ArticleSummary,
  Category,
  Page,
  PageKey,
  Site,
  SitemapEntry,
  Venture,
} from "@/types";

/*
 * Every call to the Laravel API runs on the server (SSR, or as a server
 * function during client navigation). The browser never talks to Laravel, so
 * API_URL stays private and no CORS setup is needed.
 */

function apiUrl(path: string): string {
  const base = (process.env["API_URL"] ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");
  return `${base}${path}`;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { headers: { Accept: "application/json" } });
  if (res.status === 404) throw notFound();
  if (!res.ok) throw new Error(`API GET ${path} failed with ${res.status}`);
  return (await res.json()) as T;
}

export const fetchSite = createServerFn({ method: "GET" }).handler(() => apiGet<Site>("/site"));

export const fetchPage = createServerFn({ method: "GET" })
  .validator((key: PageKey) => key)
  .handler(({ data: key }) => apiGet<Page<PageKey>>(`/pages/${key}`));

/** Typed wrapper: the API returns the content shape that matches the key. */
export const getPage = <K extends PageKey>(key: K) => fetchPage({ data: key }) as Promise<Page<K>>;

export const fetchArticles = createServerFn({ method: "GET" }).handler(() =>
  apiGet<{ categories: Category[]; articles: ArticleSummary[] }>("/articles"),
);

export const fetchArticle = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) =>
    apiGet<{ article: Article; related: ArticleSummary[] }>(
      `/articles/${encodeURIComponent(slug)}`,
    ),
  );

export const fetchVentures = createServerFn({ method: "GET" }).handler(() =>
  apiGet<Venture[]>("/ventures"),
);

/** Plain (non-RPC) helpers for server routes such as sitemap.xml. */
export const getSiteData = () => apiGet<Site>("/site");
export const getSitemapData = () => apiGet<SitemapEntry[]>("/sitemap");

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot field; humans leave it empty. */
  website: string;
}

export type ContactResult =
  | { ok: true }
  | { ok: false; errors?: Partial<Record<keyof ContactInput, string>>; message?: string };

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((input: ContactInput) => input)
  .handler(async ({ data }): Promise<ContactResult> => {
    const res = await fetch(apiUrl("/contact"), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        website: data.website || undefined,
        ip: getRequestIP({ xForwardedFor: true }),
        userAgent: getRequestHeader("user-agent")?.slice(0, 255),
      }),
    });

    if (res.ok) return { ok: true };
    if (res.status === 422) {
      const body = (await res.json()) as { errors?: Record<string, string[]> };
      const errors: Partial<Record<keyof ContactInput, string>> = {};
      for (const [field, messages] of Object.entries(body.errors ?? {})) {
        if (messages[0]) errors[field as keyof ContactInput] = messages[0];
      }
      return { ok: false, errors };
    }
    if (res.status === 429) {
      return {
        ok: false,
        message: "Too many messages in a short time. Try again in a few minutes.",
      };
    }
    return { ok: false, message: "The message couldn't be sent. Try again, or email directly." };
  });
