import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameMap } from "@/components/GameMap";
import { Logo } from "@/components/SiteHeader";
import {
  BOTS,
  MAX_POINTS,
  MODES,
  ROUNDS,
  SIN_CARDS,
  TIME_OPTIONS,
  botGuess,
  compassWhisperFor,
  dailyRounds,
  distanceKm,
  evaluateSinScore,
  formatDistance,
  generateQuizChoices,
  pickRounds,
  poolFor,
  saveRecent,
  scoreFor,
  shrinkCenter,
  shrinkRadius,
  timeMultiplier,
  type Difficulty,
  type LatLng,
  type Mode,
  type Pool,
  type SinCardId,
  type TimeLimit,
} from "@/lib/game/engine";
import type { Location } from "@/lib/game/locations";
import { saveRecord, useSettings, loadRecords } from "@/lib/game/storage";
import { SmartClue } from "@/components/SmartClue";
import { blip, buzz } from "@/lib/game/sound";
import type { CardData, CardTemplate } from "@/lib/game/shareCard";
import { t, type Lang } from "@/lib/i18n";
import { applyMatchResult, loadRank, type RankStep } from "@/lib/rank";
import { COMMUNITY_PLAYERS, addPlayerExp, awardCoins, useSocialProfile } from "@/lib/social";
import { ACH_ALL, syncAchievements } from "@/lib/achievements";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { useMapStyle, useResolvedMapStyle } from "@/lib/theme";
import type { OpenFreeMapStyleId } from "@/lib/map/types";
import { GameHud } from "@/components/game/GameHud";
import { RoundReveal } from "@/components/game/RoundReveal";
import { GameSummary } from "@/components/game/GameSummary";
import { GameSettingsPanel } from "@/components/game/GameSettingsPanel";

const AUTO_NEXT_SECONDS = 5;

interface Search {
  pool?: Pool | undefined;
  difficulty?: Difficulty | undefined;
  daily?: 1 | undefined;
  practice?: 1 | undefined;
  time?: TimeLimit | undefined;
  ranked?: 1 | undefined;
  sin?: SinCardId | undefined;
  zone?: string | undefined;
}
const MODE_IDS = Object.keys(MODES) as Mode[];
const DIFF_IDS: Difficulty[] = ["easy", "medium", "hard", "expert", "hardcore"];
const SIN_IDS: SinCardId[] = ["pride", "greed", "wrath", "envy", "lust", "gluttony", "sloth"];

