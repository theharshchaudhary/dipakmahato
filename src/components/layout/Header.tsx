import { Link } from "@tanstack/react-router";
import { Linkedin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/90 backdrop-blur transition-[border-color] duration-300",
        scrolled ? "border-b" : "border-b border-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="font-serif text-2xl leading-none" onClick={() => setOpen(false)}>
          {profile.shortName}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn (placeholder link)"
            className="text-muted-foreground transition-colors hover:text-accent"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </nav>
        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-background md:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block border-b py-4 font-serif text-3xl"
                  activeProps={{ className: "text-accent" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
