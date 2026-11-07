import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type MapStyle = "auto" | "light" | "dark" | "voyager" | "positron" | "darkmatter" | "satellite";
const TKEY = "strafe-theme";
const MKEY = "strafe-map";
const EVT = "strafe-theme-change";

export const themeInitScript = `try{var t=localStorage.getItem("${TKEY}");if(t==="dark"||!t)document.documentElement.classList.add("dark")}catch(e){}`;

function readTheme(): Theme {
  if (typeof localStorage === "undefined") return "dark";
  const v = localStorage.getItem(TKEY);
  return v === "light" ? "light" : "dark";
}
function readMap(): MapStyle {
  if (typeof localStorage === "undefined") return "auto";
  const v = localStorage.getItem(MKEY);
  return v === "light" || v === "dark" || v === "voyager" || v === "positron" || v === "darkmatter" || v === "satellite" ? v : "auto";
}

export function useTheme() {
  const [theme, setT] = useState<Theme>("dark");
  useEffect(() => {
    const sync = () => {
      const cur = readTheme();
      setT(cur);
      document.documentElement.classList.toggle("dark", cur === "dark");
    };
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

/* ---------- Core Brand Palette + Liquid Glass ---------- */
export const BRAND_COLORS = {
  electricBlue: "#0367FC",
  acidLime: "#D2F801",
  darkSurface: "#161616",
  lightSurface: "#FFFFFF",
} as const;

export const ACCENTS = {
  lime: { label: "Acid Lime", primary: "#D2F801", active: "#DCFF1A" },
  blue: { label: "Electric Blue", primary: "#0367FC", active: "#257CFD" },
} as const;
export type Accent = keyof typeof ACCENTS;
export const GLASS_PRESETS = ["off", "bend", "dispersion", "frost", "rim"] as const;
export type GlassPreset = (typeof GLASS_PRESETS)[number];
const GKEY = "strafe-glass";

const readGlass = (): GlassPreset => {
  if (typeof localStorage === "undefined") return "off";
  const v = localStorage.getItem(GKEY) as GlassPreset;
  return GLASS_PRESETS.includes(v) ? v : "off";
};

export function applyAppearance() {
  const root = document.documentElement;
  root.style.setProperty("--primary", BRAND_COLORS.acidLime);
  root.style.setProperty("--primary-active", "#DCFF1A");
  root.style.setProperty("--ring-accent", BRAND_COLORS.acidLime);
  const g = readGlass();
  if (g === "off") root.removeAttribute("data-glass");
  else root.setAttribute("data-glass", g);
}

export const appearanceInitScript = `try{localStorage.removeItem("strafe-accent");var g=localStorage.getItem("${GKEY}");if(g&&g!=="off")document.documentElement.setAttribute("data-glass",g)}catch(e){}`;

export function useAppearance() {
  const [glass, setG] = useState<GlassPreset>("off");
  useEffect(() => {
    const sync = () => setG(readGlass());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  const setGlass = useCallback((v: GlassPreset) => {
    localStorage.setItem(GKEY, v);
    applyAppearance();
    window.dispatchEvent(new Event(EVT));
  }, []);
  const setAccent = useCallback((_v: Accent) => {}, []);
  return { accent: "lime" as Accent, setAccent, glass, setGlass } as const;
}
