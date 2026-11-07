import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getRank, loadRank, saveRank, type RankedProfile } from "@/lib/rank";
import { RankBanner, VerifiedBadge, type VerifiedBadgeType } from "@/components/RankVisuals";
import { useSocialProfile } from "@/lib/social";
import { ShieldCheck, Sliders, Sparkles } from "lucide-react";

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
  const [rank, setRank] = useState<RankedProfile>(loadRank());

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
                Dedicated sandbox tools for testing ranks, champion states, and verified badges.
              </p>
            </div>
          </div>

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
                  ["rainbow", "Rainbow (Exclusive You)"],
                  ["green", "Green (Creator)"],
                  ["red", "Red (Admin)"],
                  ["none", "None (Standard)"],
                ] as [VerifiedBadgeType, string][]
              ).map(([bType, bLabel]) => (
                <button
                  key={bType}
                  type="button"
                  onClick={() => updateSocial({ verifiedBadge: bType })}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
                    social.verifiedBadge === bType
                      ? "border-[#D2F801] bg-[#D2F801]/15 text-foreground ring-1 ring-[#D2F801]"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <VerifiedBadge type={bType} size={15} />
                  {bLabel}
                </button>
              ))}
            </div>
          </section>

          {/* 2. Rank & Champion Tester (RANKS.md) */}
          <section className="plate p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 gap-2">
              <div>
                <h2 className="font-display text-xl flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#D2F801]" />
                  Rank & Champion Tester (RANKS.md)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Simulate live RP and leaderboard placement positions for Champion Top 50 verification.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={48} />
                <span className="font-display text-sm font-bold" style={{ color: current.tier.accent }}>
                  {current.name}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs">
                <span className="font-bold text-muted-foreground">Rank Points (RP: 0 – 10,000)</span>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  value={rank.rp}
                  onChange={(e) => onRpChange(Number(e.target.value), rank.championPosition ?? null)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm font-bold"
                />
              </label>

              <label className="block text-xs">
                <span className="font-bold text-muted-foreground">
                  Leaderboard Position (1–50 for Champion)
                </span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  placeholder="None (>50)"
                  value={rank.championPosition ?? ""}
                  onChange={(e) => {
                    const v = e.target.value === "" ? null : Number(e.target.value);
                    onRpChange(rank.rp, v);
                  }}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm font-bold"
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
                    className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-semibold hover:border-[#D2F801]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
