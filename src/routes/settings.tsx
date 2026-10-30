import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";
import { useMapStyle, useTheme, type MapStyle } from "@/lib/theme";
import { LANGS, t, type Lang } from "@/lib/i18n";
import { TILES } from "@/components/GameMap";

const tile = (u: string) => u.replace("{z}", "2").replace("{y}", "1").replace("{x}", "2").replace("{s}", "a").replace("{r}", "");

export const Route = createFileRoute("/settings")({
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
      <main className="md:ml-56 px-5 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display mb-6 text-4xl">{t(lang, "settings")}</h1>
          <div className="plate space-y-4 p-6">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">{t(lang, "playerName")}</span>
              <input
                value={s.name}
                maxLength={20}
                onChange={(e) => update({ name: e.target.value })}
                className="w-48 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t(lang, "language")}</span>
              <select
                value={lang}
                onChange={(e) => update({ language: e.target.value as Lang })}
                className="w-40 rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
              >
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t(lang, "sound")}</span>
              <select
                value={s.sound ? "on" : "off"}
                onChange={(e) => { const on = e.target.value === "on"; update({ sound: on }); blip(on); }}
                className="w-32 rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="on">{t(lang, "on")}</option>
                <option value="off">{t(lang, "off")}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t(lang, "units")}</span>
              <select
                value={s.unit}
                onChange={(e) => update({ unit: e.target.value as "km" | "mi" })}
                className="w-28 rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t(lang, "theme")}</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                className="w-32 rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="light">{t(lang, "light")}</option>
                <option value="dark">{t(lang, "dark")}</option>
              </select>
            </div>

            <div>
              <span className="mb-3 block text-sm font-medium">{t(lang, "mapStyle")}</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {([["auto", "Auto"], ["light", "Light"], ["dark", "Dark"], ["voyager", "Voyager"], ["positron", "Positron"], ["darkmatter", "Dark Matter"], ["satellite", "Satellite"]] as [MapStyle, string][]).map(([v, l]) => {
                  const k = v === "auto" ? (theme === "dark" ? "darkmatter" : "voyager") : v;
                  const on = mapStyle === v;
                  return (
                    <button key={v} onClick={() => setMapStyle(v)} className={`overflow-hidden rounded-xl border-2 text-left ${on ? "border-primary" : "border-transparent hover:border-muted"}`}>
                      <div className="relative aspect-square bg-muted">
                        <img src={tile(TILES[k].base)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                        <img src={tile(TILES[k].labels)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className={`px-2 py-1.5 text-xs font-medium ${on ? "bg-primary text-primary-foreground" : ""}`}>{l}</div>
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
