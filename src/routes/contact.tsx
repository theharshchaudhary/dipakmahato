import { createFileRoute } from "@tanstack/react-router";
import { Info, Linkedin, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Container } from "@/components/common";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dipak Kumar Mahato" },
      { name: "description", content: "Get in touch with Dipak Kumar Mahato about partnerships, media, speaking, or collaboration." },
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
  if (!f.name.trim()) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (!f.subject.trim()) e.subject = "Please add a subject.";
  if (f.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  return e;
}

const inquiries = [
  { title: "Business partnerships", body: "Opportunities to work together on commerce, operations, or technology." },
  { title: "Media & speaking", body: "Interviews, panels, and talks on entrepreneurship in Nepal." },
  { title: "Collaboration", body: "Projects, ideas, and communities building useful things." },
];

function Contact() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setSubmitted(false);
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    // TODO: POST to Laravel API endpoint once available.
    setSubmitted(true);
  };

  const field = (key: keyof Fields, label: string, type = "text", textarea = false) => {
    const err = errors[key];
    const common = {
      id: `f-${key}`,
      name: key,
      value: fields[key],
      "aria-invalid": !!err,
      "aria-describedby": err ? `e-${key}` : undefined,
      onChange: (ev: { target: { value: string } }) => setFields((f) => ({ ...f, [key]: ev.target.value })),
      className: cn(
        "mt-2 w-full border bg-card px-3 py-3 outline-none transition-colors focus:border-foreground",
        err ? "border-destructive" : "border-input",
      ),
    };
    return (
      <div>
        <label htmlFor={`f-${key}`} className="text-sm font-medium">{label}</label>
        {textarea ? <textarea rows={6} {...common} /> : <input type={type} {...common} />}
        {err && <p id={`e-${key}`} className="mt-1.5 text-sm text-destructive">{err}</p>}
      </div>
    );
  };

  return (
    <Container className="pb-24 pt-12 md:pt-20">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-5 text-5xl leading-[1.02] sm:text-7xl">Let's start a conversation.</h1>
          <div className="mt-10 space-y-3">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 hover:text-accent">
              <Mail className="h-4 w-4 text-accent" /> {profile.email}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-accent">
              <Linkedin className="h-4 w-4 text-accent" /> LinkedIn
            </a>
          </div>
          <div className="mt-12">
            {inquiries.map((i) => (
              <div key={i.title} className="border-t py-5">
                <h2 className="text-2xl">{i.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
              </div>
            ))}
          </div>
        </div>

        <form noValidate onSubmit={onSubmit} className="space-y-6 lg:col-span-6 lg:col-start-7">
          {field("name", "Name")}
          {field("email", "Email", "email")}
          {field("subject", "Subject")}
          {field("message", "Message", "text", true)}
          <button type="submit" className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent">
            Send message
          </button>
          <div aria-live="polite">
            {submitted && (
              <div className="flex gap-3 border border-accent bg-card p-4 text-sm">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p>
                  Your message looks good, but it has <strong>not been sent</strong> — the contact form isn't connected
                  yet. Please email <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a> in the meantime.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}
