import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types";
import { formatPublished } from "@/lib/format";

export function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="font-medium uppercase tracking-[0.14em] text-accent">{article.category}</span>
      <span aria-hidden>·</span>
      <span>{formatPublished(article)}</span>
      <span aria-hidden>·</span>
      <span>{article.readingMinutes} min read</span>
    </div>
  );
}

export function ArticlePreview({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <article className="group flex h-full flex-col border-t pt-6">
      <ArticleMeta article={article} />
      <h3 className={large ? "mt-4 text-4xl leading-tight sm:text-5xl" : "mt-4 text-2xl leading-snug sm:text-[1.7rem]"}>
        <Link
          to="/writing/$slug"
          params={{ slug: article.slug }}
          className="transition-colors group-hover:text-accent"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-prose text-muted-foreground">{article.excerpt}</p>
      <Link
        to="/writing/$slug"
        params={{ slug: article.slug }}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium"
        aria-label={`Read article: ${article.title}`}
      >
        <span className="link-underline">Read article</span>
        <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
      </Link>
    </article>
  );
}
