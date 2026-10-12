import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Container, CtaSection, DraftNote, ToneBar } from "@/components/common";
import { fetchVentures, getPage } from "@/lib/api";
import { breadcrumbSchema, buildHead } from "@/lib/seo";
import { siteFromMatches } from "@/lib/site";
import type { Venture } from "@/types";

export const Route = createFileRoute("/ventures")({
  loader: async () => {
    const [page, ventures] = await Promise.all([getPage("ventures"), fetchVentures()]);
    return { page, ventures };
  },
  head: ({ loaderData, matches }) => {
    const site = siteFromMatches(matches);
    if (!site || !loaderData) return {};
    const { page, ventures } = loaderData;
    return buildHead(site, {
      path: "/ventures",
      title: page.seo.title,
      description: page.seo.description,
      image: page.seo.image ?? ventures[0]?.coverImage,
      schema: [
        ...ventures.map((v) => ({
          "@type": "Organization",
          name: v.name,
          description: v.tagline,
          url: v.website ?? undefined,
          logo: v.coverImage ?? undefined,
          founder: { "@id": `${site.siteUrl}/#person` },
        })),
        breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          { name: "Ventures", path: "/ventures" },
        ]),
      ],
    });
  },
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
          <div className={v.coverImage ? "md:col-span-6" : "md:col-span-9"}>
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
          {v.coverImage && (
            <div className="md:col-span-6">
              <img
                src={v.coverImage}
                alt={`${v.name} brand image`}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <dl className="border-t-2 border-ink">
        <Detail label="The company">{v.description}</Detail>
        <Detail label="My role">{v.role}</Detail>
        {v.problem && <Detail label="The problem">{v.problem}</Detail>}
        {(v.product || v.screenshots.length > 0) && (
          <Detail label="The product">
            {v.product && <p>{v.product}</p>}
            {v.screenshots.length > 0 && (
              <div className="mt-6 grid max-w-md grid-cols-2 gap-4">
                {v.screenshots.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${v.name} screenshot ${i + 1}`}
                    loading="lazy"
                    className="aspect-[9/16] w-full object-cover ring-1 ring-line"
                  />
                ))}
              </div>
            )}
          </Detail>
        )}
        {v.milestones.length > 0 && (
          <Detail label="Milestones">
            <ul className="list-disc space-y-1 pl-5">
              {v.milestones.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Detail>
        )}
        {v.website && (
          <Detail label="Website">
            <a
              href={v.website}
              target="_blank"
              rel="noopener"
              className="ui link inline-flex items-center gap-2 font-semibold text-sign-text"
            >
              Visit {v.name} <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </Detail>
        )}
      </dl>
    </section>
  );
}

function Ventures() {
  const { page, ventures } = Route.useLoaderData();
  const c = page.content;
  return (
    <>
      <Container className="pb-20 pt-12 md:pt-20">
        <header className="max-w-3xl">
          <ToneBar tone="sign" className="mb-6" />
          <h1 className="display-xl">{c.heading}</h1>
          {c.lead && <p className="mt-6 text-2xl leading-snug text-ink-soft">{c.lead}</p>}
          {c.note && <DraftNote>{c.note}</DraftNote>}
        </header>
        {ventures.map((v) => (
          <VentureFeature key={v.slug} v={v} />
        ))}
      </Container>
      <CtaSection title={c.ctaTitle} body={c.ctaBody} cta={c.ctaLabel} />
    </>
  );
}
