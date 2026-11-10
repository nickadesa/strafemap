import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches all 4 core tabs (Home, Play, Rank, Settings)", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const homeMatches = router.matchRoutes("/");
    const playMatches = router.matchRoutes("/play");
    const rankMatches = router.matchRoutes("/rank");
    const settingsMatches = router.matchRoutes("/settings");

    expect(homeMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(playMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(rankMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(settingsMatches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("recognizes /community as a defined route for redirecting to /rank", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const communityMatches = router.matchRoutes("/community");
    expect(communityMatches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});

