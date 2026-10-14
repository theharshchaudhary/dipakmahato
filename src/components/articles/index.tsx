import { Link } from "@tanstack/react-router";
import { Frame } from "@/components/common";
import type { ArticleSummary } from "@/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ArticleMeta({
  article,
  className,
}: {
  article: ArticleSummary;
  className?: string;
}) {
  return (
    <p
      className={cn("label flex flex-wrap items-center gap-x-5 gap-y-1.5 text-ink-soft", className)}
    >
      {article.category && (
        <span className="inline-flex items-center gap-2 text-ink">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-crimson" />
          {article.category.name}
        </span>
      )}
      {article.publishedAt && (
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      )}
      <span>{article.readingMinutes} min read</span>
    </p>
  );
}

/** One essay as a ruled row: meta in the margin, the title as the statement, the excerpt in the serif. */
export function ArticleRow({ article }: { article: ArticleSummary }) {
  return (
    <li className="group relative grid gap-4 border-t border-ink/15 py-8 md:grid-cols-12 md:gap-8">
      <ArticleMeta article={article} className="md:col-span-3 md:flex-col md:items-start" />
      <div className="md:col-span-9">
        <h3 className="display-md max-w-2xl">
          <Link
            to="/writing/$slug"
            params={{ slug: article.slug }}
            className="decoration-1 underline-offset-4 after:absolute after:inset-0 group-hover:underline"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-ink-soft">
          {article.excerpt}
        </p>
      </div>
    </li>
  );
}

export function ArticleList({ articles }: { articles: ArticleSummary[] }) {
  return (
    <ul className="border-b border-ink/15">
      {articles.map((a) => (
        <ArticleRow key={a.slug} article={a} />
      ))}
    </ul>
  );
}

/** The featured essay: framed like the hero portrait, with its cover image when there is one. */
export function ArticleFeature({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative">
      <Frame className="pb-6">
        <div className={cn("grid gap-8", article.coverImage && "lg:grid-cols-12 lg:items-center")}>
          {article.coverImage && (
            <img
              src={article.coverImage}
              alt=""
              loading="lazy"
              className="aspect-[1200/630] w-full object-cover lg:col-span-6"
            />
          )}
          <div className={cn("py-4", article.coverImage && "lg:col-span-6")}>
            <ArticleMeta article={article} />
            <h2 className="display-lg mt-5 max-w-3xl">
              <Link
                to="/writing/$slug"
                params={{ slug: article.slug }}
                className="decoration-2 underline-offset-[6px] after:absolute after:inset-0 group-hover:underline"
              >
                {article.title}
              </Link>
            </h2>
            {article.subtitle && (
              <p className="lead-serif mt-5 max-w-2xl text-ink-soft">{article.subtitle}</p>
            )}
          </div>
        </div>
      </Frame>
    </article>
  );
}
