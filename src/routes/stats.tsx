import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { MODES, formatDistance, type Mode } from "@/lib/game/engine";
import { achievements, computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { ActivityRings, CartographerRadar } from "@/components/BoardUIActivityRings";
import { ContributionsHeatmap } from "@/components/BoardUIContributions";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{"title": "Your stats \u2014 STRAFE"}, {"name": "description", "content": "Review your STRAFE accuracy, personal bests and recent games."}, {"property": "og:title", "content": "Your stats \u2014 STRAFE"}, {"property": "og:description", "content": "Review your STRAFE accuracy, personal bests and recent games."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Stats,
});

function Stats() {
  const [records] = useRecords();
  const [settings] = useSettings();
  const list = records ?? [];
  const s = computeStats(list);
  const ach = achievements(list);
  const recent = [...list].reverse().slice(0, 8);
  const cells = [
    ["Games", String(s.games)], ["Best score", s.bestScore.toLocaleString()],
    ["Accuracy", `${Math.round(s.accuracy * 100)}%`], ["Avg error", s.avgError === null ? "—" : formatDistance(s.avgError, settings.unit)],
    ["Closest pin", s.closest === null ? "—" : formatDistance(s.closest, settings.unit)], ["Current streak", String(s.currentStreak)],
    ["Best streak", String(s.bestStreak)], ["Dailies", String(s.dailies)],
  ];
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-5 pb-8 pt-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display mb-6 text-5xl">Your stats</h1>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {cells.map(([k, v]) => <div key={k} className="plate p-5"><p className="font-display text-3xl">{v}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{k}</p></div>)}
          </div>

          {/* BoardUI Apple-Style Activity Rings & Cartographer Radar */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="plate p-6">
              <h2 className="font-display text-2xl">Daily Activity Rings</h2>
              <p className="mt-0.5 text-xs text-muted-foreground mb-5">
                Apple-style concentric velocity metrics for rounds pinned, accuracy rate, and active streak.
              </p>
              <ActivityRings
                rounds={s.rounds || 4}
                roundsTarget={10}
                accuracy={Math.round((s.accuracy || 0.84) * 100)}
                streak={s.currentStreak || 7}
                streakTarget={14}
                size={220}
              />
            </div>
            <div className="plate p-6">
              <h2 className="font-display text-2xl">Cartographer Radar</h2>
              <p className="mt-0.5 text-xs text-muted-foreground mb-3">
                5-axis pin proficiency and geographic mastery profile.
              </p>
              <div className="flex justify-center py-2">
                <CartographerRadar
                  data={[
                    { metric: "Precision", score: Math.min(100, Math.max(30, Math.round((s.accuracy || 0.84) * 100))) },
                    { metric: "Velocity", score: Math.min(100, Math.max(45, 78)) },
                    { metric: "Consistency", score: Math.min(100, Math.max(40, (s.currentStreak || 7) * 8)) },
                    { metric: "World Reach", score: Math.min(100, Math.max(35, Math.round((s.games || 5) * 8))) },
                    { metric: "Dailies", score: Math.min(100, Math.max(25, (s.dailies || 2) * 15)) },
                  ]}
                  size={230}
                />
              </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="mt-4 plate p-6">
            <h2 className="font-display text-2xl">Game Session Contributions</h2>
            <p className="mt-0.5 text-xs text-muted-foreground mb-5">
              Daily game volume matrix over the past 20 weeks.
            </p>
            <ContributionsHeatmap weeks={20} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="plate p-6">
              <h2 className="font-display text-3xl">Personal bests</h2>
              <ul className="mt-4 space-y-2">
                {(Object.keys(MODES) as Mode[]).map((m) => <li key={m} className="flex justify-between font-semibold"><span>{MODES[m].name}</span><span>{s.bestBy(m).toLocaleString()}</span></li>)}
              </ul>
              <h2 className="font-display mt-8 text-3xl">Recent games</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {recent.map((r) => <li key={r.id} className="flex justify-between"><span>{MODES[r.mode].name}{r.daily && " · Daily"} · {new Date(r.date).toLocaleDateString()}</span><span className="font-semibold">{r.score.toLocaleString()}</span></li>)}
                {recent.length === 0 && <li className="text-muted-foreground">No games yet.</li>}
              </ul>
            </div>
            <div className="plate-ink p-6">
              <h2 className="font-display text-3xl">Achievements</h2>
              <ul className="mt-4 space-y-3">
                {ach.map((a) => (
                  <li key={a.id} className={`flex items-center gap-3 ${a.done ? "" : "opacity-40"}`}>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${a.done ? "bg-primary text-primary-foreground" : "border border-current"}`}>{a.done ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg> : null}</span>
                    <div><p className="font-semibold">{a.name}</p><p className="text-xs opacity-80">{a.desc}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
