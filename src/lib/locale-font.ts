import { useEffect } from "react";
import { loadSettings } from "@/lib/game/storage";
import type { Lang } from "@/lib/i18n";

const LOCALE_FONT_URLS: Partial<Record<Lang, string>> = {
  ko: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600&display=swap",
  zh: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap",
  ja: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&display=swap",
  th: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap",
};

/** Synchronous head init script so `<html lang="...">` matches saved locale before first paint. */
export const localeInitScript = `try{var s=localStorage.getItem("strafe.settings");if(s){var l=JSON.parse(s).language;if(l)document.documentElement.lang=l}}catch(e){}`;

export function applyLocaleTypography(lang?: Lang) {
  if (typeof document === "undefined") return;
  const activeLang: Lang = lang ?? loadSettings().language ?? "en";
  document.documentElement.lang = activeLang;

  const fontUrl = LOCALE_FONT_URLS[activeLang];
  if (fontUrl) {
    const selector = `link[data-strafe-font="${activeLang}"]`;
    if (!document.head.querySelector(selector)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      link.setAttribute("data-strafe-font", activeLang);
      document.head.appendChild(link);
    }
  }
}

export function useLocaleTypography() {
  useEffect(() => {
    const sync = () => applyLocaleTypography();
    sync();
    window.addEventListener("strafe:settings", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("strafe:settings", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
}
