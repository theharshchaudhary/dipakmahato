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
      <section className="pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Container className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className={site.portrait ? "md:col-span-8" : "md:col-span-10"}>
            {/* The name is the h1 so the page plainly answers a search for it. */}
            <h1 className="ui font-semibold">
              {site.fullName}
              <span className="ml-3 font-normal text-ink-soft">
                {site.jobTitle}
                {site.organization && ` of ${site.organization.name}`}
              </span>
            </h1>
            <p className="display-hero mt-6">{c.heroHeadline}</p>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink-soft sm:text-[1.375rem]">
              {c.heroLead}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/ventures">{c.primaryCtaLabel}</ButtonLink>
              <ButtonLink to="/about" variant="outline">
                {c.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </div>
          {site.portrait && (
            <div className="md:col-span-4">
              <img
                src={site.portrait}
                alt={`Portrait of ${site.fullName}`}
                width={800}
                height={1000}
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover md:aspect-[4/5]"
              />
            </div>
          )}
        </Container>
      </section>

      {c.focusItems.length > 0 && (
        <section className="pb-16 sm:pb-24">
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
