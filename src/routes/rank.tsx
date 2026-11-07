import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import {
  loadRank,
  saveRank,
  getRank,
  getAdjacentRanks,
  RANK_STEPS,
  SEASON_REWARDS,
  type RankedProfile,
} from "@/lib/rank";
import { AvatarFrame, ClanTagPill, RankBanner, VerifiedBadge } from "@/components/RankVisuals";
import { Flag } from "@/components/Flag";
import {
  COMMUNITY_PLAYERS,
  useSocialProfile,
  type ContinentZone,
} from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { Compass, Flag as FlagIcon, Gift, Globe, Shield, Sparkles, SlidersHorizontal, Trophy } from "lucide-react";

type RankTab = "play" | "leaderboard" | "guide";

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
    if (tab === "play" || tab === "leaderboard" || tab === "guide") return { tab };
    return {};
  },
  component: RankPage,
});

function RankPage() {
  const search = Route.useSearch();
  const [s] = useSettings();
  const [social] = useSocialProfile();
  const lang = (s.language ?? "en") as Lang;
  const [tab, setTab] = useState<RankTab>(search.tab ?? "play");
  const [rank, setRankState] = useState<RankedProfile>(() => loadRank());

  const updateRankPreview = (rp: number, championPosition: number | null) => {
    const updated: RankedProfile = {
      ...rank,
      rp: Math.max(0, rp),
      peakRp: Math.max(rank.peakRp, rp),
      championPosition,
    };
    saveRank(updated);
    setRankState(updated);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset flex min-h-screen items-start justify-center px-3 py-6 md:px-6 md:py-10">
        <div className="w-full max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="seg">
              <button onClick={() => setTab("play")} data-on={tab === "play"} className="seg-item">
                {t(lang, "play")}
              </button>
              <button onClick={() => setTab("leaderboard")} data-on={tab === "leaderboard"} className="seg-item">
                {t(lang, "leaderboard")}
              </button>
              <button onClick={() => setTab("guide")} data-on={tab === "guide"} className="seg-item">
                {t(lang, "guide")}
              </button>
            </div>
          </div>

          {tab === "play" && (
            <PlayTab
              rank={rank}
              lang={lang}
              onPreviewChange={updateRankPreview}
            />
          )}
          {tab === "leaderboard" && (
            <UnifiedLeaderboardView rank={rank} social={social} lang={lang} />
          )}
          {tab === "guide" && (
            <GuideTab lang={lang} rp={rank.rp} championPosition={rank.championPosition} />
          )}
        </div>
      </main>
    </div>
  );
}

