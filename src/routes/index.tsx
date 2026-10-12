import { createFileRoute } from "@tanstack/react-router";
import {
  ButtonLink,
  Container,
  CtaSection,
  DraftNote,
  ImagePlaceholder,
  SectionHeading,
  TextLink,
  ToneBar,
} from "@/components/common";
import { ArticleList } from "@/components/articles";
import { articles } from "@/data/articles";
import { profile } from "@/data/profile";
import { ventures } from "@/data/ventures";
import type { NavItem, Tone } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dipak Kumar Mahato — Building businesses. Learning through execution." },
      {
        name: "description",
        content:
          "Dipak Kumar Mahato is an entrepreneur and CEO of Zedfo, writing about business, technology, and execution in Nepal.",
      },
      { property: "og:title", content: "Dipak Kumar Mahato — Entrepreneur, CEO of Zedfo" },
      { property: "og:description", content: "Building businesses. Learning through execution." },
    ],
  }),
  component: Home,
});

const focus: {
  tone: Tone;
  title: string;
  body: string;
  cta: string;
  to: NavItem["to"];
}[] = [
  {
    tone: "sign",
    title: "Zedfo",
    body: "Building a local commerce business, where customer experience, operations, and technology meet.",
    cta: "See the venture",
    to: "/ventures",
  },
  {
    tone: "crimson",
    title: "Writing",
    body: "Notes on business decisions, lessons from building, and what execution actually takes.",
    cta: "Read the essays",
    to: "/writing",
  },
  {
    tone: "marigold",
    title: "Partnerships",
    body: "Meeting people who build useful products, businesses, and communities.",
    cta: "Get in touch",
    to: "/contact",
  },
];

function Home() {
  const recent = articles.slice(0, 3);
  const zedfo = ventures[0]!;
  return (
    <>
      <section className="pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Container className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="ui font-semibold">
              {profile.fullName}
              <span className="ml-3 font-normal text-ink-soft">Entrepreneur and CEO of Zedfo</span>
            </p>
            <h1 className="display-hero mt-6">Building useful businesses in Nepal.</h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink-soft sm:text-[1.375rem]">
              As CEO of Zedfo, I&apos;m working to make everyday commerce more convenient. I start
              from real problems, make careful decisions, and write down what I learn.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/ventures">See what I&apos;m building</ButtonLink>
              <ButtonLink to="/about" variant="outline">
                About me
              </ButtonLink>
            </div>
          </div>
          <div className="md:col-span-4">
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
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <h2 className="display-lg">What I'm working on</h2>
          <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {focus.map((f) => (
              <li key={f.title} className="flex flex-col">
                <ToneBar tone={f.tone} className="mb-5 w-full" />
                <h3 className="display-md">{f.title}</h3>
                <p className="mt-3 text-ink-soft">{f.body}</p>
                <div className="mt-5">
                  <TextLink to={f.to}>{f.cta}</TextLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            tone="crimson"
            title="Recent writing"
            action={<TextLink to="/writing">All writing</TextLink>}
          />
          <ArticleList articles={recent} />
          <DraftNote>These essays are in progress. Dates appear once they're published.</DraftNote>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <ImagePlaceholder label="Zedfo product or brand imagery" ratio="aspect-[4/3]" />
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <ToneBar tone="sign" className="mb-5" />
            <h2 className="display-xl text-sign-text">{zedfo.name}</h2>
            <p className="mt-4 text-2xl leading-snug">{zedfo.tagline}</p>
            <p className="mt-5 text-ink-soft">
              Zedfo is the company Dipak leads as CEO. A verified description, product imagery, and
              a link to the official site will be added here.
            </p>
            <div className="mt-8">
              <ButtonLink to="/ventures">Read about Zedfo</ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection
        title="Good businesses are built one decision at a time."
        body="I'm glad to talk about entrepreneurship, technology, and building useful things."
        cta="Start a conversation"
      >
        <a href={`mailto:${profile.email}`} className="ui link font-medium">
          {profile.email}
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="ui link font-medium">
          LinkedIn
        </a>
      </CtaSection>
    </>
  );
}
