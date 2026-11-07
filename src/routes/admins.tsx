import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getRank, loadRank, saveRank, type RankedProfile } from "@/lib/rank";
import { AvatarFrame, ClanTagPill, RankBanner, VerifiedBadge, type VerifiedBadgeType } from "@/components/RankVisuals";
import { useSocialProfile, useClans, computeLevelFromExp, LEVEL_MAX, EXP_PER_LEVEL } from "@/lib/social";
import { Flag } from "@/components/Flag";
import { buzz } from "@/lib/game/sound";
import { ShieldCheck, Sliders, Sparkles, Flame, UserCheck, RotateCcw, Award } from "lucide-react";
import { GameChat } from "@/components/GameChat";

export const Route = createFileRoute("/admins")({
  head: () => ({
    meta: [
      { title: "Admin Tools — STRAFE" },
      { name: "description", content: "Internal developer & admin simulation tools for STRAFE." },
    ],
  }),
  component: AdminsPage,
});

function AdminsPage() {
  const [social, updateSocial] = useSocialProfile();
  const [clans, saveClans] = useClans();
  const [rank, setRank] = useState<RankedProfile>(loadRank());
  const [presetNotice, setPresetNotice] = useState<string | null>(null);

  const current = getRank(rank.rp, rank.championPosition);

  const onRpChange = (rp: number, pos: number | null) => {
    const updated: RankedProfile = {
      ...rank,
      rp: Math.max(0, rp),
      peakRp: Math.max(rank.peakRp, rp),
      championPosition: pos,
    };
    saveRank(updated);
    setRank(updated);
  };

  const applyRonaldoPreset = () => {
    buzz(15);

    // 1. Ensure Portugal clan exists and player is leader
    const portugalClan = {
      id: "clan-portugal",
      tag: "POR",
      name: "Portugal",
      iconUrl: "https://flagcdn.com/w160/pt.png",
      description: "Official Portuguese cartography guild led by Cristiano Ronaldo. Siuuuuuu!",
      level: 10,
      xp: 10000,
      maxMembers: 50,
      totalPoints: 250000,
      weeklyMissionProgress: 50,
      weeklyMissionTarget: 50,
      members: [
        { id: "me", nickname: "Ronaldo", username: "cristiano", rp: 10000, role: "Leader" as const, weeklyContribution: 10000 },
      ],
    };
    const otherClans = clans.filter((c) => c.id !== "clan-portugal" && c.tag !== "POR");
    saveClans([portugalClan, ...otherClans]);

    // 2. Update Social Profile
    updateSocial({
      nickname: "Ronaldo",
      username: "cristiano",
      bio: "Siuuuuuu",
      country: "Portugal",
      zone: "Europe",
      clanTag: "POR",
      clanTagColor: "#ef4444",
      clanId: "clan-portugal",
      isGuest: false,
      verifiedBadge: "champion",
      totalGames: 100000,
      totalPins: 1500000,
      exp: (1000 - 1) * EXP_PER_LEVEL,
      title: "World Champion #1",
      bannerColor: "#1e1e20",
    });

    // 3. Update Rank
    onRpChange(10000, 1);
    const cur = loadRank();
    const updatedRank: RankedProfile = {
      ...cur,
      rp: 10000,
      peakRp: 10000,
      championPosition: 1,
      games: 100000,
      wins: 95000,
      losses: 4500,
      draws: 500,
      winStreak: 50,
      bestStreak: 77,
    };
    saveRank(updatedRank);
    setRank(updatedRank);

    setPresetNotice("Applied Ronaldo Preset");
    setTimeout(() => setPresetNotice(null), 4000);
  };

  const resetDefaultPreset = () => {
    buzz(10);

    updateSocial({
      nickname: "StrafePlayer",
      username: "strafe_ace",
      bio: "Exploring every meridian. Elite cartographer on STRAFE.",
      country: "Thailand",
      zone: "Asia",
      clanTag: "STRF",
      clanTagColor: "#D2F801",
      clanId: "clan-strf",
      isGuest: false,
      verifiedBadge: "gold",
      totalGames: undefined,
      totalPins: undefined,
      exp: 6850,
      title: "Grand Meridian",
      bannerColor: "#27272a",
    });

    onRpChange(1120, null);
    const cur = loadRank();
    const updatedRank: RankedProfile = {
      ...cur,
      rp: 1120,
      peakRp: 1180,
      championPosition: null,
      games: 8,
      wins: 5,
      losses: 3,
      draws: 0,
      winStreak: 2,
      bestStreak: 3,
    };
    saveRank(updatedRank);
    setRank(updatedRank);

    setPresetNotice("Reset to Default Player");
    setTimeout(() => setPresetNotice(null), 4000);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-16 pt-8 md:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#D2F801] text-[#161616]">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl md:text-4xl">Admin & Developer Console</h1>
              <p className="text-xs text-muted-foreground">
                Dedicated sandbox tools for testing profiles, ranks, champion states, and badges.
              </p>
            </div>
          </div>

          {/* Profile Presets Simulator (Ronaldo & Default) */}
          <section className="plate p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="font-display text-xl flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-[#D2F801]" />
                  Profile Presets Simulator
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  1-Click simulate full player profiles: Ronaldo (Champion #1, Portugal, 100k games, 1.5M pins) or reset to default.
                </p>
              </div>
              {presetNotice && (
                <span className="rounded-full bg-[#D2F801]/15 px-3 py-1 text-xs font-semibold text-[#D2F801] animate-in fade-in">
                  ✓ {presetNotice}
                </span>
              )}
            </div>

            {/* Ronaldo Preset Card */}
            <div className="rounded-2xl border border-border bg-card/60 p-4 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <AvatarFrame
                    name="Ronaldo"
                    rp={10000}
                    championPosition={1}
                    size={52}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <ClanTagPill tag="POR" color="#ef4444" />
                      <span className="font-semibold text-foreground text-base">Ronaldo</span>
                      <VerifiedBadge type="champion" size={16} />
                      <Flag country="Portugal" size={18} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      @cristiano · <span className="text-[#D2F801] font-semibold">Champion #1 (10,000 RP)</span>
                    </p>
                    <p className="text-xs italic text-muted-foreground/80 mt-0.5">
                      "Siuuuuuu" · Clan: Portugal [POR]
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-xl border border-border bg-background/50 px-3 py-1.5 text-center text-xs">
                    <p className="font-mono font-semibold text-foreground">100,000</p>
                    <p className="text-[10px] text-muted-foreground">Games (100k)</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/50 px-3 py-1.5 text-center text-xs">
                    <p className="font-mono font-semibold text-[#D2F801]">1,500,000</p>
                    <p className="text-[10px] text-muted-foreground">Pins (1.5M)</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="h-3.5 w-3.5 text-[#D2F801]" />
                  <span>Max Level 1,000 · Title: World Champion #1 · Country: Portugal</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={applyRonaldoPreset}
                    className="btn btn-primary !px-4 !py-2 text-xs font-semibold"
                  >
                    Apply Ronaldo Preset
                  </button>
                  <button
                    type="button"
                    onClick={resetDefaultPreset}
                    className="btn btn-secondary !px-3 !py-2 text-xs font-semibold"
                    title="Reset back to default player"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reset Default
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 1. Verified Badge Switcher */}
          <section className="plate p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="font-display text-xl flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D2F801]" />
                  Verified Badge Preview Switcher
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Simulate verification tiers: Gold (Premium), Rainbow (Exclusive Owner), Green (Creator), Red (Admin), or None.
                </p>
              </div>
              <VerifiedBadge type={social.verifiedBadge} size={24} />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {(
                [
                  ["gold", "Gold (Premium)"],
                  ["rainbow", "Rainbow (Exclusive)"],
                  ["green", "Green (Creator)"],
                  ["red", "Red (Admin)"],
                  ["blue", "Blue (Partner/Pro)"],
                  ["purple", "Purple (Staff/Dev)"],
                  ["diamond", "Diamond (Top 50)"],
                  ["vip", "VIP (Ruby Patron)"],
                  ["bot", "Bot (AI Cartographer)"],
                  ["fire", "Fire (Streak Master)"],
                  ["og", "OG (Alpha Veteran)"],
                  ["moderator", "Moderator (Guardian)"],
                  ["champion", "Champion (Crown)"],
                  ["lightning", "Lightning (Speedrun)"],
                  ["none", "None (Standard)"],
                ] as [VerifiedBadgeType, string][]
              ).map(([bType, bLabel]) => (
                <button
                  key={bType}
                  type="button"
                  onClick={() => updateSocial({ verifiedBadge: bType })}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    social.verifiedBadge === bType
                      ? "border-foreground/60 bg-[#D2F801]/15 text-foreground ring-1 ring-foreground/40"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <VerifiedBadge type={bType} size={15} />
                  {bLabel}
                </button>
              ))}
            </div>
          </section>

          {/* 2. Level 1–1,000 Slider & EXP Tester */}
          <section className="plate p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="font-display text-xl flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#D2F801]" />
                  Level 1–1,000 & EXP Tester
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Adjust player profile level and experience points in real-time.
                </p>
              </div>
              <div className="rounded-full border border-border bg-[#D2F801]/10 px-3.5 py-1 text-xs font-semibold text-[#D2F801]">
                LVL {computeLevelFromExp(social.exp).level} ({social.exp.toLocaleString()} EXP)
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Adjust Level Slider:</span>
                <span className="font-mono font-semibold text-[#D2F801]">
                  Level {computeLevelFromExp(social.exp).level} / {LEVEL_MAX}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={LEVEL_MAX}
                value={computeLevelFromExp(social.exp).level}
                onChange={(e) => {
                  const targetLvl = Number(e.target.value);
                  updateSocial({ exp: (targetLvl - 1) * EXP_PER_LEVEL });
                }}
                className="mt-2 w-full accent-[#D2F801]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: "Level 1 (Novice)", lvl: 1 },
                { label: "Level 50 (Apprentice)", lvl: 50 },
                { label: "Level 100 (Expert)", lvl: 100 },
                { label: "Level 250 (Master)", lvl: 250 },
                { label: "Level 500 (Grandmaster)", lvl: 500 },
                { label: "Level 777 (Lucky 7)", lvl: 777 },
                { label: "Level 1,000 (Max Legend)", lvl: 1000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateSocial({ exp: (preset.lvl - 1) * EXP_PER_LEVEL })}
                  className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-semibold hover:border-foreground/60"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Rank & Champion Tester */}
          <section className="plate p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
              <div>
                <h2 className="font-display text-xl flex items-center gap-2">
                  <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={42} />
                  Rank & Champion Tester (RANKS.md)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Change RP or Champion leaderboard position to preview rank badges and titles live across the app.
                </p>
              </div>

              <div className="text-right">
                <span className="font-display text-lg font-semibold" style={{ color: current.tier.accent }}>
                  {current.name}
                </span>
                <p className="readout text-xs text-muted-foreground">
                  {rank.rp.toLocaleString()} RP {rank.championPosition ? `· Rank #${rank.championPosition}` : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">Rank Points (RP):</span>
                <input
                  type="number"
                  min={0}
                  max={15000}
                  step={50}
                  value={rank.rp}
                  onChange={(e) => onRpChange(Number(e.target.value), rank.championPosition ?? null)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm font-semibold"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">
                  Champion Leaderboard Position (1–50, Top 50 only):
                </span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  placeholder="None (>50)"
                  value={rank.championPosition ?? ""}
                  onChange={(e) => {
                    const v = e.target.value === "" ? null : Number(e.target.value);
                    onRpChange(rank.rp, v);
                  }}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm font-semibold"
                />
              </label>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Quick Tier Presets:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Bronze IV (0)", rp: 0, pos: null },
                  { label: "Silver IV (1,000)", rp: 1000, pos: null },
                  { label: "Gold I (3,499)", rp: 3499, pos: null },
                  { label: "Diamond III (5,000)", rp: 5000, pos: null },
                  { label: "Master (7,000, #120)", rp: 7000, pos: 120 },
                  { label: "Champion #1 (7,500)", rp: 7500, pos: 1 },
                  { label: "Champion #50 (7,300)", rp: 7300, pos: 50 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onRpChange(preset.rp, preset.pos)}
                    className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-semibold hover:border-foreground/60"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Toxic Bot Chat Sandbox Tester */}
          <section className="plate space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold sm:text-xl">
                  <Flame className="h-4 w-4 text-red-400" />
                  Toxic AI Bot Chat Tester
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Test savage gamer banter & swear-word detection in real time. Try typing insults or low-score banter.
                </p>
              </div>
            </div>
            <GameChat
              inline
              playerScore={500}
              opponent={{
                name: "ToxicGamer99",
                clanTag: "RAGE",
                clanTagColor: "#ef4444",
                rp: 8400,
                verified: "fire",
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
