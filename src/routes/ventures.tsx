import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import {
  Container,
  CtaSection,
  DraftNote,
  Frame,
  FramedVisual,
  Label,
  PageHeader,
  PersonChip,
} from "@/components/common";
import { fetchVentures, getPage } from "@/lib/api";
import { breadcrumbSchema, buildHead } from "@/lib/seo";
import { siteFromMatches, useSite } from "@/lib/site";
import type { Site, Venture } from "@/types";

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
    <div className="reveal grid gap-3 border-t border-ink/15 py-7 md:grid-cols-12 md:gap-8">
      <dt className="label pt-1.5 text-ink-soft md:col-span-3">{label}</dt>
      <dd className="max-w-2xl font-serif text-lg leading-relaxed text-ink md:col-span-9">
        {children}
      </dd>
    </div>
  );
}

function VentureFeature({ v, site }: { v: Venture; site: Site }) {
  return (
    <section aria-labelledby={`v-${v.slug}`} className="pt-16 first:pt-0 sm:pt-24">
      <div className="flex items-center justify-between gap-6 border-t border-ink/15 pt-5">
        <Label tone="sign">{v.primary ? "Current venture" : "Venture"}</Label>
        {v.website && (
          <a
            href={v.website}
            target="_blank"
            rel="noopener"
            className="label inline-flex items-center gap-1.5 text-ink hover:underline"
          >
            Visit site <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h2 id={`v-${v.slug}`} className="display-xl">
            {v.name}
          </h2>
          <p className="lead-serif mt-6 text-ink-soft">{v.tagline}</p>
          <div className="mt-8">
            <PersonChip name={site.fullName} portrait={site.portrait}>
              {v.role}
            </PersonChip>
          </div>
        </div>
        <FramedVisual
          src={v.coverImage}
          alt={`${v.name} brand image`}
          fallback={v.name}
          ratio="aspect-[16/11]"
          className="lg:col-span-6 lg:col-start-7"
        />
      </div>

      <dl className="mt-16 border-b border-ink/15">
        <Detail label="The company">{v.description}</Detail>
        {v.problem && <Detail label="The problem">{v.problem}</Detail>}
        {(v.product || v.screenshots.length > 0) && (
          <Detail label="The product">
            {v.product && <p>{v.product}</p>}
            {v.screenshots.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
                {v.screenshots.map((src, i) => (
                  <Frame key={src}>
                    <img
                      src={src}
                      alt={`${v.name} screenshot ${i + 1}`}
                      loading="lazy"
                      className="aspect-[9/16] w-full object-cover"
                    />
                  </Frame>
                ))}
              </div>
            )}
          </Detail>
        )}
        {v.milestones.length > 0 && (
          <Detail label="Milestones">
            <ul className="divide-y divide-ink/10">
              {v.milestones.map((m) => (
                <li key={m} className="py-2 first:pt-0 last:pb-0">
                  {m}
                </li>
              ))}
            </ul>
          </Detail>
        )}
      </dl>
    </section>
  );
}

function Ventures() {
  const site = useSite();
  const { page, ventures } = Route.useLoaderData();
  const c = page.content;
  return (
    <>
      <PageHeader
        label="Ventures"
        tone="sign"
        title={c.heading}
        lead={c.lead}
        meta={ventures.length > 1 && `${ventures.length} ventures`}
      >
        {c.note && <DraftNote>{c.note}</DraftNote>}
      </PageHeader>
      <Container className="py-16 sm:py-24">
        {ventures.map((v) => (
          <VentureFeature key={v.slug} v={v} site={site} />
        ))}
      </Container>
      <CtaSection title={c.ctaTitle} body={c.ctaBody} cta={c.ctaLabel} />
    </>
  );
}
