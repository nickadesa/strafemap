import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSettings, loadRecords } from "@/lib/game/storage";
import { buzz, blip } from "@/lib/game/sound";
import {
  loadRank,
  saveRank,
  getRank,
  getAdjacentRanks,
  RANK_STEPS,
  SEASON_REWARDS,
  type RankedProfile,
} from "@/lib/rank";
import { AvatarFrame, ClanTagPill, RankBanner, VerifiedBadge, type VerifiedBadgeType } from "@/components/RankVisuals";
import { Flag } from "@/components/Flag";
import {
  COMMUNITY_PLAYERS,
  useSocialProfile,
  type ContinentZone,
} from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { SymbolCompass, SymbolTrophy, SymbolShield } from "@/components/SFSymbols";
import { Flag as FlagIcon, Gift, Globe, Sparkles, SlidersHorizontal, Trophy, History } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useCountUp } from "@/lib/use-count-up";
import { ScrollFade, useScrollFade } from "@/components/ScrollFade";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { NumberPopIn } from "@/components/ui/NumberPopIn";
import { TiltCard } from "@/components/ui/TiltCard";

type RankTab = "ladder" | "leaderboard" | "history";

export const Route = createFileRoute("/rank")({
  head: () => ({
    meta: [
      { title: "Rank — STRAFE" },
      { name: "description", content: "Track your STRAFE rank, Season 1 rewards, and global leaderboard." },
      { property: "og:title", content: "Rank — STRAFE" },
      { property: "og:description", content: "Track your STRAFE rank, Season 1 rewards, and global leaderboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { tab?: RankTab } => {
    const tab = s["tab"];
    if (tab === "ladder" || tab === "leaderboard" || tab === "history" || tab === "play" || tab === "guide") {
      const normalized: RankTab = tab === "play" || tab === "guide" ? "ladder" : (tab as RankTab);
      return { tab: normalized };
    }
    return {};
  },
  component: RankPage,
});

function RankPage() {
  const search = Route.useSearch();
  const nav = useNavigate();
  const [s] = useSettings();
  const [social] = useSocialProfile();
  const lang = (s.language ?? "en") as Lang;
  const [tab, setTab] = useState<RankTab>(search.tab ?? "ladder");
  const [rank, setRankState] = useState<RankedProfile>(() => loadRank());
  const [showRewards, setShowRewards] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchElapsed, setSearchElapsed] = useState(0);

  const { prev, current, next } = getAdjacentRanks(rank.rp, rank.championPosition);
  const progress = Math.round(current.progressRatio * 100);

  // Matchmaking simulation
  useEffect(() => {
    if (!isSearching) return;
    const interval = setInterval(() => {
      setSearchElapsed((prev) => prev + 1);
    }, 1000);

    const timer = setTimeout(() => {
      buzz(15);
      blip(s.sound, 880, 120);
      setIsSearching(false);
      nav({
        to: "/game/$mode",
        params: { mode: "classic" },
        search: { ranked: 1 },
      });
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isSearching, nav, s.sound]);

  const handleStartMatchmaking = () => {
    buzz(10);
    blip(s.sound, 660, 60);
    setSearchElapsed(0);
    setIsSearching(true);
  };

  const handleCancelMatchmaking = () => {
    buzz(6);
    setIsSearching(false);
    setSearchElapsed(0);
  };

  const stats = [
    [rank.wins, t(lang, "winsLabel")],
    [rank.losses, t(lang, "lossesLabel")],
    [`${rank.games ? Math.round((rank.wins / rank.games) * 100) : 0}%`, t(lang, "winRate")],
    [rank.bestStreak, t(lang, "bestStreakLabel")],
  ] as const;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset flex min-h-screen items-start justify-center px-3 pt-6 pb-16 md:px-6 md:py-10">
        <div className="w-full max-w-4xl space-y-6">
          {/* Apple Large Title Header */}
          <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t(lang, "ranked")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(lang, "seasonCountdown", { days: 24 })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-accent-text" />
                Season 1
              </span>
              <button
                type="button"
                onClick={() => setShowRewards(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-95"
              >
                <Gift className="h-3 w-3 text-accent-text" />
                {t(lang, "seasonRewards")}
              </button>
            </div>
          </header>

          {/* Hero Card: Prominent Rank Emblem & Matchmaking */}
          <div className="plate relative overflow-hidden p-6 text-center md:p-8">
            {/* Center Emblem */}
            <div className="flex flex-col items-center">
              <RankBanner
                rp={rank.rp}
                championPosition={rank.championPosition}
                width={132}
                className="my-1 sm:scale-105"
              />
              <h2
                className="font-display mt-2 text-2xl sm:text-3xl"
                style={{ color: current.tier.accent }}
              >
                {current.name}
              </h2>
              <p className="mt-0.5 text-base font-semibold sm:text-lg">
                <span className="readout text-accent-text font-bold">
                  <NumberPopIn value={rank.rp} />
                </span>{" "}
                <span className="text-xs text-muted-foreground">RP</span>
              </p>
            </div>

            {/* Division Progress Bar */}
            <div className="mx-auto mt-5 w-full max-w-md">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted-foreground">
                <span>{current.name}</span>
                <span>{next?.name ?? t(lang, "topRank")}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted p-0.5">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "var(--accent-fill)",
                  }}
                />
              </div>
              {current.nextDivisionRp !== null ? (
                <p className="readout mt-1.5 text-xs text-muted-foreground">
                  {t(lang, "rpToNext", {
                    n: Math.max(0, current.nextDivisionRp - rank.rp),
                    rank: next?.name ?? "Next",
                  })}
                </p>
              ) : (
                <p className="readout mt-1.5 text-xs text-accent-text">
                  {current.rank === "champion"
                    ? `Champion Standing · #${current.championPosition}`
                    : "Master Tier · Reach Top 50 Leaderboard for Champion"}
                </p>
              )}
            </div>

            {/* Placement Match Notice (if < 5 games) */}
            {rank.games < 5 && (
              <div className="mx-auto mt-5 max-w-md rounded-2xl border border-border/80 bg-background/50 p-3.5 text-left">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">{t(lang, "placements")}</span>
                  <span className="readout text-accent-text">{rank.games} / 5</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t(lang, "placementDesc")}</p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        idx <= rank.games ? "bg-accent-fill" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Matchmaking Action Button */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {!isSearching ? (
                <button
                  type="button"
                  onClick={handleStartMatchmaking}
                  className="btn btn-primary px-8 py-3.5 text-base font-semibold shadow-lg"
                >
                  {t(lang, "findMatch")}
                </button>
              ) : (
                <div className="inline-flex items-center gap-3 rounded-2xl border border-accent-fill/40 bg-accent-fill/10 px-6 py-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-fill opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-fill" />
                  </span>
                  <span className="readout text-sm font-semibold text-foreground">
                    {t(lang, "findingMatch")} (0:0{searchElapsed})
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelMatchmaking}
                    className="ml-2 rounded-lg bg-background/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(lang, "cancelMatch")}
                  </button>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="mx-auto mt-6 grid w-full max-w-lg grid-cols-4 divide-x divide-border rounded-2xl border border-border bg-background/40">
              {stats.map(([v, l]) => (
                <div key={l} className="px-2 py-3">
                  <p className="readout text-lg sm:text-xl font-semibold">{v}</p>
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sliding Tabs */}
          <div className="flex justify-center">
            <SlidingTabs
              tabs={[
                { id: "ladder", label: t(lang, "ladder") },
                { id: "leaderboard", label: t(lang, "leaderboard") },
                { id: "history", label: t(lang, "matchHistory") },
              ]}
              activeId={tab}
              onChange={(nextTab) => {
                buzz(6);
                setTab(nextTab as RankTab);
              }}
            />
          </div>

          {/* Tab Views */}
          {tab === "ladder" && (
            <GuideTab
              lang={lang}
              rp={rank.rp}
              championPosition={rank.championPosition}
              onOpenRewards={() => setShowRewards(true)}
            />
          )}
          {tab === "leaderboard" && (
            <UnifiedLeaderboardView rank={rank} social={social} lang={lang} />
          )}
          {tab === "history" && (
            <MatchHistoryView history={rank.history} lang={lang} />
          )}

          {/* Season Rewards Drawer */}
          <Drawer open={showRewards} onOpenChange={setShowRewards}>
            <DrawerContent className="mx-auto max-w-4xl p-5 sm:p-6">
              <DrawerHeader className="flex flex-row items-center justify-between border-b border-border px-0 pb-4 pt-1">
                <div>
                  <DrawerTitle>{t(lang, "seasonRewards")}</DrawerTitle>
                  <DrawerDescription className="mt-1">
                    Unlock exclusive Avatar Frames, Titles, Gacha Packs & Super Chat Auras at your peak season tier
                  </DrawerDescription>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Season 1
                </span>
              </DrawerHeader>
              <div className="mt-4 grid max-h-[70vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {SEASON_REWARDS.map((rw) => {
                  const unlocked =
                    rw.tier === "champion"
                      ? rank.rp >= 7000 && (rank.championPosition ?? 999) <= 50
                      : rank.peakRp >= rw.minRp || rank.rp >= rw.minRp;
                  return (
                    <div
                      key={rw.tier}
                      className={`flex flex-col justify-between rounded-2xl border p-4 transition-colors ${
                        unlocked
                          ? "border-border bg-accent-fill/5"
                          : "border-border bg-background/40 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AvatarFrame name={rw.name} frameUrl={rw.frameUrl} size={56} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display text-lg" style={{ color: rw.accent }}>
                              {rw.name}
                            </span>
                            {unlocked && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                CLAIMABLE
                              </span>
                            )}
                          </div>
                          <p className="readout text-xs text-muted-foreground">
                            {rw.tier === "champion" ? "7,000+ RP · Top 50" : `${rw.minRp.toLocaleString()}+ RP`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 border-t border-border/60 pt-2.5 text-xs">
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Title:</span>
                          <span className="font-semibold text-foreground">{rw.titleReward}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Packs:</span>
                          <span className="font-semibold text-accent-text">{rw.packsReward}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Chat Aura:</span>
                          <span className="font-semibold text-foreground">{rw.auraReward}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </main>
    </div>
  );
}

function MatchHistoryView({
  history,
  lang,
}: {
  history?: RankedProfile["history"];
  lang: Lang;
}) {
  const fallbackMatches = [
    {
      id: "rm-1",
      date: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      opponentName: "AtlasWalker",
      opponentTag: "GEO",
      opponentRp: 1150,
      myRoundsWon: 3,
      oppRoundsWon: 1,
      rpChange: 32,
      rpAfter: 1120,
    },
    {
      id: "rm-2",
      date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      opponentName: "TerraQueen",
      opponentTag: "APEX",
      opponentRp: 1210,
      myRoundsWon: 3,
      oppRoundsWon: 2,
      rpChange: 26,
      rpAfter: 1088,
    },
    {
      id: "rm-3",
      date: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      opponentName: "NomadPin",
      opponentTag: "PIN",
      opponentRp: 1090,
      myRoundsWon: 1,
      oppRoundsWon: 3,
      rpChange: -18,
      rpAfter: 1062,
    },
    {
      id: "rm-4",
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      opponentName: "GeoSamurai",
      opponentTag: "JP",
      opponentRp: 1140,
      myRoundsWon: 3,
      oppRoundsWon: 0,
      rpChange: 35,
      rpAfter: 1080,
    },
  ];

  const items = history && history.length > 0 ? history : fallbackMatches;

  return (
    <div className="plate divide-y divide-border overflow-hidden !p-0">
      <div className="flex items-center justify-between p-4 sm:px-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          {t(lang, "matchHistory")}
        </h3>
        <span className="text-xs text-muted-foreground">
          {items.length} {t(lang, "gamesLabel") || "matches"}
        </span>
      </div>

      <div className="divide-y divide-border/60">
        {items.map((m) => {
          const isWin = m.rpChange > 0 || m.myRoundsWon > m.oppRoundsWon;
          return (
            <div
              key={m.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-muted/40 sm:px-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span
                  className={`inline-flex h-8 w-14 items-center justify-center rounded-lg text-xs font-bold ${
                    isWin
                      ? "bg-accent-fill/15 text-accent-text"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {isWin ? "WIN" : "LOSS"}
                </span>

                <div>
                  <div className="flex items-center gap-1.5">
                    {m.opponentTag && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        [{m.opponentTag}]
                      </span>
                    )}
                    <span className="text-sm font-semibold text-foreground">
                      {m.opponentName}
                    </span>
                    <span className="readout text-xs text-muted-foreground">
                      ({m.opponentRp.toLocaleString()} RP)
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="readout font-medium">
                      Score: {m.myRoundsWon} – {m.oppRoundsWon}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(m.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`readout text-sm font-bold ${
                    isWin ? "text-accent-text" : "text-destructive"
                  }`}
                >
                  {m.rpChange > 0 ? `+${m.rpChange}` : m.rpChange} RP
                </span>
                <p className="readout text-[11px] text-muted-foreground">
                  {m.rpAfter.toLocaleString()} RP
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Guide Tab: 2 → 3 → 4 Adaptive Pyramid from highest rank (top) to lowest rank (bottom).
 * Row 1 (2 cols): Master (7,000+ RP) | Champion (7,000+ RP · Top 50)
 * Row 2 (3 cols): Diamond III (5,000) -> II (5,667) -> I (6,334)
 * Rows 3–6 (4 cols): Platinum -> Gold -> Silver -> Bronze (IV -> III -> II -> I)
 */
function GuideTab({
  lang,
  rp,
  championPosition,
  onOpenRewards,
}: {
  lang: Lang;
  rp: number;
  championPosition?: number | null | undefined;
  onOpenRewards?: () => void;
}) {
  const mine = getRank(rp, championPosition);
  const diamondSteps = RANK_STEPS.filter((s) => s.rank === "diamond");
  const fourDivTiers: { key: "platinum" | "gold" | "silver" | "bronze"; label: string; color: string }[] = [
    { key: "platinum", label: "Platinum", color: "#62D6E6" },
    { key: "gold", label: "Gold", color: "#FFC82A" },
    { key: "silver", label: "Silver", color: "#C5CCD8" },
    { key: "bronze", label: "Bronze", color: "#CD7F32" },
  ];

  return (
    <div className="plate p-4 md:p-7">
      <div className="mb-4 text-center">
        <h3 className="font-display text-2xl md:text-3xl">{t(lang, "allRanks")}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Adaptive 2 → 3 → 4 Rank Ladder · Division Roman numerals are engraved directly in each banner
        </p>
      </div>

      <div className="space-y-3">
        {/* ROW 1 (grid-cols-2): Master (left) & Champion (right) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Master */}
          <div
            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-colors ${
              mine.rank === "master"
                ? "border-foreground/60 bg-accent-fill/10 ring-1 ring-foreground/40"
                : "border-border bg-background/40"
            }`}
          >
            <span className="mb-1 text-xs font-semibold" style={{ color: "#E8307A" }}>
              Master
            </span>
            <RankBanner bannerUrl="/ranks/banners/master.svg" alt="Master" width={68} />
            <p className="readout mt-1.5 text-[11px] font-semibold text-foreground">7,000+ RP</p>
          </div>

          {/* Champion */}
          <div
            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-colors ${
              mine.rank === "champion"
                ? "border-foreground/60 bg-accent-fill/10 ring-1 ring-foreground/40"
                : "border-border bg-background/40"
            }`}
          >
            <span className="mb-1 text-xs font-semibold" style={{ color: "#DC1F30" }}>
              Champion · Top 50
            </span>
            <RankBanner bannerUrl="/ranks/banners/champion-01.svg" alt="Champion #1" width={68} />
            <p className="readout mt-1.5 text-[11px] font-semibold text-accent-text">7,000+ RP · #1–50</p>
          </div>
        </div>

        {/* ROW 2 (grid-cols-3): Diamond III -> II -> I */}
        <div className="rounded-2xl border border-border/70 bg-background/25 p-2.5">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-xs font-semibold" style={{ color: "#3F9DE8" }}>
              Diamond
            </span>
            <span className="readout text-[10px] text-muted-foreground">5,000 – 6,999 RP</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {diamondSteps.map((s) => {
              const active = mine.name === s.name;
              return (
                <div
                  key={s.name}
                  className={`flex flex-col items-center rounded-xl border p-2 text-center ${
                    active ? "border-foreground/60 bg-accent-fill/10" : "border-border/60 bg-card/60"
                  }`}
                >
                  <RankBanner bannerUrl={s.bannerUrl} alt={s.name} width={54} />
                  <p className="readout mt-1 text-[10px] font-semibold text-muted-foreground">
                    {s.min.toLocaleString()} RP
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROWS 3–6 (grid-cols-4): Platinum -> Gold -> Silver -> Bronze (IV -> III -> II -> I) */}
        {fourDivTiers.map((tier) => {
          const steps = RANK_STEPS.filter((s) => s.rank === tier.key);
          const minRp = steps[0]?.min ?? 0;
          const maxRp = steps[steps.length - 1]?.max ?? 999;
          return (
            <div key={tier.key} className="rounded-2xl border border-border/70 bg-background/25 p-2.5">
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="text-xs font-semibold" style={{ color: tier.color }}>
                  {tier.label}
                </span>
                <span className="readout text-[10px] text-muted-foreground">
                  {minRp.toLocaleString()} – {maxRp.toLocaleString()} RP
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {steps.map((s) => {
                  const active = mine.name === s.name;
                  return (
                    <div
                      key={s.name}
                      className={`flex flex-col items-center rounded-xl border p-1.5 text-center ${
                        active ? "border-foreground/60 bg-accent-fill/10" : "border-border/60 bg-card/60"
                      }`}
                    >
                      <RankBanner bannerUrl={s.bannerUrl} alt={s.name} width={48} />
                      <p className="readout mt-1 text-[10px] font-semibold text-muted-foreground">
                        {s.min.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact How RP Works Banner */}
      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-border bg-background/50 p-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">{t(lang, "howRp")}</p>
          <p className="mt-0.5">
            10 rounds per Ranked match · Win <span className="text-positive font-semibold">+25 RP</span> · Loss{" "}
            <span className="text-destructive font-semibold">−20 RP</span> · Margin bonus ±1.5/round · First 5 placement matches ×1.5 RP gain!
          </p>
        </div>
        <span className="readout shrink-0 rounded-full bg-muted px-3 py-1 font-semibold text-foreground">
          Champion = 7,000+ RP & Top 50
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        {onOpenRewards && (
          <button
            type="button"
            onClick={onOpenRewards}
            className="btn btn-outline text-xs font-semibold"
          >
            <Gift className="h-3.5 w-3.5 text-accent-text" />
            {t(lang, "seasonRewards")}
          </button>
        )}
        <Link
          to="/achievements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <SymbolTrophy fill className="h-3.5 w-3.5 text-accent-text" />
          <span>{t(lang, "achievements")}</span>
          <span className="text-muted-foreground/60">→</span>
        </Link>
      </div>
    </div>
  );
}

interface PodiumEntry {
  id: string;
  nickname: string;
  username: string;
  country: string;
  zone: string;
  rp: number;
  championPosition: number | null;
  clanTag?: string | null | undefined;
  clanTagColor?: string | undefined;
  verifiedBadge?: VerifiedBadgeType | undefined;
  avatarUrl?: string | null | undefined;
  me: boolean;
}

function LeaderboardPodium({ topThree }: { topThree: PodiumEntry[] }) {
  if (topThree.length < 3) return null;

  const p1 = topThree[0]!;
  const p2 = topThree[1]!;
  const p3 = topThree[2]!;
  const champ1 = p1.rp >= 7000 ? (p1.championPosition ?? 1) : null;
  const champ2 = p2.rp >= 7000 ? (p2.championPosition ?? 2) : null;
  const champ3 = p3.rp >= 7000 ? (p3.championPosition ?? 3) : null;

  const step1 = getRank(p1.rp, champ1);
  const step2 = getRank(p2.rp, champ2);
  const step3 = getRank(p3.rp, champ3);

  const stands = [
    {
      player: p2,
      pos: 2,
      champPos: champ2,
      step: step2,
      avatarSize: 52,
      heightClass: "h-24 sm:h-30",
      pedestalBorder: "border-t-2 border-x border-[#8E8E93]/60",
      pedestalBg: "bg-card border border-border/70",
      badgeBg: "bg-[#8E8E93] text-[#03121C]",
      stepNumColor: "text-[#8E8E93]/30",
    },
    {
      player: p1,
      pos: 1,
      champPos: champ1,
      step: step1,
      avatarSize: 64,
      heightClass: "h-32 sm:h-42",
      pedestalBorder: "border-t-2 border-x border-accent-fill/80",
      pedestalBg: "bg-card border border-accent-fill/40",
      badgeBg: "bg-accent-fill text-[#03121C]",
      stepNumColor: "text-accent-text/35",
    },
    {
      player: p3,
      pos: 3,
      champPos: champ3,
      step: step3,
      avatarSize: 48,
      heightClass: "h-18 sm:h-24",
      pedestalBorder: "border-t-2 border-x border-[#A2845E]/60",
      pedestalBg: "bg-card border border-border/70",
      badgeBg: "bg-[#A2845E] text-[#03121C]",
      stepNumColor: "text-[#A2845E]/30",
    },
  ];

  return (
    <div className="plate relative overflow-hidden p-4 sm:p-6 mb-4">

      {/* Podium Grid: 3 columns (Rank 2, Rank 1, Rank 3) */}
      <div className="relative grid grid-cols-3 items-end gap-2 sm:gap-4 max-w-xl mx-auto pt-5">
        {stands.map(({ player: p, pos, champPos, step, avatarSize, heightClass, pedestalBorder, pedestalBg, badgeBg, stepNumColor }) => {
          return (
            <div
              key={p.id}
              id={p.me ? "leaderboard-me" : undefined}
              className={`flex flex-col items-center text-center transition-transform ${
                p.me ? "scale-[1.02]" : ""
              }`}
            >
              {/* Avatar + Floating Rank Badge */}
              <div className="relative mb-2 flex flex-col items-center">
                {pos === 1 && (
                  <div className="mb-1 flex items-center justify-center">
                    <SymbolTrophy className="h-5 w-5 text-accent-text" fill />
                  </div>
                )}
                <div className="relative">
                  <AvatarFrame
                    src={p.avatarUrl}
                    name={p.nickname}
                    rp={p.rp}
                    championPosition={champPos}
                    size={avatarSize}
                  />
                  <span
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 inline-grid h-5 w-5 place-items-center rounded-full text-[11px] font-semibold shadow-sm ${badgeBg}`}
                  >
                    {pos}
                  </span>
                </div>
              </div>

              {/* Player Info */}
              <div className="mb-2 w-full px-1">
                <div className="flex items-center justify-center gap-1">
                  <ClanTagPill tag={p.clanTag} color={p.clanTagColor} />
                  <span className="truncate text-xs sm:text-sm font-semibold text-foreground max-w-[80px] sm:max-w-[110px]">
                    {p.nickname}
                  </span>
                  <VerifiedBadge type={p.verifiedBadge} size={13} />
                </div>
                <div className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                  <Flag country={p.country} size={14} />
                  <span className="truncate max-w-[65px] sm:max-w-[95px]">@{p.username}</span>
                </div>
                <p className="readout mt-1 text-xs sm:text-sm font-semibold text-foreground">
                  {p.rp.toLocaleString()} <span className="text-[10px] text-muted-foreground">RP</span>
                </p>
                {p.me && (
                  <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                    YOU
                  </span>
                )}
              </div>

              {/* Pedestal Stand Pillar */}
              <div
                className={`w-full rounded-t-2xl ${pedestalBorder} ${pedestalBg} ${heightClass} flex flex-col items-center justify-between p-2 shadow-inner`}
              >
                <span className={`font-display text-2xl sm:text-4xl font-semibold select-none ${stepNumColor}`}>
                  {pos}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground/80 truncate w-full px-1" style={{ color: step.tier.accent }}>
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UnifiedLeaderboardView({
  rank,
  social,
  lang,
}: {
  rank: RankedProfile;
  social: ReturnType<typeof useSocialProfile>[0];
  lang: Lang;
}) {
  const [scope, setScope] = useState<"global" | "zone" | "country">("global");
  const [selectedZone, setSelectedZone] = useState<Exclude<ContinentZone, "Global">>(social.zone);
  const [selectedCountry, setSelectedCountry] = useState<string>(social.country);
  const fade = useScrollFade();

  const meEntry: PodiumEntry = {
    id: "me",
    nickname: social.nickname,
    username: social.isGuest ? "guest" : social.username,
    country: social.country,
    zone: social.zone,
    rp: rank.rp,
    championPosition: rank.championPosition ?? null,
    clanTag: social.clanTag,
    clanTagColor: social.clanTagColor,
    verifiedBadge: social.verifiedBadge,
    avatarUrl: social.avatarUrl,
    me: true,
  };

  const allEntries: PodiumEntry[] = [
    meEntry,
    ...COMMUNITY_PLAYERS.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      username: p.username,
      country: p.country,
      zone: p.zone,
      rp: p.rp,
      championPosition: p.championPosition ?? null,
      clanTag: p.clanTag,
      clanTagColor: p.clanTagColor ?? "#00ADFF",
      verifiedBadge: p.verifiedBadge,
      avatarUrl: p.avatarUrl ?? null,
      me: false,
    })),
  ]
    .filter((entry) => {
      if (scope === "zone") return entry.zone === selectedZone;
      if (scope === "country") return entry.country.toLowerCase() === selectedCountry.toLowerCase();
      return true;
    })
    .sort((a, b) => b.rp - a.rp);

  const countries = Array.from(new Set([social.country, ...COMMUNITY_PLAYERS.map((p) => p.country)]));
  const zones: Exclude<ContinentZone, "Global">[] = ["Asia", "Europe", "Americas", "Africa", "Oceania"];

  const showPodium = allEntries.length >= 3;
  const topThree = showPodium ? allEntries.slice(0, 3) : [];
  const listEntries = showPodium ? allEntries.slice(3) : allEntries;
  const listStartIndex = showPodium ? 3 : 0;

  return (
    <div className="space-y-4">
      {/* Scope Filter Bar: Global / Zone / Country */}
      <div className="plate flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="seg">
          <button
            onClick={() => {
              buzz(6);
              setScope("global");
            }}
            data-on={scope === "global"}
            className="seg-item"
          >
            <Globe className="mr-1.5 inline h-3.5 w-3.5" />
            {t(lang, "globalFilter")}
          </button>
          <button
            onClick={() => {
              buzz(6);
              setScope("zone");
            }}
            data-on={scope === "zone"}
            className="seg-item"
          >
            <SymbolCompass fill={scope === "zone"} className="mr-1.5 inline h-3.5 w-3.5" />
            {t(lang, "zoneFilter")}
          </button>
          <button
            onClick={() => {
              buzz(6);
              setScope("country");
            }}
            data-on={scope === "country"}
            className="seg-item"
          >
            <FlagIcon className="mr-1.5 inline h-3.5 w-3.5" />
            {t(lang, "countryFilter")}
          </button>
        </div>

        {scope === "zone" && (
          <div className="flex flex-wrap gap-1.5">
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedZone === z ? "bg-accent-fill text-[#03121C]" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        )}

        {scope === "country" && (
          <div className="flex flex-wrap gap-1.5">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  selectedCountry === c ? "bg-accent-fill text-[#03121C]" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Flag country={c} size={16} />
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {showPodium && <LeaderboardPodium topThree={topThree} />}

      {/* Leaderboard List with internal scroll & sticky header */}
      <div className="plate relative overflow-hidden !p-0">
        {/* Sticky Header with columns and Jump to You button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-3.5 py-2.5 text-xs font-semibold text-muted-foreground backdrop-blur-md sm:px-5">
          <div className="flex items-center gap-3">
            <span className="w-7 text-center font-semibold sm:w-9">#</span>
            <span>Player / Rank</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                buzz(4);
                document.getElementById("leaderboard-me")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="inline-flex items-center gap-1 rounded-full bg-accent-fill/15 px-3 py-1 text-xs font-semibold text-accent-text transition-colors hover:bg-accent-fill/25 active:scale-95"
            >
              <span>{t(lang, "jumpToYou")}</span>
            </button>
            <span className="hidden font-semibold sm:inline">RP / Zone</span>
          </div>
        </div>

        {/* BoardUI Progressive Scroll Fade */}
        <ScrollFade progress={fade.progress} surfaceClassName="from-card/95" className="top-[38px]" />

        {/* Scrollable list up to 100 ranks */}
        <div onScroll={fade.onScroll} className="max-h-[620px] divide-y divide-border overflow-y-auto scroll-smooth">
          {listEntries.map((p, idx) => {
            const pos = listStartIndex + idx + 1;
            const effectiveChampPos = p.rp >= 7000 && pos <= 50 ? (p.championPosition ?? pos) : null;
            const step = getRank(p.rp, effectiveChampPos);

            return (
              <div
                key={p.id}
                id={p.me ? "leaderboard-me" : undefined}
                className={`flex items-center gap-3 px-3.5 py-3 transition-colors sm:gap-4 sm:px-5 sm:py-3.5 ${
                  p.me ? "bg-accent-fill/10 ring-1 ring-inset ring-foreground/40" : "hover:bg-muted/40"
                }`}
              >
                {/* Rank Position Number */}
                <div className="w-7 shrink-0 text-center font-display text-lg sm:w-9 sm:text-xl">
                  {pos <= 3 ? (
                    <span
                      className={`inline-grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                        pos === 1
                          ? "bg-accent-fill text-[#03121C]"
                          : pos === 2
                            ? "bg-[#C5CCD8] text-[#161616]"
                            : "bg-[#CD7F32] text-white"
                      }`}
                    >
                      {pos}
                    </span>
                  ) : (
                    <span className="readout text-sm text-muted-foreground">#{pos}</span>
                  )}
                </div>

                {/* AvatarFrame with circular avatar under frame */}
                <AvatarFrame
                  src={p.avatarUrl}
                  name={p.nickname}
                  rp={p.rp}
                  championPosition={effectiveChampPos}
                  size={52}
                />

                {/* Top line: [TAG] pill + Nickname + VerifiedBadge + Country Flag | Bottom line: @username */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <ClanTagPill tag={p.clanTag} color={p.clanTagColor} />
                    <span className="truncate font-semibold text-foreground">{p.nickname}</span>
                    <VerifiedBadge type={p.verifiedBadge} size={16} />
                    <Flag country={p.country} size={18} />
                    {p.me && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    @{p.username} · <span style={{ color: step.tier.accent }}>{step.name}</span>
                  </p>
                </div>

                {/* Right: Rank Banner Mini + RP */}
                <div className="flex shrink-0 items-center gap-2.5 text-right">
                  <RankBanner rp={p.rp} championPosition={effectiveChampPos} width={36} className="hidden sm:inline-flex" />
                  <div>
                    <p className="readout text-sm font-semibold sm:text-base">{p.rp.toLocaleString()} RP</p>
                    <p className="text-[10px] text-muted-foreground">{p.zone}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
