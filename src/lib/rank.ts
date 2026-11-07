import ranksData from "@/data/ranks.json";

export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "champion";
export type DivisionRoman = "IV" | "III" | "II" | "I" | null;
export type Division = 4 | 3 | 2 | 1 | null;

export interface RankTierInfo {
  id: RankTier;
  name: string;
  color: string;
  accent: string;
  minRp: number;
  maxRp: number | null;
  frame: string;
  step: number | null;
}

export interface RankDivisionConfig {
  name: "IV" | "III" | "II" | "I";
  rpMin: number;
  rpMax: number;
  banner: string;
}

export interface RankStep {
  tier: RankTierInfo;
  rank: RankTier;
  rankName: string;
  division: Division;
  divisionRoman: DivisionRoman;
  /** e.g. "Gold II", "Master", "Champion #1" */
  name: string;
  icon: string;
  bannerUrl: string;
  frameUrl: string;
  min: number;
  max: number | null;
  /** RP where the next step begins; null at Master/Champion. */
  next: number | null;
  nextDivisionRp: number | null;
  progressRatio: number;
  championPosition?: number | null;
}

export const FRAME_AVATAR = ranksData.frameAvatar;
export const RP_RULES = ranksData.rpRules;

const ROMAN_TO_NUM: Record<string, Division> = { IV: 4, III: 3, II: 2, I: 1 };

const masterEntry = ranksData.ranks.find((r) => r.key === "master")!;
const championEntry = ranksData.ranks.find((r) => r.key === "champion")!;

export const RANK_TIERS: RankTierInfo[] = ranksData.ranks.map((r) => {
  const isChamp = r.key === "champion";
  const minRp = isChamp ? (masterEntry.rpMin ?? 7000) : (r.rpMin ?? 0);
  const maxRp = isChamp ? null : (r.rpMax ?? null);
  const divs = (r.divisions ?? []) as RankDivisionConfig[];
  const step = divs.length > 0 ? Math.round(((r.rpMax ?? minRp) - minRp + 1) / divs.length) : null;
  return {
    id: r.key as RankTier,
    name: r.name,
    color: r.accent,
    accent: r.accent,
    minRp,
    maxRp,
    frame: r.frame ?? championEntry.frameBlank ?? "/ranks/frames/champion-blank.svg",
    step,
  };
});

/** Every RP-based step of the ladder from Bronze IV up to Master, plus Champion representation. */
export const RANK_STEPS: RankStep[] = (() => {
  const steps: RankStep[] = [];
  for (const r of ranksData.ranks) {
    const tier = RANK_TIERS.find((t) => t.id === r.key)!;
    if (r.key === "champion") continue;
    const divs = (r.divisions ?? []) as RankDivisionConfig[];
    if (divs.length === 0) {
      steps.push({
        tier,
        rank: tier.id,
        rankName: tier.name,
        division: null,
        divisionRoman: null,
        name: tier.name,
        icon: r.banner ?? "/ranks/banners/master.svg",
        bannerUrl: r.banner ?? "/ranks/banners/master.svg",
        frameUrl: r.frame ?? "/ranks/frames/master.svg",
        min: r.rpMin ?? 7000,
        max: null,
        next: null,
        nextDivisionRp: null,
        progressRatio: 1,
      });
    } else {
      for (const d of divs) {
        steps.push({
          tier,
          rank: tier.id,
          rankName: tier.name,
          division: ROMAN_TO_NUM[d.name] ?? null,
          divisionRoman: d.name,
          name: `${tier.name} ${d.name}`,
          icon: d.banner,
          bannerUrl: d.banner,
          frameUrl: r.frame ?? `/ranks/frames/${r.key}.svg`,
          min: d.rpMin,
          max: d.rpMax,
          next: d.rpMax + 1,
          nextDivisionRp: d.rpMax + 1,
          progressRatio: 0,
        });
      }
    }
  }
  return steps;
})();

