import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { clearRecords, useSettings } from "@/lib/game/storage";
import { SCORING } from "@/lib/game/engine";
import { blip } from "@/lib/game/sound";

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
          <div className="flex items-center justify-between border-t pt-6">
            <span className="font-semibold">Reset all local records</span>
            <button onClick={() => { if (confirm("Delete all games, stats and achievements on this device?")) { clearRecords(); setCleared(true); } }} className="btn btn-outline text-destructive">{cleared ? "Cleared" : "Reset"}</button>
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
