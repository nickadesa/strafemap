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