export function formatChampionPattern(pattern: string, position: number): string {
  const nn = String(Math.floor(position)).padStart(2, "0");
  return pattern.replace("{NN}", nn);
}

/**
 * Pure helper `getRank(rp, championPosition)` per RANKS.md.
 * Uses `src/data/ranks.json` thresholds and patterns.
 */
export function getRank(
  rp: number,
  championPosition?: number | null,
  options?: { loadingPosition?: boolean },
): RankStep {
  const safeRp = Math.max(0, Math.floor(Number.isFinite(rp) ? rp : 0));
  const masterMin = masterEntry.rpMin ?? 7000;
  const maxPos = championEntry.maxPosition ?? 50;

  if (safeRp >= masterMin) {
    if (options?.loadingPosition) {
      const champTier = RANK_TIERS.find((t) => t.id === "champion")!;
      const blankBanner = championEntry.bannerBlank ?? "/ranks/banners/champion-blank.svg";
      const blankFrame = championEntry.frameBlank ?? "/ranks/frames/champion-blank.svg";
      return {
        tier: champTier,
        rank: "champion",
        rankName: champTier.name,
        division: null,
        divisionRoman: null,
        name: "Champion",
        icon: blankBanner,
        bannerUrl: blankBanner,
        frameUrl: blankFrame,
        min: masterMin,
        max: null,
        next: null,
        nextDivisionRp: null,
        progressRatio: 1,
        championPosition: null,
      };
    }

    const validChamp =
      typeof championPosition === "number" &&
      Number.isInteger(championPosition) &&
      championPosition >= 1 &&
      championPosition <= maxPos;

    if (validChamp) {
      const champTier = RANK_TIERS.find((t) => t.id === "champion")!;
      const bannerUrl = formatChampionPattern(
        championEntry.bannerPattern ?? "/ranks/banners/champion-{NN}.svg",
        championPosition,
      );
      const frameUrl = formatChampionPattern(
        championEntry.framePattern ?? "/ranks/frames/champion-{NN}.svg",
        championPosition,
      );
      return {
        tier: champTier,
        rank: "champion",
        rankName: champTier.name,
        division: null,
        divisionRoman: null,
        name: `Champion ${championPosition}`,
        icon: bannerUrl,
        bannerUrl,
        frameUrl,
        min: masterMin,
        max: null,
        next: null,
        nextDivisionRp: null,
        progressRatio: 1,
        championPosition,
      };
    }

    const masterStep = RANK_STEPS[RANK_STEPS.length - 1]!;
    return {
      ...masterStep,
      progressRatio: 1,
      championPosition: null,
    };
  }

  let matched = RANK_STEPS[0]!;
  for (let i = RANK_STEPS.length - 1; i >= 0; i--) {
    const s = RANK_STEPS[i]!;
    if (safeRp >= s.min) {
      matched = s;
      break;
    }
  }

  const span = matched.next !== null ? matched.next - matched.min : 1;
  const progressRatio = matched.next !== null ? Math.min(1, Math.max(0, (safeRp - matched.min) / span)) : 1;

  return {
    ...matched,
    progressRatio,
    championPosition: null,
  };
}

export function getAdjacentRanks(rp: number, championPosition?: number | null): {
  prev: RankStep | null;
  current: RankStep;
  next: RankStep | null;
} {
  const current = getRank(rp, championPosition);
  if (current.rank === "champion") {
    const masterStep = RANK_STEPS[RANK_STEPS.length - 1]!;
    const nextChamp =
      current.championPosition && current.championPosition > 1
        ? getRank(rp, current.championPosition - 1)
        : null;
    return { prev: masterStep, current, next: nextChamp };
  }
  const idx = RANK_STEPS.findIndex((s) => s.name === current.name);
  const prev = idx > 0 ? RANK_STEPS[idx - 1]! : null;
  if (current.rank === "master") {
    const champPreview = getRank(Math.max(rp, 7000), 50);
    return { prev, current, next: champPreview };
  }
  const next = idx >= 0 && idx + 1 < RANK_STEPS.length ? RANK_STEPS[idx + 1]! : null;
  return { prev, current, next };
}

