// Rounded SVG flag badge. Uses the bundled flag pack in /flags; countries missing
// from the pack fall back to flagcdn, then a thin globe glyph.
import { useState } from "react";
import { FLAG_FILES } from "@/lib/flag-files";

/** Alternative country names → file name in the bundled pack. */
const ALIAS: Record<string, string> = {
  usa: "united-states", us: "united-states", "united states of america": "united-states", america: "united-states",
  uk: "united-kingdom", "great britain": "united-kingdom", britain: "united-kingdom",
  "türkiye": "turkey", turkiye: "turkey", "czech republic": "czechia",
  "bosnia and herzegovina": "bosnia-herzegovina", bosnia: "bosnia-herzegovina",
  "dr congo": "democratic-republic-congo", "democratic republic of the congo": "democratic-republic-congo", "congo - kinshasa": "democratic-republic-congo",
  "republic of the congo": "republic-congo", congo: "republic-congo", "congo - brazzaville": "republic-congo",
  "côte d'ivoire": "ivory-coast", "cote d'ivoire": "ivory-coast", "côte d’ivoire": "ivory-coast",
  mozambique: "mozanbique", "northern ireland": "northen-ireland",
  "timor-leste": "east-timor", "trinidad and tobago": "trinidad-tobago", "trinidad & tobago": "trinidad-tobago",
  "saint kitts and nevis": "saint-kitts-nevis", "st. kitts & nevis": "saint-kitts-nevis",
  korea: "south-korea", "republic of korea": "south-korea", "north korea": "north-korea",
  uae: "united-arab-emirates", vatican: "vatican-city", "holy see": "vatican-city", "vatican city": "vatican-city",
  burma: "myanmar", swaziland: "eswatini", "åland islands": "aaland-islands", "aland islands": "aaland-islands",
  macao: "macau", "macao sar china": "macau", "hong kong sar china": "hong-kong",
  "turks & caicos islands": "turks-and-caicos-islands", "south georgia & south sandwich islands": "south-georgia-sandwich-islands",
  "u.s. virgin islands": "united-states-virgin-islands", "falkland islands (islas malvinas)": "falkland-islands",
  "palestinian territories": "palestine", "cabo verde": "cape-verde", "the bahamas": "bahamas", "the gambia": "gambia",
};

const slug = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let names: Intl.DisplayNames | null | undefined;
const regionName = (code: string) => {
  if (names === undefined) { try { names = new Intl.DisplayNames(["en"], { type: "region" }); } catch { names = null; } }
  try { return names?.of(code.toUpperCase()) ?? null; } catch { return null; }
};

let codes: Record<string, string> | null = null;
function isoCode(name: string): string | null {
  if (!codes) {
    codes = {};
    for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++) {
      const c = String.fromCharCode(65 + i, 65 + j);
      const n = regionName(c);
      if (n && n !== c) codes[n.toLowerCase()] = c.toLowerCase();
    }
  }
  return codes[name] ?? null;
}

/** File name in the bundled pack for a country name or ISO code. */
export function flagFile(country: string): string | null {
  let key = (country.split("/")[0] ?? country).trim().toLowerCase();
  if (/^[a-z]{2}$/.test(key)) key = (regionName(key) ?? key).toLowerCase();
  const file = ALIAS[key] ?? slug(key);
  return FLAG_FILES.has(file) ? file : null;
}

export function countryCode(country: string): string | null {
  const key = (country.split("/")[0] ?? country).trim().toLowerCase();
  if (/^[a-z]{2}$/.test(key)) return key;
  return isoCode(key);
}

export function Flag({ country, size = 24, className = "" }: { country: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const file = flagFile(country);
  const code = file ? null : countryCode(country);
  const src = file ? `/flags/${file}.svg` : code ? `https://flagcdn.com/${code}.svg` : null;
  const h = Math.round(size * 0.75);
  const base = `inline-grid shrink-0 place-items-center overflow-hidden rounded-[6px] bg-muted ring-1 ring-border ${className}`;
  if (!src || failed) {
    return (
      <span className={base} style={{ width: size, height: h }} aria-label={country}>
        <svg width={h * 0.7} height={h * 0.7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60">
          <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
        </svg>
      </span>
    );
  }
  return (
    <span className={base} style={{ width: size, height: h }}>
      <img src={src} alt={`${country} flag`} width={size} height={h} onError={() => setFailed(true)} className="h-full w-full object-cover" draggable={false} />
    </span>
  );
}
