import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container, DraftNote, ToneBar } from "@/components/common";
import { ArticleFeature, ArticleList } from "@/components/articles";
import { articles, categories } from "@/data/articles";
import { cn } from "@/lib/utils";
import type { ArticleCategory } from "@/types";

export const Route = createFileRoute("/writing/")({
  head: () => ({
    meta: [
      { title: "Writing — Dipak Kumar Mahato" },
      {
        name: "description",
        content:
          "Essays on entrepreneurship, business strategy, technology, and founder reflections.",
      },
      { property: "og:title", content: "Writing — Dipak Kumar Mahato" },
      {
        property: "og:description",
        content: "Ideas and observations on building businesses in Nepal.",
      },
    ],
  }),
  component: Writing,
});

const PAGE = 6;

function Writing() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<ArticleCategory | "All">("All");
  const [visible, setVisible] = useState(PAGE);
  const featured = articles.find((a) => a.featured) ?? articles[0]!;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (cat === "All" || a.category === cat) &&
        (!q || `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(q)),
    );
  }, [query, cat]);

  const showFeatured = cat === "All" && !query;
  const list = showFeatured ? filtered.filter((a) => a.slug !== featured.slug) : filtered;

  return (
    <Container className="pb-24 pt-12 md:pt-20">
      <header className="max-w-3xl">
        <ToneBar tone="crimson" className="mb-6" />
        <h1 className="display-xl">Writing</h1>
        <p className="mt-6 text-2xl leading-snug text-ink-soft">
          Notes on business decisions, lessons from building, and the hard parts of execution.
        </p>
        <DraftNote>Every piece here is a draft in progress. None has been published yet.</DraftNote>
      </header>

      {showFeatured && (
        <section aria-label="Featured essay" className="mt-14">
          <ArticleFeature article={featured} />
        </section>
      )}

      <div className="mt-14 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => {
                setCat(c);
                setVisible(PAGE);
              }}
              className={cn(
                "ui px-3.5 py-2 transition-colors",
                cat === c
                  ? "bg-crimson font-semibold text-white"
                  : "bg-surface text-ink-soft ring-1 ring-line hover:text-ink hover:ring-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>
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
      </div>

      <div className="mt-8">
        {list.length === 0 ? (
          <div className="border-t-2 border-ink/10 py-16">
            <p className="display-md">No essays match that.</p>
            <p className="mt-2 text-ink-soft">
              Try another word, or{" "}
              <button
                type="button"
                className="link text-ink"
                onClick={() => {
                  setQuery("");
                  setCat("All");
                }}
              >
                show all essays
              </button>
              .
            </p>
          </div>
        ) : (
          <ArticleList articles={list.slice(0, visible)} />
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
    </Container>
  );
}
