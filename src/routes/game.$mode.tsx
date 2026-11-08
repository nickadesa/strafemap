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
import {
  renderCard,
  shareCard,
  gradeFor,
  type CardAspect,
  type CardData,
  type CardResolution,
  type CardTemplate,
} from "@/lib/game/shareCard";
import { Button } from "@/components/ui/button";
import { t, type Lang } from "@/lib/i18n";
import { applyMatchResult, loadRank, type RankStep } from "@/lib/rank";
import { AvatarFrame, ClanTagPill, RankBanner, VerifiedBadge } from "@/components/RankVisuals";
import { Flag } from "@/components/Flag";
import { COMMUNITY_PLAYERS, addPlayerExp, awardCoins, useFeed, useSocialProfile } from "@/lib/social";
import { REACTION_SETS } from "@/lib/reactions";
import { ACH_ALL, syncAchievements } from "@/lib/achievements";
import { GameChat } from "@/components/GameChat";
import {
  Download,
  Share2,
  Sparkles,
  Check,
  Send,
  AlertTriangle,
  Info,
  Menu,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Globe,
  LogOut,
  X,
  Layers,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCountUp } from "@/lib/use-count-up";
import { MapStyleSelector } from "@/components/MapStyleSelector";
import { useMapStyle, useResolvedMapStyle } from "@/lib/theme";
import { STYLE_ORDER } from "@/lib/map/styles";
import type { OpenFreeMapStyleId } from "@/lib/map/types";
import { NumberPopIn } from "@/components/ui/NumberPopIn";

function AnimatedRoundPoints({ points }: { points: number }) {
  const animated = useCountUp(points, 750, true);
  return <NumberPopIn value={animated.toLocaleString()} />;
}

function formatCompactScore(score: number): string {
  if (score >= 10000) {
    const k = (score / 1000).toFixed(1).replace(/\.0$/, "");
    return `${k}k`;
  }
  return score.toLocaleString();
}

