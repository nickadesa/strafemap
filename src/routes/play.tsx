import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { MODES, type Difficulty, type Mode, type Pool } from "@/lib/game/engine";

const modeIds = Object.keys(MODES) as Mode[];

export const Route = createFileRoute("/play")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => {
    const mode = typeof search.mode === "string" && modeIds.includes(search.mode as Mode) ? (search.mode as Mode) : undefined;
    return { mode };
  },
  head: () => ({
    meta: [
      { title: "Choose a mode — STRAFE" },
      { name: "description", content: "Pick One Pin, Map Shrink, Closest Wins or Blind Map, then set difficulty and category." },
      { property: "og:title", content: "Choose a mode — STRAFE" },
      { property: "og:description", content: "Four ways to play the STRAFE map guessing game." },
    ],
  }),
  component: Play,
});

const pools: { id: Pool; label: string }[] = [
  { id: "world", label: "World" }, { id: "capitals", label: "Capitals" },
  { id: "countries", label: "Countries" }, { id: "landmarks", label: "Landmarks & nature" },
];
const diffs: Difficulty[] = ["easy", "medium", "hard", "expert"];

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${on ? "bg-foreground text-primary" : "bg-card hover:bg-primary-pale"}`}>
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

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5">
        <h1 className="font-display py-8 text-6xl md:text-8xl">Pick your game.</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`p-6 text-left transition-colors ${mode === m ? "plate-ink" : "plate hover:bg-primary-pale"}`}>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{MODES[m].tag}</span>
              <h2 className="font-display mt-2 text-4xl">{MODES[m].name}</h2>
              <p className="mt-2 text-sm opacity-80">{MODES[m].blurb}</p>
            </button>
          ))}
        </div>

        <div className="plate mt-4 space-y-5 p-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">Category</p>
            <div className="flex flex-wrap gap-2">{pools.map((p) => <Chip key={p.id} on={pool === p.id} onClick={() => setPool(p.id)}>{p.label}</Chip>)}</div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">Difficulty</p>
            <div className="flex flex-wrap gap-2">{diffs.map((d) => <Chip key={d} on={difficulty === d} onClick={() => setDiff(d)}>{d}</Chip>)}</div>
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} className="h-5 w-5 accent-[var(--color-foreground)]" />
            Practice mode — endless rounds, nothing saved to records
          </label>
          <Link to="/game/$mode" params={{ mode }} search={practice ? { pool, difficulty, practice: 1 } : { pool, difficulty }} className="btn btn-primary px-10 py-4 text-lg">
            Start {MODES[mode].name}
          </Link>
        </div>
      </main>
    </div>
  );
}
