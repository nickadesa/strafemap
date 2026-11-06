/** STRAFE ranked ladder: 7 tiers, Divisions IV→I, Rank Points (RP). */
export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "champion";
export type Division = 4 | 3 | 2 | 1 | null;

export interface RankTierInfo {
  id: RankTier;
  name: string;
  color: string;
  /** RP needed for the first step of this tier. */
  minRp: number;
  /** RP per division; null for single-step tiers (Master). */
  step: number | null;
}

export const DIVISION_RP = 100;
export const RANK_TIERS: RankTierInfo[] = [
  { id: "bronze", name: "Bronze", color: "#cd7f32", minRp: 0, step: DIVISION_RP },
  { id: "silver", name: "Silver", color: "#b8c0cc", minRp: 400, step: DIVISION_RP },
  { id: "gold", name: "Gold", color: "#f2b72e", minRp: 800, step: DIVISION_RP },
  { id: "platinum", name: "Platinum", color: "#4fd1c5", minRp: 1200, step: DIVISION_RP },
  { id: "diamond", name: "Diamond", color: "#8fb8ff", minRp: 1600, step: DIVISION_RP },
  { id: "master", name: "Master", color: "#f0306a", minRp: 2000, step: null },
  { id: "champion", name: "Champion", color: "#f2a93b", minRp: 2500, step: 150 },
];

export interface RankStep {
  tier: RankTierInfo;
  division: Division;
  /** e.g. "Gold II" */
  name: string;
  icon: string;
  min: number;
  /** RP where the next step begins; null at the very top. */
  next: number | null;
}

const ROMAN = { 4: "IV", 3: "III", 2: "II", 1: "I" } as const;

/** Every step of the ladder from Bronze IV up to Champion I. */
export const RANK_STEPS: RankStep[] = RANK_TIERS.flatMap((tier): RankStep[] => {
  if (tier.step === null) return [{ tier, division: null, name: tier.name, icon: `/ranks/r6/${tier.id}.svg`, min: tier.minRp, next: 0 }];
  return ([4, 3, 2, 1] as const).map((d, i) => ({
    tier, division: d, name: `${tier.name} ${ROMAN[d]}`,
    icon: `/ranks/r6/${tier.id}-${d}.svg`, min: tier.minRp + i * tier.step!, next: 0,
  }));
}).map((s, i, all): RankStep => ({ ...s, next: all[i + 1]?.min ?? null }));

export function getRank(rp: number): RankStep {
  for (let i = RANK_STEPS.length - 1; i >= 0; i--) if (rp >= RANK_STEPS[i]!.min) return RANK_STEPS[i]!;
  return RANK_STEPS[0]!;
}

export interface RankedProfile {
  rp: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestStreak: number;
  peakRp: number;
}

const RANK_KEY = "strafe.rp";
const DEFAULT_RANK: RankedProfile = { rp: 0, games: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestStreak: 0, peakRp: 0 };

export function loadRank(): RankedProfile {
  if (typeof window === "undefined") return DEFAULT_RANK;
  try {
    const v = localStorage.getItem(RANK_KEY);
    return v ? { ...DEFAULT_RANK, ...JSON.parse(v) } : DEFAULT_RANK;
  } catch {
    return DEFAULT_RANK;
  }
}

export function saveRank(r: RankedProfile) {
  localStorage.setItem(RANK_KEY, JSON.stringify(r));
}

/**
 * RP change for one ranked game. Base: win +25, draw +5, loss −20.
 * Average round score adds/removes up to ±10. Win streaks add +2 per game (max +10).
 */
export function rpChange(result: "win" | "loss" | "draw", avgScore: number, winStreak = 0): number {
  const base = result === "win" ? 25 : result === "draw" ? 5 : -20;
  const perf = Math.max(-10, Math.min(10, Math.round((avgScore - 2500) / 250)));
  const streak = result === "win" ? Math.min(10, winStreak * 2) : 0;
  return base + perf + streak;
}

export function applyMatchResult(result: "win" | "loss" | "draw", avgScore: number): { profile: RankedProfile; change: number; before: RankStep; after: RankStep } {
  const cur = loadRank();
  const change = rpChange(result, avgScore, cur.winStreak);
  const rp = Math.max(0, cur.rp + change);
  const next: RankedProfile = {
    ...cur,
    rp,
    peakRp: Math.max(cur.peakRp, rp),
    games: cur.games + 1,
    wins: cur.wins + (result === "win" ? 1 : 0),
    losses: cur.losses + (result === "loss" ? 1 : 0),
    draws: cur.draws + (result === "draw" ? 1 : 0),
    winStreak: result === "win" ? cur.winStreak + 1 : 0,
    bestStreak: result === "win" ? Math.max(cur.bestStreak, cur.winStreak + 1) : cur.bestStreak,
  };
  saveRank(next);
  return { profile: next, change: rp - cur.rp, before: getRank(cur.rp), after: getRank(rp) };
}
