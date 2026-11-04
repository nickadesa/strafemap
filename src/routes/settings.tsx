import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";
import { useMapStyle, useTheme, type MapStyle } from "@/lib/theme";
import { LANGS, t, type Lang } from "@/lib/i18n";
import { TILES } from "@/components/GameMap";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const tile = (u: string) => u.replace("{z}", "2").replace("{y}", "1").replace("{x}", "2").replace("{s}", "a").replace("{r}", "");

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{"title": "Settings \u2014 STRAFE"}, {"name": "description", "content": "Set your STRAFE language, sound, distance units and map style."}, {"property": "og:title", "content": "Settings \u2014 STRAFE"}, {"property": "og:description", "content": "Set your STRAFE language, sound, distance units and map style."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [s, update] = useSettings();
  const [theme, setTheme] = useTheme();
  const [mapStyle, setMapStyle] = useMapStyle();
  const lang = (s.language ?? "en") as Lang;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-56 px-5 pb-8 pt-20 md:pt-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display mb-6 text-4xl">{t(lang, "settings")}</h1>
          <div className="plate space-y-4 p-6">
            <label className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-sm font-medium">{t(lang, "playerName")}</span>
              <input
                value={s.name}
                maxLength={20}
                onChange={(e) => update({ name: e.target.value })}
                className="w-36 sm:w-48 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-sm font-medium">{t(lang, "language")}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-40 justify-between">
                    {LANGS.find((l) => l.id === lang)?.label ?? lang}
                    <ChevronDown className="h-4 w-4 opacity-60" />
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

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-sm font-medium">{t(lang, "sound")}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-32 justify-between">
                    {s.sound ? t(lang, "on") : t(lang, "off")}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => { update({ sound: true }); blip(true); }}>
                    {t(lang, "on")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => { update({ sound: false }); blip(false); }}>
                    {t(lang, "off")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-sm font-medium">{t(lang, "units")}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-28 justify-between">
                    {s.unit}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => update({ unit: "km" })}>km</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => update({ unit: "mi" })}>mi</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-sm font-medium">{t(lang, "theme")}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-32 justify-between">
                    {theme === "light" ? t(lang, "light") : t(lang, "dark")}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setTheme("light")}>{t(lang, "light")}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTheme("dark")}>{t(lang, "dark")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <span className="mb-3 block text-sm font-medium">{t(lang, "mapStyle")}</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {([["auto", "Auto"], ["light", "Light"], ["dark", "Dark"], ["voyager", "Voyager"], ["positron", "Positron"], ["darkmatter", "Dark Matter"], ["satellite", "Satellite"]] as [MapStyle, string][]).map(([v, l]) => {
                  const k = v === "auto" ? (theme === "dark" ? "darkmatter" : "voyager") : v;
                  const on = mapStyle === v;
                  return (
                    <button key={v} onClick={() => setMapStyle(v)} className={`overflow-hidden rounded-xl border-2 text-left transition-all ${on ? "border-primary ring-2 ring-primary/40" : "border-border/50 hover:border-muted"}`}>
                      <div className="relative aspect-square bg-muted">
                        <img src={tile(TILES[k].base)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                        <img src={tile(TILES[k].labels)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className={`px-2 py-1.5 text-xs font-medium ${on ? "bg-primary text-primary-foreground" : "bg-card"}`}>{["auto", "light", "dark", "satellite"].includes(v) ? t(lang, v) : l}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
