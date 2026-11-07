import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import { loadRank } from "@/lib/rank";
import { useSocialProfile } from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { UnifiedLeaderboardView } from "./rank";

export const Route = createFileRoute("/leaderboard")({
  beforeLoad: () => {
    throw redirect({ to: "/rank", search: { tab: "leaderboard" } });
  },
  head: () => ({
    meta: [
      { title: "Leaderboard — STRAFE" },
      { name: "description", content: "Global, Continental Zone, and Country Leaderboards on STRAFE." },
      { property: "og:title", content: "Leaderboard — STRAFE" },
      { property: "og:description", content: "Global, Continental Zone, and Country Leaderboards on STRAFE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [s] = useSettings();
  const [social] = useSocialProfile();
  const lang = (s.language ?? "en") as Lang;
  const rank = loadRank();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-10 pt-8 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-4xl md:text-5xl">{t(lang, "leaderboard")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Live Global, Continental Zone & Country Rank Standings
              </p>
            </div>
            <Link to="/rank" className="btn btn-primary text-sm">
              {t(lang, "rank")} Hub
            </Link>
          </div>
          <UnifiedLeaderboardView rank={rank} social={social} lang={lang} />
        </div>
      </main>
    </div>
  );
}
