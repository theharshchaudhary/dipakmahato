import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container, DraftNote, Label, PageHeader } from "@/components/common";
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
    <>
      <PageHeader
        label="Writing"
        tone="crimson"
        title={c.heading}
        lead={c.lead}
        meta={
          articles.length > 0 && `${articles.length} ${articles.length === 1 ? "essay" : "essays"}`
        }
      >
        {c.note && <DraftNote>{c.note}</DraftNote>}
      </PageHeader>
      <Container className="pb-24 pt-16 sm:pb-28">
        {articles.length === 0 ? (
          <div className="border-y border-ink/15 py-20">
            <Label tone="crimson">Coming soon</Label>
            <p className="lead-serif mt-5 max-w-xl">{c.emptyMessage}</p>
          </div>
        ) : (
          <>
            {showFeatured && featured && (
              <section aria-label="Featured essay" className="mb-16">
                <ArticleFeature article={featured} />
              </section>
            )}

            <div className="flex flex-col gap-5 border-t border-ink/15 pt-5 lg:flex-row lg:items-center lg:justify-between">
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
                        "ui rounded-full px-3.5 py-1.5 text-sm ring-1 transition-colors",
                        cat === topic.slug
                          ? "bg-ink font-semibold text-paper ring-ink"
                          : "bg-surface text-ink-soft ring-line hover:text-ink hover:ring-ink",
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
                    className="ui w-full rounded-full bg-surface py-2 pl-9 pr-4 text-sm outline-none ring-1 ring-line placeholder:text-ink-soft focus:ring-2 focus:ring-ink"
                  />
                </label>
              )}
            </div>

            <div className="mt-8">
              {list.length === 0 && !showFeatured ? (
                <div className="border-t border-ink/15 py-16">
                  <p className="display-md">No essays match that.</p>
                  <p className="mt-2 font-serif text-lg text-ink-soft">
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
                  className="ui border border-ink px-5 py-3 font-semibold transition-colors hover:bg-ink hover:text-paper"
                >
                  Show more essays
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
