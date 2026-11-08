import { LOCATIONS, type Location } from "./locations";

export type LatLng = { lat: number; lng: number };
export type Mode = "classic" | "shrink" | "closest" | "blind" | "findCity" | "sins" | "quiz";
export type Difficulty = "easy" | "medium" | "hard" | "expert" | "hardcore";
export type Pool = "world" | "capitals" | "countries" | "landmarks" | "stadiums" | "wonders" | "attractions";
export type SinCardId = "pride" | "greed" | "wrath" | "envy" | "lust" | "gluttony" | "sloth";

export const ROUNDS = 5;
export const MAX_POINTS = 5000;

export const MODES: Record<Mode, { name: string; tag: string; blurb: string }> = {
  classic: { name: "One Pin", tag: "Classic", blurb: "Five rounds. One pin each. Closer means more points." },
  shrink: { name: "Map Shrink", tag: "Timed", blurb: "The guessing zone closes in. Pin fast for a time bonus." },
  closest: { name: "Closest Wins", tag: "vs Bots", blurb: "Same target as three bots. Nearest pin takes the round." },
  blind: { name: "Blind Map", tag: "No labels", blurb: "No place names. Just coastlines, borders and memory." },
  findCity: { name: "Find the City", tag: "Country Locked", blurb: "Locked inside the target country with city names hidden." },
  sins: { name: "7 Deadly Sins", tag: "Skill Cards", blurb: "Pick 1 of 7 Deadly Sin skill cards with self-only boons and trade-offs." },
  quiz: { name: "Country Quiz", tag: "4 Choices", blurb: "Fast-paced 4-option multiple choice quiz by continent and difficulty." },
};

export interface SinCardInfo {
  id: SinCardId;
  sinName: string;
  skillName: string;
  accent: string;
  boon: string;
  tradeoff: string;
}

export const SIN_CARDS: SinCardInfo[] = [
  {
    id: "pride",
    sinName: "1. Pride",
    skillName: "Precision Bullseye",
    accent: "#FFC82A",
    boon: "Expands 5,000-pt radius from 25 km to 65 km, plus +12% bonus within 150 km.",
    tradeoff: "Guesses further than 600 km lose -15% points.",
  },
  {
    id: "greed",
    sinName: "2. Greed",
    skillName: "Dual Pin Gambit",
    accent: "#D2F801",
    boon: "Place a 2nd backup pin up to 2 times per game; closer pin scores automatically.",
    tradeoff: "Rounds using the 2nd pin have their max score cap reduced by -6% (max 4,700 pts).",
  },
  {
    id: "wrath",
    sinName: "3. Wrath",
    skillName: "Snap Lock",
    accent: "#DC1F30",
    boon: "Confirming within the first 40% of round timer grants a +12% speed bonus.",
    tradeoff: "Tapping the map locks your pin immediately — no moving or re-placing in that round.",
  },
  {
    id: "envy",
    sinName: "4. Envy",
    skillName: "Redemption Rebound",
    accent: "#10B981",
    boon: "If your previous round scored under 3,000 pts, gain +15% rebound points this round.",
    tradeoff: "If your previous round scored over 4,200 pts, this round scores -6%.",
  },
  {
    id: "lust",
    sinName: "5. Lust",
    skillName: "Compass Whisper",
    accent: "#E8307A",
    boon: "Reveals 1 extra sub-region & hemisphere clue inside SmartClue from round start.",
    tradeoff: "Distance falloff scale (scaleKm) is 12% stricter.",
  },
  {
    id: "gluttony",
    sinName: "6. Gluttony",
    skillName: "Streak Feast",
    accent: "#FF7A00",
    boon: "Consecutive rounds > 3,500 pts stack +4% → +8% → max +12% bonus.",
    tradeoff: "Scoring under 2,200 pts resets your feast stack to 0 and deducts -200 pts.",
  },
  {
    id: "sloth",
    sinName: "7. Sloth",
    skillName: "Safety Cushion",
    accent: "#06B6D4",
    boon: "Reduces long-distance penalty by 15% and auto-submits unconfirmed pins on timeout.",
    tradeoff: "Map zoom is locked to high-altitude regional view (maxZoom 5).",
  },
];

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
  const d = km / R,
    b = rad(bearingDeg),
    l1 = rad(p.lat),
    g1 = rad(p.lng);
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

