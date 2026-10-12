import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Container, CtaSection, DraftNote, ImagePlaceholder, ToneBar } from "@/components/common";
import { ventures } from "@/data/ventures";
import type { Venture } from "@/types";

export const Route = createFileRoute("/ventures")({
  head: () => ({
    meta: [
      { title: "Ventures — Dipak Kumar Mahato" },
      {
        name: "description",
        content:
          "Ventures led by Dipak Kumar Mahato, including Zedfo — building more convenient access to local commerce.",
      },
      { property: "og:title", content: "Ventures — Dipak Kumar Mahato" },
      { property: "og:description", content: "Zedfo and the businesses Dipak is building." },
    ],
  }),
  component: Ventures,
});

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-line py-9 md:grid-cols-12">
      <dt className="display-md md:col-span-4">{label}</dt>
      <dd className="max-w-2xl text-ink-soft md:col-span-7 md:col-start-6">{children}</dd>
    </div>
  );
}

function VentureFeature({ v }: { v: Venture }) {
  return (
    <section aria-labelledby={`v-${v.slug}`} className="mt-16">
      <div className="bg-sign text-sign-ink">
        <div className="grid gap-8 p-6 sm:p-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <p className="ui font-semibold text-marigold">
              {v.primary ? "Current venture" : "Venture"}
            </p>
            <h2
              id={`v-${v.slug}`}
              className="mt-3 font-display text-6xl font-semibold leading-none tracking-tight sm:text-8xl"
            >
              {v.name}
            </h2>
            <p className="mt-5 max-w-md text-2xl leading-snug">{v.tagline}</p>
          </div>
          <div className="md:col-span-6">
            <ImagePlaceholder
              label={`${v.name} brand imagery`}
              ratio="aspect-[16/10]"
              className="border-sign-ink/30 bg-sign-ink/5 [&>p]:text-sign-ink/70"
            />
          </div>
        </div>
      </div>

      <dl className="border-t-2 border-ink">
        <Detail label="The company">{v.description}</Detail>
        <Detail label="Dipak's role">{v.role}</Detail>
        <Detail label="The problem">{v.problem}</Detail>
        <Detail label="The product">
          <p>{v.product}</p>
          <div className="mt-6 grid max-w-md grid-cols-2 gap-4">
            <ImagePlaceholder label="Product screenshot" ratio="aspect-[9/16]" />
            <ImagePlaceholder label="Product screenshot" ratio="aspect-[9/16]" />
          </div>
        </Detail>
        <Detail label="Milestones">
          {v.milestones.length ? (
            <ul className="list-disc space-y-1 pl-5">
              {v.milestones.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : (
            <p>Verified milestones will be listed here when available.</p>
          )}
        </Detail>
        <Detail label="Website">
          {v.website ? (
            <a
              href={v.website}
              target="_blank"
              rel="noreferrer"
              className="ui link inline-flex items-center gap-2 font-semibold text-sign-text"
            >
              Visit {v.name} <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <p>The official website link will be added here.</p>
          )}
        </Detail>
      </dl>
    </section>
  );
}

function Ventures() {
  return (
    <>
      <Container className="pb-20 pt-12 md:pt-20">
        <header className="max-w-3xl">
          <ToneBar tone="sign" className="mb-6" />
          <h1 className="display-xl">Ventures</h1>
          <p className="mt-6 text-2xl leading-snug text-ink-soft">
            The businesses I lead and contribute to: what they do, and the problems they set out to
            solve.
          </p>
          <DraftNote>
            Company details are placeholders until verified. No metrics are assumed.
          </DraftNote>
        </header>
        {ventures.map((v) => (
          <VentureFeature key={v.slug} v={v} />
        ))}
      </Container>
      <CtaSection
        title="Building something useful?"
        body="I'm open to conversations with partners, collaborators, and people solving real problems."
        cta="Get in touch"
      />
    </>
  );
}
