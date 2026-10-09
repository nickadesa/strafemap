import { LOCATIONS, type Location } from "./locations";

export type LatLng = { lat: number; lng: number };
export type Mode = "classic" | "shrink" | "closest" | "blind";
export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type Pool = "world" | "capitals" | "countries" | "landmarks";

export const ROUNDS = 5;
export const MAX_POINTS = 5000;

export const MODES: Record<Mode, { name: string; tag: string; blurb: string }> = {
  classic: { name: "One Pin", tag: "Classic", blurb: "Five rounds. One pin each. Closer means more points." },
  shrink: { name: "Map Shrink", tag: "Timed", blurb: "The guessing zone closes in. Pin fast for a time bonus." },
  closest: { name: "Closest Wins", tag: "vs Bots", blurb: "Same target as three bots. Nearest pin takes the round." },
  blind: { name: "Blind Map", tag: "No labels", blurb: "No place names. Just coastlines, borders and memory." },
};

/* ---------- Distance & scoring ---------- */
const R = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

/** Haversine great-circle distance in km. */
export function distanceKm(a: LatLng, b: LatLng) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Point reached travelling `km` from `p` on `bearingDeg`. */
export function destination(p: LatLng, km: number, bearingDeg: number): LatLng {
  const d = km / R, b = rad(bearingDeg), l1 = rad(p.lat), g1 = rad(p.lng);
  const l2 = Math.asin(Math.sin(l1) * Math.cos(d) + Math.cos(l1) * Math.sin(d) * Math.cos(b));
  const g2 = g1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(l1), Math.cos(d) - Math.sin(l1) * Math.sin(l2));
  return { lat: (l2 * 180) / Math.PI, lng: ((((g2 * 180) / Math.PI + 540) % 360) - 180) };
}

/**
 * score = MAX * exp(-distance / scale), forced to 0 past `cutoffKm`.
 * A guess within `perfectKm` earns the full 5,000.
 */
export const SCORING = { scaleKm: 1500, cutoffKm: 10000, perfectKm: 25 };
export function scoreFor(km: number, cfg = SCORING) {
  if (km <= cfg.perfectKm) return MAX_POINTS;
  if (km >= cfg.cutoffKm) return 0;
  return Math.round(MAX_POINTS * Math.exp(-km / cfg.scaleKm));
}

export function formatDistance(km: number, unit: "km" | "mi" = "km") {
  const v = unit === "mi" ? km * 0.621371 : km;
  if (unit === "km" && v < 1) return `${Math.round(v * 1000)} m`;
  return `${v < 10 ? v.toFixed(1) : Math.round(v).toLocaleString()} ${unit}`;
}

/* ---------- Randomness ---------- */
export function seededRng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353), (h = (h << 13) | (h >>> 19));
  let a = h >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const todayKey = () => new Date().toISOString().slice(0, 10);

/* ---------- Round selection ---------- */
const diffRange: Record<Difficulty, [number, number]> = { easy: [1, 1], medium: [1, 2], hard: [2, 3], expert: [3, 4] };

export function poolFor(pool: Pool, difficulty: Difficulty): Location[] {
  const base = LOCATIONS.filter((l) =>
    pool === "world" ? true : pool === "capitals" ? l.category === "capital" : pool === "countries" ? l.category === "country" : l.category === "landmark" || l.category === "natural",
  );
  const [lo, hi] = diffRange[difficulty];
  const filtered = base.filter((l) => l.difficulty >= lo && l.difficulty <= hi);
  return filtered.length >= ROUNDS ? filtered : base;
}

export function pickRounds(list: Location[], n: number, rng: () => number = Math.random, avoid: string[] = []) {
  const src = list.filter((l) => !avoid.includes(l.id));
  const arr = [...(src.length >= n ? src : list)];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i]!; arr[i] = arr[j]!; arr[j] = t;
  }
  return arr.slice(0, n);
}

export function dailyRounds() {
  return pickRounds(poolFor("world", "medium"), ROUNDS, seededRng("strafe-" + todayKey()));
}

/* ---------- Map Shrink ---------- */
export const SHRINK = { seconds: 30, startKm: 3000, endKm: 350 };
export const shrinkRadius = (elapsed: number) =>
  SHRINK.startKm - (SHRINK.startKm - SHRINK.endKm) * Math.min(1, elapsed / SHRINK.seconds);
/** Zone centre is offset from the target but always keeps it inside the final zone. */
export const shrinkCenter = (target: LatLng) =>
  destination(target, Math.random() * SHRINK.endKm * 0.75, Math.random() * 360);
/** Time multiplier: 1.0 when instant, 0.5 at the buzzer. */
export const timeMultiplier = (elapsed: number) => 1 - 0.5 * Math.min(1, elapsed / SHRINK.seconds);

/* ---------- Closest Wins bots (simulated, clearly labelled) ---------- */
export const BOTS = [
  { name: "Bot · Atlas", meanKm: 350 },
  { name: "Bot · Compass", meanKm: 900 },
  { name: "Bot · Drift", meanKm: 2200 },
];
export function botGuess(target: LatLng, meanKm: number): LatLng {
  const km = -meanKm * Math.log(1 - Math.random() * 0.999);
  return destination(target, km, Math.random() * 360);
}

export const promptFor = (l: Location) =>
  l.category === "country" ? { verb: "Find the country", title: l.name } : { verb: "Pin the location", title: l.name };
