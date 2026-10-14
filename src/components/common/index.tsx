import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { initials } from "@/lib/format";
import { toneBg } from "@/lib/tone";
import { cn } from "@/lib/utils";
import type { SitePath, Tone } from "@/types";

/*
 * Shared editorial building blocks. They all speak the home hero's language:
 * uppercase labels, bold grotesk statements, a serif voice, hairline frames,
 * pill chips and the drafting grid. Section colours appear only as small dots.
 */

type NavTo = SitePath;

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-8", className)}>{children}</div>;
}

/** Small uppercase label, optionally marked with its section colour. */
export function Label({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone?: Tone | undefined;
  className?: string;
}) {
  return (
    <p className={cn("label inline-flex items-center gap-2 text-ink-soft", className)}>
      {tone && <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", toneBg[tone])} />}
      {children}
    </p>
  );
}

/** Section opener: a hairline with the label on the left and an optional action on the right. */
export function SectionHeading({
  label,
  title,
  tone,
  action,
}: {
  label?: string;
  title: string;
  tone?: Tone;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 border-t border-ink/15 pt-5 sm:mb-14">
      <div className="flex items-center justify-between gap-6">
        {label ? <Label tone={tone}>{label}</Label> : <span />}
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <h2 className="display-lg mt-6 max-w-3xl">{title}</h2>
    </div>
  );
}

/**
 * Header for inner pages, a smaller cousin of the home hero: label row, a bold
 * title with its serif lead beside it, and a strip of drafting grid underneath.
 */
export function PageHeader({
  label,
  tone,
  title,
  lead,
  meta,
  children,
}: {
  label: string;
  tone?: Tone;
  title: ReactNode;
  lead?: string | null | undefined;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="hero-grid absolute inset-x-0 bottom-0 h-24 opacity-80" />
      <Container className="relative pb-32 pt-8">
        <div className="flex items-center justify-between gap-6">
          <Label tone={tone}>{label}</Label>
          {meta && <div className="label text-ink-soft">{meta}</div>}
        </div>
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-end">
          <h1 className="display-xl lg:col-span-7">{title}</h1>
          {lead && <p className="lead-serif text-ink-soft lg:col-span-5">{lead}</p>}
        </div>
        {children}
      </Container>
    </header>
  );
}

/** Hairline frame set slightly above its content, as around the hero portrait. */
export function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("relative pt-6", className)}>
      <div aria-hidden className="absolute inset-0 border border-ink/30" />
      <div className="relative px-6">{children}</div>
    </div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "ui inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm ring-1 ring-line",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TextLink({ to, children }: { to: NavTo; children: ReactNode }) {
  return (
    <Link to={to} className="ui link font-semibold text-ink">
      {children}
    </Link>
  );
}

export function ButtonLink({
  to,
  children,
  variant = "solid",
}: {
  to: NavTo;
  children: ReactNode;
  variant?: "solid" | "outline";
}) {
  return (
    <Link
      to={to}
      className={cn(
        "ui inline-flex items-center justify-center px-5 py-3 font-semibold transition-colors",
        variant === "solid"
          ? "bg-ink text-paper hover:bg-sign"
          : "border border-ink text-ink hover:bg-ink hover:text-paper",
      )}
    >
      {children}
    </Link>
  );
}

/** Optional highlighted note set per page in the admin, e.g. to flag placeholder copy. */
export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="ui mt-8 inline-flex max-w-xl items-start gap-2.5 rounded-2xl bg-marigold/15 px-4 py-2.5 text-sm text-ink-soft">
      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold" />
      {children}
    </p>
  );
}

export function Monogram({ name, className }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={cn("monogram", className)}>
      {initials(name)}
    </span>
  );
}

/**
 * Closing call to action, echoing the hero: the serif question over the
 * drafting grid and a single action.
 */
export function CtaSection({
  title,
  body,
  cta,
  to = "/contact",
  children,
}: {
  title: string;
  body?: string | null | undefined;
  cta: string;
  to?: NavTo;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="hero-grid absolute inset-x-0 bottom-0 top-1/2 opacity-80" />
      <Container className="relative grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-10">
          <Label tone="marigold">Get in touch</Label>
          <h2 className="display-question mt-6 max-w-[18ch] text-[clamp(2.5rem,5.4vw,4.5rem)]">
            {title}
          </h2>
          {body && <p className="lead-serif mt-6 max-w-xl text-ink-soft">{body}</p>}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to={to}
              className="ui inline-flex bg-ink px-6 py-3.5 font-semibold text-paper transition-colors hover:bg-sign"
            >
              {cta}
            </Link>
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Round photo (or monogram) with a line of text, as in the hero badge. */
export function PersonChip({
  name,
  portrait,
  children,
}: {
  name: string;
  portrait: string | null;
  children: ReactNode;
}) {
  return (
    <span className="ui inline-flex w-fit items-center gap-2.5 rounded-full bg-surface py-1 pl-1 pr-4 ring-1 ring-line">
      {portrait ? (
        <img
          src={portrait}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full bg-paper object-cover object-top ring-1 ring-line"
        />
      ) : (
        <Monogram
          name={name}
          className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs text-paper"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

/** An image in a hairline frame; until one is uploaded, a drafting-grid panel holds its place. */
export function FramedVisual({
  src,
  alt,
  fallback,
  ratio = "aspect-[4/3]",
  className,
}: {
  src: string | null;
  alt: string;
  /** Text set large and faint in the empty panel. */
  fallback: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <Frame className={className}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className={cn(ratio, "w-full object-cover")} />
      ) : (
        <div aria-hidden className={cn(ratio, "hero-grid grid place-items-center bg-surface/60")}>
          <span className="display-question px-6 text-center text-ink/15">{fallback}</span>
        </div>
      )}
    </Frame>
  );
}
