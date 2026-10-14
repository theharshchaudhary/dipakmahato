import { ButtonLink, Container } from "@/components/common";
import { cn } from "@/lib/utils";
import type { HomeContent, Site } from "@/types";

/**
 * Editorial hero. It reads as one sentence across the layout:
 * "Hello, I'm <name>, <intro> … <question>", with the portrait framed in the
 * middle over a fine drafting grid. Every word comes from the admin.
 */
export function Hero({ site, content: c }: { site: Site; content: HomeContent }) {
  const role = [site.jobTitle, site.organization?.name].filter(Boolean).join(", ");

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Grid sits behind the lower part of the section, edge to edge. */}
      <div aria-hidden className="hero-grid absolute inset-x-0 bottom-0 top-[58%] opacity-80" />

      <Container className="relative">
        {c.heroKeywords.length > 0 && (
          <ul
            aria-label="Focus"
            className="ui flex justify-between gap-4 pt-8 text-sm uppercase tracking-[0.12em] text-ink sm:text-base"
          >
            {c.heroKeywords.slice(0, 3).map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        )}

        <div className="grid gap-10 pt-10 lg:min-h-[38rem] lg:grid-cols-[1fr_minmax(0,25rem)_1fr] lg:gap-8 lg:pt-6">
          {/* Left: who, then the first half of the sentence. */}
          <div className="flex flex-col justify-center lg:pb-40">
            <p className="ui inline-flex w-fit items-center gap-2.5 rounded-full bg-surface py-1 pl-1 pr-4 ring-1 ring-line">
              <Avatar site={site} monogram={c.heroMonogram} />
              <span>{c.heroHandle || role}</span>
            </p>
            {/* The name is the h1 so the page plainly answers a search for it. */}
            <h1 className="mt-5 font-display text-[2.375rem] font-bold leading-[1.02] tracking-[-0.02em] sm:text-5xl lg:text-[2.75rem] xl:text-5xl">
              {c.heroGreeting} {site.fullName},
            </h1>
            <p className="mt-5 max-w-sm font-display text-xl leading-snug text-ink">
              {c.heroIntro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/ventures">{c.primaryCtaLabel}</ButtonLink>
              <ButtonLink to="/about" variant="outline">
                {c.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </div>

          {/* Centre: the portrait in a thin frame, standing on the grid. */}
          <div className="relative mx-auto flex w-full max-w-sm items-end lg:max-w-none">
            <div aria-hidden className="absolute inset-x-0 bottom-0 top-6 border border-ink/30" />
            <Portrait site={site} monogram={c.heroMonogram} />
          </div>

          {/* Right: the question that finishes the sentence, and the signature. */}
          <div className="flex flex-col justify-between gap-12 pb-10 lg:pb-12 lg:pt-28">
            <p className="display-question max-w-[12ch]">{c.heroQuestion}</p>
            <Signature site={site} content={c} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Avatar({ site, monogram }: { site: Site; monogram: string }) {
  if (site.portrait) {
    return (
      <img
        src={site.portrait}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 rounded-full bg-paper object-cover object-top ring-1 ring-line"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="monogram grid h-8 w-8 place-items-center rounded-full bg-ink text-xs text-paper"
    >
      {monogram}
    </span>
  );
}

function Portrait({ site, monogram }: { site: Site; monogram: string }) {
  if (site.portrait) {
    return (
      <img
        src={site.portrait}
        alt={`Portrait of ${site.fullName}`}
        width={800}
        height={1000}
        fetchPriority="high"
        className="relative z-10 mx-auto max-h-[36rem] w-[88%] object-contain object-bottom"
      />
    );
  }
  // No portrait uploaded yet: keep the composition with a large monogram.
  return (
    <div
      aria-hidden
      className="relative z-10 mx-6 mt-6 grid aspect-[4/5] w-full place-items-center bg-gradient-to-b from-surface to-surface/30"
    >
      <span className="monogram text-[9rem] text-ink/10">{monogram}</span>
    </div>
  );
}

function Signature({ site, content: c }: { site: Site; content: HomeContent }) {
  return (
    <div className="flex items-end gap-3 self-start lg:self-end">
      <span aria-hidden className="monogram text-5xl text-ink">
        {c.heroMonogram}
      </span>
      <p className="ui text-xs font-semibold uppercase leading-tight tracking-[0.08em]">
        <span className="block">
          {c.heroSignature}
          <span className={cn("font-normal text-ink-soft", "before:mx-1.5 before:content-['|']")}>
            {site.jobTitle}
          </span>
        </span>
        {c.heroSignatureNote && (
          <span className="block font-normal text-ink-soft">{c.heroSignatureNote}</span>
        )}
      </p>
    </div>
  );
}
