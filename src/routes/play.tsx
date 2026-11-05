import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { useSettings } from "@/lib/game/storage";
import { Sidebar } from "@/components/Sidebar";
import { MODES, TIME_OPTIONS, type TimeLimit, type Difficulty, type Mode, type Pool } from "@/lib/game/engine";

const modeIds = Object.keys(MODES) as Mode[];

export const Route = createFileRoute("/play")({
  head: () => ({ meta: [{"title": "Choose a game \u2014 STRAFE"}, {"name": "description", "content": "Choose your STRAFE mode, category, difficulty and round timer."}, {"property": "og:title", "content": "Choose a game \u2014 STRAFE"}, {"property": "og:description", "content": "Choose your STRAFE mode, category, difficulty and round timer."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
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
  const [settings] = useSettings();
  const lang = settings.language;
  const initial = Route.useSearch().mode;
  const [mode, setMode] = useState<Mode>(initial ?? "classic");
  const [pool, setPool] = useState<Pool>("world");
  const [difficulty, setDiff] = useState<Difficulty>("medium");
  const [practice, setPractice] = useState(false);
  const [time, setTime] = useState<TimeLimit>(30);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-5 pb-8 pt-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display mb-6 text-5xl">{t(lang, "pickGame")}</h1>
          <ModeCarousel lang={lang} mode={mode} setMode={setMode} />

          <div className="plate mt-4 space-y-5 p-6">
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">{t(lang, "category")}</p>
              <div className="seg">{pools.map((p) => <Chip key={p.id} on={pool === p.id} onClick={() => setPool(p.id)}>{t(lang, p.id)}</Chip>)}</div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">{t(lang, "difficulty")}</p>
              <div className="seg">{diffs.map((d) => <Chip key={d} on={difficulty === d} onClick={() => setDiff(d)}>{t(lang, d)}</Chip>)}</div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">{t(lang, "timePerRound")}</p>
              <div className="seg">{TIME_OPTIONS.map((t) => <Chip key={t} on={time === t} onClick={() => setTime(t)}>{t}s</Chip>)}</div>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} className="h-5 w-5 accent-[var(--color-foreground)]" />
              {t(lang, "practiceNote")}
            </label>
            <Link to="/game/$mode" params={{ mode }} search={practice ? { pool, difficulty, time, practice: 1 } : { pool, difficulty, time }} className="btn btn-primary px-10 py-4 text-lg">
              {t(lang, "startMode", { mode: t(lang, mode) })}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Arrow({ dir, onClick, lang }: { lang: Lang; dir: "left" | "right"; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={t(lang, dir === "left" ? "previousModes" : "nextModes")}
      className={`absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted ${dir === "left" ? "-left-3" : "-right-3"}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}

function ModeCarousel({ mode, setMode, lang }: { lang: Lang; mode: Mode; setMode: (m: Mode) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setL] = useState(false);
  const [canR, setR] = useState(false);
  const update = () => {
    const el = ref.current; if (!el) return;
    setL(el.scrollLeft > 4);
    setR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const go = (d: number) => { const el = ref.current; if (el) el.scrollBy({ left: d * el.clientWidth * 0.85, behavior: "smooth" }); };
  return (
    <div className="relative">
      {canL && <Arrow lang={lang} dir="left" onClick={() => go(-1)} />}
      {canR && <Arrow lang={lang} dir="right" onClick={() => go(1)} />}
      <div ref={ref} onScroll={update} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 py-1 md:mx-0 md:px-0">
        {modeIds.map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`plate w-[82%] shrink-0 snap-start p-6 text-left transition-colors sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] ${mode === m ? "ring-1 ring-foreground" : "hover:bg-muted/50"}`}>
            <span className="text-xs opacity-70">{t(lang, `${m}Tag`)}</span>
            <h2 className="font-display mt-2 text-4xl">{t(lang, m)}</h2>
            <p className="mt-2 text-sm opacity-80">{t(lang, `${m}Blurb`)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
