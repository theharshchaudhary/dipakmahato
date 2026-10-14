import { getRouteApi } from "@tanstack/react-router";
import type { PageKey, Site, Tone } from "@/types";

const rootApi = getRouteApi("__root__");

/** Site settings, loaded once by the root route. */
export function useSite(): Site {
  return rootApi.useLoaderData();
}

/** Read the site settings inside a route's head(), from the root match. */
export function siteFromMatches(matches: readonly { loaderData?: unknown }[]): Site {
  return matches[0]?.loaderData as Site;
}

/** The colour that marks each section of the site. */
export const pageTone: Record<PageKey, Tone> = {
  home: "ink",
  about: "ink",
  writing: "crimson",
  ventures: "sign",
  contact: "marigold",
};

export const pagePath: Record<PageKey, "/" | "/about" | "/writing" | "/ventures" | "/contact"> = {
  home: "/",
  about: "/about",
  writing: "/writing",
  ventures: "/ventures",
  contact: "/contact",
};

/** Default name of each section, used in labels. */
export const pageLabel: Record<PageKey, string> = {
  home: "Home",
  about: "About",
  writing: "Writing",
  ventures: "Ventures",
  contact: "Contact",
};
