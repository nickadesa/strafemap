// Rounded SVG flag badge. Vector flags from flagcdn; falls back to a globe glyph.
const ALIAS: Record<string, string> = {
  "united states": "us", usa: "us", "united kingdom": "gb", uk: "gb", russia: "ru", türkiye: "tr", turkey: "tr",
  "south korea": "kr", "north korea": "kp", vietnam: "vn", laos: "la", iran: "ir", syria: "sy", bolivia: "bo",
  venezuela: "ve", tanzania: "tz", moldova: "md", "czech republic": "cz", czechia: "cz", taiwan: "tw",
  "ivory coast": "ci", "côte d'ivoire": "ci", "dr congo": "cd", "democratic republic of the congo": "cd",
  "republic of the congo": "cg", palestine: "ps", "vatican city": "va", "hong kong": "hk", macau: "mo",
  myanmar: "mm", burma: "mm", "cape verde": "cv", eswatini: "sz", "east timor": "tl", "timor-leste": "tl",
  micronesia: "fm", brunei: "bn", "north macedonia": "mk", kosovo: "xk", antarctica: "aq", scotland: "gb-sct",
  england: "gb-eng", wales: "gb-wls",
};

let table: Record<string, string> | null = null;
function build() {
  const t: Record<string, string> = {};
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    const A = 65;
    for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++) {
      const code = String.fromCharCode(A + i, A + j);
      const name = dn.of(code);
      if (name && name !== code) t[name.toLowerCase()] = code.toLowerCase();
    }
  } catch { /* Intl unavailable */ }
  return { ...t, ...ALIAS };
}

export function countryCode(country: string): string | null {
  table ??= build();
  const first = (country.split("/")[0] ?? country).trim().toLowerCase();
  if (/^[a-z]{2}$/.test(first)) return first;
  return table[first] ?? null;
}

export function Flag({ country, size = 24, className = "" }: { country: string; size?: number; className?: string }) {
  const code = countryCode(country);
  const h = Math.round(size * 0.75);
  const base = `inline-grid shrink-0 place-items-center overflow-hidden rounded-[6px] bg-muted ring-1 ring-border ${className}`;
  if (!code) {
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
      <img src={`https://flagcdn.com/${code}.svg`} alt={`${country} flag`} width={size} height={h} className="h-full w-full object-cover" draggable={false} />
    </span>
  );
}
