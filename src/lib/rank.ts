export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "champion";

export interface RankTierInfo {
  id: RankTier;
  name: string;
  minElo: number;
  color: string;
  icon: string;
}

export const RANK_TIERS: RankTierInfo[] = [
  { id: "bronze", name: "Bronze", minElo: 0, color: "#cd7f32", icon: "/ranks/bronze.svg" },
  { id: "silver", name: "Silver", minElo: 1000, color: "#c0c0c0", icon: "/ranks/silver.svg" },
  { id: "gold", name: "Gold", minElo: 1500, color: "#ffd700", icon: "/ranks/gold.svg" },
  { id: "platinum", name: "Platinum", minElo: 2000, color: "#e5e4e2", icon: "/ranks/platinum.svg" },
  { id: "diamond", name: "Diamond", minElo: 2500, color: "#b9f2ff", icon: "/ranks/diamond.svg" },
  { id: "master", name: "Master", minElo: 3000, color: "#9b59b6", icon: "/ranks/master.svg" },
  { id: "champion", name: "Champion", minElo: 99999, color: "#b9ff24", icon: "/ranks/champion.svg" },
];

export function getTier(elo: number): RankTierInfo {
  // Champion is top 50 only — not ELO based
  const tiers = RANK_TIERS.filter((t) => t.id !== "champion");
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (elo >= tiers[i].minElo) return tiers[i];
  }
  return tiers[0]!;
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

export function applyMatchResult(result: "win" | "loss" | "draw", oppElo = 1000): { profile: RankedProfile; change: number } {
  const cur = loadRank();
  const r = result === "win" ? 1 : result === "loss" ? 0 : 0.5;
  const change = calcEloChange(cur.elo, oppElo, r as 1 | 0 | 0.5);
  const next: RankedProfile = {
    ...cur,
    elo: Math.max(0, cur.elo + change),
    games: cur.games + 1,
    wins: cur.wins + (result === "win" ? 1 : 0),
    losses: cur.losses + (result === "loss" ? 1 : 0),
    draws: cur.draws + (result === "draw" ? 1 : 0),
    winStreak: result === "win" ? cur.winStreak + 1 : 0,
    bestStreak: result === "win" ? Math.max(cur.bestStreak, cur.winStreak + 1) : cur.bestStreak,
  };
  saveRank(next);
  return { profile: next, change };
}
