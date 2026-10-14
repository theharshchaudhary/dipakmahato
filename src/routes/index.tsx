import { createFileRoute } from "@tanstack/react-router";
import { Fragment, type ReactNode } from "react";
import {
  ButtonLink,
  Container,
  CtaSection,
  SectionHeading,
  FramedVisual,
  Label,
  TextLink,
} from "@/components/common";
import { ArticleList } from "@/components/articles";
import { Hero } from "@/components/home/Hero";
import { fetchArticles, fetchVentures, getPage } from "@/lib/api";
import { profileLabel } from "@/lib/profiles";
import { buildHead } from "@/lib/seo";
import { pageLabel, pagePath, siteFromMatches, useSite } from "@/lib/site";
import type { HomeSectionKey } from "@/types";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [page, writing, ventures] = await Promise.all([
      getPage("home"),
      fetchArticles(),
      fetchVentures(),
    ]);
    return {
      page,
      recent: writing.articles.slice(0, 3),
      spotlight: ventures.find((v) => v.primary) ?? ventures[0] ?? null,
    };
  },
  head: ({ loaderData, matches }) => {
    const site = siteFromMatches(matches);
    if (!site || !loaderData) return {};
    const { seo } = loaderData.page;
    return buildHead(site, {
      path: "/",
      title: seo.title,
      description: seo.description,
      image: seo.image,
      type: "profile",
      schema: [
        {
          "@type": "ProfilePage",
          "@id": `${site.siteUrl}/#profilepage`,
          url: `${site.siteUrl}/`,
          name: seo.title ?? site.fullName,
          mainEntity: { "@id": `${site.siteUrl}/#person` },
          isPartOf: { "@id": `${site.siteUrl}/#website` },
        },
      ],
    });
  },
  component: Home,
});

const defaultSections: { key: HomeSectionKey; visible: boolean }[] = [
  { key: "focus", visible: true },
  { key: "writing", visible: true },
  { key: "venture", visible: true },
  { key: "cta", visible: true },
];

function Home() {
  const site = useSite();
  const { page, recent, spotlight } = Route.useLoaderData();
  const c = page.content;

  // Sections below the hero, keyed for the order and visibility chosen in the admin.
  const sections: Record<HomeSectionKey, ReactNode> = {
    focus: c.focusItems.length > 0 && (
      <section className="py-10 sm:py-14">
        <Container>
          <SectionHeading label="Now" title={c.focusHeading} />
          <ul className="grid border-y border-ink/15 md:grid-cols-3 md:divide-x md:divide-ink/15">
            {c.focusItems.map((f) => (
              <li
                key={f.title}
                className="flex flex-col border-t border-ink/15 py-8 first:border-t-0 md:border-t-0 md:px-8 md:first:pl-0 md:last:pr-0"
              >
                <Label tone={f.tone}>{pageLabel[f.page]}</Label>
                <h3 className="display-md mt-6">{f.title}</h3>
                <p className="mt-3 font-serif text-lg leading-relaxed text-ink-soft">{f.body}</p>
                <div className="mt-auto pt-6">
                  <TextLink to={pagePath[f.page]}>{f.ctaLabel}</TextLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    ),
    writing: recent.length > 0 && (
      <section className="py-10 sm:py-14">
        <Container>
          <SectionHeading
            label="Writing"
            tone="crimson"
            title={c.writingHeading}
            action={<TextLink to="/writing">All writing</TextLink>}
          />
          <ArticleList articles={recent} />
        </Container>
      </section>
    ),
    venture: spotlight && (
      <section className="py-10 sm:py-14">
        <Container>
          <SectionHeading
            label={spotlight.primary ? "Current venture" : "Venture"}
            tone="sign"
            title={spotlight.name}
          />
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="lead-serif">{spotlight.tagline}</p>
              {c.spotlightBody && (
                <p className="mt-5 font-serif text-lg leading-relaxed text-ink-soft">
                  {c.spotlightBody}
                </p>
              )}
              <div className="mt-8">
                <ButtonLink to="/ventures">{c.spotlightCtaLabel || "Read more"}</ButtonLink>
              </div>
            </div>
            <FramedVisual
              src={spotlight.coverImage}
              alt={`${spotlight.name} brand image`}
              fallback={spotlight.name}
              className="lg:col-span-6 lg:col-start-7"
            />
          </div>
        </Container>
      </section>
    ),
    cta: (
      <CtaSection title={c.ctaTitle} body={c.ctaBody} cta={c.ctaLabel}>
        <a href={`mailto:${site.email}`} className="ui link font-medium">
          {site.email}
        </a>
        {site.sameAs.map((url) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="me noopener noreferrer"
            className="ui link font-medium"
          >
            {profileLabel(url)}
          </a>
        ))}
      </CtaSection>
    ),
  };
  const order = c.sections?.length ? c.sections : defaultSections;

  return (
    <>
      <Hero site={site} content={c} />
      <div className="py-10 sm:py-14">
        {order
          .filter((s) => s.visible && s.key in sections)
          .map((s) => (
            <Fragment key={s.key}>{sections[s.key]}</Fragment>
          ))}
      </div>
    </>
  );
}
