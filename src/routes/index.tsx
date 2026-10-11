import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { MODES, todayKey, formatDistance, type Mode } from "@/lib/game/engine";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STRAFE — Know the map. Make your mark." },
      { name: "description", content: "A fast 2D map guessing game. Drop one pin, beat the distance, climb your personal bests." },
      { property: "og:title", content: "STRAFE — Map guessing game" },
      { property: "og:description", content: "Drop one pin. Beat the distance. Five rounds, 25,000 points." },
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
        <section className="py-10 md:py-16">
          <h1 className="font-display text-[clamp(4rem,14vw,9.5rem)]">
            Know the map.<br />Make your mark.
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/game/$mode" params={{ mode: "classic" }} search={{}} className="btn btn-primary px-10 py-4 text-lg">PLAY</Link>
            <Link to="/play" className="btn btn-outline">All modes</Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="plate-ink p-6 md:col-span-1">
            <p className="text-sm font-semibold opacity-80">Daily challenge · {todayKey()}</p>
            <p className="font-display mt-3 text-5xl">{today ? today.score.toLocaleString() : "5 pins"}</p>
            <p className="mt-2 text-sm opacity-80">{today ? "Done for today. Come back tomorrow." : "Same five places for everyone today."}</p>
            {!today && (
              <Link to="/game/$mode" params={{ mode: "classic" }} search={{ daily: 1 }} className="btn btn-primary mt-5">Play daily</Link>
            )}
          </div>
          <div className="plate p-6 md:col-span-2">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-muted-foreground">Your stats · {settings.name}</p>
              <Link to="/stats" className="text-sm font-semibold underline">Details</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat k="Best score" v={stats.bestScore.toLocaleString()} />
              <Stat k="Games" v={String(stats.games)} />
              <Stat k="Avg error" v={stats.avgError === null ? "—" : formatDistance(stats.avgError, settings.unit)} />
              <Stat k="Best streak" v={String(stats.bestStreak)} />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <Link key={m} to="/play" search={{ mode: m }} className="plate group p-6 transition-colors hover:bg-primary-pale">
              <span className="rounded-full bg-primary-pale px-3 py-1 text-xs font-semibold text-ink-deep group-hover:bg-card">{MODES[m].tag}</span>
              <h3 className="font-display mt-4 text-3xl">{MODES[m].name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{MODES[m].blurb}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-display text-3xl">{v}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{k}</p>
    </div>
  );
}