export function evaluateSinScore(params: {
  sin: SinCardId;
  km: number | null;
  usedSecondPin: boolean;
  elapsed: number;
  limit: number;
  prevRoundPoints: number | null;
  gluttonyStreak: number;
}): { points: number; nextGluttonyStreak: number; note: string } {
  const { sin, km, usedSecondPin, elapsed, limit, prevRoundPoints, gluttonyStreak } = params;
  if (km === null) {
    return { points: 0, nextGluttonyStreak: 0, note: "No pin placed" };
  }

  let scaleKm = SCORING.scaleKm;
  let perfectKm = SCORING.perfectKm;
  if (sin === "pride") perfectKm = 65;
  if (sin === "lust") scaleKm = SCORING.scaleKm * 0.88; // 12% stricter
  if (sin === "sloth") scaleKm = SCORING.scaleKm * 1.15; // 15% more forgiving

  let pts = scoreFor(km, { ...SCORING, scaleKm, perfectKm });
  let nextStreak = gluttonyStreak;
  let note = "";

  if (sin === "pride") {
    if (km <= 150) {
      pts = Math.min(5600, Math.round(pts * 1.12));
      note = "Pride Boon: +12% Bullseye";
    } else if (km > 600) {
      pts = Math.round(pts * 0.85);
      note = "Pride Trade-off: -15% (>600 km)";
    }
  } else if (sin === "greed") {
    if (usedSecondPin) {
      pts = Math.min(4700, Math.round(pts * 0.94));
      note = "Greed Dual Pin: 4,700 max cap (-6%)";
    }
  } else if (sin === "wrath") {
    if (limit > 0 && elapsed <= limit * 0.4) {
      pts = Math.min(5600, Math.round(pts * 1.12));
      note = "Wrath Snap Lock: +12% Speed Bonus";
    } else {
      note = "Wrath: Locked on tap";
    }
  } else if (sin === "envy") {
    if (prevRoundPoints !== null && prevRoundPoints < 3000) {
      pts = Math.min(5750, Math.round(pts * 1.15));
      note = "Envy Rebound: +15% Buff";
    } else if (prevRoundPoints !== null && prevRoundPoints > 4200) {
      pts = Math.round(pts * 0.94);
      note = "Envy Trade-off: -6%";
    }
  } else if (sin === "lust") {
    note = "Lust Whisper: Compass hint active (-12% scale)";
  } else if (sin === "gluttony") {
    const bonusPct = Math.min(0.12, gluttonyStreak * 0.04);
    if (bonusPct > 0) {
      pts = Math.round(pts * (1 + bonusPct));
      note = `Gluttony Feast: +${Math.round(bonusPct * 100)}%`;
    }
    if (pts > 3500) {
      nextStreak = Math.min(3, gluttonyStreak + 1);
    } else if (pts < 2200) {
      nextStreak = 0;
      pts = Math.max(0, pts - 200);
      note = "Gluttony Reset: -200 pts";
    }
  } else if (sin === "sloth") {
    note = "Sloth Cushion: +15% forgiving scale";
  }

  return { points: Math.max(0, pts), nextGluttonyStreak: nextStreak, note };
}

import { getSubregionForCountry, getZoneForCountry } from "./locations-wikidata";
import { COUNTRY_QUIZ_ITEMS } from "./countries-quiz";

