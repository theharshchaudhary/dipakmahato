import { Link } from "@tanstack/react-router";
import { Monogram } from "@/components/common";
import { profileLabel } from "@/lib/profiles";
import { useSite } from "@/lib/site";

const footerLink = "ui link text-night-ink/80 hover:text-night-ink";

/** Dark closing panel in the same editorial language: labels, a serif line, the monogram. */
export function Footer() {
  const site = useSite();
  return (
    <footer className="bg-night text-night-ink">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label text-night-ink/50">{site.fullName}</p>
            <p className="lead-serif mt-5 max-w-md">{site.positioning}</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="label text-night-ink/50">Pages</p>
            <ul className="mt-5 space-y-2.5">
              {site.nav.map((n) => (
                <li key={n.key}>
                  <Link to={n.path} className={footerLink}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="label text-night-ink/50">Contact</p>
            <ul className="mt-5 space-y-2.5">
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className={footerLink}>
                    {site.email}
                  </a>
                </li>
              )}
              {site.sameAs.map((url) => (
                <li key={url}>
                  {/* rel="me" tells search engines these profiles belong to the site owner. */}
                  <a href={url} target="_blank" rel="me noopener noreferrer" className={footerLink}>
                    {profileLabel(url)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-6 border-t border-night-ink/15 pt-6">
          <p className="label text-night-ink/50">
            © {new Date().getFullYear()} {site.fullName}
            {site.footerNote && (
              <span className="ml-4 normal-case tracking-normal">{site.footerNote}</span>
            )}
          </p>
          <Monogram name={site.fullName} className="text-4xl text-night-ink" />
        </div>
      </div>
    </footer>
  );
}