function PlayTab({
  rank,
  lang,
  onPreviewChange,
}: {
  rank: RankedProfile;
  lang: Lang;
  onPreviewChange: (rp: number, pos: number | null) => void;
}) {
  const { prev, current, next } = getAdjacentRanks(rank.rp, rank.championPosition);
  const progress = Math.round(current.progressRatio * 100);
  const [showRewards, setShowRewards] = useState(false);
  const [showSim, setShowSim] = useState(false);

  const stats = [
    [rank.wins, t(lang, "winsLabel")],
    [rank.losses, t(lang, "lossesLabel")],
    [`${rank.games ? Math.round((rank.wins / rank.games) * 100) : 0}%`, t(lang, "winRate")],
    [rank.bestStreak, t(lang, "bestStreakLabel")],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="plate relative overflow-hidden p-5 text-center md:p-9">
        {/* Ambient Accent Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-6 h-52 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: current.tier.accent }}
        />

        {/* 3-Column Rank Showcase: Previous (left ~65%) - Current (center 100%) - Next (right ~65%) */}
        <div className="relative mx-auto grid max-w-2xl grid-cols-3 items-center gap-2 sm:gap-6">
          {/* Previous Rank */}
          <div className="flex flex-col items-center opacity-65 transition-opacity hover:opacity-95">
            <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t(lang, "previousRank")}
            </span>
            {prev ? (
              <>
                <RankBanner bannerUrl={prev.bannerUrl} alt={prev.name} width={86} className="sm:scale-105" />
                <p className="mt-1.5 text-xs font-bold" style={{ color: prev.tier.accent }}>
                  {prev.name}
                </p>
                <p className="readout text-[10px] text-muted-foreground">{prev.min.toLocaleString()} RP</p>
              </>
            ) : (
              <div className="grid h-24 w-20 place-items-center rounded-2xl border border-dashed border-border text-[11px] text-muted-foreground">
                Start
              </div>
            )}
          </div>

          {/* Current Rank (Center Hero) */}
          <div className="flex flex-col items-center">
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#D2F801]/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#D2F801]">
              <Sparkles className="h-3 w-3" /> {t(lang, "currentRank")}
            </span>
            <RankBanner
              rp={rank.rp}
              championPosition={rank.championPosition}
              width={142}
              className="my-1 sm:scale-110"
            />
            <h2
              className="font-display mt-2 text-2xl sm:text-4xl"
              style={{ color: current.tier.accent }}
            >
              {current.name}
            </h2>
            <p className="mt-0.5 text-base font-bold sm:text-lg">
              <span className="readout text-[#D2F801]">{rank.rp.toLocaleString()}</span>{" "}
              <span className="text-xs text-muted-foreground">RP</span>
            </p>
          </div>

          {/* Next Rank */}
          <div className="flex flex-col items-center opacity-65 transition-opacity hover:opacity-95">
            <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t(lang, "nextRank")}
            </span>
            {next ? (
              <>
                <RankBanner bannerUrl={next.bannerUrl} alt={next.name} width={86} className="sm:scale-105" />
                <p className="mt-1.5 text-xs font-bold" style={{ color: next.tier.accent }}>
                  {next.name}
                </p>
                <p className="readout text-[10px] text-muted-foreground">
                  {next.rank === "champion" ? "Top 50" : `${next.min.toLocaleString()} RP`}
                </p>
              </>
            ) : (
              <div className="grid h-24 w-20 place-items-center rounded-2xl border border-dashed border-border text-[11px] text-[#D2F801]">
                #1 Apex
              </div>
            )}
          </div>
        </div>

        {/* Division Progress Bar */}
        <div className="mx-auto mt-6 w-full max-w-md">
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted-foreground">
            <span>{current.name}</span>
            <span>{next?.name ?? t(lang, "topRank")}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted p-0.5">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: "#D2F801",
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
            <p className="readout mt-1.5 text-xs text-[#D2F801]">
              {current.rank === "champion"
                ? `Champion Standing · #${current.championPosition}`
                : "Master Tier · Reach Top 50 Leaderboard for Champion"}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="mx-auto mt-6 grid w-full max-w-lg grid-cols-4 divide-x divide-border rounded-2xl border border-border bg-background/40">
          {stats.map(([v, l]) => (
            <div key={l} className="px-2 py-3">
              <p className="readout text-xl font-bold">{v}</p>
              <p className="text-[11px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        {/* CTA & Season Rewards Toggle */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/game/$mode"
            params={{ mode: "classic" }}
            search={{ ranked: 1 }}
            className="btn btn-primary px-9 py-3.5 text-base font-bold shadow-lg"
          >
            {t(lang, "playRanked")}
          </Link>
          <button
            type="button"
            onClick={() => setShowRewards((v) => !v)}
            className="btn btn-outline px-5 py-3 text-sm font-semibold"
          >
            <Gift className="h-4 w-4" />
            {t(lang, "seasonRewards")}
          </button>
          <button
            type="button"
            onClick={() => setShowSim((v) => !v)}
            className="btn btn-outline !px-3.5 !py-3 text-xs"
            title="Test Rank RP & Champion #1-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Interactive Rank Preview Tester */}
        {showSim && (
          <div className="mx-auto mt-5 max-w-lg rounded-2xl border border-border bg-background/70 p-4 text-left text-xs">
            <div className="flex items-center justify-between font-bold">
              <span>Rank & Champion Tester (RANKS.md)</span>
              <span className="readout text-[#D2F801]">{current.bannerUrl}</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-muted-foreground">RP (0 – 8,500)</span>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  value={rank.rp}
                  onChange={(e) => onPreviewChange(Number(e.target.value), rank.championPosition ?? null)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 font-mono text-sm"
                />
              </label>
              <label className="block">
                <span className="text-muted-foreground">Leaderboard Rank (1–50 for Champion)</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  placeholder="None (>50)"
                  value={rank.championPosition ?? ""}
                  onChange={(e) => {
                    const v = e.target.value === "" ? null : Number(e.target.value);
                    onPreviewChange(rank.rp, v);
                  }}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 font-mono text-sm"
                />
              </label>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[
                { label: "Bronze IV (0)", rp: 0, pos: null },
                { label: "Silver IV (1000)", rp: 1000, pos: null },
                { label: "Gold I (3499)", rp: 3499, pos: null },
                { label: "Diamond III (5000)", rp: 5000, pos: null },
                { label: "Master (7000, #120)", rp: 7000, pos: 120 },
                { label: "Champion #1 (7500)", rp: 7500, pos: 1 },
                { label: "Champion #50 (7300)", rp: 7300, pos: 50 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onPreviewChange(preset.rp, preset.pos)}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold hover:border-[#D2F801]"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Season Rank Rewards Preview Drawer */}
      {showRewards && (
        <div className="plate rise-in p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl">{t(lang, "seasonRewards")}</h3>
              <p className="text-xs text-muted-foreground">
                Unlock exclusive Avatar Frames, Titles, Gacha Packs & Super Chat Auras at your peak season tier
              </p>
            </div>
            <span className="rounded-full bg-[#D2F801] px-3 py-1 text-xs font-extrabold text-[#161616]">
              Season 1
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                      ? "border-[#D2F801]/60 bg-[#D2F801]/5"
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
                          <span className="rounded-full bg-[#D2F801] px-2 py-0.5 text-[10px] font-extrabold text-[#161616]">
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
                      <span className="font-semibold text-[#D2F801]">{rw.packsReward}</span>
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
        </div>
      )}

      <Link
        to="/achievements"
        className="plate flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Trophy className="h-4 w-4 text-[#D2F801]" />
          {t(lang, "achievements")}
        </span>
        <span className="text-sm text-muted-foreground">{t(lang, "viewAll")} →</span>
      </Link>
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
}: {
  lang: Lang;
  rp: number;
  championPosition?: number | null | undefined;
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
            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
              mine.rank === "master"
                ? "border-[#D2F801] bg-[#D2F801]/10 ring-1 ring-[#D2F801]"
                : "border-border bg-background/40"
            }`}
          >
            <span className="mb-1 text-xs font-extrabold uppercase tracking-wider" style={{ color: "#E8307A" }}>
              Master
            </span>
            <RankBanner bannerUrl="/ranks/banners/master.svg" alt="Master" width={68} />
            <p className="readout mt-1.5 text-[11px] font-bold text-foreground">7,000+ RP</p>
          </div>

          {/* Champion */}
          <div
            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
              mine.rank === "champion"
                ? "border-[#D2F801] bg-[#D2F801]/10 ring-1 ring-[#D2F801]"
                : "border-border bg-background/40"
            }`}
          >
            <span className="mb-1 text-xs font-extrabold uppercase tracking-wider" style={{ color: "#DC1F30" }}>
              Champion · Top 50
            </span>
            <RankBanner bannerUrl="/ranks/banners/champion-01.svg" alt="Champion #1" width={68} />
            <p className="readout mt-1.5 text-[11px] font-bold text-[#D2F801]">7,000+ RP · #1–50</p>
          </div>
        </div>

        {/* ROW 2 (grid-cols-3): Diamond III -> II -> I */}
        <div className="rounded-2xl border border-border/70 bg-background/25 p-2.5">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "#3F9DE8" }}>
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
                    active ? "border-[#D2F801] bg-[#D2F801]/10" : "border-border/60 bg-card/60"
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
                <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: tier.color }}>
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
                        active ? "border-[#D2F801] bg-[#D2F801]/10" : "border-border/60 bg-card/60"
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
          <p className="font-bold text-foreground">{t(lang, "howRp")}</p>
          <p className="mt-0.5">
            10 rounds per Ranked match · Win <span className="text-positive font-semibold">+25 RP</span> · Loss{" "}
            <span className="text-destructive font-semibold">−20 RP</span> · Margin bonus ±1.5/round · First 5 placement matches ×1.5 RP gain!
          </p>
        </div>
        <span className="readout shrink-0 rounded-full bg-[#D2F801]/10 px-3 py-1 font-bold text-[#D2F801]">
          Champion = 7,000+ RP & Top 50
        </span>
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

  const meEntry = {
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

  const allEntries = [
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
      clanTagColor: p.clanTagColor ?? "#D2F801",
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

  return (
    <div className="space-y-4">
      {/* Scope Filter Bar: Global / Zone / Country */}
      <div className="plate flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="seg">
          <button onClick={() => setScope("global")} data-on={scope === "global"} className="seg-item">
            <Globe className="mr-1.5 inline h-3.5 w-3.5" />
            {t(lang, "globalFilter")}
          </button>
          <button onClick={() => setScope("zone")} data-on={scope === "zone"} className="seg-item">
            <Compass className="mr-1.5 inline h-3.5 w-3.5" />
            {t(lang, "zoneFilter")}
          </button>
          <button onClick={() => setScope("country")} data-on={scope === "country"} className="seg-item">
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
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  selectedZone === z ? "bg-[#D2F801] text-[#161616]" : "bg-muted text-muted-foreground hover:text-foreground"
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
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  selectedCountry === c ? "bg-[#D2F801] text-[#161616]" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Flag country={c} size={16} />
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="plate divide-y divide-border overflow-hidden">
        {allEntries.map((p, idx) => {
          const pos = idx + 1;
          const effectiveChampPos = p.rp >= 7000 && pos <= 50 ? (p.championPosition ?? pos) : null;
          const step = getRank(p.rp, effectiveChampPos);

          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-3.5 py-3 transition-colors sm:gap-4 sm:px-5 sm:py-3.5 ${
                p.me ? "bg-[#D2F801]/10" : "hover:bg-muted/40"
              }`}
            >
              {/* Rank Position Number */}
              <div className="w-7 shrink-0 text-center font-display text-lg sm:w-9 sm:text-xl">
                {pos <= 3 ? (
                  <span
                    className={`inline-grid h-7 w-7 place-items-center rounded-full text-xs font-black ${
                      pos === 1
                        ? "bg-[#D2F801] text-[#161616]"
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
                  <span className="truncate font-bold text-foreground">{p.nickname}</span>
                  <VerifiedBadge type={p.verifiedBadge} size={16} />
                  <Flag country={p.country} size={18} />
                  {p.me && (
                    <span className="rounded-full bg-[#D2F801] px-2 py-0.5 text-[10px] font-black text-[#161616]">
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
                  <p className="readout text-sm font-extrabold sm:text-base">{p.rp.toLocaleString()} RP</p>
                  <p className="text-[10px] text-muted-foreground">{p.zone}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
