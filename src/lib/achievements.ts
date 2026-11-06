import data from "@/data/achievements.json";
import type { GameRecord } from "@/lib/game/storage";
import { getRank, type RankedProfile } from "@/lib/rank";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
export interface AchTier {
  id: string; name: string; requirement: string; rarity: Rarity; secret: boolean; label: string;
  files: { full: { unlocked: string; locked: string }; compact: { unlocked: string; locked: string } };
}
export interface AchUnit { id: string; name: string; group: string; type: "series" | "single"; tiers: AchTier[] }

export const ACH_GROUPS = data.groups as { key: string; name: string; badges: number }[];
export const ACH_UNITS = data.units as AchUnit[];
export const ACH_ALL: (AchTier & { unit: AchUnit })[] = ACH_UNITS.flatMap((u) => u.tiers.map((t) => ({ ...t, unit: u })));
export const RARITY_COLORS = data.rarityColors as Record<Rarity, string>;
export const SECRET_BADGE = data.secretBadge as string;

const MODES = ["classic", "shrink", "closest", "blind"];
const dayKey = (iso: string) => iso.slice(0, 10);
function longestConsecutiveDays(days: string[]) {
  const ts = [...new Set(days)].map((d) => Date.parse(d)).sort((a, b) => a - b);
  let best = 0, run = 0;
  ts.forEach((t, i) => { run = i && t - ts[i - 1]! === 86400000 ? run + 1 : 1; best = Math.max(best, run); });
  return best;
}

/** Facts derived from local game history + ranked profile. */
export function achievementFacts(records: GameRecord[], rank: RankedProfile) {
  const rounds = records.flatMap((r) => r.rounds);
  const kms = rounds.map((r) => r.km).filter((k): k is number => k !== null);
  const dailies = records.filter((r) => r.daily);
  let streak500 = 0, best500 = 0;
  for (const r of rounds) { streak500 = r.km !== null && r.km < 500 ? streak500 + 1 : 0; best500 = Math.max(best500, streak500); }
  const modesPlayed = new Set(records.map((r) => r.mode));
  const byMode = (m: string) => records.filter((r) => r.mode === m).length;
  const total = records.reduce((a, r) => a + r.score, 0);
  const dates = records.map((r) => Date.parse(r.date));
  return {
    games: records.length, modes: modesPlayed.size, allModes: MODES.every((m) => modesPlayed.has(m as never)),
    days: new Set(records.map((r) => dayKey(r.date))).size,
    spanDays: dates.length ? (Math.max(...dates) - Math.min(...dates)) / 86400000 : 0,
    minKm: kms.length ? Math.min(...kms) : Infinity, maxKm: kms.length ? Math.max(...kms) : 0,
    perfectRound: rounds.some((r) => r.points >= 5000), perfectGame: records.some((r) => r.rounds.length > 0 && r.rounds.every((x) => x.points >= 5000)),
    bestScore: Math.max(0, ...records.map((r) => r.score)), total, best500,
    dailies: dailies.length, dailyDays: new Set(dailies.map((r) => dayKey(r.date))).size,
    dailyRun: longestConsecutiveDays(dailies.map((r) => dayKey(r.date))),
    perfectDaily: dailies.some((r) => r.score >= r.max),
    classic: byMode("classic"), blind: byMode("blind"), shrink: byMode("shrink"), closest: byMode("closest"),
    night: records.some((r) => { const h = new Date(r.date).getHours(); return h >= 0 && h < 5; }),
    rankedGames: rank.games, rankedWins: rank.wins, winStreak: rank.bestStreak,
    peakTier: getRank(rank.peakRp ?? rank.rp).tier.id,
  };
}
type Facts = ReturnType<typeof achievementFacts>;
const tierAt = (f: Facts, t: string) => ["bronze", "silver", "gold", "platinum", "diamond", "master", "champion"].indexOf(f.peakTier) >= ["bronze", "silver", "gold", "platinum", "diamond", "master", "champion"].indexOf(t);

/** Achievements STRAFE can measure today. Others stay locked until their feature exists. */
const RULES: Record<string, (f: Facts) => boolean> = {
  "A-01": (f) => f.games >= 1, "A-12": (f) => f.games >= 10, "A-03": (f) => f.games >= 50, "A-04": (f) => f.games >= 250,
  "A-05": (f) => f.games >= 500, "A-06": (f) => f.games >= 1000, "A-02": (f) => f.modes >= 3, "A-09": (f) => f.allModes,
  "A-07": (f) => f.days >= 7, "A-10": (f) => f.spanDays >= 365,
  "B-01": (f) => f.minKm <= 1000, "B-02": (f) => f.minKm <= 250, "B-03": (f) => f.minKm <= 100, "B-04": (f) => f.minKm <= 10,
  "B-09": (f) => f.perfectGame, "C-04": (f) => f.perfectRound, "C-09": (f) => f.perfectRound, "C-08": (f) => f.bestScore >= 20000,
  "D-09": (f) => f.best500 >= 5, "D-10": (f) => f.winStreak >= 5, "H-08": (f) => f.winStreak >= 5,
  "E-01": (f) => f.dailies >= 1, "E-02": (f) => f.dailyDays >= 7, "E-03": (f) => f.dailyDays >= 30, "E-05": (f) => f.dailies >= 100,
  "E-11": (f) => f.dailies >= 50, "E-12": (f) => f.dailies >= 200, "E-06": (f) => f.dailyRun >= 7, "E-08": (f) => f.dailyRun >= 30,
  "E-10": (f) => f.perfectDaily,
  "F-01": (f) => f.classic >= 1, "F-02": (f) => f.classic >= 25, "F-11": (f) => f.classic >= 100,
  "I-01": (f) => f.blind >= 1, "I-10": (f) => f.blind >= 100,
  "H-01": (f) => f.rankedWins >= 1, "H-11": (f) => f.rankedGames >= 1, "H-13": (f) => f.rankedGames >= 100,
  "N-01": (f) => tierAt(f, "gold"), "N-02": (f) => tierAt(f, "platinum"), "N-03": (f) => tierAt(f, "diamond"),
  "N-04": (f) => tierAt(f, "master"), "N-05": (f) => tierAt(f, "champion"),
  "X-03": (f) => f.maxKm >= 15000, "X-04": (f) => f.maxKm >= 10000, "X-17": (f) => f.night,
};
export const TRACKED_IDS = Object.keys(RULES);

const KEY = "strafe.achievements";
export function loadUnlocked(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

/** Evaluates rules, stores new unlocks with a timestamp, and returns ids unlocked by this call. */
export function syncAchievements(records: GameRecord[], rank: RankedProfile): string[] {
  const f = achievementFacts(records, rank);
  const have = loadUnlocked();
  const fresh = Object.entries(RULES).filter(([id, rule]) => !have[id] && rule(f)).map(([id]) => id);
  if (fresh.length && typeof window !== "undefined") {
    const now = new Date().toISOString();
    fresh.forEach((id) => { have[id] = now; });
    localStorage.setItem(KEY, JSON.stringify(have));
  }
  return fresh;
}
