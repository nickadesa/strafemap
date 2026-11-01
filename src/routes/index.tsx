import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { IconTarget, IconPin, IconTimer, IconFlag, IconEye, IconTrophy, IconCalendar } from "@/components/icons";
import { MODES, todayKey, type Mode } from "@/lib/game/engine";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Home,
});

const MODE_ICONS: Record<Mode, typeof IconPin> = {
  classic: IconPin,
  shrink: IconTimer,
  closest: IconFlag,
  blind: IconEye,
};

function Home() {
  const [records] = useRecords();
  const [settings] = useSettings();
  const lang = (settings.language ?? "en") as Lang;
  const stats = computeStats(records ?? []);
  const today = (records ?? []).find((r) => r.daily && r.date.slice(0, 10) === todayKey());

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-56 px-5 py-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="font-display text-3xl">STRAFE</h1>
            <p className="mt-1 text-sm text-muted-foreground">Drop one pin. The closer it lands, the more it scores.</p>
          </header>

          {/* Daily — the one bright moment */}
          <section className="plate-ink relative mb-8 overflow-hidden p-6 md:p-8">
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" preserveAspectRatio="none">
              <defs>
                <pattern id="grat" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grat)" />
            </svg>
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm opacity-70">
                  <IconCalendar className="h-4 w-4" /> {t(lang, "daily")} · {todayKey()}
                </p>
                <p className="font-display mt-3 text-4xl md:text-5xl">
                  {today ? today.score.toLocaleString() : "5 pins"}
                </p>
                <p className="mt-2 text-sm opacity-70">
                  {today ? `of ${today.max.toLocaleString()} · come back tomorrow` : "Same five places for everyone today"}
                </p>
              </div>
              {!today && (
                <Link to="/game/$mode" params={{ mode: "classic" }} search={{ daily: 1 }} className="btn btn-primary self-start md:self-auto">
                  {t(lang, "playNow")}
                </Link>
              )}
            </div>
          </section>

          {/* Modes */}
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">{t(lang, "modes")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(MODES) as Mode[]).map((m) => {
                const Icon = MODE_ICONS[m];
                return (
                  <Link key={m} to="/play" search={{ mode: m }} className="plate flex items-center gap-4 p-4 transition-colors hover:bg-muted">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{MODES[m].name}</p>
                      <p className="text-sm text-muted-foreground">{MODES[m].tag}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Quiet summary row */}
          <section className="grid gap-3 sm:grid-cols-3">
            <Link to="/leaderboard" className="plate flex items-center gap-3 p-4 transition-colors hover:bg-muted">
              <IconTrophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-display text-xl">{stats.bestScore.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Best score</p>
              </div>
            </Link>
            <Link to="/stats" className="plate flex items-center gap-3 p-4 transition-colors hover:bg-muted">
              <IconTarget className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-display text-xl">{stats.games} <span className="text-muted-foreground">· {stats.bestStreak}</span></p>
                <p className="text-sm text-muted-foreground">Games · best streak</p>
              </div>
            </Link>
            <Link to="/party" className="plate flex items-center gap-3 p-4 transition-colors hover:bg-muted">
              <IconFlag className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{t(lang, "party")}</p>
                <p className="text-sm text-muted-foreground">Up to 10 friends</p>
              </div>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
