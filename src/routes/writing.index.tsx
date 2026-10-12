import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container, DraftNote, ToneBar } from "@/components/common";
import { ArticleFeature, ArticleList } from "@/components/articles";
import { fetchArticles, getPage } from "@/lib/api";
import { breadcrumbSchema, buildHead } from "@/lib/seo";
import { siteFromMatches } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/writing/")({
  loader: async () => {
    const [page, writing] = await Promise.all([getPage("writing"), fetchArticles()]);
    return { page, ...writing };
  },
  head: ({ loaderData, matches }) => {
    const site = siteFromMatches(matches);
    if (!site || !loaderData) return {};
    const { page, articles } = loaderData;
    return buildHead(site, {
      path: "/writing",
      title: page.seo.title,
      description: page.seo.description,
      image: page.seo.image,
      schema: [
        {
          "@type": "Blog",
          "@id": `${site.siteUrl}/writing#blog`,
          url: `${site.siteUrl}/writing`,
          name: page.content.heading,
          author: { "@id": `${site.siteUrl}/#person` },
          blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: `${site.siteUrl}/writing/${a.slug}`,
            datePublished: a.publishedAt ?? undefined,
          })),
        },
        breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          { name: page.content.heading, path: "/writing" },
        ]),
      ],
    });
  },
  component: Writing,
});

const PAGE = 6;

function Writing() {
  const { page, articles, categories } = Route.useLoaderData();
  const c = page.content;
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE);
  const featured = articles.find((a) => a.featured) ?? articles[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (cat === "all" || a.category?.slug === cat) &&
        (!q || `${a.title} ${a.excerpt} ${a.category?.name ?? ""}`.toLowerCase().includes(q)),
    );
  }, [articles, query, cat]);

  const showFeatured = Boolean(featured) && cat === "all" && !query;
  const list = showFeatured ? filtered.filter((a) => a.slug !== featured?.slug) : filtered;

  return (
    <Container className="pb-24 pt-12 md:pt-20">
      <header className="max-w-3xl">
        <ToneBar tone="crimson" className="mb-6" />
        <h1 className="display-xl">{c.heading}</h1>
        {c.lead && <p className="mt-6 text-2xl leading-snug text-ink-soft">{c.lead}</p>}
        {c.note && <DraftNote>{c.note}</DraftNote>}
      </header>

      {articles.length === 0 ? (
        <p className="display-md mt-14 border-t-2 border-ink/10 py-16 text-ink-soft">
          {c.emptyMessage}
        </p>
      ) : (
        <>
          {showFeatured && featured && (
            <section aria-label="Featured essay" className="mt-14">
              <ArticleFeature article={featured} />
            </section>
          )}

          <div className="mt-14 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {categories.length > 1 ? (
              <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
                {[{ name: "All", slug: "all" }, ...categories].map((topic) => (
                  <button
                    key={topic.slug}
                    type="button"
                    aria-pressed={cat === topic.slug}
                    onClick={() => {
                      setCat(topic.slug);
                      setVisible(PAGE);
                    }}
                    className={cn(
                      "ui px-3.5 py-2 transition-colors",
                      cat === topic.slug
                        ? "bg-crimson font-semibold text-white"
                        : "bg-surface text-ink-soft ring-1 ring-line hover:text-ink hover:ring-ink",
                    )}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            ) : (
              <span />
            )}
            {articles.length > PAGE && (
              <label className="relative block w-full lg:w-72">
                <span className="sr-only">Search essays</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisible(PAGE);
                  }}
                  placeholder="Search essays"
                  className="ui w-full bg-surface py-2.5 pl-9 pr-3 outline-none ring-1 ring-line placeholder:text-ink-soft focus:ring-2 focus:ring-ink"
                />
              </label>
            )}
          </div>

          <div className="mt-8">
            {list.length === 0 && !showFeatured ? (
              <div className="border-t-2 border-ink/10 py-16">
                <p className="display-md">No essays match that.</p>
                <p className="mt-2 text-ink-soft">
                  Try another word, or{" "}
                  <button
                    type="button"
                    className="link text-ink"
                    onClick={() => {
                      setQuery("");
                      setCat("all");
                    }}
                  >
                    show all essays
                  </button>
                  .
                </p>
              </div>
            ) : (
              list.length > 0 && <ArticleList articles={list.slice(0, visible)} />
            )}
          </div>

          {list.length > visible && (
            <div className="mt-10">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE)}
                className="ui border-2 border-ink px-5 py-3 font-semibold hover:bg-ink hover:text-paper"
              >
                Show more essays
              </button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
