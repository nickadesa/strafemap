import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { clearRecords, useSettings } from "@/lib/game/storage";
import { SCORING } from "@/lib/game/engine";
import { blip } from "@/lib/game/sound";
import { useMapStyle, useTheme, type MapStyle } from "@/lib/theme";
import { TILES } from "@/components/GameMap";

const tile = (u: string) => u.replace("{z}", "2").replace("{y}", "1").replace("{x}", "2");

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — STRAFE" },
      { name: "description", content: "Player name, sound and distance units for STRAFE." },
      { property: "og:title", content: "Settings — STRAFE" },
      { property: "og:description", content: "Tune STRAFE to your liking." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [s, update] = useSettings();
  const [cleared, setCleared] = useState(false);
  const [theme, setTheme] = useTheme();
  const [mapStyle, setMapStyle] = useMapStyle();
  const chip = (on: boolean) => `rounded-full px-4 py-2 text-sm font-semibold ${on ? "bg-primary text-primary-foreground" : "bg-muted"}`;
  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5">
        <h1 className="font-display py-8 text-6xl md:text-8xl">Settings</h1>
        <div className="plate space-y-6 p-6">
          <label className="block">
            <span className="text-sm font-semibold text-muted-foreground">Player name</span>
            <input value={s.name} maxLength={20} onChange={(e) => update({ name: e.target.value })} className="mt-2 w-full rounded-full border border-input bg-background px-5 py-3 font-semibold outline-none focus:border-foreground" />
          </label>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Sound effects</span>
            <button onClick={() => { update({ sound: !s.sound }); blip(!s.sound); }} className={`rounded-full px-5 py-2 text-sm font-semibold ${s.sound ? "bg-primary" : "bg-muted"}`}>{s.sound ? "On" : "Off"}</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Distance units</span>
            <div className="flex gap-2">
              {(["km", "mi"] as const).map((u) => <button key={u} onClick={() => update({ unit: u })} className={`rounded-full px-5 py-2 text-sm font-semibold ${s.unit === u ? "bg-foreground text-primary" : "bg-muted"}`}>{u}</button>)}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold">Theme</span>
            <div className="flex gap-2">
              {(["light", "dark"] as const).map((t) => <button key={t} onClick={() => setTheme(t)} className={chip(theme === t)}>{t === "light" ? "Light" : "Dark"}</button>)}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold">Map style</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {([["auto", "Match theme"], ["light", "Light"], ["dark", "Dark"], ["voyager", "Voyager"], ["satellite", "Satellite"]] as [MapStyle, string][]).map(([v, l]) => {
              const k = v === "auto" ? theme : v;
              const on = mapStyle === v;
              return (
                <button key={v} onClick={() => setMapStyle(v)} aria-pressed={on} className={`overflow-hidden rounded-2xl border-2 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring ${on ? "border-primary" : "border-border hover:border-foreground/40"}`}>
                  <div className="relative aspect-square bg-muted">
                    <img src={tile(TILES[k].base)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                    <img src={tile(TILES[k].labels)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className={`px-3 py-2 text-sm font-semibold ${on ? "bg-primary text-primary-foreground" : ""}`}>{l}</div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t pt-6">
            <span className="font-semibold">Reset all records</span>
            <button onClick={() => { if (confirm("Delete all games, stats and achievements on this device?")) { clearRecords().then(() => setCleared(true)); } }} className="btn btn-outline text-destructive">{cleared ? "Cleared" : "Reset"}</button>
          </div>
        </div>
        <div className="plate mt-4 p-6 text-sm text-muted-foreground">
          <h2 className="font-display text-2xl text-foreground">How scoring works</h2>
          <p className="mt-2">Points = 5,000 × e<sup>−distance / {SCORING.scaleKm.toLocaleString()} km</sup>. Within {SCORING.perfectKm} km is a perfect 5,000; beyond {SCORING.cutoffKm.toLocaleString()} km scores 0. Distance uses the Haversine great-circle formula. Map Shrink multiplies by a time bonus from ×1.00 down to ×0.50.</p>
        </div>
      </main>
    </div>
  );
}
