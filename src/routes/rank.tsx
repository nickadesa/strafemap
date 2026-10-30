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
      a[r.player] ??= { name: r.player, score: 0 };
      a[r.player].score += r.score;
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
      <main className="md:ml-56 flex min-h-screen items-start justify-center px-5 py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex justify-center gap-2">
            <button
              onClick={() => setTab("play")}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${tab === "play" ? "border-primary bg-primary text-primary-foreground" : "border-border/50 bg-card hover:bg-muted"}`}
            >
              {t(lang, "play")}
            </button>
            <button
              onClick={() => setTab("leaderboard")}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${tab === "leaderboard" ? "border-primary bg-primary text-primary-foreground" : "border-border/50 bg-card hover:bg-muted"}`}
            >
              {t(lang, "leaderboard")}
            </button>
            <button
              onClick={() => setTab("guide")}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${tab === "guide" ? "border-primary bg-primary text-primary-foreground" : "border-border/50 bg-card hover:bg-muted"}`}
            >
              Guide
            </button>
          </div>

          {tab === "play" && <PlayTab rank={rank} tier={tier} />}
          {tab === "leaderboard" && <LeaderboardTab board={board} />}
          {tab === "guide" && <GuideTab />}
        </div>
      </main>
    </div>
  );
}

function PlayTab({ rank, tier }: { rank: RankedProfile; tier: ReturnType<typeof getTier> }) {
  const nextTier = RANK_TIERS.find((t) => t.minElo > rank.elo);
  const progress = nextTier ? Math.min(100, ((rank.elo - tier.minElo) / (nextTier.minElo - tier.minElo)) * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="plate flex flex-col items-center p-8 text-center">
        <div
          className="mb-4 grid h-24 w-24 place-items-center rounded-2xl text-4xl font-bold"
          style={{ background: tier.color + "22", color: tier.color }}
        >
          {tier.name[0]}
        </div>
        <p className="text-sm text-muted-foreground">Current Rank</p>
        <h2 className="font-display text-5xl" style={{ color: tier.color }}>{tier.name}</h2>
        <p className="mt-1 text-2xl font-semibold">{rank.elo} ELO</p>

        {nextTier && (
          <div className="mt-4 w-full max-w-xs">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{tier.name}</span>
              <span>{nextTier.name}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{nextTier.minElo - rank.elo} ELO to {nextTier.name}</p>
          </div>
        )}

        <div className="mt-6 flex gap-8 text-sm">
          <div><p className="font-display text-2xl">{rank.wins}</p><p className="text-muted-foreground">Wins</p></div>
          <div><p className="font-display text-2xl">{rank.losses}</p><p className="text-muted-foreground">Losses</p></div>
          <div><p className="font-display text-2xl">{rank.games ? Math.round((rank.wins / rank.games) * 100) : 0}%</p><p className="text-muted-foreground">Win rate</p></div>
          <div><p className="font-display text-2xl">{rank.bestStreak}</p><p className="text-muted-foreground">Best streak</p></div>
        </div>

        <Link to="/game/$mode" params={{ mode: "classic" }} search={{ ranked: 1 }} className="btn btn-primary mt-6 px-10 py-3">
          Play Ranked
        </Link>
      </div>

      <div className="plate p-5">
        <p className="text-sm text-muted-foreground">Recent matches will appear here after you play ranked games.</p>
      </div>
    </div>
  );
}

function GuideTab() {
  return (
    <div className="plate p-6">
      <h3 className="mb-4 text-center font-semibold">All Ranks</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RANK_TIERS.map((t) => (
          <div key={t.id} className="rounded-xl border border-border/30 bg-muted/50 p-3 text-center">
            <div className="mx-auto mb-1 grid h-10 w-10 place-items-center rounded-lg text-lg font-bold" style={{ background: t.color + "33", color: t.color }}>
              {t.name[0]}
            </div>
            <p className="text-sm font-semibold">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.minElo}+ ELO</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">How ELO works</p>
        <p className="mt-1">Start at 1000 ELO. Win to gain points, lose to lose points. The amount depends on your opponent's ELO. Higher rank = higher ELO threshold.</p>
      </div>
    </div>
  );
}

function LeaderboardTab({ board }: { board: { name: string; elo: number; me: boolean }[] }) {
  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  return (
    <div>
      <div className="mb-8 flex items-end justify-center gap-4">
        {top3[1] && (
          <div className="flex flex-col items-center">
            <Avatar name={top3[1].name} size={56} />
            <p className="mt-2 text-sm font-semibold">{top3[1].name}</p>
            <p className="text-xs text-muted-foreground">{top3[1].elo}</p>
            <div className="mt-2 grid h-20 w-20 place-items-center rounded-t-xl border border-border/30 bg-muted text-2xl font-bold">2</div>
          </div>
        )}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <Avatar name={top3[0].name} size={72} />
            <p className="mt-2 font-semibold">{top3[0].name}</p>
            <p className="text-sm text-primary">{top3[0].elo}</p>
            <div className="mt-2 grid h-28 w-24 place-items-center rounded-t-xl border border-primary/40 bg-primary/20 text-3xl font-bold text-primary">1</div>
          </div>
        )}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <Avatar name={top3[2].name} size={48} />
            <p className="mt-2 text-sm font-semibold">{top3[2].name}</p>
            <p className="text-xs text-muted-foreground">{top3[2].elo}</p>
            <div className="mt-2 grid h-16 w-20 place-items-center rounded-t-xl border border-border/30 bg-muted/70 text-xl font-bold">3</div>
          </div>
        )}
      </div>

      <div className="plate divide-y">
        {rest.map((p, i) => (
          <div key={p.name} className="flex items-center gap-4 px-4 py-3">
            <span className="w-6 text-sm text-muted-foreground">{i + 4}</span>
            <Avatar name={p.name} size={36} />
            <span className={`flex-1 font-medium ${p.me ? "text-primary" : ""}`}>{p.name}</span>
            <span className="text-sm font-semibold">{p.elo}</span>
          </div>
        ))}
        {rest.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Play more games to see rankings</p>
        )}
      </div>
    </div>
  );
}
