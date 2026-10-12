import { Link } from "@tanstack/react-router";
import { Linkedin, Mail } from "lucide-react";
import { navItems, profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-serif text-3xl">{profile.fullName}</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{profile.positioning}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="space-y-2 text-sm">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline text-muted-foreground hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 text-sm md:col-span-3">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Mail className="h-4 w-4" /> {profile.email}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t px-5 py-6 text-xs text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
      </div>
    </footer>
  );
}
