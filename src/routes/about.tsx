import { createFileRoute } from "@tanstack/react-router";
import { Container, CtaSection, DraftNote, ImagePlaceholder, Reveal, TextLink } from "@/components/common";
import { profile } from "@/data/profile";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dipak Kumar Mahato" },
      { name: "description", content: "Background, journey, and leadership philosophy of Dipak Kumar Mahato, CEO of Zedfo." },
      { property: "og:title", content: "About Dipak Kumar Mahato" },
      { property: "og:description", content: "An entrepreneur interested in business, technology, and execution." },
    ],
  }),
  component: About,
});

const sections = [
  {
    title: "Entrepreneurial journey",
    body: "Placeholder — to be written from a founder interview. How Dipak came to entrepreneurship, the first steps taken, and what led to Zedfo.",
  },
  {
    title: "Background & experience",
    body: "Placeholder — verified education and professional history will be added here. Nothing has been assumed.",
  },
  {
    title: "Leadership philosophy",
    body: "Proposed copy: meaningful progress comes from understanding real problems, making thoughtful decisions, and learning from what happens in practice. To be refined with Dipak.",
  },
  {
    title: "Current focus",
    body: "Leading Zedfo as CEO — working on making everyday commerce more convenient in Nepal — and writing about the lessons along the way.",
  },
];

const interests = ["Entrepreneurship", "Local commerce", "Operations", "Technology for real problems", "Decision-making"];

function About() {
  return (
    <>
      <section>
        <Container className="grid gap-12 pb-16 pt-12 md:grid-cols-12 md:pt-20">
          <div className="md:col-span-5">
            {profile.portraitUrl ? (
              <img src={profile.portraitUrl} alt={profile.fullName} className="aspect-[4/5] w-full object-cover" />
            ) : (
              <ImagePlaceholder label="Portrait of Dipak Kumar Mahato — to be supplied" />
            )}
          </div>
          <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
            <p className="eyebrow">About</p>
            <h1 className="mt-5 text-5xl leading-[1.02] sm:text-7xl">
              {profile.fullName}
            </h1>
            <p className="mt-3 text-lg text-accent">{profile.title}</p>
            <p className="mt-8 text-lg leading-relaxed">
              I'm an entrepreneur focused on building businesses, understanding problems, and turning ideas into
              practical solutions. I'm interested in the intersection of business, technology, and execution.
            </p>
            <DraftNote>Biographical details on this page are placeholders until verified with Dipak.</DraftNote>
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          {sections.map((s) => (
            <Reveal key={s.title} className="grid gap-4 border-t py-10 md:grid-cols-12">
              <h2 className="text-3xl md:col-span-4">{s.title}</h2>
              <p className="max-w-2xl leading-relaxed text-muted-foreground md:col-span-7 md:col-start-6">{s.body}</p>
            </Reveal>
          ))}
          <Reveal className="grid gap-4 border-t py-10 md:grid-cols-12">
            <h2 className="text-3xl md:col-span-4">Core interests</h2>
            <ul className="flex flex-wrap gap-2 md:col-span-7 md:col-start-6">
              {interests.map((i) => (
                <li key={i} className="border px-3 py-1.5 text-sm text-muted-foreground">{i}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="grid gap-4 border-t py-10 md:grid-cols-12">
            <h2 className="text-3xl md:col-span-4">Explore further</h2>
            <div className="flex flex-wrap gap-8 md:col-span-7 md:col-start-6">
              <TextLink to="/ventures">Ventures</TextLink>
              <TextLink to="/writing">Writing</TextLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaSection
        title="Let's start a conversation."
        body="Interested in partnerships, collaboration, or an exchange of ideas? I'd be glad to hear from you."
        cta="Get in touch"
      />
    </>
  );
}
