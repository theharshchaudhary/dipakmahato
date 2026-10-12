import { Link } from "@tanstack/react-router";
import { ArrowRight, ImageIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

type NavTo = NavItem["to"];

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-4xl leading-tight sm:text-5xl">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function TextLink({ to, children }: { to: NavTo; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2 text-sm font-medium text-foreground">
      <span className="link-underline">{children}</span>
      <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
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
        "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium transition-colors",
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:bg-accent"
          : "border border-foreground/30 text-foreground hover:border-foreground",
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
      className={cn("placeholder-stripes flex flex-col items-center justify-center gap-3 border p-6 text-center", ratio, className)}
    >
      <ImageIcon className="h-6 w-6 text-muted-foreground" aria-hidden />
      <p className="eyebrow max-w-[16rem]">{label}</p>
    </div>
  );
}

export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border-l-2 border-accent pl-3 text-xs italic text-muted-foreground">{children}</p>
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
  body: string;
  cta: string;
  to?: NavTo;
  children?: ReactNode;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <Container className="py-24 sm:py-32">
        <Reveal className="max-w-3xl">
          <h2 className="text-5xl leading-[1.05] sm:text-7xl">{title}</h2>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/70">{body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              to={to}
              className="inline-flex items-center gap-2 rounded-sm bg-primary-foreground px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {cta} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {children}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
