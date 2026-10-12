import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Link2, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { Container, ToneBar } from "@/components/common";
import { ArticleList, ArticleMeta } from "@/components/articles";
import { articles, getArticle } from "@/data/articles";
import { profile } from "@/data/profile";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Essay not found" }, { name: "robots", content: "noindex" }] };
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
    <Container className="py-28 sm:py-40">
      <ToneBar tone="crimson" className="mb-6" />
      <h1 className="display-xl">This essay doesn't exist.</h1>
      <p className="mt-5 text-ink-soft">The link may be old, or the essay has moved.</p>
      <Link to="/writing" className="ui link mt-8 inline-block font-semibold">
        See all essays
      </Link>
    </Container>
  );
}

const shareButton =
  "grid h-10 w-10 place-items-center bg-surface ring-1 ring-line transition-colors hover:text-crimson hover:ring-crimson";

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const related = articles
    .filter((a) => a.slug !== article.slug)
    .sort((a) => (a.category === article.category ? -1 : 1))
    .slice(0, 3);

  const share = (kind: "linkedin" | "email") => {
    const url = encodeURIComponent(window.location.href);
    const href =
      kind === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : `mailto:?subject=${encodeURIComponent(article.title)}&body=${url}`;
    window.open(href, "_blank", "noopener");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the button just does nothing.
    }
  };

  return (
    <article className="pb-24 pt-8 md:pt-14">
      <Container>
        <Link
          to="/writing"
          className="ui inline-flex items-center gap-2 text-ink-soft hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> All essays
        </Link>

        <header className="mt-10 max-w-4xl">
          <ArticleMeta article={article} />
          <h1 className="display-xl mt-5">{article.title}</h1>
          <p className="mt-6 max-w-2xl text-2xl leading-snug text-ink-soft">{article.subtitle}</p>
          <p className="ui mt-6 font-semibold">By {profile.fullName}</p>
        </header>

        <div className="mt-14 grid gap-12 border-t-2 border-ink pt-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <nav aria-label="Contents">
                <p className="ui mb-3 font-semibold">Contents</p>
                <ol className="ui space-y-2 border-l-2 border-line">
                  {article.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ml-0.5 block border-l-2 border-transparent pl-3 text-ink-soft hover:border-crimson hover:text-ink"
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <p className="ui mb-3 mt-10 font-semibold">Share</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => share("linkedin")}
                  aria-label="Share on LinkedIn"
                  className={shareButton}
                >
                  <Linkedin className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => share("email")}
                  aria-label="Share by email"
                  className={shareButton}
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  aria-label="Copy link"
                  className={shareButton}
                >
                  <Link2 className="h-4 w-4" />
                </button>
              </div>
              <p aria-live="polite" className="ui mt-2 h-5 text-crimson">
                {copied ? "Link copied" : ""}
              </p>
            </div>
          </aside>
          <div className="prose-reading max-w-[66ch] lg:col-span-8 lg:col-start-5">
            {article.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>

        <section className="mt-24">
          <ToneBar tone="crimson" className="mb-5" />
          <h2 className="display-lg mb-8">Keep reading</h2>
          <ArticleList articles={related} />
        </section>
      </Container>
    </article>
  );
}
