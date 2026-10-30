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
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <IconTarget className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-4xl">STRAFE</h1>
              <p className="text-sm text-muted-foreground">Drop one pin. Closer = more points.</p>
            </div>
          </div>

          {/* Daily */}
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t(lang, "daily")}</h2>
            <div className="plate flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <IconCalendar className="h-5 w-5" />
                <div>
                  <p className="font-semibold">{todayKey()}</p>
                  <p className="text-sm text-muted-foreground">{today ? "Done today" : "5 pins · Same for everyone"}</p>
                </div>
              </div>
              {!today && (
                <Link to="/game/$mode" params={{ mode: "classic" }} search={{ daily: 1 }} className="btn btn-primary">
                  {t(lang, "playNow")}
                </Link>
              )}
            </div>
          </section>

          {/* Rank */}
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t(lang, "rank")}</h2>
            <div className="plate flex items-center gap-4 p-5">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted">
                <IconTrophy className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-2xl">{stats.bestScore.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Best score</p>
              </div>
              <Link to="/leaderboard" className="ml-auto text-sm font-semibold text-primary">View →</Link>
            </div>
          </section>

          {/* Party */}
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t(lang, "party")}</h2>
            <div className="plate flex items-center justify-between p-5">
              <div>
                <p className="font-semibold">Play with friends</p>
                <p className="text-sm text-muted-foreground">Up to 10 players</p>
              </div>
              <Link to="/party" className="btn btn-primary">{t(lang, "party")}</Link>
            </div>
          </section>

          {/* Modes */}
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t(lang, "modes")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(MODES) as Mode[]).map((m) => {
                const Icon = MODE_ICONS[m];
                return (
                  <Link key={m} to="/play" search={{ mode: m }} className="plate flex items-center gap-3 p-4 transition-colors hover:bg-muted/50">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{MODES[m].name}</p>
                      <p className="text-xs text-muted-foreground">{MODES[m].tag}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Stats */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t(lang, "stats")}</h2>
            <div className="plate flex items-center justify-between p-5">
              <div className="flex gap-6 text-sm">
                <div><p className="font-display text-xl">{stats.games}</p><p className="text-muted-foreground">Games</p></div>
                <div><p className="font-display text-xl">{stats.bestStreak}</p><p className="text-muted-foreground">Streak</p></div>
              </div>
              <Link to="/stats" className="text-sm font-semibold text-primary">Full stats →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
