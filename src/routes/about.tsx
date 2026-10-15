import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  CtaSection,
  DraftNote,
  Frame,
  PageHeader,
  Pill,
  TextLink,
} from "@/components/common";
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
  const facts = [
    { label: "Role", value: site.jobTitle },
    { label: "Company", value: site.organization?.name },
    { label: "Based in", value: site.location },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <>
      {/* The introduction can be long, so it sits in the body beside the photo, not in the header. */}
      <PageHeader label="About" title={site.fullName}>
        {c.note && <DraftNote>{c.note}</DraftNote>}
      </PageHeader>

      <Container className="grid gap-14 py-20 sm:py-28 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="space-y-10 lg:sticky lg:top-24">
            {site.portrait && (
              <Frame>
                <img
                  src={site.portrait}
                  alt={`Portrait of ${site.fullName}`}
                  width={800}
                  height={1000}
                  className="mx-auto aspect-[4/5] w-full object-cover object-top"
                />
              </Frame>
            )}
            {facts.length > 0 && (
              <dl className="border-t border-ink/15">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex justify-between gap-6 border-b border-ink/15 py-3.5"
                  >
                    <dt className="label text-ink-soft">{f.label}</dt>
                    <dd className="ui text-right font-semibold">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          {c.lead && (
            <p className="mb-14 whitespace-pre-line font-serif text-xl leading-relaxed text-ink sm:text-[1.375rem]">
              {c.lead}
            </p>
          )}
          <dl>
            {c.sections.map((s) => (
              <div key={s.title} className="reveal border-t border-ink/15 pb-10 pt-5">
                <dt className="display-md">{s.title}</dt>
                <dd className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed text-ink-soft">
                  {s.body}
                </dd>
              </div>
            ))}
            {c.interests.length > 0 && (
              <div className="border-t border-ink/15 pb-10 pt-5">
                <dt className="display-md">{c.interestsHeading}</dt>
                <dd className="mt-5">
                  <ul className="flex flex-wrap gap-2">
                    {c.interests.map((i) => (
                      <li key={i}>
                        <Pill>{i}</Pill>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
          <div className="flex flex-wrap gap-8 border-t border-ink/15 pt-6">
            <TextLink to="/ventures">See the ventures</TextLink>
            <TextLink to="/writing">Read the writing</TextLink>
          </div>
        </div>
      </Container>

      <CtaSection title={c.ctaTitle} body={c.ctaBody} cta={c.ctaLabel} />
    </>
  );
}
