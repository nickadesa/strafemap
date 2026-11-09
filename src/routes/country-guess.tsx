import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { Flag } from "@/components/Flag";
import { Logo } from "@/components/SiteHeader";
import { blip, buzz } from "@/lib/game/sound";
import { useCountUp } from "@/lib/use-count-up";
import {
  generateCountryQuizRounds,
  type CountryQuizQuestion,
  type QuizZone,
  type QuizDifficulty,
} from "@/lib/game/countries-quiz";
import { addPlayerExp, awardCoins } from "@/lib/social";
import { Trophy, Flame, RotateCcw, ArrowRight, CheckCircle2, XCircle, Globe, Sparkles } from "lucide-react";

export const Route = createFileRoute("/country-guess")({
  head: () => ({
    meta: [
      { title: "Country Guess Trivia — STRAFE" },
      { name: "description", content: "Fast-paced country, flag and capital quiz game mode without map pinning." },
    ],
  }),
  component: CountryGuessPage,
});

const TOTAL_ROUNDS = 10;
const SECONDS_PER_ROUND = 15;

function CountryGuessPage() {
  const [zone, setZone] = useState<QuizZone>("world");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const [rounds, setRounds] = useState<CountryQuizQuestion[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_ROUND);
  const [gameState, setGameState] = useState<"lobby" | "playing" | "results">("lobby");

  const animatedScore = useCountUp(score, 700);

  const startNewGame = useCallback(() => {
    const list = generateCountryQuizRounds(TOTAL_ROUNDS, zone, difficulty);
    setRounds(list);
    setRoundIdx(0);
    setSelectedIdx(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(SECONDS_PER_ROUND);
    setGameState("playing");
  }, [zone, difficulty]);

  const currentQ = rounds[roundIdx];

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing" || answered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(-1); // Time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, answered, roundIdx]);

  const handleAnswer = (choiceIdx: number) => {
    if (answered || !currentQ) return;
    setSelectedIdx(choiceIdx);
    setAnswered(true);

    const isCorrect = choiceIdx === currentQ.correctIndex;
    if (isCorrect) {
      blip(true, 850);
      const timeBonus = Math.round(timeLeft * 30);
      const streakBonus = streak * 50;
      const roundPoints = 500 + timeBonus + streakBonus;
      setScore((s) => s + roundPoints);
      setStreak((st) => {
        const next = st + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      buzz(12);
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (roundIdx + 1 >= TOTAL_ROUNDS) {
      // Award rewards
      addPlayerExp(Math.round(score / 15));
      awardCoins(Math.round(score / 50) + 30);
      setGameState("results");
    } else {
      setRoundIdx((i) => i + 1);
      setSelectedIdx(null);
      setAnswered(false);
      setTimeLeft(SECONDS_PER_ROUND);
    }
  };

  // Keyboard shortcuts 1..4 & Space/Enter for Next
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (!answered) {
        if (["1", "2", "3", "4"].includes(e.key)) {
          const idx = Number(e.key) - 1;
          handleAnswer(idx);
        }
      } else {
        if (e.key === "Enter" || e.code === "Space") {
          e.preventDefault();
          nextQuestion();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameState, answered, currentQ, roundIdx]);

  if (gameState === "lobby") {
    return (
      <div className="min-h-screen px-4 pb-16 pt-8 md:px-6">
        <header className="mx-auto max-w-2xl flex items-center justify-between pb-6">
          <Logo />
          <Link to="/play" className="btn btn-outline !px-4 !py-1.5 text-xs font-semibold">
            Back to Modes
          </Link>
        </header>

        <main className="mx-auto max-w-2xl">
          <div className="plate p-6 md:p-8 space-y-6">
            <div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                Standalone Game Mode
              </span>
              <h1 className="font-display mt-3 text-3xl md:text-5xl">Country Guess Trivia</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Test your knowledge of flags, capitals, populations, and geography facts. Rapid 4-choice questions with zero map pinning required.
              </p>
            </div>

            {/* Zone Selector */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Geographic Zone:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(["world", "asia", "europe", "americas", "africa", "oceania"] as QuizZone[]).map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZone(z)}
                    className={`rounded-2xl border p-3 text-left transition-colors ${
                      zone === z
                        ? "border-foreground/60 bg-accent-fill/15 text-accent-text ring-1 ring-foreground/40"
                        : "border-border bg-card/60 hover:bg-muted"
                    }`}
                  >
                    <span className="block font-semibold text-sm capitalize">{z}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {z === "world" ? "All 195+ Countries" : `${z} Continent`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Difficulty Tier:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["easy", "medium", "hard", "hardcore"] as QuizDifficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`rounded-2xl border p-3 text-center transition-colors ${
                      difficulty === d
                        ? "border-foreground/60 bg-accent-fill/15 text-accent-text ring-1 ring-foreground/40"
                        : "border-border bg-card/60 hover:bg-muted"
                    }`}
                  >
                    <span className="block font-semibold text-sm capitalize">{d}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={startNewGame}
              className="btn btn-primary w-full !py-3.5 text-base font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" /> Start Country Guess (10 Rounds)
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (gameState === "results") {
    const accuracy = Math.round((score / (TOTAL_ROUNDS * 1000)) * 100);
    return (
      <div className="min-h-screen px-4 pb-16 pt-8 md:px-6">
        <header className="mx-auto max-w-xl pb-6">
          <Logo />
        </header>

        <main className="mx-auto max-w-xl">
          <div className="plate p-6 md:p-8 space-y-6 text-center">
            <span className="rounded-full bg-muted px-3.5 py-1 text-xs font-semibold text-muted-foreground">
              Quiz Completed
            </span>
            <div>
              <h1 className="font-display text-5xl md:text-6xl text-accent-text">
                {animatedScore.toLocaleString()}
              </h1>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">Total Points Scored</p>
            </div>

            <div className="grid grid-cols-3 gap-3 border-y border-border py-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Zone</p>
                <p className="text-base font-semibold capitalize">{zone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Max Streak</p>
                <p className="text-base font-semibold text-accent-text">{bestStreak}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Performance</p>
                <p className="text-base font-semibold">{accuracy >= 80 ? "S Tier" : accuracy >= 50 ? "A Tier" : "B Tier"}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={startNewGame}
                className="btn btn-primary flex-1 !py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Play Again
              </button>
              <button
                type="button"
                onClick={() => setGameState("lobby")}
                className="btn btn-outline flex-1 !py-3 text-sm font-semibold"
              >
                Change Zone / Tier
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-6 md:px-6 flex flex-col justify-between">
      {/* HUD Header */}
      <header className="mx-auto max-w-3xl w-full flex flex-wrap items-center justify-between gap-3 pb-4">
        <Logo />
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
            Round {roundIdx + 1} / {TOTAL_ROUNDS}
          </span>
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-400">
              <Flame className="h-3.5 w-3.5 fill-current" /> {streak} Streak
            </span>
          )}
          <span className="readout rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-accent-text">
            {animatedScore.toLocaleString()} pts
          </span>
        </div>
      </header>

      {/* Main Question Card */}
      <main className="mx-auto max-w-3xl w-full my-auto py-4">
        <div className="plate overflow-hidden p-6 md:p-8 space-y-6">
          {/* Progress / Time Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">{currentQ?.type.replace("-", " ")} question</span>
              <span className={`font-mono ${timeLeft <= 3 ? "text-destructive font-semibold animate-pulse" : "text-accent-text"}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-[width] duration-1000 ease-linear ${timeLeft <= 3 ? "bg-destructive" : "bg-accent-fill"}`}
                style={{ width: `${(timeLeft / SECONDS_PER_ROUND) * 100}%` }}
              />
            </div>
          </div>

          {/* Clue Visual (Flag or Icon) */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 pt-2">
            {currentQ?.target && (
              <div className="shadow-lg">
                <Flag country={currentQ.target.country} size={96} />
              </div>
            )}
            <div>
              <h2 className="font-display text-2xl md:text-3xl max-w-xl">
                {currentQ?.prompt}
              </h2>
              {currentQ?.subtitle && (
                <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                  {currentQ.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* 4 Choices */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {currentQ?.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = "border-border bg-card/70 hover:bg-muted";
              if (answered) {
                if (isCorrect) {
                  btnStyle = "border-accent-fill bg-accent-fill/20 text-accent-text ring-2 ring-accent-fill";
                } else if (isSelected) {
                  btnStyle = "border-destructive bg-destructive/20 text-destructive ring-2 ring-destructive";
                } else {
                  btnStyle = "border-border/50 opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={answered}
                  onClick={() => handleAnswer(idx)}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-colors ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-xs font-semibold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-sm md:text-base">{option}</span>
                  </div>
                  {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-accent-text shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Answered Feedback Banner & Next Button */}
          {answered && (
            <div className="rounded-2xl border border-border bg-background/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Correct answer</p>
                <p className="font-display text-lg text-accent-text">
                  {currentQ?.correctAnswer} ({currentQ?.target.subregion})
                </p>
              </div>
              <button
                type="button"
                onClick={nextQuestion}
                className="btn btn-primary w-full sm:w-auto !px-6 !py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>{roundIdx + 1 >= TOTAL_ROUNDS ? "View Results" : "Next Round"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-muted-foreground py-2">
        Tip: Press numbers <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">1</kbd>–<kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">4</kbd> to pick and <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Space</kbd> for next.
      </footer>
    </div>
  );
}
