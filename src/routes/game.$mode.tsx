import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameMap } from "@/components/GameMap";
import { Logo } from "@/components/SiteHeader";
import {
  BOTS, MAX_POINTS, MODES, ROUNDS, botGuess, dailyRounds, distanceKm, formatDistance, pickRounds, poolFor, saveRecent,
  promptFor, scoreFor, shrinkCenter, shrinkRadius, timeMultiplier, TIME_OPTIONS, type TimeLimit, type Difficulty, type LatLng, type Mode, type Pool,
} from "@/lib/game/engine";
import type { Location } from "@/lib/game/locations";
import { saveRecord, useSettings } from "@/lib/game/storage";
import { Flag } from "@/components/Flag";
import { blip, buzz } from "@/lib/game/sound";
import { renderCard, shareCard, type CardData } from "@/lib/game/shareCard";
import { applyMatchResult } from "@/lib/rank";

interface Search { pool?: Pool | undefined; difficulty?: Difficulty | undefined; daily?: 1 | undefined; practice?: 1 | undefined; time?: TimeLimit | undefined; ranked?: 1 | undefined }
const MODE_IDS = Object.keys(MODES) as Mode[];

export const Route = createFileRoute("/game/$mode")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    pool: ["world", "capitals", "countries", "landmarks"].includes(s["pool"] as string) ? (s["pool"] as Pool) : undefined,
    difficulty: ["easy", "medium", "hard", "expert"].includes(s["difficulty"] as string) ? (s["difficulty"] as Difficulty) : undefined,
    daily: s["daily"] ? 1 : undefined,
    practice: s["practice"] ? 1 : undefined,
    time: TIME_OPTIONS.includes(Number(s["time"]) as TimeLimit) ? (Number(s["time"]) as TimeLimit) : undefined,
    ranked: s["ranked"] ? 1 : undefined,
  }),
  beforeLoad: ({ params }) => { if (!MODE_IDS.includes(params.mode as Mode)) throw notFound(); },
  head: ({ params }) => {
    const m = MODES[params.mode as Mode];
    const t = m ? `${m.name} — STRAFE` : "Game — STRAFE";
    return { meta: [
      { title: t },
      { name: "description", content: m?.blurb ?? "Play STRAFE." },
      { property: "og:title", content: t },
      { property: "og:description", content: m?.blurb ?? "Play STRAFE." },
    ] };
  },
  component: GamePage,
});

interface Bot { name: string; guess: LatLng; km: number; points: number }
interface Result { loc: Location; guess: LatLng | null; km: number | null; points: number; mult?: number | undefined; bots?: Bot[] | undefined }