export const Route = createFileRoute("/game/$mode")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    pool: ["world", "capitals", "countries", "landmarks", "stadiums", "wonders", "attractions"].includes(
      s["pool"] as string,
    )
      ? (s["pool"] as Pool)
      : undefined,
    difficulty: DIFF_IDS.includes(s["difficulty"] as Difficulty)
      ? (s["difficulty"] as Difficulty)
      : undefined,
    daily: s["daily"] ? 1 : undefined,
    practice: s["practice"] ? 1 : undefined,
    time: TIME_OPTIONS.includes(Number(s["time"]) as TimeLimit)
      ? (Number(s["time"]) as TimeLimit)
      : undefined,
    ranked: s["ranked"] ? 1 : undefined,
    sin: SIN_IDS.includes(s["sin"] as SinCardId) ? (s["sin"] as SinCardId) : undefined,
    zone: typeof s["zone"] === "string" ? s["zone"] : undefined,
  }),
  beforeLoad: ({ params }) => {
    if (!MODE_IDS.includes(params.mode as Mode)) throw notFound();
  },
  head: ({ params }) => {
    const m = MODES[params.mode as Mode];
    const title = m ? `${m.name} — STRAFE` : "Game — STRAFE";
    return {
      meta: [
        { title },
        { name: "description", content: m?.blurb ?? "Play STRAFE." },
        { property: "og:title", content: title },
        { property: "og:description", content: m?.blurb ?? "Play STRAFE." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: GamePage,
});

interface Bot {
  name: string;
  guess: LatLng;
  km: number;
  points: number;
}
interface Result {
  loc: Location;
  guess: LatLng | null;
  guess2?: LatLng | null;
  km: number | null;
  points: number;
  mult?: number | undefined;
  sinNote?: string | undefined;
  bots?: Bot[] | undefined;
}

function GamePage() {
  const { mode: modeParam } = Route.useParams();
  const mode = modeParam as Mode;
  const search = Route.useSearch();
  const [settings, setSettings] = useSettings();
  const [social] = useSocialProfile();
  const lang = settings.language;
  const tr = (key: string, values: Record<string, string | number> = {}) => t(lang, key, values);
  const pool = search.pool ?? "world";
  const difficulty = search.difficulty ?? "medium";
  const daily = !!search.daily;
  const practice = !!search.practice && !daily;
  const ranked = !!search.ranked;
  const isHardcore = difficulty === "hardcore";
  const [customBlind, setCustomBlind] = useState<boolean | null>(null);
  const defaultBlind = mode === "blind" || mode === "findCity" || isHardcore;
  const blind = customBlind !== null ? customBlind : defaultBlind;
  const rawLimit: number = search.time !== undefined ? search.time : isHardcore ? 15 : 30;
  const unlimitedTime = rawLimit === 0 && mode !== "shrink";
  const limit = unlimitedTime ? 0 : rawLimit || 30;
  const [, setMapStylePref] = useMapStyle();
  const resolvedStyle = useResolvedMapStyle();
  const [activeMapStyle, setActiveMapStyle] = useState<OpenFreeMapStyleId>(resolvedStyle);

  useEffect(() => {
    setActiveMapStyle(resolvedStyle);
  }, [resolvedStyle]);

  // 7 Deadly Sins state
  const [activeSin, setActiveSin] = useState<SinCardId>(search.sin ?? "pride");
  const [sinConfirmed, setSinConfirmed] = useState<boolean>(mode !== "sins" || Boolean(search.sin));
  const [sinCountdown, setSinCountdown] = useState(30);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [greedChargesLeft, setGreedChargesLeft] = useState(2);
  const [placingSecondPin, setPlacingSecondPin] = useState(false);
  const [guess2, setGuess2] = useState<LatLng | null>(null);
  const [gluttonyStreak, setGluttonyStreak] = useState(0);

  // 30s countdown for 7 Deadly Sins card selection drawer
  useEffect(() => {
    if (mode !== "sins" || sinConfirmed) return;
    const timer = setInterval(() => {
      setSinCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSinConfirmed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, sinConfirmed]);

  const todayKeyStr = useMemo(() => {
    const d = new Date();
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  }, []);

  const existingDailyRecord = useMemo(() => {
    if (!daily) return null;
    const records = loadRecords();
    return records.find((r) => r.daily && (r.date === todayKeyStr || r.seed === todayKeyStr)) ?? null;
  }, [daily, todayKeyStr]);

  const [seed, setSeed] = useState(0);
  const [rounds, setRounds] = useState<Location[]>([]);
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"guess" | "reveal" | "done">("guess");
  const [results, setResults] = useState<Result[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [center, setCenter] = useState<LatLng | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [promptCollapsed, setPromptCollapsed] = useState(false);
  const [eloChange, setEloChange] = useState<number | null>(null);
  const [rankAfter, setRankAfter] = useState<RankStep | null>(null);
  const [newAch, setNewAch] = useState<string[]>([]);
  const saved = useRef(false);
  const navigate = useNavigate();
  const [quitModalOpen, setQuitModalOpen] = useState(false);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const [expandedSinId, setExpandedSinId] = useState<SinCardId | null>(null);

  // Ranked Opponent Rival
  const opponent = useMemo(() => {
    const myRank = loadRank();
    const sorted = [...COMMUNITY_PLAYERS].sort(
      (a, b) => Math.abs(a.rp - myRank.rp) - Math.abs(b.rp - myRank.rp),
    );
    return sorted[seed % sorted.length] ?? COMMUNITY_PLAYERS[0]!;
  }, [seed]);

  // Intercept logo / exit during active gameplay
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (phase !== "done") {
        setQuitModalOpen(true);
      } else {
        navigate({ to: "/play" });
      }
    },
    [phase, navigate],
  );

  const handleConfirmQuit = useCallback(() => {
    if (phase !== "done" && !saved.current && !practice) {
      saved.current = true;
      if (daily) {
        // Record 0 points forfeit for today's daily briefing so it cannot be retried/exploited
        saveRecord({
          id: crypto.randomUUID(),
          player: social.nickname || settings.name || "Guest",
          mode,
          daily: true,
          date: todayKeyStr,
          seed: todayKeyStr,
          score: 0,
          max: MAX_POINTS * ROUNDS,
          rounds: [],
        });
      } else if (ranked) {
        applyMatchResult("loss", 0, {
          opponentName: opponent.nickname,
          opponentTag: opponent.clanTag ?? "RIV",
          opponentRp: opponent.rp,
          myRoundsWon: 0,
          oppRoundsWon: ROUNDS,
        });
      }
    }
    setQuitModalOpen(false);
    navigate({ to: "/play" });
  }, [phase, practice, daily, ranked, social.nickname, settings.name, mode, todayKeyStr, opponent, navigate]);

  useEffect(() => {
    if (phase === "done" || practice) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [phase, practice]);

  useEffect(() => {
    const list = daily ? dailyRounds() : pickRounds(poolFor(pool, difficulty, mode), ROUNDS);
    setRounds(list);
    setIdx(0);
    setGuess(null);
    setGuess2(null);
    setQuizSelected(null);
    setGreedChargesLeft(2);
    setGluttonyStreak(0);
    setPhase("guess");
    setResults([]);
    saved.current = false;
  }, [seed, daily, pool, difficulty, mode]);

  useEffect(() => {
    setPromptCollapsed(false);
    setPlacingSecondPin(false);
    setGuess2(null);
    setQuizSelected(null);
  }, [idx, seed]);

  const loc = rounds[idx];

  const quizChoices = useMemo(() => {
    if (mode !== "quiz" || !loc) return [];
    return generateQuizChoices(loc, search.zone ?? "Global");
  }, [mode, loc, search.zone]);

  useEffect(() => {
    if (!loc) return;
    setElapsed(0);
    if (mode === "shrink") setCenter(shrinkCenter(loc));
  }, [mode, loc]);

  const radius = shrinkRadius(elapsed, limit || 30);

  const submit = useCallback(
    (overrideGuess?: LatLng | null, quizAnswer?: string) => {
      if (phase !== "guess" || !loc) return;
      const primaryGuess = overrideGuess !== undefined ? overrideGuess : guess;

      let km: number | null = primaryGuess ? distanceKm(primaryGuess, loc) : null;
      let usedSecondPin = false;
      if (mode === "sins" && activeSin === "greed" && guess2) {
        const km2 = distanceKm(guess2, loc);
        usedSecondPin = true;
        if (km === null || km2 < km) km = km2;
      }

      let points = km === null ? 0 : scoreFor(km);
      let mult: number | undefined;
      let sinNote: string | undefined;

      if (mode === "quiz") {
        const chosen = quizAnswer ?? quizSelected;
        const isCorrect = chosen === loc.country;
        km = isCorrect ? 0 : 4500;
        const speedBonus = limit > 0 ? Math.round(1000 * Math.max(0, 1 - elapsed / limit)) : 500;
        points = isCorrect ? 4000 + speedBonus : 0;
      } else if (mode === "shrink") {
        mult = timeMultiplier(elapsed, limit || 30);
        points = Math.round(points * mult);
      } else if (mode === "sins") {
        const prevPts = results.length > 0 ? results[results.length - 1]!.points : null;
        const evalRes = evaluateSinScore({
          sin: activeSin,
          km,
          usedSecondPin,
          elapsed,
          limit: limit || 30,
          prevRoundPoints: prevPts,
          gluttonyStreak,
        });
        points = evalRes.points;
        sinNote = evalRes.note;
        setGluttonyStreak(evalRes.nextGluttonyStreak);
      }

      const bots: Bot[] | undefined =
        mode === "closest"
          ? BOTS.map((b) => {
              const g = botGuess(loc, b.meanKm);
              const d = distanceKm(g, loc);
              return { name: b.name, guess: g, km: d, points: scoreFor(d) };
            })
          : ranked
            ? [
                (() => {
                  const meanKm = Math.max(180, 1800 - opponent.rp * 0.18);
                  const g = botGuess(loc, meanKm);
                  const d = distanceKm(g, loc);
                  return {
                    name: `${opponent.clanTag ? `[${opponent.clanTag}] ` : ""}${opponent.nickname}`,
                    guess: g,
                    km: d,
                    points: scoreFor(d),
                  };
                })(),
              ]
            : undefined;

      setResults((r) => [...r, { loc, guess: primaryGuess, guess2, km, points, mult, sinNote, bots }]);
      setPhase("reveal");
      buzz(10);
      blip(settings.sound, points > 3500 ? 880 : points > 1000 ? 660 : 330, 140);
    },
    [
      phase,
      loc,
      guess,
      guess2,
      mode,
      activeSin,
      elapsed,
      limit,
      results,
      gluttonyStreak,
      quizSelected,
      ranked,
      opponent,
      settings.sound,
    ],
  );

  const submitRef = useRef(submit);
  submitRef.current = submit;

  useEffect(() => {
    if (phase !== "guess" || !loc || !sinConfirmed || unlimitedTime) return;
    const start = performance.now();
    const timer = setInterval(() => {
      const e = (performance.now() - start) / 1000;
      setElapsed(Math.min(e, limit));
      if (e >= limit) {
        clearInterval(timer);
        setTimeout(() => submitRef.current(), 0);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [phase, loc, limit, sinConfirmed, unlimitedTime]);

  useEffect(() => {
    if (mode === "shrink" && phase === "guess" && guess && center && distanceKm(guess, center) > radius) {
      setGuess(null);
      setFlash(t(lang, "zoneClosed"));
    }
  }, [radius, guess, center, mode, phase, lang]);

  useEffect(() => {
    if (phase !== "guess" || settings.promptCollapseSeconds <= 0) return;
    const timer = setTimeout(() => setPromptCollapsed(true), settings.promptCollapseSeconds * 1000);
    return () => clearTimeout(timer);
  }, [phase, idx, settings.promptCollapseSeconds]);

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(timer);
  }, [flash]);

  const pick = useCallback(
    (p: LatLng) => {
      if (phase !== "guess") return;
      // Wrath Sin Card locks pin immediately after first placement
      if (mode === "sins" && activeSin === "wrath" && guess !== null) {
        setFlash("Wrath snap lock: pin locked");
        return;
      }
      if (mode === "shrink" && center && distanceKm(p, center) > shrinkRadius(elapsed, limit || 30)) {
        setFlash(t(lang, "outsideZone"));
        return;
      }
      if (mode === "sins" && activeSin === "greed" && placingSecondPin && greedChargesLeft > 0) {
        setGuess2(p);
        setGreedChargesLeft((c) => Math.max(0, c - 1));
        setPlacingSecondPin(false);
        blip(settings.sound, 640, 50);
        buzz(10);
        return;
      }
      setGuess(p);
      blip(settings.sound, 520, 50);
      buzz(10);
    },
    [phase, mode, activeSin, guess, center, elapsed, limit, placingSecondPin, greedChargesLeft, settings.sound, lang],
  );

  const next = () => {
    if (practice && idx + 1 >= rounds.length) {
      setRounds((r) => [
        ...r,
        ...pickRounds(
          poolFor(pool, difficulty, mode),
          ROUNDS,
          Math.random,
          r.slice(-10).map((x) => x.id),
        ),
      ]);
    } else if (!practice && idx + 1 >= ROUNDS) {
      setPhase("done");
      return;
    }
    setIdx((i) => i + 1);
    setGuess(null);
    setGuess2(null);
    setPhase("guess");
  };

  const total = results.reduce((a, r) => a + r.points, 0);

  // Reveal auto-advances after a short countdown.
  const [revealLeft, setRevealLeft] = useState(AUTO_NEXT_SECONDS);
  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    if (phase !== "reveal") return;
    const start = performance.now();
    setRevealLeft(AUTO_NEXT_SECONDS);
    const id = window.setInterval(() => {
      const left = AUTO_NEXT_SECONDS - (performance.now() - start) / 1000;
      if (left <= 0) {
        window.clearInterval(id);
        nextRef.current();
        return;
      }
      setRevealLeft(left);
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, idx]);

  const [floaters, setFloaters] = useState<{ id: number; e: string; x: number }[]>([]);
  const react = (e: string) => {
    const id = Date.now() + Math.random();
    setFloaters((f) => [...f.slice(-8), { id, e, x: Math.random() * 60 - 30 }]);
    buzz(6);
    window.setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1600);
  };

  const keyRef = useRef({ submit, next, phase, guess });
  keyRef.current = { submit, next, phase, guess };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl && (targetEl.tagName === "INPUT" || targetEl.tagName === "TEXTAREA" || targetEl.isContentEditable))
        return;
      const k = keyRef.current;
      if (k.phase === "guess" && k.guess) {
        e.preventDefault();
        k.submit();
      } else if (k.phase === "reveal") {
        e.preventDefault();
        k.next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // save record + update ELO if ranked
  useEffect(() => {
    if (phase !== "done" || practice || saved.current) return;
    saved.current = true;
    saveRecord({
      id: crypto.randomUUID(),
      player: social.nickname || settings.name || "Guest",
      mode,
      daily,
      date: new Date().toISOString(),
      score: total,
      max: MAX_POINTS * ROUNDS,
      rounds: results.map((r) => ({ km: r.km, points: r.points })),
    });
    if (results.length) saveRecent(results.map((r) => r.loc.id));

    if (ranked) {
      let myWins = 0;
      let oppWins = 0;
      results.forEach((r) => {
        const oppPts = r.bots?.[0]?.points ?? 2800;
        if (r.points > oppPts) myWins++;
        else if (oppPts > r.points) oppWins++;
      });
      const avg = total / Math.max(1, results.length);
      const matchRes = myWins > oppWins ? "win" : myWins < oppWins ? "loss" : avg >= 3000 ? "win" : "draw";
      const { change, after } = applyMatchResult(matchRes, avg, {
        opponentName: opponent.nickname,
        opponentTag: opponent.clanTag ?? "RIV",
        opponentRp: opponent.rp,
        myRoundsWon: myWins,
        oppRoundsWon: oppWins,
      });
      setEloChange(change);
      setRankAfter(after);
    }
    const unlockedNow = syncAchievements(loadRecords(), loadRank());
    setNewAch(unlockedNow);
    if (unlockedNow.length > 0) {
      unlockedNow.forEach((achId) => {
        const item = ACH_ALL.find((a) => a.id === achId);
        if (item) {
          toast(`Achievement unlocked: ${item.name}`, {
            description: item.requirement,
          });
        }
      });
    }
    addPlayerExp(Math.round(total / 10));
    awardCoins(Math.round(total / 50) + (ranked ? 75 : 30));
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const standings = useMemo(() => {
    if (mode !== "closest" && !ranked) return [];
    const totals: Record<string, { pts: number; wins: number; km: number }> = {};
    const add = (n: string, pts: number, km: number | null, win: boolean) => {
      totals[n] ??= { pts: 0, wins: 0, km: 0 };
      totals[n].pts += pts;
      totals[n].km += km ?? 20000;
      if (win) totals[n].wins++;
    };
    for (const r of results) {
      const all = [
        { n: social.nickname || settings.name || t(lang, "you"), km: r.km, p: r.points },
        ...(r.bots ?? []).map((b) => ({ n: b.name, km: b.km, p: b.points })),
      ];
      const best = Math.min(...all.map((a) => a.km ?? Infinity));
      all.forEach((a) => add(a.n, a.p, a.km, a.km === best));
    }
    return Object.entries(totals).sort((a, b) => b[1].pts - a[1].pts);
  }, [results, mode, ranked, social.nickname, settings.name, lang]);

  if (existingDailyRecord) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <Logo />
        <div className="plate mt-6 max-w-md p-6 sm:p-8 space-y-4">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            Daily Challenge
          </span>
          <h1 className="font-display text-3xl">Already Completed Today</h1>
          <p className="text-sm text-muted-foreground">
            You achieved <strong className="text-accent-text">{existingDailyRecord.score.toLocaleString()}</strong> / 25,000 points today. Daily challenge seeds are strictly one attempt per calendar day.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/play" className="btn btn-primary w-full !py-2.5 text-xs font-semibold">
              Play Other Modes
            </Link>
            <Link to="/stats" className="btn btn-outline w-full !py-2.5 text-xs font-semibold">
              View Stats & Streaks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!loc)
    return (
      <div className="grid min-h-screen place-items-center font-semibold text-muted-foreground">
        {tr("preparing")}
      </div>
    );

  const last = results[results.length - 1];
  const showHint = difficulty === "easy" || difficulty === "medium";
  const roundLabel = practice
    ? `${tr("practice")} · ${idx + 1}`
    : `${tr("round")} ${Math.min(idx + 1, ROUNDS)} / ${ROUNDS}`;
  const currentSinCard = mode === "sins" ? SIN_CARDS.find((c) => c.id === activeSin) : null;

  if (phase === "done") {
    const errs = results.map((r) => r.km).filter((x): x is number => x !== null);
    const defaultTemplate: CardTemplate = daily ? "daily" : ranked ? "ranked" : mode === "closest" ? "party" : "classic";
    const records = loadRecords().filter((r) => r.mode === mode);
    const personalBest = records.length ? Math.max(...records.map((r) => r.score)) : 0;
    const isNewPersonalBest = total > personalBest && !practice;

    const cardBaseData: CardData = {
      mode: MODES[mode].name,
      tag: daily ? "Daily Challenge" : ranked ? "Ranked Match" : `${tr(mode)} · ${difficulty}`,
      playerName: social.nickname || settings.name || "Player",
      clanTag: social.clanTag,
      rankName: rankAfter?.name,
      rpChange: eloChange ?? undefined,
      opponentName: ranked ? opponent.nickname : null,
      total,
      max: MAX_POINTS * ROUNDS,
      avgKm: errs.length
        ? formatDistance(errs.reduce((a, b) => a + b, 0) / errs.length, settings.unit)
        : "—",
      perfects: results.filter((r) => r.km !== null && r.km <= 25).length,
      rounds: results.map((r) => ({
        name: r.loc.name,
        points: r.points,
        km: r.km,
        guess: r.guess,
        target: { lat: r.loc.lat, lng: r.loc.lng },
      })),
      url: "strafemap.lovable.app",
    };

    const standingsRows: [string, { pts: number; best: boolean }][] = standings.map(([name, data]) => [
      name,
      { pts: data.pts, best: data.wins > 0 },
    ]);

    return (
      <GameSummary
        mode={mode}
        daily={daily}
        ranked={ranked}
        total={total}
        results={results}
        rankAfter={rankAfter}
        rpDelta={eloChange ?? 0}
        personalBest={personalBest}
        isNewPersonalBest={isNewPersonalBest}
        onPlayAgain={() => setSeed((s) => s + 1)}
        lang={lang}
        unit={settings.unit}
        opponent={ranked ? opponent : undefined}
        standingsRows={standingsRows}
        defaultTemplate={defaultTemplate}
        cardBaseData={cardBaseData}
      />
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden select-none bg-background">
      {/* Full Canvas Edge-to-Edge Map (Apple Maps Style) */}
      <div className={`absolute inset-0 z-0 h-full w-full ${phase === "reveal" ? "reveal-on" : ""}`}>
        <GameMap
          lang={lang}
          blind={blind && phase === "guess"}
          guess={guess}
          guess2={guess2}
          target={phase === "reveal" ? loc : null}
          others={phase === "reveal" ? last?.bots?.map((b) => ({ ...b.guess, label: b.name })) ?? [] : []}
          circle={mode === "shrink" && phase === "guess" && center ? { center, radiusKm: radius } : null}
          locked={phase !== "guess" || mode === "quiz"}
          onPick={pick}
          resetKey={`${seed}-${idx}`}
          hideZoomButtons={settings.hideZoomButtons}
          maxZoomLimit={mode === "sins" && activeSin === "sloth" ? 5 : 12}
          countryFocusCenter={mode === "findCity" && phase === "guess" ? { lat: loc.lat, lng: loc.lng } : null}
          activeStyle={activeMapStyle}
        />
      </div>

      {/* Apple Floating Island HUD (toolbar + bottom drop pin / quiz controls) */}
      <GameHud
        idx={idx}
        roundsTotal={ROUNDS}
        practice={practice}
        totalScore={total}
        timeLimit={limit}
        elapsedSeconds={elapsed}
        unlimitedTime={unlimitedTime}
        mode={mode}
        daily={daily}
        ranked={ranked}
        blind={blind}
        currentSinCard={currentSinCard}
        opponent={ranked ? opponent : undefined}
        guess={guess}
        guess2={guess2}
        greedChargesLeft={greedChargesLeft}
        placingSecondPin={placingSecondPin}
        onToggleSecondPin={() => setPlacingSecondPin((v) => !v)}
        onSubmit={() => submit()}
        onOpenQuitModal={() => setQuitModalOpen(true)}
        lang={lang}
        phase={phase}
        quizChoices={quizChoices}
        onSelectQuizChoice={(countryOpt) => {
          setQuizSelected(countryOpt);
          submit({ lat: loc.lat, lng: loc.lng }, countryOpt);
        }}
        sound={settings.sound}
        onToggleSound={() => setSettings({ sound: !settings.sound })}
        hideZoomButtons={!!settings.hideZoomButtons}
        onToggleZoomButtons={() => setSettings({ hideZoomButtons: !settings.hideZoomButtons })}
      />

      {/* Top-Center: Floating SmartClue Pill (Preserved strictly as per Section 17.5 Item 7) */}
      <div className="pointer-events-none absolute inset-x-3 top-14 z-30 flex justify-center sm:top-4 sm:z-40">
        <SmartClue
          collapsed={promptCollapsed}
          onToggle={() => {
            setPromptCollapsed((c) => !c);
            buzz(8);
          }}
          country={loc.country}
          name={mode === "quiz" && phase === "guess" ? `Mystery Country #${idx + 1}` : loc.name}
          isCountry={loc.category === "country" || mode === "quiz"}
          lang={lang}
          label={`${tr(loc.category === "country" ? "findCountry" : "pinLocation")}${
            blind ? ` · ${tr("labelsHidden")}` : ""
          }`}
          seconds={phase === "guess" && !unlimitedTime ? Math.ceil(limit - elapsed) : null}
        >
          {(loc.category !== "country" || phase === "guess") && (
            <div>
              <div className="overflow-hidden">
                <div className="pt-1">
                  {mode === "sins" && activeSin === "lust" && (
                    <p className="text-[11px] font-semibold text-foreground dark:text-accent-text">
                      Lust whisper: {compassWhisperFor(loc)}
                    </p>
                  )}
                  {phase === "guess" && !unlimitedTime && (
                    <div className="mt-1 h-[2px] overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-foreground dark:bg-accent-fill transition-[width] duration-100"
                        style={{ width: `${100 - (elapsed / limit) * 100}%` }}
                      />
                    </div>
                  )}
                  {mode === "shrink" && phase === "guess" && (
                    <p className="readout mt-2 text-[11px] text-muted-foreground">
                      {tr("zone")} {Math.round(radius).toLocaleString()} km · {tr("bonus")} ×
                      {timeMultiplier(elapsed, limit || 30).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </SmartClue>
      </div>

      {flash && (
        <div className="absolute left-1/2 top-40 z-[600] -translate-x-1/2 rounded-full bg-[#161616] px-4 py-2 text-sm font-semibold text-accent-text shadow-lg">
          {flash}
        </div>
      )}

      {/* Round Reveal Bottom Sheet */}
      {phase === "reveal" && last && (
        <RoundReveal
          last={last}
          idx={idx}
          roundsTotal={ROUNDS}
          practice={practice}
          unit={settings.unit}
          playerName={social.nickname || settings.name || t(lang, "you")}
          revealLeft={revealLeft}
          autoNextSeconds={AUTO_NEXT_SECONDS}
          onNext={next}
          lang={lang}
          reactionsEnabled={settings.reactions !== false}
          quickEmojis={settings.quickEmojis}
          reactionSet={settings.reactionSet}
          onReact={react}
          floaters={floaters}
        />
      )}

      {/* 7 Deadly Sins Pre-Match Drawer with 30s countdown */}
      {mode === "sins" && !sinConfirmed && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="glass-plate pop-in relative z-10 max-h-[85vh] w-full max-w-2xl rounded-t-3xl border-t border-border p-5 shadow-2xl flex flex-col">
            <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  7 Deadly Sins
                </span>
                <h2 className="font-display mt-1 text-xl">Select Your Sin Card</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="readout rounded-full border border-foreground/60 px-3 py-1 text-xs font-semibold text-accent-text">
                  {sinCountdown}s
                </span>
                <button
                  type="button"
                  onClick={() => setSinConfirmed(true)}
                  className="btn btn-primary !px-4 !py-1.5 text-xs font-semibold"
                >
                  Skip / Start
                </button>
              </div>
            </div>

            <div className="no-scrollbar mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
              {SIN_CARDS.map((card) => {
                const selected = activeSin === card.id;
                const isExpanded = expandedSinId === card.id;
                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border transition-all ${
                      selected
                        ? "border-foreground/70 bg-accent-fill/10 ring-1 ring-foreground/40 shadow-sm"
                        : "border-border bg-card/60 hover:bg-muted/70"
                    }`}
                  >
                    <div
                      onClick={() => setActiveSin(card.id)}
                      className="flex cursor-pointer items-center justify-between p-3 gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="font-display text-base tracking-wide"
                          style={{ color: card.accent }}
                        >
                          {card.sinName}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-foreground truncate">
                          {card.skillName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {selected && (
                          <span className="rounded-full bg-accent-fill px-2 py-0.5 text-[10px] font-bold text-[#03121C] uppercase">
                            Selected
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedSinId(isExpanded ? null : card.id);
                          }}
                          title="View skill details"
                          aria-label={`View ${card.sinName} details`}
                          className={`h-7 w-7 rounded-full border flex items-center justify-center transition-colors ${
                            isExpanded
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-muted/80 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border/70 bg-background/50 px-3.5 py-2.5 space-y-1 text-xs">
                        <p className="text-positive">
                          <strong>Boon:</strong> {card.boon}
                        </p>
                        <p className="text-[11px] text-destructive">
                          <strong>Trade-off:</strong> {card.tradeoff}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setSinConfirmed(true)}
                className="btn btn-primary w-full !py-3 text-sm font-semibold"
              >
                Confirm & Start Match ({activeSin.toUpperCase()})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apple In-Game ActionSheet / Settings Drawer */}
      <GameSettingsPanel
        open={gameMenuOpen}
        onOpenChange={setGameMenuOpen}
        sound={settings.sound}
        onToggleSound={() => setSettings({ sound: !settings.sound })}
        blind={blind}
        onToggleBlind={() => setCustomBlind((prev) => !(prev ?? defaultBlind))}
        hideBlindOption={mode === "findCity"}
        hideZoomButtons={!!settings.hideZoomButtons}
        onToggleZoomButtons={() => setSettings({ hideZoomButtons: !settings.hideZoomButtons })}
        activeMapStyle={activeMapStyle}
        onSelectMapStyle={(s) => {
          setActiveMapStyle(s);
          setMapStylePref(s);
        }}
        lang={lang}
        onSelectLang={(l) => setSettings({ language: l })}
        onConfirmQuit={handleConfirmQuit}
        daily={daily}
        ranked={ranked}
        quitAlertOpen={quitModalOpen}
        onQuitAlertOpenChange={setQuitModalOpen}
      />
    </div>
  );
}
