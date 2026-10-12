import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: jsdom never loads the
// stylesheets React waits on.
describe("App routing", () => {
  const router = createRouter({ routeTree });

  it.each(["/", "/about", "/writing", "/ventures", "/contact"])("matches a page for %s", (path) => {
    expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
