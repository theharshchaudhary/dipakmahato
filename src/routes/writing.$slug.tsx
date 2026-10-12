import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Link2, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { Container, ToneBar } from "@/components/common";
import { ArticleList, ArticleMeta } from "@/components/articles";
import { fetchArticle } from "@/lib/api";
import { breadcrumbSchema, buildHead } from "@/lib/seo";
import { siteFromMatches, useSite } from "@/lib/site";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => fetchArticle({ data: params.slug }),
  head: ({ loaderData, matches, params }) => {
    const site = siteFromMatches(matches);
    if (!site) return {};
    if (!loaderData)
      return { meta: [{ title: "Essay not found" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    const path = `/writing/${params.slug}`;
    return buildHead(site, {
      path,
      title: a.seo.title,
      description: a.seo.description,
      image: a.seo.image,
      type: "article",
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      schema: [
        {
          "@type": "BlogPosting",
          "@id": `${site.siteUrl}${path}#article`,
          headline: a.title,
          description: a.excerpt,
          image: a.coverImage ?? site.defaultOgImage ?? undefined,
          datePublished: a.publishedAt ?? undefined,
          dateModified: a.updatedAt ?? undefined,
          articleSection: a.category?.name,
          timeRequired: `PT${a.readingMinutes}M`,
          author: { "@id": `${site.siteUrl}/#person` },
          publisher: { "@id": `${site.siteUrl}/#person` },
          mainEntityOfPage: `${site.siteUrl}${path}`,
          isPartOf: { "@id": `${site.siteUrl}/writing#blog` },
          inLanguage: "en",
        },
        breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
          { name: a.title, path },
        ]),
      ],
    });
  },
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

function ArticleNotFound() {
  return (
    <Container className="py-28 sm:py-40">
      <ToneBar tone="crimson" className="mb-6" />
      <h1 className="display-xl">This essay doesn&apos;t exist.</h1>
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
  const site = useSite();
  const { article, related } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

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
        <nav aria-label="Breadcrumb">
          <Link
            to="/writing"
            className="ui inline-flex items-center gap-2 text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All essays
          </Link>
        </nav>

        <header className="mt-10 max-w-4xl">
          <ArticleMeta article={article} />
          <h1 className="display-xl mt-5">{article.title}</h1>
          {article.subtitle && (
            <p className="mt-6 max-w-2xl text-2xl leading-snug text-ink-soft">{article.subtitle}</p>
          )}
          <p className="ui mt-6 font-semibold">
            By{" "}
            <Link to="/about" rel="author" className="link">
              {site.fullName}
            </Link>
          </p>
        </header>

        {article.coverImage && (
          <img
            src={article.coverImage}
            alt=""
            fetchPriority="high"
            className="mt-12 aspect-[1200/630] w-full object-cover"
          />
        )}

        <div className="mt-14 grid gap-12 border-t-2 border-ink pt-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              {article.toc.length > 1 && (
                <nav aria-label="Contents" className="mb-10">
                  <p className="ui mb-3 font-semibold">Contents</p>
                  <ol className="ui space-y-2 border-l-2 border-line">
                    {article.toc.map((s) => (
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
              )}
              <p className="ui mb-3 font-semibold">Share</p>
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
          {/* Sanitised server-side (Laravel + Symfony HtmlSanitizer) before it reaches here. */}
          <div
            className="prose-reading max-w-[66ch] lg:col-span-8 lg:col-start-5"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <ToneBar tone="crimson" className="mb-5" />
            <h2 className="display-lg mb-8">Keep reading</h2>
            <ArticleList articles={related} />
          </section>
        )}
      </Container>
    </article>
  );
}
