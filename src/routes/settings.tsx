import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";
import { useMapStyle, useTheme, type MapStyle } from "@/lib/theme";
import { LANGS, t, type Lang } from "@/lib/i18n";

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
          <div className="plate space-y-5 p-6">
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">{t(lang, "playerName")}</span>
              <input
                value={s.name}
                maxLength={20}
                onChange={(e) => update({ name: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
              />
            </label>

            <div>
              <span className="text-sm font-medium text-muted-foreground">{t(lang, "language")}</span>
              <select
                value={lang}
                onChange={(e) => update({ language: e.target.value as Lang })}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5"
              >
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">{t(lang, "sound")}</span>
              <select
                value={s.sound ? "on" : "off"}
                onChange={(e) => { const on = e.target.value === "on"; update({ sound: on }); blip(on); }}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5"
              >
                <option value="on">{t(lang, "on")}</option>
                <option value="off">{t(lang, "off")}</option>
              </select>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">{t(lang, "units")}</span>
              <select
                value={s.unit}
                onChange={(e) => update({ unit: e.target.value as "km" | "mi" })}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5"
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">{t(lang, "theme")}</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5"
              >
                <option value="light">{t(lang, "light")}</option>
                <option value="dark">{t(lang, "dark")}</option>
              </select>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">{t(lang, "mapStyle")}</span>
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value as MapStyle)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5"
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="voyager">Voyager</option>
                <option value="positron">Positron</option>
                <option value="darkmatter">Dark Matter</option>
                <option value="satellite">Satellite</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
