import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Container, Frame, Label, PageHeader, Pill } from "@/components/common";
import { getPage, sendContactMessage, type ContactInput } from "@/lib/api";
import { profileLabel } from "@/lib/profiles";
import { breadcrumbSchema, buildHead } from "@/lib/seo";
import { siteFromMatches, useSite } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  loader: () => getPage("contact"),
  head: ({ loaderData: page, matches }) => {
    const site = siteFromMatches(matches);
    if (!site || !page) return {};
    return buildHead(site, {
      path: "/contact",
      title: page.seo.title,
      description: page.seo.description,
      image: page.seo.image,
      schema: [
        {
          "@type": "ContactPage",
          url: `${site.siteUrl}/contact`,
          about: { "@id": `${site.siteUrl}/#person` },
        },
        breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]),
      ],
    });
  },
  component: Contact,
});

type Field = Exclude<keyof ContactInput, "website">;
const empty: ContactInput = { name: "", email: "", subject: "", message: "", website: "" };

function validate(f: ContactInput) {
  const e: Partial<Record<Field, string>> = {};
  if (!f.name.trim()) e.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = "Enter an email address like name@example.com.";
  if (!f.subject.trim()) e.subject = "Add a subject.";
  if (f.message.trim().length < 10) e.message = "Write at least 10 characters.";
  return e;
}

type Status =
  { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

function Contact() {
  const site = useSite();
  const { content: c } = Route.useLoaderData();
  const [fields, setFields] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    const firstError = Object.keys(errs)[0];
    if (firstError) {
      document.getElementById(`f-${firstError}`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const result = await sendContactMessage({ data: fields });
      if (result.ok) {
        setFields(empty);
        setStatus({ kind: "sent" });
        return;
      }
      if (result.errors) setErrors(result.errors as Partial<Record<Field, string>>);
      setStatus({
        kind: "failed",
        message: result.message ?? "Check the highlighted fields and send again.",
      });
    } catch {
      setStatus({
        kind: "failed",
        message: site.email
          ? `The message couldn't be sent. Try again, or email ${site.email}.`
          : "The message couldn't be sent. Try again in a moment.",
      });
    }
  };

  const field = (key: Field, label: string, type = "text", textarea = false) => {
    const err = errors[key];
    const common = {
      id: `f-${key}`,
      name: key,
      value: fields[key],
      "aria-invalid": !!err,
      "aria-describedby": err ? `e-${key}` : undefined,
      onChange: (ev: { target: { value: string } }) =>
        setFields((f) => ({ ...f, [key]: ev.target.value })),
      className: cn(
        "ui mt-2 w-full border-b bg-transparent py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink-soft/60",
        err ? "border-crimson" : "border-ink/30 focus:border-ink",
      ),
    };
    return (
      <div>
        <label htmlFor={`f-${key}`} className="label text-ink-soft">
          {label}
        </label>
        {textarea ? (
          <textarea rows={5} {...common} className={cn(common.className, "resize-y")} />
        ) : (
          <input type={type} autoComplete={key === "subject" ? "off" : key} {...common} />
        )}
        {err && (
          <p id={`e-${key}`} className="ui mt-2 text-sm text-crimson">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <PageHeader label="Contact" tone="marigold" title={c.heading} lead={c.lead}>
        <ul className="mt-10 flex flex-wrap gap-2">
          {site.email && (
            <li>
              <a href={`mailto:${site.email}`} className="hover:[&>span]:ring-ink">
                <Pill>{site.email}</Pill>
              </a>
            </li>
          )}
          {site.sameAs.map((url) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="me noopener noreferrer"
                className="hover:[&>span]:ring-ink"
              >
                <Pill>{profileLabel(url)}</Pill>
              </a>
            </li>
          ))}
        </ul>
      </PageHeader>

      <Container className="grid gap-16 py-20 sm:py-28 lg:grid-cols-12">
        {c.inquiries.length > 0 && (
          <div className="lg:col-span-5">
            <Label>What to write about</Label>
            <dl className="mt-6 border-b border-ink/15">
              {c.inquiries.map((i) => (
                <div key={i.title} className="reveal border-t border-ink/15 py-6">
                  <dt className="display-md">{i.title}</dt>
                  <dd className="mt-2 font-serif text-lg leading-relaxed text-ink-soft">
                    {i.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <Frame className="self-start lg:col-span-6 lg:col-start-7">
          <form
            noValidate
            onSubmit={onSubmit}
            aria-label="Contact form"
            className="space-y-8 pb-8 pt-4 sm:px-4"
          >
            {field("name", "Your name")}
            {field("email", "Your email", "email")}
            {field("subject", "Subject")}
            {field("message", "Message", "text", true)}
            {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="f-website">Leave this empty</label>
              <input
                id="f-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={fields.website}
                onChange={(ev) => setFields((f) => ({ ...f, website: ev.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={status.kind === "sending"}
              className="ui px-6 py-3.5 font-semibold transition rounded-button bg-primary text-primary-ink hover:opacity-90 disabled:opacity-60"
            >
              {status.kind === "sending" ? "Sending…" : "Send message"}
            </button>
            <div aria-live="polite">
              {status.kind === "sent" && (
                <p className="ui animate-rise inline-flex items-start gap-2.5 rounded-2xl bg-marigold/15 px-4 py-3 text-ink">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold"
                  />
                  {c.successMessage}
                </p>
              )}
              {status.kind === "failed" && (
                <p className="ui animate-rise inline-flex items-start gap-2.5 rounded-2xl bg-crimson/10 px-4 py-3 text-ink">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson"
                  />
                  {status.message}
                </p>
              )}
            </div>
          </form>
        </Frame>
      </Container>
    </>
  );
}
