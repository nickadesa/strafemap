import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MODES, TIME_OPTIONS, type TimeLimit, type Difficulty, type Mode, type Pool } from "@/lib/game/engine";

const modeIds = Object.keys(MODES) as Mode[];

export const Route = createFileRoute("/play")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => {
    const mode = typeof search["mode"] === "string" && modeIds.includes(search["mode"] as Mode) ? (search["mode"] as Mode) : undefined;
    return mode ? { mode } : {};
  },
  component: Play,
});

const pools: { id: Pool; label: string }[] = [
  { id: "world", label: "World" }, { id: "capitals", label: "Capitals" },
  { id: "countries", label: "Countries" }, { id: "landmarks", label: "Landmarks & nature" },
];
const diffs: Difficulty[] = ["easy", "medium", "hard", "expert"];

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} data-on={on} className="seg-item capitalize">
      {children}
    </button>
  );
}

function Play() {
  const initial = Route.useSearch().mode;
  const [mode, setMode] = useState<Mode>(initial ?? "classic");
  const [pool, setPool] = useState<Pool>("world");
  const [difficulty, setDiff] = useState<Difficulty>("medium");
  const [practice, setPractice] = useState(false);
  const [time, setTime] = useState<TimeLimit>(30);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-56 px-5 pb-8 pt-20 md:pt-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display mb-6 text-5xl">Pick your game.</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`p-6 text-left transition-colors plate ${mode === m ? "ring-1 ring-foreground" : "hover:bg-muted/50"}`}>
                <span className="text-xs opacity-70">{MODES[m].tag}</span>
                <h2 className="font-display mt-2 text-4xl">{MODES[m].name}</h2>
                <p className="mt-2 text-sm opacity-80">{MODES[m].blurb}</p>
              </button>
            ))}
          </div>

          <div className="plate mt-4 space-y-5 p-6">
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">Category</p>
              <div className="seg">{pools.map((p) => <Chip key={p.id} on={pool === p.id} onClick={() => setPool(p.id)}>{p.label}</Chip>)}</div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">Difficulty</p>
              <div className="seg">{diffs.map((d) => <Chip key={d} on={difficulty === d} onClick={() => setDiff(d)}>{d}</Chip>)}</div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">Time per round</p>
              <div className="seg">{TIME_OPTIONS.map((t) => <Chip key={t} on={time === t} onClick={() => setTime(t)}>{t}s</Chip>)}</div>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} className="h-5 w-5 accent-[var(--color-foreground)]" />
              Practice · endless rounds, not recorded
            </label>
            <Link to="/game/$mode" params={{ mode }} search={practice ? { pool, difficulty, time, practice: 1 } : { pool, difficulty, time }} className="btn btn-primary px-10 py-4 text-lg">
              Start {MODES[mode].name}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
