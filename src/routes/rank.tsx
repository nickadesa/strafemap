import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSettings, useRecords } from "@/lib/game/storage";
import { loadRank, getRank, RANK_TIERS, RANK_STEPS, type RankedProfile } from "@/lib/rank";
import { t, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/rank")({
  head: () => ({ meta: [{"title": "Rank \u2014 STRAFE"}, {"name": "description", "content": "Track your STRAFE rank and play ranked geography challenges."}, {"property": "og:title", "content": "Rank \u2014 STRAFE"}, {"property": "og:description", "content": "Track your STRAFE rank and play ranked geography challenges."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: RankPage,
});

function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const initial = name?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      className="grid place-items-center rounded-full border border-border/40 bg-muted font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  );
}

function RankPage() {
  const [s] = useSettings();
  const [records] = useRecords();
  const lang = (s.language ?? "en") as Lang;
  const [tab, setTab] = useState<"play" | "leaderboard" | "guide">("play");
  const rank = loadRank();

  const myName = s.name || "Guest";

  const others = (records ?? [])
    .reduce<Record<string, { name: string; score: number }>>((a, r) => {
      if (r.player === myName) return a;
      const e = (a[r.player] ??= { name: r.player, score: 0 });
      e.score += r.score;
      return a;
    }, {});

  const board = [
    { name: myName, elo: rank.rp, me: true },
    ...Object.values(others).slice(0, 9).map((o) => ({
      name: o.name,
      elo: Math.floor(o.score / 100),
      me: false,
    })),
  ].sort((a, b) => b.elo - a.elo);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset flex min-h-screen items-start justify-center px-4 py-6 md:px-5 md:py-10">
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex justify-center"><div className="seg">
            <button
              onClick={() => setTab("play")}
              data-on={tab === "play"} className="seg-item"
            >
              {t(lang, "play")}
            </button>
            <button
              onClick={() => setTab("leaderboard")}
              data-on={tab === "leaderboard"} className="seg-item"
            >
              {t(lang, "leaderboard")}
            </button>
            <button
              onClick={() => setTab("guide")}
              data-on={tab === "guide"} className="seg-item"
            >
              {t(lang, "guide")}
            </button>
          </div></div>

          {tab === "play" && <PlayTab rank={rank} lang={lang} />}
          {tab === "leaderboard" && <LeaderboardTab board={board} />}
          {tab === "guide" && <GuideTab lang={lang} rp={rank.rp} />}
        </div>
      </main>
    </div>
  );
}

function PlayTab({ rank, lang }: { rank: RankedProfile; lang: Lang }) {
  const cur = getRank(rank.rp);
  const nxt = cur.next !== null ? getRank(cur.next) : null;
  const progress = cur.next !== null ? ((rank.rp - cur.min) / (cur.next - cur.min)) * 100 : 100;
  const stats = [
    [rank.wins, t(lang, "winsLabel")], [rank.losses, t(lang, "lossesLabel")],
    [`${rank.games ? Math.round((rank.wins / rank.games) * 100) : 0}%`, t(lang, "winRate")], [rank.bestStreak, t(lang, "bestStreakLabel")],
  ] as const;
  return (
    <div className="space-y-4">
      <div className="plate flex flex-col items-center p-6 text-center md:p-10">
        <img src={cur.icon} alt={cur.name} className="h-36 w-36 md:h-48 md:w-48" />
        <p className="mt-2 text-sm text-muted-foreground">{t(lang, "currentRank")}</p>
        <h2 className="font-display text-4xl md:text-5xl" style={{ color: cur.tier.color }}>{cur.name}</h2>
        <p className="mt-1 text-lg font-semibold"><span className="readout">{rank.rp.toLocaleString()}</span> RP</p>
        <div className="mt-5 w-full max-w-sm">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{cur.name}</span><span>{nxt?.name ?? t(lang, "topRank")}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>
          {nxt && <p className="readout mt-1.5 text-xs text-muted-foreground">{t(lang, "rpToNext", { n: cur.next! - rank.rp, rank: nxt.name })}</p>}
        </div>
        <div className="mt-6 grid w-full max-w-md grid-cols-4 divide-x divide-border rounded-2xl border border-border">
          {stats.map(([v, l]) => (
            <div key={l} className="px-2 py-3"><p className="readout text-xl font-semibold">{v}</p><p className="text-[11px] text-muted-foreground">{l}</p></div>
          ))}
        </div>
        <Link to="/game/$mode" params={{ mode: "classic" }} search={{ ranked: 1 }} className="btn btn-primary mt-6 px-10 py-3">
          {t(lang, "playRanked")}
        </Link>
      </div>
      <Link to="/achievements" className="plate flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
        <span className="font-semibold">{t(lang, "achievements")}</span>
        <span className="text-sm text-muted-foreground">{t(lang, "viewAll")} →</span>
      </Link>
    </div>
  );
}

function GuideTab({ lang, rp }: { lang: Lang; rp: number }) {
  const mine = getRank(rp);
  return (
    <div className="plate p-4 md:p-8">
      <h3 className="mb-5 text-center text-lg font-semibold">{t(lang, "allRanks")}</h3>
      <div className="space-y-5">
        {RANK_TIERS.map((tier) => {
          const steps = RANK_STEPS.filter((s) => s.tier.id === tier.id);
          return (
            <div key={tier.id}>
              <p className="mb-2 text-sm font-semibold" style={{ color: tier.color }}>{tier.name}</p>
              <div className="grid grid-cols-4 gap-2">
                {steps.map((s) => (
                  <div key={s.name} className={`rounded-2xl border p-2 text-center ${s.name === mine.name ? "border-primary bg-primary/10" : "border-border"}`}>
                    <img src={s.icon} alt={s.name} loading="lazy" className="mx-auto h-14 w-14 md:h-16 md:w-16" />
                    <p className="text-xs font-semibold">{s.division ? s.name.split(" ")[1] : s.name}</p>
                    <p className="readout text-[10px] text-muted-foreground">{s.min.toLocaleString()} RP</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">{t(lang, "howRp")}</p>
        <p className="mt-1">{t(lang, "howRpBody")}</p>
      </div>
    </div>
  );
}

function LeaderboardTab({ board }: { board: { name: string; elo: number; me: boolean }[] }) {
  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  return (
    <div>
      <div className="mb-6 flex items-end justify-center gap-3 md:mb-10 md:gap-6">
        {top3[1] && (
          <div className="flex flex-col items-center">
            <Avatar name={top3[1].name} size={48} />
            <p className="mt-2 text-sm font-semibold md:mt-3 md:text-base">{top3[1].name}</p>
            <p className="text-xs text-muted-foreground md:text-sm">{top3[1].elo}</p>
            <div className="mt-2 grid h-16 w-16 place-items-center rounded-t-xl border border-border/30 bg-muted text-xl font-bold md:mt-3 md:h-24 md:w-24 md:text-3xl">2</div>
          </div>
        )}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <Avatar name={top3[0].name} size={56} />
            <p className="mt-2 text-base font-semibold md:mt-3 md:text-lg">{top3[0].name}</p>
            <p className="text-sm text-muted-foreground md:text-base">{top3[0].elo}</p>
            <div className="mt-2 grid h-20 w-20 place-items-center rounded-t-xl border border-border bg-primary text-2xl font-semibold text-primary-foreground md:mt-3 md:h-32 md:w-28 md:text-4xl">1</div>
          </div>
        )}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <Avatar name={top3[2].name} size={44} />
            <p className="mt-2 text-sm font-semibold md:mt-3 md:text-base">{top3[2].name}</p>
            <p className="text-xs text-muted-foreground md:text-sm">{top3[2].elo}</p>
            <div className="mt-2 grid h-14 w-16 place-items-center rounded-t-xl border border-border/30 bg-muted/70 text-lg font-bold md:mt-3 md:h-20 md:w-24 md:text-2xl">3</div>
          </div>
        )}
      </div>

      <div className="plate divide-y">
        {rest.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3 px-3 py-3 md:gap-4 md:px-5 md:py-4">
            <span className="w-6 text-sm text-muted-foreground md:w-8 md:text-base">{i + 4}</span>
            <Avatar name={p.name} size={36} />
            <span className={`flex-1 text-sm font-medium md:text-base ${p.me ? "font-semibold underline decoration-primary decoration-2 underline-offset-4" : ""}`}>{p.name}</span>
            <span className="text-sm font-semibold md:text-base">{p.elo}</span>
          </div>
        ))}
        {rest.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground md:px-5 md:py-10 md:text-base">Play more games to see rankings</p>
        )}
      </div>
    </div>
  );
}
