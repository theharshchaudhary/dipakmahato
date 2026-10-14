import { createFileRoute } from "@tanstack/react-router";
import {
  ButtonLink,
  Container,
  CtaSection,
  SectionHeading,
  TextLink,
  ToneBar,
} from "@/components/common";
import { ArticleList } from "@/components/articles";
import { Hero } from "@/components/home/Hero";
import { fetchArticles, fetchVentures, getPage } from "@/lib/api";
import { profileLabel } from "@/lib/profiles";
import { buildHead } from "@/lib/seo";
import { pagePath, siteFromMatches, useSite } from "@/lib/site";

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

function Home() {
  const site = useSite();
  const { page, recent, spotlight } = Route.useLoaderData();
  const c = page.content;

  return (
    <>
      <Hero site={site} content={c} />

      {c.focusItems.length > 0 && (
        <section className="py-16 sm:py-24">
          <Container>
            <h2 className="display-lg">{c.focusHeading}</h2>
            <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
              {c.focusItems.map((f) => (
                <li key={f.title} className="flex flex-col">
                  <ToneBar tone={f.tone} className="mb-5 w-full" />
                  <h3 className="display-md">{f.title}</h3>
                  <p className="mt-3 text-ink-soft">{f.body}</p>
                  <div className="mt-5">
                    <TextLink to={pagePath[f.page]}>{f.ctaLabel}</TextLink>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {recent.length > 0 && (
        <section className="bg-surface py-16 sm:py-24">
          <Container>
            <SectionHeading
              tone="crimson"
              title={c.writingHeading}
              action={<TextLink to="/writing">All writing</TextLink>}
            />
            <ArticleList articles={recent} />
          </Container>
        </section>
      )}

      {spotlight && (
        <section className="py-16 sm:py-24">
          <Container className="grid gap-10 md:grid-cols-12 md:items-center">
            {spotlight.coverImage && (
              <div className="md:col-span-6">
                <img
                  src={spotlight.coverImage}
                  alt={`${spotlight.name} brand image`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            )}
            <div
              className={spotlight.coverImage ? "md:col-span-5 md:col-start-8" : "md:col-span-8"}
            >
              <ToneBar tone="sign" className="mb-5" />
              <h2 className="display-xl text-sign-text">{spotlight.name}</h2>
              <p className="mt-4 text-2xl leading-snug">{spotlight.tagline}</p>
              {c.spotlightBody && <p className="mt-5 text-ink-soft">{c.spotlightBody}</p>}
              <div className="mt-8">
                <ButtonLink to="/ventures">{c.spotlightCtaLabel || "Read more"}</ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      )}

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
    </>
  );
}
