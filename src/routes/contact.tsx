import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Container, ToneBar } from "@/components/common";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dipak Kumar Mahato" },
      {
        name: "description",
        content:
          "Get in touch with Dipak Kumar Mahato about partnerships, media, speaking, or collaboration.",
      },
      { property: "og:title", content: "Contact Dipak Kumar Mahato" },
      { property: "og:description", content: "Let's start a conversation." },
    ],
  }),
  component: Contact,
});

type Fields = { name: string; email: string; subject: string; message: string };
const empty: Fields = { name: "", email: "", subject: "", message: "" };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.name.trim()) e.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = "Enter an email address like name@example.com.";
  if (!f.subject.trim()) e.subject = "Add a subject.";
  if (f.message.trim().length < 10) e.message = "Write at least 10 characters.";
  return e;
}

const inquiries = [
  {
    title: "Business partnerships",
    body: "Working together on commerce, operations, or technology.",
  },
  {
    title: "Media and speaking",
    body: "Interviews, panels, and talks on entrepreneurship in Nepal.",
  },
  { title: "Collaboration", body: "Projects, ideas, and communities building useful things." },
];

function Contact() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [opened, setOpened] = useState(false);

  // No backend yet: hand the message to the visitor's email app, pre-filled.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    const firstError = Object.keys(errs)[0];
    if (firstError) {
      setOpened(false);
      document.getElementById(`f-${firstError}`)?.focus();
      return;
    }
    const body = `${fields.message.trim()}\n\n— ${fields.name.trim()} (${fields.email.trim()})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      fields.subject.trim(),
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const field = (key: keyof Fields, label: string, type = "text", textarea = false) => {
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
        {textarea ? <textarea rows={6} {...common} /> : <input type={type} {...common} />}
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
          <h1 className="display-xl">Let's talk.</h1>
          <p className="mt-6 text-2xl leading-snug text-ink-soft">
            Write to me directly, or use the form and it will open in your email app.
          </p>
          <ul className="ui mt-8 space-y-2 text-lg">
            <li>
              <a href={`mailto:${profile.email}`} className="link font-semibold">
                {profile.email}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="link font-semibold"
              >
                LinkedIn
              </a>
            </li>
          </ul>
          <dl className="mt-12 border-t-2 border-ink">
            {inquiries.map((i) => (
              <div key={i.title} className="border-b border-line py-5">
                <dt className="display-md">{i.title}</dt>
                <dd className="mt-1 text-ink-soft">{i.body}</dd>
              </div>
            ))}
          </dl>
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
          <button
            type="submit"
            className="ui bg-marigold px-6 py-3.5 font-semibold text-marigold-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Continue in email app
          </button>
          <div aria-live="polite">
            {opened && (
              <p className="ui border-l-4 border-marigold bg-paper p-4 text-ink-soft">
                Your email app should now be open with this message filled in. If nothing opened,
                write to{" "}
                <a className="link text-ink" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                .
              </p>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}
