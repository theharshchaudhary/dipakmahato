import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Container, CtaSection, DraftNote, ImagePlaceholder, Reveal } from "@/components/common";
import { ventures } from "@/data/ventures";
import type { Venture } from "@/types";

export const Route = createFileRoute("/ventures")({
  head: () => ({
    meta: [
      { title: "Ventures — Dipak Kumar Mahato" },
      { name: "description", content: "Ventures led by Dipak Kumar Mahato, including Zedfo — building more convenient access to local commerce." },
      { property: "og:title", content: "Ventures — Dipak Kumar Mahato" },
      { property: "og:description", content: "Zedfo and the businesses Dipak is building." },
    ],
  }),
  component: Ventures,
});

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-t py-8 md:grid-cols-12">
      <h3 className="eyebrow md:col-span-3">{label}</h3>
      <div className="leading-relaxed text-muted-foreground md:col-span-8 md:col-start-5">{children}</div>
    </div>
  );
}

function VentureFeature({ v }: { v: Venture }) {
  return (
    <section className="py-12">
      <Reveal className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <p className="eyebrow">{v.primary ? "Current venture" : "Venture"}</p>
          <h2 className="mt-4 text-6xl sm:text-8xl">{v.name}</h2>
          <p className="mt-4 font-serif text-3xl italic text-accent">{v.tagline}</p>
        </div>
        <div className="md:col-span-6">
          <ImagePlaceholder label={`${v.name} brand imagery`} ratio="aspect-[16/10]" />
        </div>
      </Reveal>
      <div className="mt-14">
        <Detail label="Company">{v.description}</Detail>
        <Detail label="Dipak's role">{v.role}</Detail>
        <Detail label="Problem">{v.problem}</Detail>
        <Detail label="Product">
          <p>{v.product}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <ImagePlaceholder label="Product screenshot" ratio="aspect-[9/16]" />
            <ImagePlaceholder label="Product screenshot" ratio="aspect-[9/16]" />
          </div>
        </Detail>
        <Detail label="Milestones">
          {v.milestones.length ? (
            <ul className="list-disc space-y-1 pl-5">{v.milestones.map((m) => <li key={m}>{m}</li>)}</ul>
          ) : (
            <p>Verified milestones will be listed here when available.</p>
          )}
        </Detail>
        <Detail label="Links">
          {v.website ? (
            <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground">
              Official website <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <p>Official website link to be added.</p>
          )}
        </Detail>
      </div>
    </section>
  );
}

function Ventures() {
  return (
    <>
      <Container className="pb-16 pt-12 md:pt-20">
        <header className="max-w-3xl">
          <p className="eyebrow">Ventures</p>
          <h1 className="mt-5 text-5xl leading-[1.02] sm:text-7xl">Businesses I'm building.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            A record of the ventures I lead and contribute to — what they do, and the problems they set out to solve.
          </p>
          <DraftNote>Company details are placeholders pending verified information. No metrics have been assumed.</DraftNote>
        </header>
        {ventures.map((v) => <VentureFeature key={v.slug} v={v} />)}
      </Container>
      <CtaSection
        title="Building something useful?"
        body="I'm open to conversations with partners, collaborators, and people solving real problems."
        cta="Get in touch"
      />
    </>
  );
}
