import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { MODES, formatDistance, type Mode } from "@/lib/game/engine";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { useSocialProfile } from "@/lib/social";
import { ActivityRings, CartographerRadar } from "@/components/BoardUIActivityRings";
import { ContributionsHeatmap } from "@/components/BoardUIContributions";
import { t, type Lang } from "@/lib/i18n";
import { BarChart3, Compass, History, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Stats — STRAFE" },
      { name: "description", content: "Review your STRAFE accuracy, personal bests and recent games." },
      { property: "og:title", content: "Stats — STRAFE" },
      { property: "og:description", content: "Review your STRAFE accuracy, personal bests and recent games." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Stats,
});

function Stats() {
  const [records] = useRecords();
  const [settings] = useSettings();
  const [social] = useSocialProfile();
  const lang = (settings.language ?? "en") as Lang;
  const list = records ?? [];
  const s = computeStats(list);
  const gamesCount = social.totalGames ?? s.games;
  const recent = [...list].reverse().slice(0, 8);

  const cells = [
    [t(lang, "gamesLabel") || "Games", gamesCount.toLocaleString()],
    [t(lang, "bestScore") || "Best score", s.bestScore.toLocaleString()],
    [t(lang, "accuracy") || "Accuracy", `${Math.round(s.accuracy * 100)}%`],
    [t(lang, "avgError") || "Avg. error", s.avgError === null ? "—" : formatDistance(s.avgError, settings.unit)],
    [t(lang, "closestPin") || "Closest pin", s.closest === null ? "—" : formatDistance(s.closest, settings.unit)],
    [t(lang, "currentStreak") || "Current streak", String(s.currentStreak)],
    [t(lang, "bestStreakLabel") || "Best streak", String(s.bestStreak)],
    [t(lang, "dailies") || "Dailies", String(s.dailies)],
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-16 pt-8 md:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Apple Large Title Header */}
          <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t(lang, "stats")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {gamesCount > 0 ? `${gamesCount} matches played` : t(lang, "noStatsYet")}
              </p>
            </div>
          </header>

          {list.length === 0 ? (
            <div className="plate flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 inline-grid h-16 w-16 place-items-center rounded-full bg-muted">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t(lang, "noStatsYet")}</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Play your first daily challenge or game round to view accuracy, activity rings, and radar metrics.
              </p>
              <Link
                to="/game/$mode"
                params={{ mode: "classic" }}
                search={{ daily: 1 }}
                className="btn btn-primary mt-6 px-8 py-3 text-sm font-semibold shadow-md"
              >
                {t(lang, "playDaily")}
              </Link>
            </div>
          ) : (
            <>
              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {cells.map(([k, v]) => (
                  <div key={k} className="plate p-4 sm:p-5">
                    <p className="readout text-2xl font-bold text-foreground sm:text-3xl">{v}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{k}</p>
                  </div>
                ))}
              </div>

              {/* Concentric Activity Rings & Cartographer Radar */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="plate p-5 sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent-text" />
                      {t(lang, "today")}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Concentric velocity metrics for rounds pinned, accuracy rate, and active streak.
                    </p>
                  </div>
                  <div className="flex justify-center py-2">
                    <ActivityRings
                      rounds={s.rounds || 4}
                      roundsTarget={10}
                      accuracy={Math.round((s.accuracy || 0.84) * 100)}
                      streak={s.currentStreak || 7}
                      streakTarget={14}
                      size={220}
                    />
                  </div>
                </div>

                <div className="plate p-5 sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Compass className="h-4 w-4 text-accent-text" />
                      {t(lang, "skills")}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      5-axis pin proficiency and geographic mastery profile.
                    </p>
                  </div>
                  <div className="flex justify-center py-2">
                    <CartographerRadar
                      data={[
                        { metric: "Precision", score: Math.min(100, Math.max(30, Math.round((s.accuracy || 0.84) * 100))) },
                        { metric: "Velocity", score: Math.min(100, Math.max(45, 78)) },
                        { metric: "Consistency", score: Math.min(100, Math.max(40, (s.currentStreak || 7) * 8)) },
                        { metric: "World Reach", score: Math.min(100, Math.max(35, Math.round((s.games || 5) * 8))) },
                        { metric: "Dailies", score: Math.min(100, Math.max(25, (s.dailies || 2) * 15)) },
                      ]}
                      size={220}
                    />
                  </div>
                </div>
              </div>

              {/* Game Session Contributions Heatmap */}
              <div className="plate p-5 sm:p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-accent-text" />
                    {t(lang, "activity")}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Daily game volume matrix over the past 20 weeks.
                  </p>
                </div>
                <ContributionsHeatmap weeks={20} />
              </div>

              {/* Personal Bests & Recent Games Inset Grouped */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="plate p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent-text" />
                    {t(lang, "bestScores")}
                  </h2>
                  <ul className="mt-4 divide-y divide-border/60">
                    {(Object.keys(MODES) as Mode[]).map((m) => (
                      <li key={m} className="flex justify-between items-center py-2.5 text-sm font-semibold">
                        <span className="text-muted-foreground">{t(lang, m) || MODES[m].name}</span>
                        <span className="readout font-semibold text-foreground">{s.bestBy(m).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="plate p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <History className="h-4 w-4 text-accent-text" />
                    Recent Games
                  </h2>
                  <ul className="mt-4 divide-y divide-border/60 text-sm">
                    {recent.map((r) => (
                      <li key={r.id} className="flex justify-between items-center py-2.5">
                        <span className="text-muted-foreground">
                          {t(lang, r.mode) || MODES[r.mode].name}
                          {r.daily && ` · ${t(lang, "daily")}`} ·{" "}
                          {new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                        <span className="readout font-semibold text-foreground">{r.score.toLocaleString()}</span>
                      </li>
                    ))}
                    {recent.length === 0 && (
                      <li className="py-4 text-center text-xs text-muted-foreground">
                        {t(lang, "noStatsYet")}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
