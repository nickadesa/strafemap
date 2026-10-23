import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { MODES, todayKey, formatDistance, type Mode } from "@/lib/game/engine";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STRAFE — Map guessing game" },
      { name: "description", content: "Drop a pin. Beat the distance. Fast 2D map guessing." },
      { property: "og:title", content: "STRAFE" },
      { property: "og:description", content: "One pin. Closer means more points." },
    ],
  }),
  component: Home,
});

function Home() {
  const [records] = useRecords();
  const [settings] = useSettings();
  const stats = computeStats(records ?? []);
  const today = (records ?? []).find((r) => r.daily && r.date.slice(0, 10) === todayKey());

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5">
        {/* Hero — compact, game-like */}
        <section className="flex flex-col items-center py-10 text-center md:py-14">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary text-4xl shadow-lg">🎯</div>
          <h1 className="font-display text-5xl md:text-7xl">STRAFE</h1>
          <p className="mt-3 max-w-md text-lg text-muted-foreground">Drop one pin. Closer = more points.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/game/$mode" params={{ mode: "classic" }} search={{}} className="btn btn-primary px-10 py-4 text-lg">Play now</Link>
            <Link to="/play" className="btn btn-outline">Modes</Link>
            <Link to="/duel" className="btn btn-ink">Party / Duel</Link>
          </div>
        </section>

        {/* Quick stats row */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickStat icon="🏆" label="Best" value={stats.bestScore.toLocaleString()} />
          <QuickStat icon="🎮" label="Games" value={String(stats.games)} />
          <QuickStat icon="📏" label="Avg error" value={stats.avgError === null ? "—" : formatDistance(stats.avgError, settings.unit)} />
          <QuickStat icon="🔥" label="Streak" value={String(stats.bestStreak)} />
        </section>

        {/* Daily + modes */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="plate-ink flex flex-col justify-between p-6">
            <div>
              <p className="text-sm font-semibold opacity-80">📅 Daily · {todayKey()}</p>
              <p className="font-display mt-3 text-4xl">{today ? today.score.toLocaleString() : "5 pins"}</p>
              <p className="mt-2 text-sm opacity-80">{today ? "Done today" : "Same places for everyone"}</p>
            </div>
            {!today && (
              <Link to="/game/$mode" params={{ mode: "classic" }} search={{ daily: 1 }} className="btn btn-primary mt-5 self-start">Play daily</Link>
            )}
          </div>
          <div className="plate col-span-2 grid gap-3 p-6 sm:grid-cols-2">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <Link key={m} to="/play" search={{ mode: m }} className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-primary-pale">
                <span className="text-2xl">{modeIcon(m)}</span>
                <div>
                  <p className="font-display text-xl">{MODES[m].name}</p>
                  <p className="text-xs text-muted-foreground">{MODES[m].tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-6 text-center">
          <Link to="/stats" className="text-sm font-semibold underline">View full stats & achievements →</Link>
        </div>
      </main>
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="plate flex items-center gap-3 p-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-display text-2xl">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function modeIcon(m: Mode) {
  return { classic: "📍", shrink: "⏱️", closest: "🏁", blind: "👁️" }[m] ?? "🎯";
}
