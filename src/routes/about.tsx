import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  CtaSection,
  DraftNote,
  ImagePlaceholder,
  TextLink,
  ToneBar,
} from "@/components/common";
import { profile } from "@/data/profile";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dipak Kumar Mahato" },
      {
        name: "description",
        content:
          "Background, journey, and leadership philosophy of Dipak Kumar Mahato, CEO of Zedfo.",
      },
      { property: "og:title", content: "About Dipak Kumar Mahato" },
      {
        property: "og:description",
        content: "An entrepreneur interested in business, technology, and execution.",
      },
    ],
  }),
  component: About,
});

const sections = [
  {
    title: "How I got here",
    body: "Placeholder, to be written from a founder interview: how Dipak came to entrepreneurship, the first steps taken, and what led to Zedfo.",
  },
  {
    title: "Background",
    body: "Placeholder: verified education and professional history will be added here. Nothing has been assumed.",
  },
  {
    title: "How I lead",
    body: "Meaningful progress comes from understanding real problems, making thoughtful decisions, and learning from what happens in practice. Proposed copy, to be refined with Dipak.",
  },
  {
    title: "Right now",
    body: "Leading Zedfo as CEO, working to make everyday commerce in Nepal more convenient, and writing about the lessons along the way.",
  },
];

const interests = [
  "Entrepreneurship",
  "Local commerce",
  "Operations",
  "Technology for real problems",
  "Decision-making",
];

function About() {
  return (
    <>
      <Container className="grid gap-12 pb-16 pt-12 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-7">
          <ToneBar tone="ink" className="mb-6" />
          <h1 className="display-xl">{profile.fullName}</h1>
          <p className="ui mt-4 text-lg font-semibold text-sign-text">
            Entrepreneur and {profile.title}
          </p>
          <p className="mt-8 max-w-xl text-2xl leading-snug">
            I build businesses by understanding problems first, then turning ideas into practical
            solutions. I care most about where business, technology, and execution meet.
          </p>
          <DraftNote>
            Biographical details below are placeholders until verified with Dipak.
          </DraftNote>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          {profile.portraitUrl ? (
            <img
              src={profile.portraitUrl}
              alt={profile.fullName}
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <ImagePlaceholder
              label="Portrait of Dipak — to be supplied"
              ratio="aspect-[4/3] md:aspect-[4/5]"
            />
          )}
        </div>
      </Container>

      <Container className="pb-20 sm:pb-28">
        <dl className="border-t-2 border-ink">
          {sections.map((s) => (
            <div key={s.title} className="grid gap-3 border-b border-line py-9 md:grid-cols-12">
              <dt className="display-md md:col-span-4">{s.title}</dt>
              <dd className="max-w-2xl text-ink-soft md:col-span-7 md:col-start-6">{s.body}</dd>
            </div>
          ))}
          <div className="grid gap-4 border-b border-line py-9 md:grid-cols-12">
            <dt className="display-md md:col-span-4">What I think about</dt>
            <dd className="md:col-span-7 md:col-start-6">
              <ul className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <li key={i} className="ui bg-surface px-3 py-1.5 ring-1 ring-line">
                    {i}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        <div className="mt-10 flex flex-wrap gap-8">
          <TextLink to="/ventures">See the ventures</TextLink>
          <TextLink to="/writing">Read the writing</TextLink>
        </div>
      </Container>

      <CtaSection
        title="Let's start a conversation."
        body="Partnerships, collaboration, or an exchange of ideas — I'd be glad to hear from you."
        cta="Get in touch"
      />
    </>
  );
}