export interface RankedMatchHistoryItem {
  id: string;
  date: string;
  opponentName: string;
  opponentTag?: string;
  opponentRp: number;
  myRoundsWon: number;
  oppRoundsWon: number;
  rpChange: number;
  rpAfter: number;
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
  championPosition?: number | null;
  history?: RankedMatchHistoryItem[];
}

const RANK_KEY = "strafe.rp";
const DEFAULT_RANK: RankedProfile = {
  rp: 1120,
  games: 8,
  wins: 5,
  losses: 3,
  draws: 0,
  winStreak: 2,
  bestStreak: 3,
  peakRp: 1180,
  championPosition: null,
  history: [],
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
  if (typeof window === "undefined") return;
  localStorage.setItem(RANK_KEY, JSON.stringify(r));
  window.dispatchEvent(new Event("strafe:rank"));
}

/**
 * RP calculation following `rpRules` in `src/data/ranks.json`:
 * - win: +25, loss: -20, draw: 0
 * - marginBonusPerRound: (roundDiff - 1) * 1.5 rounded (added on win, subtracted on loss)
 * - opponentGap: clamp((opponentRp - myRp) / 100, -8, +8)
 * - placementMatches (first 5 matches): x1.5 on positive RP gains
 */
export function calculateMatchRpDelta(params: {
  result: "win" | "loss" | "draw";
  myRp: number;
  opponentRp?: number;
  roundDiff?: number;
  gamesPlayed?: number;
}): number {
  const { result, myRp, opponentRp = myRp, roundDiff = 2, gamesPlayed = 5 } = params;
  const rules = ranksData.rpRules;
  if (result === "draw") return rules.draw;

  const base = result === "win" ? rules.win : rules.loss;
  const margin = Math.max(0, Math.round((Math.max(1, roundDiff) - 1) * rules.marginBonusPerRound));
  const rawGap = (opponentRp - myRp) / rules.opponentGapDivisor;
  const gapAdj = Math.round(Math.max(-rules.opponentGapClamp, Math.min(rules.opponentGapClamp, rawGap)));

  let delta = result === "win" ? base + margin + gapAdj : base - margin + gapAdj;
  if (delta > 0 && gamesPlayed < rules.placementMatches) {
    delta = Math.round(delta * rules.placementMultiplier);
  }
  return delta;
}

export function rpChange(result: "win" | "loss" | "draw", avgScore: number, winStreak = 0): number {
  const estRoundDiff = Math.max(1, Math.min(5, Math.round(Math.abs(avgScore - 2500) / 450) + 1));
  const cur = loadRank();
  const delta = calculateMatchRpDelta({
    result,
    myRp: cur.rp,
    opponentRp: cur.rp + (winStreak > 1 ? 150 : 0),
    roundDiff: estRoundDiff,
    gamesPlayed: cur.games,
  });
  return delta;
}

export function applyMatchResult(
  result: "win" | "loss" | "draw",
  avgScore: number,
  extra?: { opponentName?: string; opponentTag?: string; opponentRp?: number; myRoundsWon?: number; oppRoundsWon?: number },
): { profile: RankedProfile; change: number; before: RankStep; after: RankStep } {
  const cur = loadRank();
  const roundDiff =
    extra?.myRoundsWon !== undefined && extra?.oppRoundsWon !== undefined
      ? Math.abs(extra.myRoundsWon - extra.oppRoundsWon)
      : Math.max(1, Math.min(5, Math.round(Math.abs(avgScore - 2500) / 450) + 1));
  const change = calculateMatchRpDelta({
    result,
    myRp: cur.rp,
    opponentRp: extra?.opponentRp ?? cur.rp,
    roundDiff,
    gamesPlayed: cur.games,
  });
  const rp = Math.max(ranksData.rpRules.minRp, cur.rp + change);
  const matchItem: RankedMatchHistoryItem = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date: new Date().toISOString(),
    opponentName: extra?.opponentName ?? "Rival Cartographer",
    opponentTag: extra?.opponentTag ?? "MAP",
    opponentRp: extra?.opponentRp ?? cur.rp,
    myRoundsWon: extra?.myRoundsWon ?? (result === "win" ? 4 : result === "draw" ? 3 : 2),
    oppRoundsWon: extra?.oppRoundsWon ?? (result === "win" ? 1 : result === "draw" ? 3 : 3),
    rpChange: rp - cur.rp,
    rpAfter: rp,
  };
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
    history: [matchItem, ...(cur.history ?? [])].slice(0, 20),
  };
  saveRank(next);
  return {
    profile: next,
    change: rp - cur.rp,
    before: getRank(cur.rp, cur.championPosition),
    after: getRank(rp, next.championPosition),
  };
}

