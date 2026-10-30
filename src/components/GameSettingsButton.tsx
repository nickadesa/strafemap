import { useState, useEffect } from "react";
import { Settings, ChevronDown } from "lucide-react";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";
import { useTheme } from "@/lib/theme";
import { LANGS, t, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function GameSettingsButton() {
  const [open, setOpen] = useState(false);
  const [s, update] = useSettings();
  const [theme, setTheme] = useTheme();
  const lang = (s.language ?? "en") as Lang;

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("close-game-panels", close);
    return () => window.removeEventListener("close-game-panels", close);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) window.dispatchEvent(new Event("close-game-panels"));
  };

  return (
    <div className="fixed bottom-4 left-16 z-[9999] flex flex-col items-start">
      {open && (
        <div className="mb-2 w-64 overflow-hidden rounded-xl border border-border/40 bg-card/95 p-3 shadow-lg backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Quick settings</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span>Sound</span>
              <button
                onClick={() => { const next = !s.sound; update({ sound: next }); blip(next); }}
                className={`rounded-md px-3 py-1 text-xs font-semibold ${s.sound ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {s.sound ? t(lang, "on") : t(lang, "off")}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span>Unit</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 w-20 justify-between text-xs">
                    {s.unit}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => update({ unit: "km" })}>km</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => update({ unit: "mi" })}>mi</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between">
              <span>Language</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 w-24 justify-between text-xs">
                    {LANGS.find((l) => l.id === lang)?.label ?? lang}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {LANGS.map((l) => (
                    <DropdownMenuItem key={l.id} onSelect={() => update({ language: l.id })}>
                      {l.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between">
              <span>Theme</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 w-24 justify-between text-xs">
                    {theme === "light" ? t(lang, "light") : t(lang, "dark")}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setTheme("light")}>{t(lang, "light")}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTheme("dark")}>{t(lang, "dark")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        className="grid h-11 w-11 place-items-center rounded-full border border-border/40 bg-card/95 shadow-md backdrop-blur-md hover:bg-card"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}
