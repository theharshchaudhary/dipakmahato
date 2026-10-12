import { createFileRoute } from "@tanstack/react-router";
import { Container, CtaSection, DraftNote, TextLink, ToneBar } from "@/components/common";
import { getPage } from "@/lib/api";
import { breadcrumbSchema, buildHead } from "@/lib/seo";
import { siteFromMatches, useSite } from "@/lib/site";

export const Route = createFileRoute("/about")({
  loader: () => getPage("about"),
  head: ({ loaderData: page, matches }) => {
    const site = siteFromMatches(matches);
    if (!site || !page) return {};
    return buildHead(site, {
      path: "/about",
      title: page.seo.title ?? `About ${site.fullName}`,
      description: page.seo.description,
      image: page.seo.image,
      type: "profile",
      schema: [
        {
          "@type": "ProfilePage",
          url: `${site.siteUrl}/about`,
          mainEntity: { "@id": `${site.siteUrl}/#person` },
          isPartOf: { "@id": `${site.siteUrl}/#website` },
          dateModified: page.updatedAt ?? undefined,
        },
        breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ],
    });
  },
  component: About,
});

function About() {
  const site = useSite();
  const { content: c } = Route.useLoaderData();

  return (
    <>
      <Container className="grid gap-12 pb-16 pt-12 md:grid-cols-12 md:pt-20">
        <div className={site.portrait ? "md:col-span-7" : "md:col-span-9"}>
          <ToneBar tone="ink" className="mb-6" />
          <h1 className="display-xl">{site.fullName}</h1>
          <p className="ui mt-4 text-lg font-semibold text-sign-text">
            {site.jobTitle}
            {site.organization && ` of ${site.organization.name}`}
            {site.location && `, ${site.location}`}
          </p>
          <p className="mt-8 max-w-xl text-2xl leading-snug">{c.lead}</p>
          {c.note && <DraftNote>{c.note}</DraftNote>}
        </div>
        {site.portrait && (
          <div className="md:col-span-4 md:col-start-9">
            <img
              src={site.portrait}
              alt={`Portrait of ${site.fullName}`}
              width={800}
              height={1000}
              className="aspect-[4/3] w-full object-cover md:aspect-[4/5]"
            />
          </div>
        )}
      </Container>

      <Container className="pb-20 sm:pb-28">
        <dl className="border-t-2 border-ink">
          {c.sections.map((s) => (
            <div key={s.title} className="grid gap-3 border-b border-line py-9 md:grid-cols-12">
              <dt className="display-md md:col-span-4">{s.title}</dt>
              <dd className="max-w-2xl whitespace-pre-line text-ink-soft md:col-span-7 md:col-start-6">
                {s.body}
              </dd>
            </div>
          ))}
          {c.interests.length > 0 && (
            <div className="grid gap-4 border-b border-line py-9 md:grid-cols-12">
              <dt className="display-md md:col-span-4">{c.interestsHeading}</dt>
              <dd className="md:col-span-7 md:col-start-6">
                <ul className="flex flex-wrap gap-2">
                  {c.interests.map((i) => (
                    <li key={i} className="ui bg-surface px-3 py-1.5 ring-1 ring-line">
                      {i}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-10 flex flex-wrap gap-8">
          <TextLink to="/ventures">See the ventures</TextLink>
          <TextLink to="/writing">Read the writing</TextLink>
        </div>
      </Container>

      <CtaSection title={c.ctaTitle} body={c.ctaBody} cta={c.ctaLabel} />
    </>
  );
}
