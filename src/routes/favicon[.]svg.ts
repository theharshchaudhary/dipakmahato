import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "@/lib/api";
import { faviconResponse } from "@/lib/favicon";

/** Browser-tab icon, generated from Site settings and Appearance (see src/lib/favicon.ts). */
export const Route = createFileRoute("/favicon.svg")({
  server: {
    handlers: {
      GET: async () => faviconResponse(await getSiteData()),
    },
  },
});