export function compassWhisperFor(loc: Location): string {
  const sub = getSubregionForCountry(loc.country);
  const ns = loc.lat >= 23.5 ? "Northern Tropics+" : loc.lat >= 0 ? "Equatorial North" : loc.lat >= -23.5 ? "Equatorial South" : "Southern Hemisphere";
  const ew = loc.lng >= 60 ? "Far East" : loc.lng >= 0 ? "Eastern Meridian" : loc.lng >= -60 ? "Atlantic / West" : "Far West";
  return `${sub} · ${ns}, ${ew} (${Math.abs(Math.round(loc.lat))}°${loc.lat >= 0 ? "N" : "S"})`;
}

export function formatDistance(km: number, unit: "km" | "mi" = "km") {
  const v = unit === "mi" ? km * 0.621371 : km;
  if (unit === "km" && v < 1) return `${Math.round(v * 1000)} m`;
  return `${v < 10 ? v.toFixed(1) : Math.round(v).toLocaleString()} ${unit}`;
}

/* ---------- Randomness ---------- */
export function seededRng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) (h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19));
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const todayKey = () => new Date().toISOString().slice(0, 10);

/* ---------- Round selection ---------- */
const diffRange: Record<Difficulty, [number, number]> = {
  easy: [1, 1],
  medium: [1, 2],
  hard: [2, 3],
  expert: [3, 4],
  hardcore: [3, 4],
};

export function continentForLocation(loc: Location): "Asia" | "Europe" | "Americas" | "Africa" | "Oceania" {
  const z = getZoneForCountry(loc.country);
  if (z === "europe") return "Europe";
  if (z === "americas") return "Americas";
  if (z === "africa") return "Africa";
  if (z === "oceania") return "Oceania";
  return "Asia";
}

export function poolFor(pool: Pool, difficulty: Difficulty, mode?: Mode): Location[] {
  const isStadium = (l: Location) =>
    /stadium|arena|park|camp nou|bernabéu|wembley|san siro|maracanã|anfield|old trafford|allianz|bombonera|monumental|signal iduna|azteca/i.test(
      `${l.name} ${l.hint ?? ""}`,
    );
  const isWonder = (l: Location) =>
    /wonder|unesco|pyramid|machu picchu|petra|colosseum|taj mahal|chichén|christ the redeemer|great wall|angkor|stonehenge|acropolis|alhambra/i.test(
      `${l.name} ${l.hint ?? ""}`,
    );
  let base = LOCATIONS.filter((l) => {
    if (pool === "world") return true;
    if (pool === "capitals") return l.category === "capital";
    if (pool === "countries") return l.category === "country";
    if (pool === "stadiums") return isStadium(l) || l.category === "landmark";
    if (pool === "wonders") return isWonder(l) || l.category === "landmark";
    if (pool === "attractions") return l.category === "landmark" || l.category === "natural";
    return l.category === "landmark" || l.category === "natural";
  });
  if (pool === "stadiums") {
    const strictStadiums = LOCATIONS.filter(isStadium);
    if (strictStadiums.length >= ROUNDS) base = strictStadiums;
  } else if (pool === "wonders") {
    const strictWonders = LOCATIONS.filter(isWonder);
    if (strictWonders.length >= ROUNDS) base = strictWonders;
  }
  if (mode === "findCity") {
    const cities = LOCATIONS.filter((l) => l.category === "city" || l.category === "capital");
    if (cities.length >= ROUNDS) base = cities;
  } else if (mode === "quiz") {
    const countries = LOCATIONS.filter((l) => l.category === "country" || l.category === "capital");
    if (countries.length >= ROUNDS) base = countries;
  }
  const [lo, hi] = diffRange[difficulty] ?? [1, 2];
  const filtered = base.filter((l) => l.difficulty >= lo && l.difficulty <= hi);
  return filtered.length >= ROUNDS ? filtered : base;
}

