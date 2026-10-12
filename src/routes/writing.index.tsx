import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container, DraftNote } from "@/components/common";
import { ArticlePreview } from "@/components/articles";
import { articles, categories } from "@/data/articles";
import { cn } from "@/lib/utils";
import type { ArticleCategory } from "@/types";

export const Route = createFileRoute("/writing/")({
  head: () => ({
    meta: [
      { title: "Writing — Dipak Kumar Mahato" },
      { name: "description", content: "Essays on entrepreneurship, business strategy, technology, and founder reflections." },
      { property: "og:title", content: "Writing — Dipak Kumar Mahato" },
      { property: "og:description", content: "Ideas and observations on building businesses in Nepal." },
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
        <p className="eyebrow">Writing</p>
        <h1 className="mt-5 text-5xl leading-[1.02] sm:text-7xl">Ideas & observations</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Notes on business decisions, entrepreneurial lessons, and the challenges of execution.
        </p>
        <DraftNote>All pieces below are drafts used for development and have not been published.</DraftNote>
      </header>

      {showFeatured && (
        <section aria-label="Featured article" className="mt-16">
          <ArticlePreview article={featured} large />
        </section>
      )}

      <div className="mt-16 flex flex-col gap-6 border-t pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
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
                "border px-3 py-1.5 text-sm transition-colors",
                cat === c ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:border-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="relative block w-full lg:w-72">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE);
            }}
            placeholder="Search articles"
            className="w-full border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-foreground"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-3xl">No articles found.</p>
          <p className="mt-2 text-muted-foreground">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, visible).map((a) => (
            <ArticlePreview key={a.slug} article={a} />
          ))}
        </div>
      )}

      {list.length > visible && (
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="border border-foreground/30 px-6 py-3 text-sm font-medium hover:border-foreground"
          >
            Load more
          </button>
        </div>
      )}
    </Container>
  );
}
