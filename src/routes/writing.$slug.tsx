import { createFileRoute, Link } from "@tanstack/react-router";
import { delay } from "@/lib/utils";
import { ArrowLeft, Link2, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { Container, Frame, Label, PersonChip, SectionHeading, TextLink } from "@/components/common";
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
      <Label tone="crimson">Writing</Label>
      <h1 className="display-xl mt-8">This essay doesn&apos;t exist.</h1>
      <p className="lead-serif mt-5 text-ink-soft">The link may be old, or the essay has moved.</p>
      <Link to="/writing" className="ui link mt-8 inline-block font-semibold">
        See all essays
      </Link>
    </Container>
  );
}

const shareButton =
  "grid h-10 w-10 place-items-center rounded-full bg-surface ring-1 ring-line transition-colors hover:bg-ink hover:text-paper hover:ring-ink";

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
    <article>
      {/* Reading progress: fills as the page scrolls (scroll-driven animation, no JavaScript). */}
      <div aria-hidden className="scroll-progress fixed inset-x-0 top-16 z-30 h-0.5 bg-crimson" />
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="hero-grid animate-draw-across absolute inset-x-0 bottom-0 h-24 opacity-80"
        />
        <Container className="relative pb-32 pt-8">
          <nav
            aria-label="Breadcrumb"
            className="animate-fade flex items-center justify-between gap-6"
          >
            <Link
              to="/writing"
              className="label inline-flex items-center gap-2 text-ink-soft hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All essays
            </Link>
            <span className="label text-ink-soft">{article.readingMinutes} min read</span>
          </nav>
          <div className="mt-12 max-w-4xl lg:mt-16">
            <div className="animate-rise">
              <ArticleMeta article={article} />
            </div>
            <h1 className="display-xl animate-rise mt-6" style={delay(100)}>
              {article.title}
            </h1>
            {article.subtitle && (
              <p
                className="lead-serif animate-rise mt-6 max-w-2xl text-ink-soft"
                style={delay(220)}
              >
                {article.subtitle}
              </p>
            )}
            <div className="animate-rise mt-8" style={delay(320)}>
              <PersonChip name={site.fullName} portrait={site.portrait}>
                By{" "}
                <Link to="/about" rel="author" className="font-semibold hover:underline">
                  {site.fullName}
                </Link>
              </PersonChip>
            </div>
          </div>
        </Container>
      </header>

      <Container className="pb-24 sm:pb-28">
        {article.coverImage && (
          <Frame className="mt-16">
            <img
              src={article.coverImage}
              alt=""
              fetchPriority="high"
              className="aspect-[1200/630] w-full object-cover"
            />
          </Frame>
        )}

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              {article.toc.length > 1 && (
                <nav aria-label="Contents" className="mb-10 border-t border-ink/15 pt-5">
                  <Label className="mb-4">Contents</Label>
                  <ol className="ui space-y-2 border-l border-line">
                    {article.toc.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="-ml-px block border-l border-transparent py-0.5 pl-4 text-ink-soft hover:border-ink hover:text-ink"
                        >
                          {s.heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <div className="border-t border-ink/15 pt-5">
                <Label className="mb-4">Share</Label>
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
                <p aria-live="polite" className="ui mt-2 h-5 text-sm text-ink-soft">
                  {copied ? "Link copied" : ""}
                </p>
              </div>
            </div>
          </aside>
          {/* Sanitised server-side (Laravel + Symfony HtmlSanitizer) before it reaches here. */}
          <div
            className="prose-reading max-w-[66ch] lg:col-span-8 lg:col-start-5"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>

        {related.length > 0 && (
          <section className="mt-28">
            <SectionHeading
              label="Keep reading"
              tone="crimson"
              title="More essays"
              action={<TextLink to="/writing">All writing</TextLink>}
            />
            <ArticleList articles={related} />
          </section>
        )}
      </Container>
    </article>
  );
}
