// Rounded SVG flag badge. Uses the bundled flag pack in /flags; countries missing
// from the pack fall back to flagcdn, then a thin globe glyph.
import { useState, useEffect } from "react";
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
  "sao tome and principe": "sao-tome-and-principe", "são tomé and príncipe": "sao-tome-and-principe",
  "saint lucia": "saint-lucia", "st. lucia": "saint-lucia",
  "marshall islands": "marshall-islands", "north macedonia": "north-macedonia",
  "saudi arabia": "saudi-arabia", "san marino": "san-marino",
};

/** Direct mapping of common 2-letter ISO codes to bundle filenames */
const ISO_TO_FILE: Record<string, string> = {
  us: "united-states", gb: "united-kingdom", uk: "united-kingdom", th: "thailand",
  fr: "france", es: "spain", de: "germany", it: "italy", jp: "japan", cn: "china",
  kr: "south-korea", ca: "canada", au: "australia", br: "brazil", mx: "mexico",
  in: "india", id: "indonesia", nl: "netherlands", se: "sweden", no: "norway",
  fi: "finland", dk: "denmark", pl: "poland", ua: "ukraine", tr: "turkey",
  gr: "greece", eg: "egypt", za: "south-africa", ar: "argentina", cl: "chile",
  co: "colombia", pe: "peru", nz: "new-zealand", ph: "philippines", sg: "singapore",
  vn: "vietnam", ch: "switzerland", at: "austria", be: "belgium", ie: "ireland",
  pt: "portugal", is: "iceland", ru: "russia", rs: "serbia", lt: "lithuania",
  mk: "north-macedonia", lu: "luxembourg", mt: "malta", sm: "san-marino",
  my: "malaysia", kg: "kyrgyzstan", sa: "saudi-arabia", lb: "lebanon",
  tz: "tanzania", sn: "senegal", bw: "botswana", mg: "madagascar", mu: "mauritius",
  sc: "seychelles", ml: "mali", ne: "niger", so: "somalia", ls: "lesotho",
  ws: "samoa", mh: "marshall-islands", nr: "nauru", lr: "liberia", mr: "mauritania",
  st: "sao-tome-and-principe", lc: "saint-lucia",
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
  if (ISO_TO_FILE[key]) return ISO_TO_FILE[key];
  if (ALIAS[key]) return ALIAS[key];
  const s = slug(key);
  if (FLAG_FILES.has(s)) return s;
  if (/^[a-z]{2}$/.test(key)) {
    const rName = regionName(key);
    if (rName) {
      const rSlug = slug(rName);
      if (FLAG_FILES.has(rSlug)) return rSlug;
    }
  }
  return null;
}

export function countryCode(country: string): string | null {
  const key = (country.split("/")[0] ?? country).trim().toLowerCase();
  if (/^[a-z]{2}$/.test(key)) return key;
  for (const [code, f] of Object.entries(ISO_TO_FILE)) {
    if (f === key || f === slug(key)) return code;
  }
  return isoCode(key);
}

export function Flag({
  country,
  size = 24,
  className = "",
  rectangular = false,
}: {
  country: string;
  size?: number;
  className?: string;
  rectangular?: boolean;
}) {
  const [failedLocal, setFailedLocal] = useState(false);
  const [failedRemote, setFailedRemote] = useState(false);

  useEffect(() => {
    setFailedLocal(false);
    setFailedRemote(false);
  }, [country]);

  const file = flagFile(country);
  const code = countryCode(country);

  // When rectangular is requested (e.g. language picker), use 4:3 ratio with gentle rounding.
  // Standard flag icons from the squircle pack use a clean 1:1 box (32x32) so no edges are cut off.
  const h = rectangular ? Math.round(size * 0.75) : size;
  const base = `inline-grid shrink-0 place-items-center select-none ${
    rectangular ? "overflow-hidden rounded-[4px]" : ""
  } ${className}`;

  // Multi-tier reliable flag source:
  // Tier 1: Local bundled SVG (/flags/<file>.svg) from the authentic squircle pack
  // Tier 2: FlagCDN fallback (https://flagcdn.com/<code>.svg) if file unknown
  // Tier 3: SVG Globe vector
  let src: string | null = null;
  if (file && !failedLocal) {
    src = `/flags/${file}.svg`;
  } else if (code && !failedRemote) {
    src = `https://flagcdn.com/${code.toLowerCase()}.svg`;
  }

  if (!src) {
    return (
      <span
        className={base}
        style={{ width: size, height: h }}
        aria-label={country}
        onContextMenu={(e) => e.preventDefault()}
      >
        <svg
          width={Math.round(size * 0.7)}
          height={Math.round(size * 0.7)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-60 pointer-events-none"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={base}
      style={{ width: size, height: h }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        key={src}
        src={src}
        alt={`${country} flag`}
        width={size}
        height={h}
        onError={() => {
          if (file && !failedLocal) {
            setFailedLocal(true);
          } else {
            setFailedRemote(true);
          }
        }}
        className="block h-full w-full object-contain pointer-events-none select-none"
        draggable={false}
        loading="lazy"
      />
    </span>
  );
}