function AnimatedTotalScore({ total, compact = false }: { total: number; compact?: boolean }) {
  const animated = useCountUp(total, 950, true);
  const formatted = compact && animated >= 10000 ? formatCompactScore(animated) : animated.toLocaleString();
  return <NumberPopIn value={formatted} />;
}

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
    setNewAch(syncAchievements(loadRecords(), loadRank()));
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
            You achieved <strong className="text-[#D2F801]">{existingDailyRecord.score.toLocaleString()}</strong> / 25,000 points today. Daily challenge seeds are strictly one attempt per calendar day.
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
    const best = results.reduce((b, r, i) => (r.points > (results[b]?.points ?? 0) ? i : b), 0);
    const share = `STRAFE · ${tr(mode)}${daily ? " · Daily " + new Date().toISOString().slice(0, 10) : ""}\n${total.toLocaleString()} / ${(MAX_POINTS * ROUNDS).toLocaleString()}\n${results.map((r) => (r.points >= 4000 ? "🟩" : r.points >= 2000 ? "🟦" : r.points > 0 ? "🟧" : "⬜")).join("")}`;
    const defaultTemplate: CardTemplate = daily ? "daily" : ranked ? "ranked" : mode === "closest" ? "party" : "classic";

    return (
      <div className="min-h-screen px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-4xl py-5">
          <Logo />
        </div>
        <main className="mx-auto max-w-4xl">
          <div className="plate relative overflow-hidden p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {tr(mode)}
                  {daily && ` · ${tr("daily")}`}
                  {ranked && ` · ${tr("ranked")}`} · {tr("final")}
                </p>
                <h1 className="font-display mt-2 text-[clamp(3.5rem,14vw,7rem)] text-foreground dark:text-[#D2F801]">
                  <AnimatedTotalScore total={total} />
                </h1>
                <p className="mt-1 font-semibold text-muted-foreground">
                  {tr("outOf", { max: (MAX_POINTS * ROUNDS).toLocaleString() })}
                </p>
              </div>

              {ranked && rankAfter && (
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <RankBanner bannerUrl={rankAfter.bannerUrl} alt={rankAfter.name} width={76} />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Ranked Outcome</p>
                    <p className="font-display text-2xl" style={{ color: rankAfter.tier.accent }}>
                      {rankAfter.name}
                    </p>
                    {eloChange !== null && (
                      <p
                        className={`readout text-base font-semibold ${
                          eloChange >= 0 ? "text-foreground dark:text-[#D2F801]" : "text-destructive"
                        }`}
                      >
                        {eloChange >= 0 ? "+" : ""}
                        {eloChange} RP
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {newAch.length > 0 && (
              <Link
                to="/achievements"
                className="plate mt-4 flex items-center gap-3 p-3 pr-5 transition-colors hover:bg-muted/50"
              >
                <div className="flex -space-x-3">
                  {newAch.slice(0, 3).map((id) => {
                    const a = ACH_ALL.find((x) => x.id === id);
                    return a && <img key={id} src={a.files.compact.unlocked} alt="" className="h-12 w-12" />;
                  })}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">{tr("newUnlock")}</p>
                  <p className="truncate font-semibold">
                    {newAch.map((id) => ACH_ALL.find((x) => x.id === id)?.name).join(", ")}
                  </p>
                </div>
              </Link>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Box k={tr("accuracy")} v={`${Math.round((total / (MAX_POINTS * ROUNDS)) * 100)}%`} />
              <Box
                k={tr("avgError")}
                v={errs.length ? formatDistance(errs.reduce((a, b) => a + b, 0) / errs.length, settings.unit) : "—"}
              />
              <Box k={tr("bestRound")} v={`R${best + 1} · ${(results[best]?.points ?? 0).toLocaleString()}`} />
              <Box k={tr("closestPin")} v={errs.length ? formatDistance(Math.min(...errs), settings.unit) : "—"} />
            </div>
          </div>

          {(mode === "closest" || ranked) && <Standings rows={standings} lang={lang} />}

          {/* Round Breakdown */}
          <div className="plate mt-4 divide-y divide-border">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Flag country={r.loc.country} size={28} />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {tr("round")} {i + 1} {r.sinNote ? `· ${r.sinNote}` : ""}
                    </p>
                    <p className="font-semibold">
                      {r.loc.name}, {r.loc.country}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-foreground dark:text-[#D2F801]">{r.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.km === null ? tr("noGuess") : formatDistance(r.km, settings.unit)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Share Results Card Trigger Button */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setShareDrawerOpen(true)}
              className="btn btn-primary flex-1 !py-3 flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <Share2 className="h-4 w-4" /> Share Results Card
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(share).then(() => setCopied(true));
              }}
              className="btn btn-outline !px-4 !py-3 text-xs font-semibold"
            >
              {copied ? tr("copied") : tr("copyResult")}
            </button>
          </div>

          {/* Share Card Drawer */}
          {shareDrawerOpen && (
            <div className="fixed inset-0 z-[1000] flex items-end justify-center">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShareDrawerOpen(false)}
              />
              <div className="glass-plate pop-in relative z-10 max-h-[90vh] w-full max-w-xl rounded-t-3xl border-t border-border p-5 shadow-2xl flex flex-col">
                <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-display text-lg">Share Results Card</h3>
                  <button
                    type="button"
                    onClick={() => setShareDrawerOpen(false)}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground"
                  >
                    Close
                  </button>
                </div>
                <div className="no-scrollbar mt-3 flex-1 overflow-y-auto">
                  <ShareCardStudio
                    lang={lang}
                    defaultTemplate={defaultTemplate}
                    baseData={{
                      mode: MODES[mode].name,
                      tag: daily ? "Daily Challenge" : ranked ? "Ranked Match" : `${tr(mode)} · ${difficulty}`,
                      playerName: social.nickname || settings.name || "Player",
                      clanTag: social.clanTag,
                      rankName: rankAfter?.name,
                      rpChange: eloChange,
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
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Inline Match Chat Embedded Directly on Results Page */}
          <GameChat
            inline
            playerScore={total}
            opponent={{
              name: opponent.nickname,
              clanTag: opponent.clanTag,
              clanTagColor: opponent.clanTagColor,
              rp: opponent.rp,
              verified: opponent.verifiedBadge,
            }}
          />

          {/* Action Buttons: Moved to the very bottom */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-6">
            {!daily && (
              <button onClick={() => setSeed((s) => s + 1)} className="btn btn-primary !px-6 !py-3 text-sm font-semibold">
                {tr("playAgain")}
              </button>
            )}
            {ranked ? (
              <Link to="/rank" className="btn btn-outline !px-5 !py-3 text-sm font-semibold">
                {tr("backRank")}
              </Link>
            ) : (
              <Link to="/play" className="btn btn-outline !px-5 !py-3 text-sm font-semibold">
                {tr("changeMode")}
              </Link>
            )}
            <Link to="/" className="btn btn-outline !px-5 !py-3 text-sm font-semibold">
              {tr("menu")}
            </Link>
          </div>
        </main>
      </div>
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

      {/* Floating Apple Island HUD (No full-width bar; 100% edge-to-edge map visible behind controls) */}
      {/* Top-Left: Floating Menu Hamburger */}
      <div className="pointer-events-auto absolute left-3 top-3 z-40 sm:left-4 sm:top-4">
        <button
          type="button"
          onClick={() => setGameMenuOpen(true)}
          aria-label="Game Menu & Settings"
          className="glass-plate grid h-9 w-9 place-items-center rounded-full shadow-sm transition-all active:scale-95 hover:bg-muted/80"
        >
          <Menu className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Top-Right: Floating Stats & Opponent Capsule */}
      <div className="pointer-events-auto absolute right-3 top-3 z-40 flex items-center gap-1.5 sm:right-4 sm:top-4">
        {/* Ranked Opponent HUD Pill */}
        {ranked && (
          <div className="glass-plate flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs shadow-md">
            <span className="text-[10px] font-semibold text-muted-foreground">VS</span>
            <AvatarFrame name={opponent.nickname} rp={opponent.rp} size={22} />
            <ClanTagPill tag={opponent.clanTag} color={opponent.clanTagColor} />
            <span className="max-w-20 truncate text-xs font-semibold hidden sm:inline">{opponent.nickname}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                elapsed > 4 ? "bg-[#D2F801]" : "bg-muted-foreground/60"
              }`}
              title={elapsed > 4 ? "Opponent pinned" : "Opponent thinking"}
            />
          </div>
        )}

        {/* Active Sin Card Pill */}
        {currentSinCard && (
          <span
            className="glass-plate rounded-full px-2.5 py-1.5 text-xs font-semibold shadow-md hidden sm:inline"
            style={{ color: currentSinCard.accent }}
          >
            {currentSinCard.sinName}
          </span>
        )}

        {/* Round & Total Score Combined Capsule */}
        <div className="glass-plate flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
          <span className="text-muted-foreground">
            {practice ? `${idx + 1}` : `${Math.min(idx + 1, ROUNDS)}/${ROUNDS}`}
          </span>
          <span className="h-3 w-px bg-border/60" />
          <span className="readout text-foreground dark:text-[#D2F801]">
            <AnimatedTotalScore total={total} compact />
          </span>
        </div>

        {practice && (
          <Button
            variant="ghost"
            onClick={() => setPhase("done")}
            className="glass-plate h-8 rounded-full px-3 text-xs shadow-md"
          >
            {tr("end")}
          </Button>
        )}

        {/* Floating OpenFreeMap Style Selector Button */}
        <MapStyleSelector
          lang={lang}
          currentStyle={activeMapStyle}
          onSelectStyle={(s) => {
            setActiveMapStyle(s);
            setMapStylePref(s);
          }}
        />
      </div>

      {/* Top-Center: Floating SmartClue Pill */}
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
                    <p className="text-[11px] font-semibold text-foreground dark:text-[#D2F801]">
                      Lust whisper: {compassWhisperFor(loc)}
                    </p>
                  )}
                  {phase === "guess" && !unlimitedTime && (
                    <div className="mt-1 h-[2px] overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-foreground dark:bg-[#D2F801] transition-[width] duration-100"
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
          <div className="absolute left-1/2 top-40 z-[600] -translate-x-1/2 rounded-full bg-[#161616] px-4 py-2 text-sm font-semibold text-[#D2F801] shadow-lg">
            {flash}
          </div>
        )}

        <div className={`absolute inset-x-3 bottom-6 z-[500] flex justify-center ${gameMenuOpen ? "opacity-0 pointer-events-none" : "transition-opacity duration-200"}`}>
          {phase === "guess" ? (
            mode === "quiz" ? (
              <div className="plate w-full max-w-xl p-4">
                <p className="mb-2.5 text-center text-xs font-medium text-muted-foreground">
                  {tr("findCountry")} · Select 1 of 4 Options
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {quizChoices.map((countryOpt) => (
                    <button
                      key={countryOpt}
                      type="button"
                      onClick={() => {
                        setQuizSelected(countryOpt);
                        submit({ lat: loc.lat, lng: loc.lng }, countryOpt);
                      }}
                      className="flex items-center justify-center rounded-2xl border border-border bg-background/90 px-4 py-3.5 text-center text-sm font-semibold transition-colors hover:border-foreground/60 hover:bg-[#D2F801] hover:text-[#161616]"
                    >
                      <span className="truncate">{countryOpt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {mode === "sins" && activeSin === "greed" && guess && !guess2 && greedChargesLeft > 0 && (
                  <button
                    type="button"
                    onClick={() => setPlacingSecondPin((v) => !v)}
                    className={`btn text-xs font-semibold shadow-lg backdrop-blur-xl ${
                      placingSecondPin ? "btn-primary" : "btn-outline bg-card/90"
                    }`}
                  >
                    {placingSecondPin
                      ? "Tap Map for 2nd Pin…"
                      : `+ Place 2nd Pin (${greedChargesLeft} left)`}
                  </button>
                )}
                {guess ? (
                  <Button
                    onClick={() => submit()}
                    className="game-confirm h-auto min-h-12 max-w-full flex-col gap-0.5 whitespace-normal rounded-full bg-[#D2F801] px-8 py-2.5 text-sm font-semibold text-black shadow-[0_12px_32px_rgba(210,248,1,0.35)] hover:bg-[#DCFF1A] active:scale-[0.96] transition-transform duration-200"
                  >
                    <span className="flex min-w-0 items-center justify-center gap-2">
                      <span>{tr("confirmGuess")}</span>
                      <kbd className="hidden rounded-full bg-black/15 px-2 py-0.5 text-xs font-mono md:inline">
                        {tr("space")}
                      </kbd>
                    </span>
                    <span className="readout whitespace-nowrap text-[10px] font-semibold opacity-75">
                      {guess.lat.toFixed(4)}, {guess.lng.toFixed(4)}
                    </span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/85 dark:bg-[rgba(28,28,30,0.85)] px-6 py-2.5 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur-2xl">
                    <span className="h-2 w-2 rounded-full bg-[#D2F801] animate-pulse" />
                    <span>{tr("pinMap")}</span>
                  </div>
                )}
              </div>
            )
          ) : (
            last && (
              <div className="relative w-full max-w-lg rounded-[26px] p-5 sm:p-6 border border-black/10 dark:border-white/15 bg-white/92 dark:bg-[rgba(28,28,30,0.88)] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                {/* Apple Sheet Grabber */}
                <div className="mx-auto -mt-1 mb-3.5 h-1 w-10 rounded-full bg-muted-foreground/30" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {last.loc.name}, {last.loc.country}
                    </p>
                    <p className="font-display readout mt-1 text-5xl text-foreground dark:text-[#D2F801]">
                      +<AnimatedRoundPoints points={last.points} />
                    </p>
                    {last.sinNote && (
                      <p className="mt-1 text-xs font-semibold text-foreground dark:text-[#D2F801]">{last.sinNote}</p>
                    )}
                  </div>
                  <div className="text-right text-sm font-semibold">
                    <p>
                      {last.km === null
                        ? tr("noGuess")
                        : tr("distanceOff", { distance: formatDistance(last.km, settings.unit) })}
                    </p>
                    {last.mult !== undefined && (
                      <p className="text-muted-foreground">
                        {tr("time")} ×{last.mult.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                {last.bots && (
                  <ol className="mt-3.5 space-y-1 text-sm">
                    {[
                      {
                        name: social.nickname || settings.name || t(lang, "you"),
                        km: last.km ?? Infinity,
                        points: last.points,
                      },
                      ...last.bots,
                    ]
                      .sort((a, b) => a.km - b.km)
                      .map((p, i) => (
                        <li
                          key={p.name}
                          className={`flex justify-between rounded-full px-3.5 py-1.5 ${
                            i === 0 ? "bg-[#D2F801] font-semibold text-black shadow-sm" : "bg-muted/50"
                          }`}
                        >
                          <span className="truncate">
                            {i + 1}. {p.name}
                          </span>
                          <span className="shrink-0 font-mono">
                            {Number.isFinite(p.km) ? formatDistance(p.km, settings.unit) : "—"} ·{" "}
                            {p.points.toLocaleString()}
                          </span>
                        </li>
                      ))}
                  </ol>
                )}
                {settings.reactions !== false && (
                  <div className="mt-4 flex items-center justify-center gap-2" role="group" aria-label={tr("react")}>
                    {(settings.quickEmojis?.length
                      ? settings.quickEmojis
                      : REACTION_SETS[settings.reactionSet] ?? REACTION_SETS.classic
                    ).map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => react(e)}
                        className="reaction-btn"
                        aria-label={`${tr("react")} ${e}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={next}
                  className="btn btn-primary relative mt-4 w-full overflow-hidden !py-3 text-sm font-semibold shadow-md active:scale-[0.98]"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-black/15"
                    style={{ width: `${(1 - revealLeft / AUTO_NEXT_SECONDS) * 100}%` }}
                    aria-hidden="true"
                  />
                  <span className="relative">
                    {!practice && idx + 1 >= ROUNDS ? tr("seeResults") : tr("nextRound")}
                  </span>
                  <span className="readout relative ml-2 text-xs font-mono opacity-80">{Math.ceil(revealLeft)}s</span>
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-full h-40" aria-hidden="true">
                  {floaters.map((f) => (
                    <span key={f.id} className="reaction-float" style={{ left: `calc(50% + ${f.x}%)` }}>
                      {f.e}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

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
                <span className="readout rounded-full border border-foreground/60 px-3 py-1 text-xs font-semibold text-[#D2F801]">
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
                        ? "border-foreground/70 bg-[#D2F801]/10 ring-1 ring-foreground/40 shadow-sm"
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
                          <span className="rounded-full bg-[#D2F801] px-2 py-0.5 text-[10px] font-bold text-black uppercase">
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
      <Drawer open={gameMenuOpen} onOpenChange={setGameMenuOpen}>
        <DrawerContent className="mx-auto max-w-md p-5 sm:p-6">
          <DrawerHeader className="p-0 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <DrawerTitle className="text-base font-bold text-foreground">
                {t(lang, "settings")}
              </DrawerTitle>
              <DrawerClose className="rounded-full p-1.5 hover:bg-muted transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="mt-4 space-y-4">
            {/* Quick Settings Group */}
            <div className="rounded-2xl border border-border bg-muted/40 p-1 space-y-1">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSettings({ sound: !settings.sound })}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-card"
              >
                <div className="flex items-center gap-2.5">
                  {settings.sound ? (
                    <Volume2 className="h-4 w-4 text-foreground dark:text-[#D2F801]" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{t(lang, "sound")}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {settings.sound ? t(lang, "on") : t(lang, "off")}
                </span>
              </button>

              {/* Map Labels Toggle (Blind Mode) */}
              <button
                type="button"
                onClick={() => setCustomBlind((prev) => !(prev ?? defaultBlind))}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-card"
              >
                <div className="flex items-center gap-2.5">
                  {blind ? (
                    <EyeOff className="h-4 w-4 text-foreground dark:text-[#D2F801]" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{tr("labelsHidden")}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {blind ? t(lang, "on") : t(lang, "off")}
                </span>
              </button>

              {/* Map Zoom Controls Toggle */}
              <button
                type="button"
                onClick={() => setSettings({ hideZoomButtons: !settings.hideZoomButtons })}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-card"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-muted-foreground">[+/-]</span>
                  <span>{t(lang, "zoomControls") || "Zoom Buttons"}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {!settings.hideZoomButtons ? t(lang, "on") : t(lang, "off")}
                </span>
              </button>

              {/* Map Style Selector Row */}
              <div className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium">
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span>{t(lang, "mapStyle") || "Map Style"}</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto max-w-[210px] no-scrollbar">
                  {STYLE_ORDER.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setActiveMapStyle(id);
                        setMapStylePref(id);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                        activeMapStyle === id
                          ? "bg-foreground text-background"
                          : "bg-card text-muted-foreground hover:bg-card/80"
                      }`}
                    >
                      {id === "apple-light" ? "Apple L" : id === "apple-dark" ? "Apple D" : id.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switch */}
              <div className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium">
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{t(lang, "language")}</span>
                </div>
                <div className="flex items-center gap-1">
                  {(["en", "th"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setSettings({ language: l })}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        lang === l
                          ? "bg-[#D2F801] text-black"
                          : "bg-card text-muted-foreground hover:bg-card/80"
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Exit Game Button */}
            <button
              type="button"
              onClick={() => {
                setGameMenuOpen(false);
                setQuitModalOpen(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              <span>{daily || ranked ? tr("forfeit") : tr("end")}</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* iOS-Style Game Exit Confirmation Modal */}
      {quitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-destructive">
              <div className="rounded-full bg-destructive/15 p-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-foreground">
                {daily ? "Forfeit Daily Challenge?" : ranked ? "Forfeit Ranked Match?" : "Quit Current Game?"}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {daily ? (
                <>
                  Leaving now will record an immediate <strong>forfeit with 0 points</strong>. You will <strong>not</strong> be able to replay today's Daily Challenge ({todayKeyStr}).
                </>
              ) : ranked ? (
                <>
                  Leaving an active Ranked match counts as an immediate <strong>forfeit loss</strong> and RP penalty.
                </>
              ) : (
                <>
                  Are you sure you want to exit? Your current game progress will be lost.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setQuitModalOpen(false)}
                className="btn btn-outline !px-4 !py-2 text-xs font-semibold"
              >
                Resume Game
              </button>
              <button
                type="button"
                onClick={handleConfirmQuit}
                className="btn btn-destructive !px-4 !py-2 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {daily || ranked ? "Forfeit & Exit" : "Exit to Menu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Box({ k, v }: { k: string; v: string }) {
  return (
    <div className="plate bg-background/40 p-4">
      <p className="font-display text-2xl md:text-3xl">{v}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{k}</p>
    </div>
  );
}

function Standings({
  rows,
  lang,
}: {
  lang: Lang;
  rows: [string, { pts: number; wins: number; km: number }][];
}) {
  return (
    <div className="plate-ink mt-4 p-6">
      <p className="text-sm font-semibold opacity-80">{t(lang, "standings")}</p>
      <ol className="mt-3 space-y-2">
        {rows.map(([n, s], i) => (
          <li key={n} className="flex justify-between font-semibold">
            <span>
              {i + 1}. {n}
            </span>
            <span>
              {s.wins} {t(lang, "wins")} · {s.pts.toLocaleString()} {t(lang, "points")}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ShareCardStudio({
  baseData,
  defaultTemplate,
  lang,
}: {
  baseData: CardData;
  defaultTemplate: CardTemplate;
  lang: Lang;
}) {
  const [template, setTemplate] = useState<CardTemplate>(defaultTemplate);
  const [aspect, setAspect] = useState<CardAspect>("9:16");
  const [resolution, setResolution] = useState<CardResolution>("1080p");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [postedToFeed, setPostedToFeed] = useState(false);
  const { addPost } = useFeed();
  const [social] = useSocialProfile();
  const rank = loadRank();

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    renderCard({ ...baseData, template, aspect, resolution })
      .then((blob) => {
        if (cancelled) return;
        setCurrentBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [template, aspect, resolution, baseData.total]);

  const handlePostToFeed = () => {
    if (postedToFeed) return;
    const pct = baseData.max > 0 ? baseData.total / baseData.max : 0;
    addPost({
      authorId: "me",
      authorName: social.nickname,
      authorUsername: social.username,
      authorClanTag: social.clanTag,
      authorVerified: social.verifiedBadge,
      authorRp: rank.rp,
      authorChampPos: rank.championPosition,
      country: social.country,
      content: `Scored ${baseData.total.toLocaleString()} / ${baseData.max.toLocaleString()} pts in ${baseData.mode}`,
      resultCard: {
        mode: baseData.tag,
        score: baseData.total,
        maxScore: baseData.max,
        accuracy: `${Math.round(pct * 100)}%`,
        avgError: baseData.avgKm,
        grade: gradeFor(pct),
      },
    });
    setPostedToFeed(true);
  };

  return (
    <section className="plate mt-6 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D2F801]">
            <Sparkles className="h-3.5 w-3.5" /> Results Share Card Studio
          </span>
          <h2 className="font-display text-2xl">Live Card Preview & Export</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!currentBlob || busy}
            onClick={() => currentBlob && shareCard(currentBlob, `strafe-${template}-${aspect}.png`)}
            className="btn btn-primary !px-4 !py-2 text-xs font-semibold"
          >
            <Share2 className="h-4 w-4" />
            {busy ? t(lang, "creating") : t(lang, "shareCard")}
          </button>
          <button
            type="button"
            disabled={postedToFeed}
            onClick={handlePostToFeed}
            className="btn btn-outline !px-4 !py-2 text-xs font-semibold"
          >
            {postedToFeed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {postedToFeed ? "Posted to feed" : "Post to Social Feed"}
          </button>
        </div>
      </div>

      {/* Controls: Mode Template, Aspect Ratio, Resolution */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Card Theme</p>
          <div className="seg w-full">
            {(["daily", "ranked", "party", "classic"] as CardTemplate[]).map((tpl) => (
              <button
                key={tpl}
                type="button"
                onClick={() => setTemplate(tpl)}
                data-on={template === tpl}
                className="seg-item !px-3 !py-1 text-xs capitalize"
              >
                {tpl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Aspect Ratio</p>
          <div className="seg w-full">
            {(["16:9", "1:1", "4:5", "9:16"] as CardAspect[]).map((ar) => (
              <button
                key={ar}
                type="button"
                onClick={() => setAspect(ar)}
                data-on={aspect === ar}
                className="seg-item !px-3 !py-1 text-xs"
              >
                {ar}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Resolution</p>
          <div className="seg w-full">
            {(["1080p", "2K", "4K"] as CardResolution[]).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                data-on={resolution === res}
                className="seg-item !px-3 !py-1 text-xs"
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Canvas Image Preview */}
      <div className="mt-5 flex justify-center rounded-2xl border border-border bg-[#161616] p-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="STRAFE Result Share Card Preview"
            className="max-h-[420px] w-auto rounded-xl border border-border object-contain shadow-2xl"
          />
        ) : (
          <div className="grid h-64 place-items-center text-sm text-muted-foreground">
            {t(lang, "creating")}
          </div>
        )}
      </div>
    </section>
  );
}
