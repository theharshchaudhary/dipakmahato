import { ButtonLink, Container, PersonChip } from "@/components/common";
import { initials } from "@/lib/format";
import { cn, delay } from "@/lib/utils";
import type { HomeContent, Site } from "@/types";

/**
 * Editorial hero. It reads as one sentence across the layout:
 * "Hello, I'm <name>, <intro> … <question>", with a photo framed in the
 * middle over a fine drafting grid. Every word comes from the admin, and any
 * part left empty there is simply not shown.
 */
export function Hero({ site, content: c }: { site: Site; content: HomeContent }) {
  const role = [site.jobTitle, site.organization?.name].filter(Boolean).join(", ");
  const keywords = (c.heroKeywords ?? []).slice(0, 3);
  const monogram = c.heroMonogram || initials(site.fullName);
  const image = c.heroImage || site.portrait;
  const hasRight = Boolean(c.heroQuestion || c.heroSignature);
  const blend = { none: "", soft: "photo-blend-soft", strong: "photo-blend-strong" }[
    c.heroBlend ?? "soft"
  ];

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Grid sits behind the lower part of the section, edge to edge. */}
      <div
        aria-hidden
        className="hero-grid animate-draw-across absolute inset-x-0 bottom-0 top-[58%] opacity-80"
      />

      <Container className="relative">
        {keywords.length > 0 && (
          <ul
            aria-label="Focus"
            className="ui flex justify-between gap-4 pt-8 text-sm uppercase tracking-[0.12em] text-ink sm:text-base"
          >
            {keywords.map((word, i) => (
              <li key={word} className="animate-fade" style={delay(i * 120)}>
                {word}
              </li>
            ))}
          </ul>
        )}

        <div
          className={cn(
            "grid gap-10 pt-10 lg:min-h-[38rem] lg:gap-8 lg:pt-6",
            hasRight
              ? "lg:grid-cols-[1fr_minmax(0,25rem)_1fr]"
              : "lg:grid-cols-[1.4fr_minmax(0,25rem)]",
          )}
        >
          {/* Left: who, then the first half of the sentence. */}
          <div className="flex flex-col justify-center lg:pb-40">
            <div className="animate-rise" style={delay(100)}>
              <PersonChip name={site.fullName} portrait={site.portrait}>
                {c.heroHandle || role}
              </PersonChip>
            </div>
            {/* The name is the h1 so the page plainly answers a search for it. */}
            <h1
              style={delay(200)}
              className="animate-rise mt-5 font-display text-[2.375rem] font-bold leading-[1.02] tracking-[-0.02em] sm:text-5xl lg:text-[2.75rem] xl:text-5xl"
            >
              {c.heroGreeting && `${c.heroGreeting} `}
              {site.fullName}
              {c.heroIntro && ","}
            </h1>
            {c.heroIntro && (
              <p
                style={delay(320)}
                className="animate-rise mt-5 max-w-sm font-display text-xl leading-snug text-ink"
              >
                {c.heroIntro}
              </p>
            )}
            {(c.primaryCtaLabel || c.secondaryCtaLabel) && (
              <div className="animate-rise mt-8 flex flex-wrap gap-3" style={delay(440)}>
                {c.primaryCtaLabel && <ButtonLink to="/ventures">{c.primaryCtaLabel}</ButtonLink>}
                {c.secondaryCtaLabel && (
                  <ButtonLink to="/about" variant="outline">
                    {c.secondaryCtaLabel}
                  </ButtonLink>
                )}
              </div>
            )}
          </div>

          {/* Centre: the photo in a thin frame, standing on the grid. */}
          <div className="relative mx-auto flex w-full max-w-sm items-end pt-12 lg:max-w-none lg:pt-0">
            <div
              aria-hidden
              style={delay(150)}
              className="animate-draw-down absolute inset-x-0 bottom-0 top-6 border border-ink/30"
            />
            {image ? (
              <img
                src={image}
                alt={`Portrait of ${site.fullName}`}
                width={800}
                height={1000}
                fetchPriority="high"
                style={delay(350)}
                className={cn(
                  "animate-rise relative z-10 mx-auto max-h-[36rem] w-[88%] object-contain object-bottom",
                  blend,
                )}
              />
            ) : (
              // No photo uploaded yet: keep the composition with a large monogram.
              <div
                aria-hidden
                className="relative z-10 mx-6 mt-6 grid aspect-[4/5] w-full place-items-center bg-gradient-to-b from-surface to-surface/30"
              >
                <span className="monogram text-[9rem] text-ink/10">{monogram}</span>
              </div>
            )}
          </div>

          {/* Right: the question that finishes the sentence, and the signature. */}
          {hasRight && (
            <div className="flex flex-col justify-between gap-12 pb-10 lg:pb-12 lg:pt-28">
              {c.heroQuestion ? (
                <p className="display-question animate-rise max-w-[12ch]" style={delay(600)}>
                  {c.heroQuestion}
                </p>
              ) : (
                <span />
              )}
              {c.heroSignature && (
                <div
                  className="animate-fade flex items-end gap-3 self-start lg:self-end"
                  style={delay(900)}
                >
                  <span aria-hidden className="monogram text-5xl text-ink">
                    {monogram}
                  </span>
                  <p className="ui text-xs font-semibold uppercase leading-tight tracking-[0.08em]">
                    <span className="block">
                      {c.heroSignature}
                      <span className="font-normal text-ink-soft before:mx-1.5 before:content-['|']">
                        {site.jobTitle}
                      </span>
                    </span>
                    {c.heroSignatureNote && (
                      <span className="block font-normal text-ink-soft">{c.heroSignatureNote}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
