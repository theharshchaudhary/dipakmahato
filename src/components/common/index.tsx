import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toneBg } from "@/lib/tone";
import type { SitePath, Tone } from "@/types";

type NavTo = SitePath;

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-8", className)}>{children}</div>;
}

/** A short painted bar marking which part of the site a block belongs to. */
export function ToneBar({ tone, className }: { tone: Tone; className?: string }) {
  return <span aria-hidden className={cn("block h-1.5 w-12", toneBg[tone], className)} />;
}

export function SectionHeading({
  title,
  tone = "ink",
  action,
}: {
  title: string;
  tone?: Tone;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <ToneBar tone={tone} className="mb-5" />
        <h2 className="display-lg">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function TextLink({ to, children }: { to: NavTo; children: ReactNode }) {
  return (
    <Link to={to} className="ui link font-medium text-ink">
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
          : "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
      )}
    >
      {children}
    </Link>
  );
}

export function ImagePlaceholder({
  label,
  className,
  ratio = "aspect-[4/5]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={cn(
        "flex items-end border-2 border-dashed border-line bg-surface p-5",
        ratio,
        className,
      )}
    >
      <p className="ui max-w-[18rem] text-ink-soft">{label}</p>
    </div>
  );
}

/** Optional highlighted note set per page in the admin, e.g. to flag placeholder copy. */
export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="ui mt-6 inline-flex max-w-xl gap-2 bg-marigold/15 px-3 py-2 text-ink-soft">
      {children}
    </p>
  );
}

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
    <section className="bg-marigold text-marigold-ink">
      <Container className="grid gap-10 py-20 sm:py-28 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h2 className="display-xl">{title}</h2>
          {body && <p className="mt-6 max-w-xl text-lg">{body}</p>}
        </div>
        <div className="flex flex-col items-start gap-4 md:col-span-4 md:items-end">
          <Link
            to={to}
            className="ui inline-flex bg-marigold-ink px-6 py-3.5 font-semibold text-marigold transition-colors hover:bg-sign hover:text-sign-ink"
          >
            {cta}
          </Link>
          {children}
        </div>
      </Container>
    </section>
  );
}
