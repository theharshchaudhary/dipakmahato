import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { pageTone, useSite } from "@/lib/site";
import { Monogram } from "@/components/common";
import { toneBg } from "@/lib/tone";
import { cn } from "@/lib/utils";

export function Header() {
  const site = useSite();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <a
        href="#main"
        className="ui sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-marigold focus:px-3 focus:py-2 focus:text-marigold-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
        >
          <Monogram name={site.fullName} className="text-2xl" />
          <span>{site.shortName}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className="ui group relative flex items-center gap-2 px-3 py-2 text-ink-soft transition-colors hover:text-ink"
                  activeProps={{ className: "!text-ink font-semibold", "aria-current": "page" }}
                >
                  {({ isActive }) => (
                    <>
                      {/* The section colour shows as a dot, as in labels across the site. */}
                      <span
                        aria-hidden
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-transform duration-200",
                          toneBg[pageTone[item.key]],
                          isActive ? "scale-100" : "scale-0 group-hover:scale-100",
                        )}
                      />
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3 -bottom-[13px] h-px origin-left bg-ink transition-transform duration-300",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-paper md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 pb-6 pt-2">
            {site.nav.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 border-b border-line py-4 font-display text-3xl font-semibold"
                >
                  <span aria-hidden className={cn("h-6 w-1.5", toneBg[pageTone[item.key]])} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