export function generateQuizChoices(target: Location, zone = "Global"): string[] {
  const zLower = zone.toLowerCase();
  const quizCountries = COUNTRY_QUIZ_ITEMS.filter((c) =>
    zone === "Global" || zLower === "world" ? true : c.zone === zLower,
  ).map((c) => c.country);
  const allCountries = Array.from(new Set([...quizCountries, ...LOCATIONS.map((l) => l.country)])).filter(
    (c) => c !== target.country,
  );
  const rng = seededRng(`${target.id}-${target.country}`);
  const picks: string[] = [];
  const copy = [...allCountries];
  while (picks.length < 3 && copy.length > 0) {
    const idx = Math.floor(rng() * copy.length);
    picks.push(copy.splice(idx, 1)[0]!);
  }
  const choices = [target.country, ...picks];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = choices[i]!;
    choices[i] = choices[j]!;
    choices[j] = tmp;
  }
  return choices;
}

/** Remember recently played location IDs so they come back less often. */
const RECENT_KEY = "strafe-recent-locs";
const RECENT_MAX = 40;

export function loadRecent(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveRecent(ids: string[]) {
  if (typeof localStorage === "undefined") return;
  try {
    const merged = [...ids, ...loadRecent()].filter((id, i, a) => a.indexOf(id) === i).slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(merged));
  } catch {
    /* ignore quota */
  }
}

export function pickRounds(list: Location[], n: number, rng: () => number = Math.random, avoid: string[] = []) {
  const recent = loadRecent();
  const avoidSet = new Set([...avoid, ...recent]);
  const src = list.filter((l) => !avoidSet.has(l.id));
  const arr = [...(src.length >= n ? src : list)];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = t;
  }
  return arr.slice(0, n);
}

export function dailyRounds() {
  const pool = poolFor("world", "medium");
  const now = new Date();
  const dayIndex = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
  const rng = seededRng("strafe-daily-" + todayKey() + "-" + dayIndex);

  // De-duplicate pool by clean name-country key
  const seen = new Set<string>();
  const uniquePool = pool.filter((l) => {
    const key = `${l.name.toLowerCase()}::${l.country.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Deterministically shuffle with daily seed
  const shuffled = [...uniquePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = t;
  }

  // Pick 5 locations ensuring distinct countries across all rounds
  const selected: Location[] = [];
  const pickedCountries = new Set<string>();
  for (const loc of shuffled) {
    if (!pickedCountries.has(loc.country)) {
      pickedCountries.add(loc.country);
      selected.push(loc);
      if (selected.length === ROUNDS) break;
    }
  }

  if (selected.length < ROUNDS) {
    for (const loc of shuffled) {
      if (!selected.some((s) => s.id === loc.id)) {
        selected.push(loc);
        if (selected.length === ROUNDS) break;
      }
    }
  }

  return selected;
}

/* ---------- Map Shrink & Time Limits (0 = Unlimited ∞) ---------- */
export const SHRINK = { seconds: 30, startKm: 3000, endKm: 350 };
export const TIME_OPTIONS = [10, 20, 30, 60, 0] as const;
export type TimeLimit = (typeof TIME_OPTIONS)[number];
export const shrinkRadius = (elapsed: number, secs: number = SHRINK.seconds) => {
  const effectiveSecs = secs > 0 ? secs : SHRINK.seconds;
  return SHRINK.startKm - (SHRINK.startKm - SHRINK.endKm) * Math.min(1, elapsed / effectiveSecs);
};
/** Zone centre is offset from the target but always keeps it inside the final zone. */
export const shrinkCenter = (target: LatLng) =>
  destination(target, Math.random() * SHRINK.endKm * 0.75, Math.random() * 360);
/** Time multiplier: 1.0 when instant, 0.5 at the buzzer. */
export const timeMultiplier = (elapsed: number, secs: number = SHRINK.seconds) => {
  const effectiveSecs = secs > 0 ? secs : SHRINK.seconds;
  return 1 - 0.5 * Math.min(1, elapsed / effectiveSecs);
};

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
