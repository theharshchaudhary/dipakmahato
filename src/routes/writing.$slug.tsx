import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Link2, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/common";
import { ArticleMeta, ArticlePreview } from "@/components/articles";
import { articles, getArticle } from "@/data/articles";
import { profile } from "@/data/profile";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} — Dipak Kumar Mahato` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        ...(a.status === "draft" ? [{ name: "robots", content: "noindex" }] : []),
      ],
    };
  },
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

function ArticleNotFound() {
  return (
    <Container className="py-32 text-center">
      <h1 className="text-5xl">Article not found</h1>
      <p className="mt-4 text-muted-foreground">This article doesn't exist or has moved.</p>
      <Link to="/writing" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to writing
      </Link>
    </Container>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const related = articles.filter((a) => a.slug !== article.slug).sort((a) => (a.category === article.category ? -1 : 1)).slice(0, 3);

  const share = (kind: "linkedin" | "email") => {
    const url = encodeURIComponent(window.location.href);
    const href =
      kind === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : `mailto:?subject=${encodeURIComponent(article.title)}&body=${url}`;
    window.open(href, "_blank", "noopener");
  };

  return (
    <article className="pb-24 pt-10 md:pt-16">
      <Container>
        <Link to="/writing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All writing
        </Link>
        {article.status === "draft" && (
          <p className="mt-8 inline-block border border-accent px-3 py-1 text-xs uppercase tracking-[0.14em] text-accent">
            Draft — development content, not published
          </p>
        )}
        <header className="mt-8 max-w-4xl">
          <ArticleMeta article={article} />
          <h1 className="mt-6 text-5xl leading-[1.03] sm:text-7xl">{article.title}</h1>
          <p className="mt-6 max-w-2xl text-xl text-muted-foreground">{article.subtitle}</p>
          <p className="mt-6 text-sm">By {profile.fullName}</p>
        </header>

        <div className="mt-14 grid gap-12 border-t pt-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav aria-label="Table of contents" className="lg:sticky lg:top-24">
              <p className="eyebrow mb-4">Contents</p>
              <ol className="space-y-2 text-sm">
                {article.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">{s.heading}</a>
                  </li>
                ))}
              </ol>
              <p className="eyebrow mb-3 mt-10">Share</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => share("linkedin")} aria-label="Share on LinkedIn" className="border p-2 hover:border-foreground"><Linkedin className="h-4 w-4" /></button>
                <button type="button" onClick={() => share("email")} aria-label="Share by email" className="border p-2 hover:border-foreground"><Mail className="h-4 w-4" /></button>
                <button
                  type="button"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
                  }}
                  aria-label="Copy link"
                  className="border p-2 hover:border-foreground"
                >
                  <Link2 className="h-4 w-4" />
                </button>
              </div>
              <p aria-live="polite" className="mt-2 h-4 text-xs text-accent">{copied ? "Link copied" : ""}</p>
            </nav>
          </aside>
          <div className="prose-editorial max-w-[68ch] lg:col-span-8 lg:col-start-5">
            {article.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.heading}</h2>
                {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}
          </div>
        </div>

        <section className="mt-24">
          <h2 className="mb-8 text-4xl">Related articles</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {related.map((a) => <ArticlePreview key={a.slug} article={a} />)}
          </div>
        </section>
      </Container>
    </article>
  );
}
