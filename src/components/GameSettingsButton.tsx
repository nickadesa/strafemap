import { useState } from "react";
import { Settings, ChevronDown } from "lucide-react";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";

export function GameSettingsButton() {
  const [open, setOpen] = useState(false);
  const [s, update] = useSettings();

  return (
    <div className="absolute bottom-4 left-16 z-[600] flex flex-col items-start">
      {open && (
        <div className="mb-2 w-56 overflow-hidden rounded-xl border border-border/40 bg-card/80 p-3 shadow-lg backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Quick settings</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <label className="flex items-center justify-between">
              <span>Sound</span>
              <button
                onClick={() => { const next = !s.sound; update({ sound: next }); blip(next); }}
                className={`rounded-md px-3 py-1 text-xs font-semibold ${s.sound ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {s.sound ? "On" : "Off"}
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span>Unit</span>
              <select
                value={s.unit}
                onChange={(e) => update({ unit: e.target.value as "km" | "mi" })}
                className="rounded-md border border-border/40 bg-background/60 px-2 py-1 text-xs"
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-11 w-11 place-items-center rounded-full border border-border/40 bg-card/80 shadow-md backdrop-blur-md hover:bg-card"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}
