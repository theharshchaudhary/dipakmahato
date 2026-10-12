import { Link } from "@tanstack/react-router";
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
    <p className={cn("ui flex flex-wrap gap-x-5 gap-y-1 text-ink-soft", className)}>
      {article.category && (
        <span className="font-semibold text-crimson">{article.category.name}</span>
      )}
      {article.publishedAt && (
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      )}
      <span>{article.readingMinutes} min read</span>
    </p>
  );
}

/** One article as a full-width row: the title does the work, not a card. */
export function ArticleRow({ article }: { article: ArticleSummary }) {
  return (
    <li className="group relative grid gap-3 border-t-2 border-ink/10 py-7 transition-colors hover:border-crimson md:grid-cols-12 md:gap-8">
      <h3 className="display-md md:col-span-7">
        <Link
          to="/writing/$slug"
          params={{ slug: article.slug }}
          className="after:absolute after:inset-0 group-hover:text-crimson"
        >
          {article.title}
        </Link>
      </h3>
      <div className="md:col-span-5">
        <p className="text-ink-soft">{article.excerpt}</p>
        <ArticleMeta article={article} className="mt-3" />
      </div>
    </li>
  );
}

export function ArticleList({ articles }: { articles: ArticleSummary[] }) {
  return (
    <ul className="border-b-2 border-ink/10">
      {articles.map((a) => (
        <ArticleRow key={a.slug} article={a} />
      ))}
    </ul>
  );
}

export function ArticleFeature({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative border-l-[6px] border-crimson bg-surface p-6 sm:p-10">
      <ArticleMeta article={article} />
      <h2 className="display-xl mt-5 max-w-4xl">
        <Link
          to="/writing/$slug"
          params={{ slug: article.slug }}
          className="after:absolute after:inset-0 group-hover:text-crimson"
        >
          {article.title}
        </Link>
      </h2>
      {article.subtitle && (
        <p className="mt-5 max-w-2xl text-xl text-ink-soft">{article.subtitle}</p>
      )}
    </article>
  );
}
