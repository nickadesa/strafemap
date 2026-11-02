import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSettings, useRecords } from "@/lib/game/storage";
import { loadRank, getTier, RANK_TIERS, type RankedProfile } from "@/lib/rank";
import { t, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/rank")({
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
  const tier = getTier(rank.elo);

  const myName = s.name || "Guest";

  const others = (records ?? [])
    .reduce<Record<string, { name: string; score: number }>>((a, r) => {
      if (r.player === myName) return a;
      const e = (a[r.player] ??= { name: r.player, score: 0 });
      e.score += r.score;
      return a;
    }, {});

  const board = [
    { name: myName, elo: rank.elo, me: true },
    ...Object.values(others).slice(0, 9).map((o) => ({
      name: o.name,
      elo: 800 + Math.floor(o.score / 100),
      me: false,
    })),
  ].sort((a, b) => b.elo - a.elo);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-56 flex min-h-screen items-start justify-center px-4 py-6 md:px-5 md:py-10">
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
              Guide
            </button>
          </div></div>

          {tab === "play" && <PlayTab rank={rank} tier={tier} />}
          {tab === "leaderboard" && <LeaderboardTab board={board} />}
          {tab === "guide" && <GuideTab />}
        </div>
      </main>
    </div>
  );
}

function PlayTab({ rank, tier }: { rank: RankedProfile; tier: ReturnType<typeof getTier> }) {
  const nextTier = RANK_TIERS.filter((t) => t.id !== "champion").find((t) => t.minElo > rank.elo);
  const progress = nextTier ? Math.min(100, ((rank.elo - tier.minElo) / (nextTier.minElo - tier.minElo)) * 100) : 100;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="plate flex flex-col items-center p-6 text-center md:p-10">
        <img src={tier.icon} alt={tier.name} className="mb-4 h-24 w-24 md:mb-6 md:h-36 md:w-36" />
        <p className="text-sm text-muted-foreground md:text-base">Current Rank</p>
        <h2 className="font-display text-4xl md:text-6xl" style={{ color: tier.color }}>{tier.name}</h2>
        <p className="mt-1 text-xl font-semibold md:mt-2 md:text-3xl"><span className="readout">{rank.elo}</span> ELO</p>

        {nextTier && (
          <div className="mt-4 w-full max-w-sm md:mt-6">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground md:mb-2 md:text-sm">
              <span>{tier.name}</span>
              <span>{nextTier.name}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted md:h-3">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground md:mt-2 md:text-sm">{nextTier.minElo - rank.elo} ELO to {nextTier.name}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm md:mt-8 md:gap-10 md:text-base">
          <div><p className="font-display text-2xl md:text-3xl">{rank.wins}</p><p className="text-muted-foreground">Wins</p></div>
          <div><p className="font-display text-2xl md:text-3xl">{rank.losses}</p><p className="text-muted-foreground">Losses</p></div>
          <div><p className="font-display text-2xl md:text-3xl">{rank.games ? Math.round((rank.wins / rank.games) * 100) : 0}%</p><p className="text-muted-foreground">Win rate</p></div>
          <div><p className="font-display text-2xl md:text-3xl">{rank.bestStreak}</p><p className="text-muted-foreground">Best streak</p></div>
        </div>

        <Link to="/game/$mode" params={{ mode: "classic" }} search={{ ranked: 1 }} className="btn btn-primary mt-6 px-8 py-3 text-base md:mt-8 md:px-12 md:py-4 md:text-lg">
          Play Ranked
        </Link>
      </div>

      <div className="plate p-4 md:p-6">
        <p className="text-sm text-muted-foreground md:text-base">Recent matches will appear here after you play ranked games.</p>
      </div>
    </div>
  );
}

function GuideTab() {
  return (
    <div className="plate p-4 md:p-8">
      <h3 className="mb-4 text-center text-lg font-semibold md:mb-6 md:text-xl">All Ranks</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
        {RANK_TIERS.map((t) => (
          <div key={t.id} className="rounded-xl border border-border/30 bg-muted/50 p-3 text-center md:rounded-2xl md:p-4">
            <img src={t.icon} alt={t.name} className="mx-auto mb-1 h-12 w-12 md:mb-2 md:h-16 md:w-16" />
            <p className="text-sm font-semibold md:text-base">{t.name}</p>
            <p className="text-xs text-muted-foreground md:text-sm">
              {t.id === "champion" ? "Top 1–50" : `${t.minElo}+ ELO`}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-muted-foreground md:mt-8 md:text-base">
        <p className="font-semibold text-foreground">How ELO works</p>
        <p className="mt-1 md:mt-2">Start at 1000 ELO. Win to gain points, lose to lose points. Master is the highest ELO rank. Champion is reserved for the Top 50 players.</p>
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
