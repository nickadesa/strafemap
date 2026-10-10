import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { MODES, formatDistance, type Mode } from "@/lib/game/engine";
import { achievements, computeStats, useRecords, useSettings } from "@/lib/game/storage";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Your stats — STRAFE" },
      { name: "description", content: "Personal bests, accuracy, streaks and achievements in STRAFE." },
      { property: "og:title", content: "Your stats — STRAFE" },
      { property: "og:description", content: "Track your personal bests and achievements." },
    ],
  }),
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
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5">
        <h1 className="font-display py-8 text-6xl md:text-8xl">Your stats</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cells.map(([k, v]) => <div key={k} className="plate p-5"><p className="font-display text-3xl">{v}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{k}</p></div>)}
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
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${a.done ? "bg-primary text-primary-foreground" : "border border-current"}`}>{a.done ? "✓" : ""}</span>
                  <div><p className="font-semibold">{a.name}</p><p className="text-xs opacity-80">{a.desc}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Signed in, your games are saved to your account. As a guest, they stay in this browser.</p>
      </main>
    </div>
  );
}
