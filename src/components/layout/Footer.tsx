import { Link } from "@tanstack/react-router";
import { profileLabel } from "@/lib/profiles";
import { useSite } from "@/lib/site";

export function Footer() {
  const site = useSite();
  return (
    <footer className="bg-night text-night-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-display text-3xl font-semibold tracking-tight">{site.fullName}</p>
          <p className="mt-3 max-w-sm text-night-ink/70">{site.positioning}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="ui space-y-2">
            {site.nav.map((n) => (
              <li key={n.key}>
                <Link to={n.path} className="link text-night-ink/80 hover:text-night-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="ui space-y-2 md:col-span-3">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="link text-night-ink/80 hover:text-night-ink"
            >
              {site.email}
            </a>
          </li>
          {site.sameAs.map((url) => (
            <li key={url}>
              {/* rel="me" tells search engines these profiles belong to the site owner. */}
              <a
                href={url}
                target="_blank"
                rel="me noopener noreferrer"
                className="link text-night-ink/80 hover:text-night-ink"
              >
                {profileLabel(url)}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="ui mx-auto max-w-6xl border-t border-night-ink/15 px-4 py-6 text-night-ink/60 sm:px-8">
        © {new Date().getFullYear()} {site.fullName}
      </div>
    </footer>
  );
}