function GamePage() {
  const { mode: modeParam } = Route.useParams();
  const mode = modeParam as Mode;
  const search = Route.useSearch();
  const [settings] = useSettings();
  const pool = search.pool ?? "world";
  const difficulty = search.difficulty ?? "medium";
  const daily = !!search.daily;
  const practice = !!search.practice && !daily;
  const ranked = !!search.ranked;
  const blind = mode === "blind";
  const limit: number = search.time ?? 30;

  const [seed, setSeed] = useState(0);
  const [rounds, setRounds] = useState<Location[]>([]);
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [phase, setPhase] = useState<"guess" | "reveal" | "done">("guess");
  const [results, setResults] = useState<Result[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [center, setCenter] = useState<LatLng | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [promptCollapsed, setPromptCollapsed] = useState(false);
  const [eloChange, setEloChange] = useState<number | null>(null);
  const saved = useRef(false);

  useEffect(() => {
    const list = daily ? dailyRounds() : pickRounds(poolFor(pool, difficulty), ROUNDS);
    setRounds(list); setIdx(0); setGuess(null); setPhase("guess"); setResults([]); saved.current = false;
  }, [seed, daily, pool, difficulty, mode]);

  useEffect(() => { setPromptCollapsed(false); }, [idx, seed]);

  const loc = rounds[idx];

  useEffect(() => {
    if (!loc) return;
    setElapsed(0);
    if (mode === "shrink") setCenter(shrinkCenter(loc));
  }, [mode, loc]);

  const radius = shrinkRadius(elapsed, limit);

  const submit = useCallback(() => {
    if (phase !== "guess" || !loc) return;
    const km = guess ? distanceKm(guess, loc) : null;
    let points = km === null ? 0 : scoreFor(km);
    let mult: number | undefined;
    if (mode === "shrink") { mult = timeMultiplier(elapsed, limit); points = Math.round(points * mult); }
    const bots = mode === "closest" ? BOTS.map((b) => {
      const g = botGuess(loc, b.meanKm); const d = distanceKm(g, loc);
      return { name: b.name, guess: g, km: d, points: scoreFor(d) };
    }) : undefined;
    setResults((r) => [...r, { loc, guess, km, points, mult, bots }]);
    setPhase("reveal");
    buzz(10);
    blip(settings.sound, points > 3500 ? 880 : points > 1000 ? 660 : 330, 140);
  }, [phase, loc, guess, mode, elapsed, settings.sound]);

  const submitRef = useRef(submit);
  submitRef.current = submit;

  useEffect(() => {
    if (phase !== "guess" || !loc) return;
    const start = performance.now();
    const t = setInterval(() => {
      const e = (performance.now() - start) / 1000;
      setElapsed(Math.min(e, limit));
      if (e >= limit) { clearInterval(t); setTimeout(() => submitRef.current(), 0); }
    }, 100);
    return () => clearInterval(t);
  }, [phase, loc, limit]);

  useEffect(() => {
    if (mode === "shrink" && phase === "guess" && guess && center && distanceKm(guess, center) > radius) {
      setGuess(null); setFlash("The zone closed over your pin — place it again.");
    }
  }, [radius, guess, center, mode, phase]);

  useEffect(() => {
    if (phase !== "guess" || settings.promptCollapseSeconds <= 0) return;
    const t = setTimeout(() => setPromptCollapsed(true), settings.promptCollapseSeconds * 1000);
    return () => clearTimeout(t);
  }, [phase, idx, settings.promptCollapseSeconds]);
  useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 2200); return () => clearTimeout(t); }, [flash]);

  const pick = useCallback((p: LatLng) => {
    if (phase !== "guess") return;
    if (mode === "shrink" && center && distanceKm(p, center) > shrinkRadius(elapsed, limit)) {
      setFlash("Outside the zone. Pin inside the circle."); return;
    }
    setGuess(p); blip(settings.sound, 520, 50); buzz(10);
  }, [phase, mode, center, elapsed, limit, settings.sound]);

  const next = () => {
    if (practice && idx + 1 >= rounds.length) {
      setRounds((r) => [...r, ...pickRounds(poolFor(pool, difficulty), ROUNDS, Math.random, r.slice(-10).map((x) => x.id))]);
    } else if (!practice && idx + 1 >= ROUNDS) { setPhase("done"); return; }
    setIdx((i) => i + 1); setGuess(null); setPhase("guess");
  };

  const total = results.reduce((a, r) => a + r.points, 0);

  const keyRef = useRef({ submit, next, phase, guess });
  keyRef.current = { submit, next, phase, guess };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const k = keyRef.current;
      if (k.phase === "guess" && k.guess) { e.preventDefault(); k.submit(); }
      else if (k.phase === "reveal") { e.preventDefault(); k.next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // save record + update ELO if ranked
  useEffect(() => {
    if (phase !== "done" || practice || saved.current) return;
    saved.current = true;
    saveRecord({
      id: crypto.randomUUID(), player: settings.name || "Guest", mode, daily, date: new Date().toISOString(),
      score: total, max: MAX_POINTS * ROUNDS, rounds: results.map((r) => ({ km: r.km, points: r.points })),
    });
    if (results.length) saveRecent(results.map((r) => r.loc.id));

    if (ranked) {
      // Simple win/loss based on score threshold
      const avg = total / results.length;
      const result = avg >= 3000 ? "win" : avg >= 1500 ? "draw" : "loss";
      const { change } = applyMatchResult(result, 1000);
      setEloChange(change);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const standings = useMemo(() => {
    if (mode !== "closest") return [];
    const t: Record<string, { pts: number; wins: number; km: number }> = {};
    const add = (n: string, pts: number, km: number | null, win: boolean) => {
      t[n] ??= { pts: 0, wins: 0, km: 0 }; t[n].pts += pts; t[n].km += km ?? 20000; if (win) t[n].wins++;
    };
    for (const r of results) {
      const all = [{ n: settings.name || "You", km: r.km, p: r.points }, ...(r.bots ?? []).map((b) => ({ n: b.name, km: b.km, p: b.points }))];
      const best = Math.min(...all.map((a) => a.km ?? Infinity));
      all.forEach((a) => add(a.n, a.p, a.km, a.km === best));
    }
    return Object.entries(t).sort((a, b) => b[1].pts - a[1].pts);
  }, [results, mode, settings.name]);

  if (!loc) return <div className="grid min-h-screen place-items-center font-semibold text-muted-foreground">Preparing rounds…</div>;

  const last = results[results.length - 1];
  const prompt = promptFor(loc);
  const showHint = difficulty === "easy" || difficulty === "medium";
  const roundLabel = practice ? `Practice · ${idx + 1}` : `Round ${Math.min(idx + 1, ROUNDS)} / ${ROUNDS}`;

  if (phase === "done") {
    const errs = results.map((r) => r.km).filter((x): x is number => x !== null);
    const best = results.reduce((b, r, i) => (r.points > results[b]!.points ? i : b), 0);
    const share = `STRAFE · ${MODES[mode].name}${daily ? " · Daily " + new Date().toISOString().slice(0, 10) : ""}\n${total.toLocaleString()} / ${(MAX_POINTS * ROUNDS).toLocaleString()}\n${results.map((r) => (r.points >= 4000 ? "🟩" : r.points >= 2000 ? "🟨" : r.points > 0 ? "🟧" : "⬜")).join("")}`;
    return (
      <div className="min-h-screen px-5 pb-16">
        <div className="mx-auto max-w-4xl py-5"><Logo /></div>
        <main className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold text-muted-foreground">{MODES[mode].name}{daily && " · Daily challenge"}{ranked && " · Ranked"} · Final</p>
          <h1 className="font-display mt-2 text-[clamp(4rem,16vw,8rem)]">{total.toLocaleString()}</h1>
          <p className="mt-2 font-semibold text-muted-foreground">out of {(MAX_POINTS * ROUNDS).toLocaleString()}</p>
          {ranked && eloChange !== null && (
            <p className={`mt-2 text-lg font-semibold ${eloChange >= 0 ? "text-positive" : "text-destructive"}`}>
              ELO {eloChange >= 0 ? "+" : ""}{eloChange}
            </p>
          )}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Box k="Accuracy" v={`${Math.round((total / (MAX_POINTS * ROUNDS)) * 100)}%`} />
            <Box k="Avg error" v={errs.length ? formatDistance(errs.reduce((a, b) => a + b, 0) / errs.length, settings.unit) : "—"} />
            <Box k="Best round" v={`R${best + 1} · ${results[best]!.points.toLocaleString()}`} />
            <Box k="Closest pin" v={errs.length ? formatDistance(Math.min(...errs), settings.unit) : "—"} />
          </div>
          {mode === "closest" && <Standings rows={standings} />}
          <div className="plate mt-4 divide-y">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-6 py-4">
                <div><p className="text-xs font-semibold text-muted-foreground">Round {i + 1}</p><p className="font-semibold">{r.loc.name}, {r.loc.country}</p></div>
                <div className="text-right"><p className="font-display text-2xl">{r.points.toLocaleString()}</p><p className="text-xs text-muted-foreground">{r.km === null ? "No guess" : formatDistance(r.km, settings.unit)}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {!daily && <button onClick={() => setSeed((s) => s + 1)} className="btn btn-primary">Play again</button>}
            <StoryButton data={{
              mode: MODES[mode].name, tag: daily ? "Daily challenge" : `${MODES[mode].name} · ${difficulty}`,
              total, max: MAX_POINTS * ROUNDS,
              avgKm: errs.length ? formatDistance(errs.reduce((a, b) => a + b, 0) / errs.length, settings.unit) : "—",
              perfects: results.filter((r) => r.km !== null && r.km <= 25).length,
              rounds: results.map((r) => ({ name: r.loc.name, points: r.points, km: r.km, guess: r.guess, target: { lat: r.loc.lat, lng: r.loc.lng } })),
              url: "strafemap.lovable.app",
            }} />
            <button onClick={() => { navigator.clipboard?.writeText(share).then(() => setCopied(true)); }} className="btn btn-ink">{copied ? "Copied!" : "Copy result"}</button>
            {ranked ? <Link to="/rank" className="btn btn-outline">Back to Rank</Link> : <Link to="/play" className="btn btn-outline">Change mode</Link>}
            <Link to="/" className="btn btn-outline">Menu</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="rounded-full border border-border bg-card px-3 py-1.5">{MODES[mode].name}{daily && " · Daily"}{ranked && " · Ranked"}</span>
          <span className="readout rounded-full border border-border bg-card px-3 py-1.5">{roundLabel}</span>
          <span className="readout rounded-full bg-foreground px-3 py-1.5 text-primary">{total.toLocaleString()} pts</span>
          {practice && <button onClick={() => setPhase("done")} className="rounded-full bg-card px-3 py-1.5 hover:bg-primary-pale">End</button>}
        </div>
      </header>

      <div className="relative mx-2 mb-2 flex-1 overflow-hidden rounded-2xl md:mx-4 md:mb-4">
        <GameMap
          blind={blind && phase === "guess"}
          guess={guess}
          target={phase === "reveal" ? loc : null}
          others={phase === "reveal" ? last?.bots?.map((b) => ({ ...b.guess, label: b.name })) ?? [] : []}
          circle={mode === "shrink" && phase === "guess" && center ? { center, radiusKm: radius } : null}
          locked={phase !== "guess"}
          onPick={pick}
          resetKey={`${seed}-${idx}`}
        />

        <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex justify-center">
          <button
            type="button"
            aria-expanded={!promptCollapsed}
            onClick={() => { setPromptCollapsed((c) => !c); buzz(8); }}
            className={`clue-pill glass-plate font-clue pointer-events-auto max-w-[min(30rem,100%)] select-none text-left ${promptCollapsed ? "rounded-full px-3 py-2" : "rounded-[20px] px-4 pt-3.5 pb-5"}`}
          >
            <div className={`flex ${promptCollapsed ? "items-center gap-2" : "items-end gap-3.5"}`}>
              <Flag country={loc.country} size={promptCollapsed ? 26 : 44} className={`clue-flag ${promptCollapsed ? "" : "mb-1.5"}`} />
              <div className={`min-w-0 ${promptCollapsed ? "" : "flex-1"}`}>
                <div className={`clue-reveal ${promptCollapsed ? "clue-hide" : ""}`}>
                  <div className="overflow-hidden">
                    <p className="mb-3 text-[11px] font-medium leading-[1.35] text-muted-foreground">{prompt.verb}{blind && " · labels hidden"}</p>
                  </div>
                </div>
                <p className={`leading-[1.15] transition-[font-size] duration-300 ${promptCollapsed ? "truncate text-[15px] font-semibold" : "text-[26px] font-semibold md:text-[30px]"}`}>{loc.name}</p>
              </div>
              <div className={`flex shrink-0 items-center gap-2 ${promptCollapsed ? "" : "mb-1"}`}>
                {phase === "guess" && (
                  <span className="readout rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold tabular-nums">
                    {Math.ceil(limit - elapsed)}s
                  </span>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className={`opacity-60 transition-transform duration-300 ${promptCollapsed ? "" : "rotate-180"}`}><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>
            {(loc.category !== "country" || phase === "guess") && (
              <div className={`clue-reveal ${promptCollapsed ? "clue-hide" : ""}`}>
                <div className="overflow-hidden">
                  <div className="mt-2.5 border-t border-border pt-2.5">
                    {loc.category !== "country" && <p className="text-[13px] leading-relaxed text-muted-foreground">{loc.country}{showHint && loc.hint ? ` · ${loc.hint}` : ""}</p>}
                    {phase === "guess" && (
                      <div className={`h-[2px] overflow-hidden rounded-full bg-muted ${loc.category !== "country" ? "mt-2.5" : ""}`}>
                        <div className="h-full bg-foreground/85 transition-[width] duration-100" style={{ width: `${100 - (elapsed / limit) * 100}%` }} />
                      </div>
                    )}
                    {mode === "shrink" && phase === "guess" && <p className="readout mt-2 text-[11px] text-muted-foreground">zone {Math.round(radius).toLocaleString()} km · bonus ×{timeMultiplier(elapsed, limit).toFixed(2)}</p>}
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>

        {flash && <div className="absolute left-1/2 top-40 z-[600] -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-primary">{flash}</div>}

        <div className="absolute inset-x-3 bottom-6 z-[500] flex justify-center">
          {phase === "guess" ? (
            <button onClick={submit} disabled={!guess} className="btn btn-primary flex-col gap-1 px-10 py-3.5 text-lg">
              {guess ? (
                <>
                  <span className="flex items-center gap-2">Confirm guess <kbd className="hidden rounded-full bg-foreground/10 px-2 py-0.5 text-xs md:inline">Space</kbd></span>
                  <span className="readout text-xs font-medium opacity-60">{guess.lat.toFixed(4)}, {guess.lng.toFixed(4)}</span>
                </>
              ) : "Click the map to pin"}
            </button>
          ) : last && (
            <div className="plate w-full max-w-lg p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{last.loc.name}, {last.loc.country}</p>
                  <p className="font-display readout mt-1 text-5xl">+{last.points.toLocaleString()}</p>
                </div>
                <div className="text-right text-sm font-semibold">
                  <p>{last.km === null ? "No guess" : formatDistance(last.km, settings.unit) + " off"}</p>
                  {last.mult !== undefined && <p className="text-muted-foreground">time ×{last.mult.toFixed(2)}</p>}
                </div>
              </div>
              {last.bots && (
                <ol className="mt-3 space-y-1 text-sm">
                  {[{ name: settings.name || "You", km: last.km ?? Infinity, points: last.points }, ...last.bots].sort((a, b) => a.km - b.km).map((p, i) => (
                    <li key={p.name} className={`flex justify-between rounded-full px-3 py-1 ${i === 0 ? "bg-primary-pale font-semibold" : ""}`}>
                      <span>{i + 1}. {p.name}</span><span>{Number.isFinite(p.km) ? formatDistance(p.km, settings.unit) : "—"} · {p.points.toLocaleString()}</span>
                    </li>
                  ))}
                </ol>
              )}
              <button onClick={next} className="btn btn-ink mt-4 w-full">
                {!practice && idx + 1 >= ROUNDS ? "See results" : "Next round"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function Box({ k, v }: { k: string; v: string }) {
  return <div className="plate p-5"><p className="font-display text-2xl md:text-3xl">{v}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{k}</p></div>;
}

function Standings({ rows }: { rows: [string, { pts: number; wins: number; km: number }][] }) {
  return (
    <div className="plate-ink mt-4 p-6">
      <p className="text-sm font-semibold opacity-80">Closest Wins · standings (bots are simulated locally)</p>
      <ol className="mt-3 space-y-2">
        {rows.map(([n, s], i) => (
          <li key={n} className="flex justify-between font-semibold"><span>{i + 1}. {n}</span><span>{s.wins} wins · {s.pts.toLocaleString()} pts</span></li>
        ))}
      </ol>
    </div>
  );
}

function StoryButton({ data }: { data: CardData }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        setBusy(true);
        try {
          const canvas = await renderCard(data);
          await shareCard(canvas);
          setDone(true);
        } finally { setBusy(false); }
      }}
      disabled={busy}
      className="btn btn-outline"
    >
      {busy ? "Creating…" : done ? "Shared!" : "Share card"}
    </button>
  );
}
