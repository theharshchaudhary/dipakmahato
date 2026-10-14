import {
  Outlet,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { fetchSite } from "@/lib/api";
import { themeBackground, themeCss } from "@/lib/theme";
import { ButtonLink, Container, Label } from "@/components/common";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function NotFoundComponent() {
  return (
    <Container className="py-28 sm:py-40">
      <Label tone="crimson">Error 404</Label>
      <h1 className="display-xl mt-8">This page doesn't exist.</h1>
      <p className="lead-serif mt-5 max-w-lg text-ink-soft">
        The link may be old, or the page has moved. Start again from the home page.
      </p>
      <div className="mt-10">
        <ButtonLink to="/">Go to home page</ButtonLink>
      </div>
    </Container>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <Container className="py-28 sm:py-40">
      <Label tone="crimson">Something went wrong</Label>
      <h1 className="display-xl mt-8">This page didn't load.</h1>
      <p className="lead-serif mt-5 max-w-lg text-ink-soft">
        Something failed while loading it. Reload to try again, or go back to the home page.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="ui px-5 py-3 font-semibold transition rounded-button bg-primary text-primary-ink hover:opacity-90"
        >
          Reload page
        </button>
        <ButtonLink to="/" variant="outline">
          Go to home page
        </ButtonLink>
      </div>
    </Container>
  );
}

export const Route = createRootRoute({
  // Site settings drive the header, footer and every page's metadata. They change
  // rarely, so load them once per visit rather than on each navigation.
  loader: () => fetchSite(),
  staleTime: Infinity,
  head: ({ loaderData: site }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      {
        name: "theme-color",
        content: themeBackground(site?.theme, "light"),
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: themeBackground(site?.theme, "dark"),
        media: "(prefers-color-scheme: dark)",
      },
      ...(site
        ? [
            { name: "author", content: site.fullName },
            ...(site.verification.google
              ? [{ name: "google-site-verification", content: site.verification.google }]
              : []),
            ...(site.verification.bing
              ? [{ name: "msvalidate.01", content: site.verification.bing }]
              : []),
          ]
        : [{ title: "Site unavailable" }]),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      ...(site?.favicon
        ? [{ rel: "icon", href: site.favicon }]
        : [
            { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
            { rel: "icon", href: "/favicon.ico", sizes: "any" },
          ]),
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    // Colours, fonts and custom CSS from the admin's Appearance screen, after the stylesheet.
    styles: site ? [{ children: themeCss(site.theme, site.customCss) }] : [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
