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
import { ButtonLink, Container, ToneBar } from "@/components/common";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function NotFoundComponent() {
  return (
    <Container className="py-28 sm:py-40">
      <ToneBar tone="crimson" className="mb-6" />
      <h1 className="display-xl">This page doesn't exist.</h1>
      <p className="mt-5 max-w-lg text-ink-soft">
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
      <ToneBar tone="crimson" className="mb-6" />
      <h1 className="display-xl">This page didn't load.</h1>
      <p className="mt-5 max-w-lg text-ink-soft">
        Something failed while loading it. Reload to try again, or go back to the home page.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="ui bg-ink px-5 py-3 font-semibold text-paper transition-colors hover:bg-sign"
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Dipak Kumar Mahato — Entrepreneur, CEO of Zedfo" },
      {
        name: "description",
        content: "Personal website of Dipak Kumar Mahato, entrepreneur and CEO of Zedfo.",
      },
      { name: "author", content: "Dipak Kumar Mahato" },
      { name: "theme-color", content: "#f3f4f8", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#0e1224", media: "(prefers-color-scheme: dark)" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dipak Kumar Mahato" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
    ],
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
