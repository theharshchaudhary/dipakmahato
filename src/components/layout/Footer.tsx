import { Link } from "@tanstack/react-router";
import { navItems, profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="bg-night text-night-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-display text-3xl font-semibold tracking-tight">{profile.fullName}</p>
          <p className="mt-3 max-w-sm text-night-ink/70">{profile.positioning}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="ui space-y-2">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link text-night-ink/80 hover:text-night-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="ui space-y-2 md:col-span-3">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="link text-night-ink/80 hover:text-night-ink"
            >
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link text-night-ink/80 hover:text-night-ink"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
      <div className="ui mx-auto max-w-6xl border-t border-night-ink/15 px-4 py-6 text-night-ink/60 sm:px-8">
        © {new Date().getFullYear()} {profile.fullName}
      </div>
    </footer>
  );
}
