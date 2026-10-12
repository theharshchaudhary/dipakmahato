import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Linkedin, Mail, PenLine, Store } from "lucide-react";
import {
  ButtonLink,
  Container,
  CtaSection,
  DraftNote,
  ImagePlaceholder,
  Reveal,
  SectionHeading,
  TextLink,
} from "@/components/common";
import { ArticlePreview } from "@/components/articles";
import { EditorialRow } from "@/components/home/EditorialRow";
import { articles } from "@/data/articles";
import { profile } from "@/data/profile";
import { ventures } from "@/data/ventures";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dipak Kumar Mahato — Building businesses. Learning through execution." },
      {
        name: "description",
        content: "Dipak Kumar Mahato is an entrepreneur and CEO of Zedfo, writing about business, technology, and execution in Nepal.",
      },
      { property: "og:title", content: "Dipak Kumar Mahato — Entrepreneur, CEO of Zedfo" },
      { property: "og:description", content: "Building businesses. Learning through execution." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = articles.slice(0, 3);
  const zedfo = ventures[0]!;
  return (
    <>
      {/* Hero */}
      <section>
        <Container className="grid gap-12 pb-20 pt-12 md:grid-cols-12 md:gap-10 md:pb-28 md:pt-20">
          <div className="flex flex-col justify-center md:col-span-7">
            <p className="eyebrow">Entrepreneurship · Technology · Business</p>
            <h1 className="mt-6 text-[3.4rem] leading-[0.98] sm:text-7xl lg:text-[6.2rem]">
              Building businesses.{" "}
              <em className="text-accent">Learning through execution.</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed">
              I'm Dipak Kumar Mahato, an entrepreneur focused on building businesses, understanding problems, and
              turning ideas into practical solutions.
            </p>
            <p className="mt-4 max-w-xl text-muted-foreground">
              As CEO of Zedfo, I'm working on making everyday commerce more convenient while learning what it takes to
              build and grow a business in Nepal.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink to="/ventures">Explore my work</ButtonLink>
              <ButtonLink to="/writing" variant="outline">
                Read my ideas
              </ButtonLink>
            </div>
          </div>
          <div className="md:col-span-5">
            {profile.portraitUrl ? (
              <img src={profile.portraitUrl} alt={profile.fullName} className="aspect-[4/5] w-full object-cover" />
            ) : (
              <ImagePlaceholder label="Portrait of Dipak Kumar Mahato — to be supplied" />
            )}
            <p className="mt-3 text-xs text-muted-foreground">{profile.fullName} — {profile.title}</p>
          </div>
        </Container>
      </section>

      {/* Current focus */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Now" title="What I'm focused on" />
            <EditorialRow
              index="01"
              icon={Store}
              title="Zedfo"
              description="Building a local commerce business and exploring the intersection of customer experience, operations, and technology."
              cta="Explore venture"
              to="/ventures"
            />
            <EditorialRow
              index="02"
              icon={PenLine}
              title="Ideas & Observations"
              description="Writing about business decisions, entrepreneurial lessons, and the challenges of execution."
              cta="Read articles"
              to="/writing"
            />
            <EditorialRow
              index="03"
              icon={Handshake}
              title="People & Partnerships"
              description="Connecting with people building useful products, businesses, and communities."
              cta="Get in touch"
              to="/contact"
            />
          </Reveal>
        </Container>
      </section>

      {/* Featured writing */}
      <section className="bg-card py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Writing"
              title="Ideas worth exploring"
              action={<TextLink to="/writing">View all writing</TextLink>}
            />
            <div className="grid gap-10 md:grid-cols-3">
              {featured.map((a) => (
                <ArticlePreview key={a.slug} article={a} />
              ))}
            </div>
            <DraftNote>These are draft pieces in preparation. Dates will appear once articles are published.</DraftNote>
          </Reveal>
        </Container>
      </section>

      {/* Venture spotlight */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <ImagePlaceholder label="Zedfo product screenshot or brand imagery" ratio="aspect-[4/3]" />
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="eyebrow">Venture spotlight · {zedfo.name}</p>
              <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">{zedfo.tagline}</h2>
              <p className="mt-6 text-muted-foreground">
                Zedfo is the current venture Dipak leads as CEO. A verified company description, product imagery, and a
                link to the official website will be added here.
              </p>
              <div className="mt-8">
                <ButtonLink to="/ventures">Explore Zedfo</ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* About preview */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="grid gap-8 border-t pt-10 md:grid-cols-12">
            <p className="eyebrow md:col-span-3">About</p>
            <div className="md:col-span-8">
              <h2 className="text-4xl leading-tight sm:text-6xl">A little about how I think.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                I'm interested in the intersection of business, technology, and execution. I believe meaningful progress
                comes from understanding real problems, making thoughtful decisions, and learning from what happens in
                practice.
              </p>
              <div className="mt-8">
                <TextLink to="/about">More about Dipak</TextLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaSection
        title="Good businesses are built one decision at a time."
        body="I'm always interested in thoughtful conversations about entrepreneurship, technology, and building useful things."
        cta="Let's connect"
      >
        <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground">
          <Mail className="h-4 w-4" /> {profile.email}
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground">
          <Linkedin className="h-4 w-4" /> LinkedIn
        </a>
      </CtaSection>
    </>
  );
}
