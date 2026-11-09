import { useMemo } from "react";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import { formatDistance } from "@/lib/game/engine";
import { NumberPopIn } from "@/components/ui/NumberPopIn";
import { useCountUp } from "@/lib/use-count-up";
import { REACTION_SETS, type ReactionSet } from "@/lib/reactions";
import type { Location } from "@/lib/game/locations";
import type { LatLng } from "@/lib/game/engine";

interface RoundResult {
  loc: Location;
  guess: LatLng | null;
  km: number | null;
  points: number;
  mult?: number | undefined;
  sinNote?: string | undefined;
  bots?: { name: string; km: number; points: number }[] | undefined;
}

interface RoundRevealProps {
  last: RoundResult;
  idx: number;
  roundsTotal: number;
  practice: boolean;
  unit: "km" | "mi";
  playerName: string;
  revealLeft: number;
  autoNextSeconds: number;
  onNext: () => void;
  lang: Lang;
  // reactions
  reactionsEnabled?: boolean;
  quickEmojis?: string[];
  reactionSet?: ReactionSet | string | undefined;
  onReact?: (emoji: string) => void;
  floaters?: { id: number; e: string; x: number }[];
}

export function RoundReveal({
  last,
  idx,
  roundsTotal,
  practice,
  unit,
  playerName,
  revealLeft,
  autoNextSeconds,
  onNext,
  lang,
  reactionsEnabled = true,
  quickEmojis,
  reactionSet = "classic",
  onReact,
  floaters = [],
}: RoundRevealProps) {
  const animatedPoints = useCountUp(last.points, 750, true);
  const isLastRound = !practice && idx + 1 >= roundsTotal;

  // Praise banner for high precision
  const praise = useMemo(() => {
    if (last.points >= 5000) return "Perfect!";
    if (last.km !== null && last.km <= 0.25) return "Bullseye!";
    if (last.points >= 4800) return "Outstanding!";
    if (last.points >= 4000) return "Great guess!";
    return null;
  }, [last.points, last.km]);

  const emojis = quickEmojis?.length
    ? quickEmojis
    : (reactionSet && reactionSet in REACTION_SETS ? REACTION_SETS[reactionSet as ReactionSet] : REACTION_SETS.classic);

  return (
    <div className="pointer-events-auto relative w-full max-w-lg rounded-[26px] border border-black/10 bg-white/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-3xl dark:border-white/15 dark:bg-[rgba(28,28,30,0.92)] sm:p-6">
      {/* Apple Sheet Grabber Handle */}
      <div className="mx-auto -mt-1 mb-3.5 h-1 w-10 rounded-full bg-muted-foreground/30" />

      {/* Location Details & Round Points */}
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {last.loc.name}, {last.loc.country}
            </p>
            {praise && (
              <span className="rounded-full bg-accent-fill/20 px-2 py-0.5 text-[10px] font-bold text-accent-text uppercase">
                {praise}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display readout text-5xl font-extrabold tracking-tight text-accent-text">
              +<NumberPopIn value={animatedPoints.toLocaleString()} />
            </span>
            <span className="text-sm font-semibold text-muted-foreground">/ 5,000</span>
          </div>

          {last.sinNote && (
            <p className="mt-1 text-xs font-semibold text-accent-text">{last.sinNote}</p>
          )}
        </div>

        <div className="text-right text-xs font-semibold text-muted-foreground shrink-0">
          <p className="text-foreground text-sm font-bold">
            {last.km === null
              ? t(lang, "noGuess")
              : formatDistance(last.km, unit)}
          </p>
          {last.mult !== undefined && (
            <p className="mt-0.5 text-muted-foreground">
              {t(lang, "time")} ×{last.mult.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* 8px Animated Score Progress Bar (strafe-game-hud.html spec) */}
      <div className="my-3.5 h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full bg-accent-fill transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, (last.points / 5000) * 100))}%` }}
        />
      </div>

      {/* Distance Separation Line (strafe-game-hud.html spec) */}
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground my-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-fill shrink-0" />
        <span>Your pin</span>
        <span className="flex-1 border-t-2 border-dotted border-border/80" />
        <b className="font-mono text-sm font-bold text-foreground tabular-nums">
          {last.km === null ? t(lang, "noGuess") : formatDistance(last.km, unit)}
        </b>
        <span>away</span>
        <span className="h-2.5 w-2.5 rounded-full border-2 border-foreground bg-foreground/20 shrink-0" />
      </div>

      {/* Standings if Bots/Multiplayer */}
      {last.bots && (
        <ol className="mt-3.5 space-y-1 text-xs">
          {[
            {
              name: playerName || t(lang, "you"),
              km: last.km ?? Infinity,
              points: last.points,
              isMe: true,
            },
            ...last.bots.map((b) => ({ ...b, isMe: false })),
          ]
            .sort((a, b) => a.km - b.km)
            .map((p, i) => (
              <li
                key={p.name}
                className={`flex items-center justify-between rounded-xl px-3 py-1.5 ${
                  p.isMe
                    ? "bg-accent-fill font-bold text-[#03121C] shadow-xs"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                <span className="truncate">
                  {i + 1}. {p.name}
                </span>
                <span className="shrink-0 font-mono">
                  {Number.isFinite(p.km) ? formatDistance(p.km, unit) : "—"} ·{" "}
                  {p.points.toLocaleString()}
                </span>
              </li>
            ))}
        </ol>
      )}

      {/* Emoji Reactions Bar */}
      {reactionsEnabled && (
        <div
          className="mt-3.5 flex items-center justify-center gap-2 border-t border-border pt-3"
          role="group"
          aria-label={t(lang, "react")}
        >
          {emojis.map((e: string) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                buzz(4);
                onReact?.(e);
              }}
              className="reaction-btn h-9 w-9 min-h-[36px] min-w-[36px] text-lg hover:scale-125 transition-transform"
              aria-label={`${t(lang, "react")} ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Primary Action Button: Next Round / See Results with auto countdown progress */}
      <button
        type="button"
        onClick={() => {
          buzz(6);
          onNext();
        }}
        className="btn btn-primary relative mt-4 w-full overflow-hidden !py-3 text-sm font-semibold shadow-md active:scale-[0.98]"
      >
        <span
          className="absolute inset-y-0 left-0 bg-black/15 transition-all duration-100 ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, (1 - revealLeft / autoNextSeconds) * 100))}%` }}
          aria-hidden="true"
        />
        <span className="relative">
          {isLastRound ? t(lang, "seeResults") : t(lang, "nextRound")}
        </span>
        <span className="readout relative ml-2 text-xs font-mono opacity-80">
          {Math.ceil(revealLeft)}s
        </span>
      </button>

      {/* Floating Reaction Emojis */}
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-40" aria-hidden="true">
        {floaters.map((f) => (
          <span
            key={f.id}
            className="reaction-float"
            style={{ left: `calc(50% + ${f.x}%)` }}
          >
            {f.e}
          </span>
        ))}
      </div>
    </div>
  );
}
