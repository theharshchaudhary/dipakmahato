import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () =>
  createRouter({
    routeTree,
    scrollRestoration: true,
    // Cross-fade between pages where the browser supports View Transitions.
    defaultViewTransition: true,
    defaultPreloadStaleTime: 0,
  });
