import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type MapStyle = "auto" | "light" | "dark" | "voyager" | "positron" | "darkmatter" | "satellite";
const TKEY = "strafe-theme";
const MKEY = "strafe-map";
const EVT = "strafe-theme-change";

export const themeInitScript = `try{if(localStorage.getItem("${TKEY}")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

function readTheme(): Theme {
  return localStorage.getItem(TKEY) === "dark" ? "dark" : "light";
}
function readMap(): MapStyle {
  const v = localStorage.getItem(MKEY);
  return v === "light" || v === "dark" || v === "voyager" || v === "positron" || v === "darkmatter" || v === "satellite" ? v : "auto";
}

export function useTheme() {
  const [theme, setT] = useState<Theme>("light");
  useEffect(() => {
    const sync = () => setT(readTheme());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(TKEY, t);
    document.documentElement.classList.toggle("dark", t === "dark");
    window.dispatchEvent(new Event(EVT));
  }, []);
  return [theme, setTheme] as const;
}

export function useMapStyle() {
  const [style, setS] = useState<MapStyle>("auto");
  useEffect(() => {
    const sync = () => setS(readMap());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  const setStyle = useCallback((s: MapStyle) => {
    localStorage.setItem(MKEY, s);
    window.dispatchEvent(new Event(EVT));
  }, []);
  return [style, setStyle] as const;
}

/** Resolved tile style: auto follows the app theme. */
export function useResolvedMapStyle(): "light" | "dark" | "voyager" | "positron" | "darkmatter" | "satellite" {
  const [theme] = useTheme();
  const [style] = useMapStyle();
  return style === "auto" ? (theme === "dark" ? "darkmatter" : "voyager") : style;
}

/* ---------- Accent colour + Liquid Glass ---------- */
export const ACCENTS = {
  lime: { label: "Lime", primary: "#b9ff24", active: "#c8ff00" },
  mint: { label: "Mint", primary: "#3df5b0", active: "#5bffc2" },
  sky: { label: "Sky", primary: "#4cc9ff", active: "#6fd5ff" },
  coral: { label: "Coral", primary: "#ff7a59", active: "#ff9273" },
  gold: { label: "Gold", primary: "#ffc531", active: "#ffd45c" },
  pink: { label: "Pink", primary: "#ff6fb5", active: "#ff8cc4" },
} as const;
export type Accent = keyof typeof ACCENTS;
export const GLASS_PRESETS = ["off", "bend", "dispersion", "frost", "rim"] as const;
export type GlassPreset = (typeof GLASS_PRESETS)[number];
const AKEY = "strafe-accent";
const GKEY = "strafe-glass";

const readAccent = (): Accent => { const v = localStorage.getItem(AKEY); return v && v in ACCENTS ? (v as Accent) : "lime"; };
const readGlass = (): GlassPreset => { const v = localStorage.getItem(GKEY) as GlassPreset; return GLASS_PRESETS.includes(v) ? v : "off"; };

export function applyAppearance() {
  const root = document.documentElement;
  const a = ACCENTS[readAccent()];
  root.style.setProperty("--primary", a.primary);
  root.style.setProperty("--primary-active", a.active);
  root.style.setProperty("--ring-accent", a.primary);
  const g = readGlass();
  if (g === "off") root.removeAttribute("data-glass"); else root.setAttribute("data-glass", g);
}

export const appearanceInitScript = `try{var A=${JSON.stringify(Object.fromEntries(Object.entries(ACCENTS).map(([k, v]) => [k, [v.primary, v.active]])))};var a=A[localStorage.getItem("${AKEY}")];if(a){document.documentElement.style.setProperty("--primary",a[0]);document.documentElement.style.setProperty("--primary-active",a[1])}var g=localStorage.getItem("${GKEY}");if(g&&g!=="off")document.documentElement.setAttribute("data-glass",g)}catch(e){}`;

export function useAppearance() {
  const [accent, setA] = useState<Accent>("lime");
  const [glass, setG] = useState<GlassPreset>("off");
  useEffect(() => {
    const sync = () => { setA(readAccent()); setG(readGlass()); };
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  const setAccent = useCallback((v: Accent) => { localStorage.setItem(AKEY, v); applyAppearance(); window.dispatchEvent(new Event(EVT)); }, []);
  const setGlass = useCallback((v: GlassPreset) => { localStorage.setItem(GKEY, v); applyAppearance(); window.dispatchEvent(new Event(EVT)); }, []);
  return { accent, setAccent, glass, setGlass } as const;
}