export interface SeasonRewardTier {
  tier: RankTier;
  name: string;
  accent: string;
  minRp: number;
  frameUrl: string;
  bannerUrl: string;
  titleReward: string;
  packsReward: string;
  auraReward: string;
}

export const SEASON_REWARDS: SeasonRewardTier[] = [
  {
    tier: "bronze",
    name: "Bronze",
    accent: "#CD7F32",
    minRp: 0,
    frameUrl: "/ranks/frames/bronze.svg",
    bannerUrl: "/ranks/banners/bronze-i.svg",
    titleReward: "Field Scout",
    packsReward: "1× Standard Pack",
    auraReward: "Bronze Spark",
  },
  {
    tier: "silver",
    name: "Silver",
    accent: "#C5CCD8",
    minRp: 1000,
    frameUrl: "/ranks/frames/silver.svg",
    bannerUrl: "/ranks/banners/silver-i.svg",
    titleReward: "Meridian Pathfinder",
    packsReward: "2× Identity Packs",
    auraReward: "Silver Frost",
  },
  {
    tier: "gold",
    name: "Gold",
    accent: "#FFC82A",
    minRp: 2000,
    frameUrl: "/ranks/frames/gold.svg",
    bannerUrl: "/ranks/banners/gold-i.svg",
    titleReward: "Golden Sovereign",
    packsReward: "3× Cartographer Packs",
    auraReward: "Solar Flare Chat",
  },
  {
    tier: "platinum",
    name: "Platinum",
    accent: "#62D6E6",
    minRp: 3500,
    frameUrl: "/ranks/frames/platinum.svg",
    bannerUrl: "/ranks/banners/platinum-i.svg",
    titleReward: "Atlas Vanguard",
    packsReward: "4× Aura & Trail Packs",
    auraReward: "Cyan Tidal Chat",
  },
  {
    tier: "diamond",
    name: "Diamond",
    accent: "#3F9DE8",
    minRp: 5000,
    frameUrl: "/ranks/frames/diamond.svg",
    bannerUrl: "/ranks/banners/diamond-i.svg",
    titleReward: "Celestial Navigator",
    packsReward: "5× Epic Packs + Pin Trail",
    auraReward: "Electric Storm Aura",
  },
  {
    tier: "master",
    name: "Master",
    accent: "#E8307A",
    minRp: 7000,
    frameUrl: "/ranks/frames/master.svg",
    bannerUrl: "/ranks/banners/master.svg",
    titleReward: "Grand Cartographer",
    packsReward: "8× Mythic Gacha Packs",
    auraReward: "Crimson Nova Chat",
  },
  {
    tier: "champion",
    name: "Champion (Top 50)",
    accent: "#DC1F30",
    minRp: 7000,
    frameUrl: "/ranks/frames/champion-01.svg",
    bannerUrl: "/ranks/banners/champion-01.svg",
    titleReward: "Season Elite #1–50",
    packsReward: "15× Mythic Packs + Trophy",
    auraReward: "Rainbow Sovereign Aura",
  },
];
