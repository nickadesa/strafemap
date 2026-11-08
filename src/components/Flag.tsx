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

const INLINE_FLAGS: Record<string, () => React.ReactNode> = {
  gb: () => (
    <svg viewBox="0 0 60 30" className="block h-full w-full">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  fr: () => (
    <svg viewBox="0 0 3 2" className="block h-full w-full">
      <rect width="1" height="2" fill="#002654" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  ),
  th: () => (
    <svg viewBox="0 0 9 6" className="block h-full w-full">
      <rect width="9" height="6" fill="#A51931" />
      <rect y="1" width="9" height="4" fill="#F4F5F8" />
      <rect y="2" width="9" height="2" fill="#2D2A4A" />
    </svg>
  ),
  es: () => (
    <svg viewBox="0 0 3 2" className="block h-full w-full">
      <rect width="3" height="2" fill="#AA151B" />
      <rect y="0.5" width="3" height="1" fill="#F1BF00" />
    </svg>
  ),
  jp: () => (
    <svg viewBox="0 0 3 2" className="block h-full w-full">
      <rect width="3" height="2" fill="#FFFFFF" />
      <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
    </svg>
  ),
  cn: () => (
    <svg viewBox="0 0 30 20" className="block h-full w-full">
      <rect width="30" height="20" fill="#DE2910" />
      <polygon points="5,2 6.18,5.62 3.09,3.38 6.91,3.38 3.82,5.62" fill="#FFDE00" />
      <circle cx="10" cy="2" r="0.8" fill="#FFDE00" />
      <circle cx="12" cy="4" r="0.8" fill="#FFDE00" />
      <circle cx="12" cy="7" r="0.8" fill="#FFDE00" />
      <circle cx="10" cy="9" r="0.8" fill="#FFDE00" />
    </svg>
  ),
  kr: () => (
    <svg viewBox="0 0 6 4" className="block h-full w-full">
      <rect width="6" height="4" fill="#FFFFFF" />
      <path d="M3,1 A1,1 0 0,1 3,3 A0.5,0.5 0 0,1 3,2 A0.5,0.5 0 0,0 3,1" fill="#CD2E3A" />
      <path d="M3,3 A1,1 0 0,1 3,1 A0.5,0.5 0 0,1 3,2 A0.5,0.5 0 0,0 3,3" fill="#0047A0" />
    </svg>
  ),
  us: () => (
    <svg viewBox="0 0 19 10" className="block h-full w-full">
      <rect width="19" height="10" fill="#B22234" />
      <path d="M0,1.54 h19 M0,3.08 h19 M0,4.62 h19 M0,6.15 h19 M0,7.69 h19 M0,9.23 h19" stroke="#fff" strokeWidth="0.77" />
      <rect width="7.6" height="5.38" fill="#3C3B6E" />
    </svg>
  ),
  de: () => (
    <svg viewBox="0 0 5 3" className="block h-full w-full">
      <rect width="5" height="1" y="0" fill="#000000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  ),
};

// Aliases for inline vector flags
const INLINE_ALIAS: Record<string, string> = {
  "united kingdom": "gb",
  "united-kingdom": "gb",
  uk: "gb",
  greatbritain: "gb",
  britain: "gb",
  england: "gb",
  en: "gb",
  france: "fr",
  fr: "fr",
  thailand: "th",
  th: "th",
  spain: "es",
  es: "es",
  japan: "jp",
  ja: "jp",
  jp: "jp",
  china: "cn",
  zh: "cn",
  cn: "cn",
  "south korea": "kr",
  "south-korea": "kr",
  korea: "kr",
  ko: "kr",
  kr: "kr",
  "united states": "us",
  "united-states": "us",
  usa: "us",
  us: "us",
  germany: "de",
  de: "de",
};

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

  const normalizedKey = (country.split("/")[0] ?? country).trim().toLowerCase();
  const inlineCode = INLINE_ALIAS[normalizedKey] ?? (INLINE_FLAGS[normalizedKey] ? normalizedKey : null);
  const inlineRenderer = inlineCode ? INLINE_FLAGS[inlineCode] : null;

  const file = flagFile(country);
  const code = countryCode(country);
  const h = Math.round(size * 0.67);
  const base = `inline-grid shrink-0 place-items-center overflow-hidden border border-border/50 shadow-xs select-none ${className}`;

  if (inlineRenderer) {
    return (
      <span
        className={base}
        style={{ width: size, height: h }}
        aria-label={country}
        onContextMenu={(e) => e.preventDefault()}
      >
        {inlineRenderer()}
      </span>
    );
  }

  // Multi-tier reliable flag source:
  // Tier 1: Local bundled SVG (/flags/<file>.svg) if known and hasn't failed
  // Tier 2: FlagCDN fallback (https://flagcdn.com/<code>.svg) if local failed or file unknown
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
          width={h * 0.7}
          height={h * 0.7}
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
        className="block h-full w-full object-cover pointer-events-none select-none"
        draggable={false}
        loading="lazy"
      />
    </span>
  );
}
