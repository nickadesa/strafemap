export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "champion";

export interface RankTierInfo {
  id: RankTier;
  name: string;
  minElo: number;
  color: string;
}

export const RANK_TIERS: RankTierInfo[] = [
  { id: "bronze", name: "Bronze", minElo: 0, color: "#cd7f32" },
  { id: "silver", name: "Silver", minElo: 1000, color: "#c0c0c0" },
  { id: "gold", name: "Gold", minElo: 1200, color: "#ffd700" },
  { id: "platinum", name: "Platinum", minElo: 1400, color: "#e5e4e2" },
  { id: "diamond", name: "Diamond", minElo: 1600, color: "#b9f2ff" },
  { id: "master", name: "Master", minElo: 1800, color: "#9b59b6" },
  { id: "champion", name: "Champion", minElo: 2000, color: "#b9ff24" },
];

export function getTier(elo: number): RankTierInfo {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (elo >= RANK_TIERS[i].minElo) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
}

export interface RankedProfile {
  elo: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestStreak: number;
}

const RANK_KEY = "strafe.rank";
const DEFAULT_RANK: RankedProfile = {
  elo: 1000,
  games: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winStreak: 0,
  bestStreak: 0,
};

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

export function calcEloChange(myElo: number, oppElo: number, result: 1 | 0 | 0.5, k = 32): number {
  const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
  return Math.round(k * (result - expected));
}
