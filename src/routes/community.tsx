import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useRecords, useSettings, computeStats } from "@/lib/game/storage";
import { loadRank } from "@/lib/rank";
import { useSocialProfile } from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import { SymbolCompass, SymbolShield } from "@/components/SFSymbols";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { SocialFeedTab } from "@/components/community/SocialFeedTab";
import { ClanSystemTab } from "@/components/community/ClanSystemTab";

type CommunityTab = "feed" | "clan";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — STRAFE" },
      { name: "description", content: "Explore the STRAFE community feed, match highlights, stories, and clans." },
      { property: "og:title", content: "Community — STRAFE" },
      { property: "og:description", content: "Explore the STRAFE community feed, match highlights, stories, and clans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { tab?: CommunityTab } => {
    const tab = s["tab"];
    if (tab === "feed" || tab === "clan") return { tab };
    return {};
  },
  component: CommunityPage,
});

function CommunityPage() {
  const search = Route.useSearch();
  const [tab, setTab] = useState<CommunityTab>(search.tab ?? "feed");
  const [social, updateSocial] = useSocialProfile();
  const rank = loadRank();
  const [records] = useRecords();
  const stats = useMemo(() => computeStats(records ?? []), [records]);
  const [settings] = useSettings();
  const lang = (settings.language ?? "en") as Lang;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-24 pt-6 md:px-6 md:pb-12 md:pt-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Apple HIG Header: Large Title & Segmented Control */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
                {t(lang, "community")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {tab === "feed"
                  ? "Discover global match drops, shared stories, and community discussions."
                  : "Join or create a clan, climb team leaderboards, and represent your tag."}
              </p>
            </div>

            <SlidingTabs
              tabs={[
                {
                  id: "feed",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <SymbolCompass fill={tab === "feed"} className="h-4 w-4" />
                      {t(lang, "feed")}
                    </span>
                  ),
                },
                {
                  id: "clan",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <SymbolShield fill={tab === "clan"} className="h-4 w-4" />
                      {t(lang, "clan")}
                    </span>
                  ),
                },
              ]}
              activeId={tab}
              onChange={(nextTab) => {
                buzz(6);
                setTab(nextTab as CommunityTab);
              }}
            />
          </div>

          {/* Tab Content */}
          {tab === "feed" && (
            <SocialFeedTab social={social} rank={rank} stats={stats} lang={lang} />
          )}

          {tab === "clan" && (
            <ClanSystemTab social={social} updateSocial={updateSocial} rank={rank} />
          )}
        </div>
      </main>
    </div>
  );
}
