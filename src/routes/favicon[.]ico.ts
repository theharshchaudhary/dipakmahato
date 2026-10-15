import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "@/lib/api";
import { faviconResponse } from "@/lib/favicon";

/** Browsers and crawlers ask for /favicon.ico by default; serve the same dynamic icon. */
export const Route = createFileRoute("/favicon.ico")({
  server: {
    handlers: {
      GET: async () => faviconResponse(await getSiteData()),
    },
  },
});
