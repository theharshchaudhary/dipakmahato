import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Container, ToneBar } from "@/components/common";
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
        message: `The message couldn't be sent. Try again, or email ${site.email}.`,
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
        "mt-2 w-full bg-surface px-4 py-3 text-ink outline-none ring-1 transition-shadow focus:ring-2",
        err ? "ring-2 ring-crimson" : "ring-line focus:ring-ink",
      ),
    };
    return (
      <div>
        <label htmlFor={`f-${key}`} className="ui font-semibold">
          {label}
        </label>
        {textarea ? (
          <textarea rows={6} {...common} />
        ) : (
          <input type={type} autoComplete={key === "subject" ? "off" : key} {...common} />
        )}
        {err && (
          <p id={`e-${key}`} className="ui mt-2 text-crimson">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <Container className="pb-24 pt-12 md:pt-20">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ToneBar tone="marigold" className="mb-6" />
          <h1 className="display-xl">{c.heading}</h1>
          {c.lead && <p className="mt-6 text-2xl leading-snug text-ink-soft">{c.lead}</p>}
          <ul className="ui mt-8 space-y-2 text-lg">
            <li>
              <a href={`mailto:${site.email}`} className="link font-semibold">
                {site.email}
              </a>
            </li>
            {site.sameAs.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="link font-semibold"
                >
                  {profileLabel(url)}
                </a>
              </li>
            ))}
          </ul>
          {c.inquiries.length > 0 && (
            <dl className="mt-12 border-t-2 border-ink">
              {c.inquiries.map((i) => (
                <div key={i.title} className="border-b border-line py-5">
                  <dt className="display-md">{i.title}</dt>
                  <dd className="mt-1 text-ink-soft">{i.body}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          aria-label="Contact form"
          className="space-y-6 self-start bg-surface p-6 ring-1 ring-line sm:p-10 lg:col-span-6 lg:col-start-7"
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
            className="ui bg-marigold px-6 py-3.5 font-semibold text-marigold-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-60"
          >
            {status.kind === "sending" ? "Sending…" : "Send message"}
          </button>
          <div aria-live="polite">
            {status.kind === "sent" && (
              <p className="ui border-l-4 border-marigold bg-paper p-4 text-ink">
                {c.successMessage}
              </p>
            )}
            {status.kind === "failed" && (
              <p className="ui border-l-4 border-crimson bg-paper p-4 text-ink">{status.message}</p>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}
