import { useEffect, useState, useCallback } from "react";
import type { Mode } from "./engine";

export interface Settings { name: string; sound: boolean; unit: "km" | "mi" }
export interface GameRecord {
  id: string;
  player: string;
  mode: Mode;
  daily: boolean;
  date: string; // ISO
  score: number;
  max: number;
  rounds: { km: number | null; points: number }[];
}

const SKEY = "strafe.settings";
const RKEY = "strafe.records";
const defaults: Settings = { name: "Guest", sound: true, unit: "km" };

const read = <T,>(k: string, fb: T): T => {
  try { const v = localStorage.getItem(k); return v ? { ...fb, ...JSON.parse(v) } : fb; } catch { return fb; }
};

export function loadSettings(): Settings { return typeof window === "undefined" ? defaults : read(SKEY, defaults); }
export function loadRecords(): GameRecord[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RKEY) || "[]"); } catch { return []; }
}
export function saveRecord(r: GameRecord) {
  localStorage.setItem(RKEY, JSON.stringify([...loadRecords(), r]));
}
export function clearRecords() { localStorage.removeItem(RKEY); }

export function useSettings() {
  const [s, setS] = useState<Settings>(defaults);
  useEffect(() => setS(loadSettings()), []);
  const update = useCallback((patch: Partial<Settings>) => {
    setS((prev) => { const n = { ...prev, ...patch }; localStorage.setItem(SKEY, JSON.stringify(n)); return n; });
  }, []);
  return [s, update] as const;
}

export function useRecords() {
  const [r, setR] = useState<GameRecord[] | null>(null);
  useEffect(() => setR(loadRecords()), []);
  return [r, () => setR(loadRecords())] as const;
}

/* ---------- Derived stats ---------- */
export const ACCURATE_KM = 500;

export function computeStats(records: GameRecord[]) {
  const rounds = records.flatMap((r) => r.rounds);
  const errs = rounds.map((x) => x.km).filter((x): x is number => x !== null);
  let streak = 0, best = 0;
  for (const x of rounds) { if (x.km !== null && x.km < ACCURATE_KM) { streak++; best = Math.max(best, streak); } else streak = 0; }
  const bestBy = (m: Mode) => Math.max(0, ...records.filter((r) => r.mode === m).map((r) => r.score));
  return {
    games: records.length,
    rounds: rounds.length,
    bestScore: Math.max(0, ...records.map((r) => r.score)),
    bestBy,
    avgError: errs.length ? errs.reduce((a, b) => a + b, 0) / errs.length : null,
    closest: errs.length ? Math.min(...errs) : null,
    accuracy: records.length ? records.reduce((a, r) => a + r.score / r.max, 0) / records.length : 0,
    currentStreak: streak,
    bestStreak: best,
    dailies: records.filter((r) => r.daily).length,
  };
}

export function achievements(records: GameRecord[]) {
  const s = computeStats(records);
  const rounds = records.flatMap((r) => r.rounds);
  return [
    { id: "first", name: "First Drop", desc: "Finish your first game", done: s.games >= 1 },
    { id: "sharp", name: "Sharpshooter", desc: "Land a pin within 50 km", done: rounds.some((x) => x.km !== null && x.km < 50) },
    { id: "perfect", name: "Bullseye", desc: "Score a perfect 5,000 round", done: rounds.some((x) => x.points === 5000) },
    { id: "streak", name: "On a Run", desc: "5 accurate guesses in a row (<500 km)", done: s.bestStreak >= 5 },
    { id: "daily", name: "Daily Regular", desc: "Complete a daily challenge", done: s.dailies >= 1 },
    { id: "20k", name: "Twenty Grand", desc: "Score 20,000 in one game", done: s.bestScore >= 20000 },
    { id: "veteran", name: "Cartographer", desc: "Play 25 games", done: s.games >= 25 },
  ];
}
