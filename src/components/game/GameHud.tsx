import { useMemo } from "react";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import { AvatarFrame, ClanTagPill } from "@/components/RankVisuals";
import { MapStyleSelector } from "@/components/MapStyleSelector";
import { NumberPopIn } from "@/components/ui/NumberPopIn";
import type { Mode, LatLng, SIN_CARDS } from "@/lib/game/engine";
import type { OpenFreeMapStyleId } from "@/lib/map/types";
import type { CommunityPlayer } from "@/lib/social";
import { Menu, X, Flame } from "lucide-react";

interface GameHudProps {
  idx: number;
  roundsTotal: number;
  practice: boolean;
  totalScore: number;
  timeLimit: number;
  elapsedSeconds: number;
  unlimitedTime: boolean;
  mode: Mode;
  daily: boolean;
  ranked: boolean;
  blind: boolean;
  currentSinCard?: typeof SIN_CARDS[number] | null | undefined;
  opponent?: CommunityPlayer | undefined;
  guess: LatLng | null;
  guess2?: LatLng | null | undefined;
  greedChargesLeft?: number | undefined;
  placingSecondPin?: boolean | undefined;
  onToggleSecondPin?: (() => void) | undefined;
  onSubmit: () => void;
  onOpenSettings: () => void;
  onOpenQuitModal: () => void;
  activeMapStyle: OpenFreeMapStyleId;
  onSelectMapStyle: (s: OpenFreeMapStyleId) => void;
  lang: Lang;
  phase?: "guess" | "reveal" | "done" | undefined;
  quizChoices?: string[] | undefined;
  onSelectQuizChoice?: ((choice: string) => void) | undefined;
}

export function GameHud({
  idx,
  roundsTotal,
  practice,
  totalScore,
  timeLimit,
  elapsedSeconds,
  unlimitedTime,
  mode,
  daily,
  ranked,
  blind,
  currentSinCard,
  opponent,
  guess,
  guess2,
  greedChargesLeft = 0,
  placingSecondPin = false,
  onToggleSecondPin,
  onSubmit,
  onOpenSettings,
  onOpenQuitModal,
  activeMapStyle,
  onSelectMapStyle,
  lang,
  phase = "guess",
  quizChoices = [],
  onSelectQuizChoice,
}: GameHudProps) {
  const remainingSeconds = Math.max(0, Math.ceil(timeLimit - elapsedSeconds));
  const isUrgent = remainingSeconds <= 10;
  const isCritical = remainingSeconds <= 5;

  const timerColorClass = useMemo(() => {
    if (isCritical) return "text-destructive font-bold";
    if (isUrgent) return "text-amber-500 font-bold";
    return "text-foreground font-semibold";
  }, [isCritical, isUrgent]);

  return (
    <>
      {/* Top Floating Glass Island Bar (Apple Glass) */}
      <header className="pointer-events-none fixed inset-x-3 top-3 z-40 flex items-center justify-between sm:inset-x-4 sm:top-4">
        {/* Left: Close / Exit Match Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              buzz(6);
              onOpenQuitModal();
            }}
            aria-label="Exit Game"
            className="glass-plate grid h-10 w-10 min-h-[44px] min-w-[44px] place-items-center rounded-full text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Round Tracker & Mode Chip */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div className="glass-plate flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-sm">
            <span className="text-xs font-semibold text-foreground">
              {practice ? `${t(lang, "practice")} · ${idx + 1}` : `${t(lang, "round")} ${Math.min(idx + 1, roundsTotal)} / ${roundsTotal}`}
            </span>
            <span className="h-3 w-px bg-border/60" />
            <span className="readout text-xs font-semibold text-accent-text">
              <NumberPopIn value={totalScore.toLocaleString()} />
              <span className="ml-0.5 text-[10px] text-muted-foreground">{t(lang, "points")}</span>
            </span>
          </div>

          {/* Sub-chip: Mode or Sins Indicator */}
          <div className="mt-1 flex items-center gap-1">
            {daily && (
              <span className="rounded-full bg-accent-fill/15 px-2 py-0.5 text-[10px] font-semibold text-accent-text">
                {t(lang, "daily")}
              </span>
            )}
            {blind && (
              <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {t(lang, "labelsHidden")}
              </span>
            )}
            {currentSinCard && (
              <span
                className="rounded-full bg-card/80 px-2 py-0.5 text-[10px] font-semibold"
                style={{ color: currentSinCard.accent }}
              >
                {currentSinCard.sinName}
              </span>
            )}
          </div>
        </div>

        {/* Right: Timer, Opponent Pill & Menu Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Timer Ring / Tabular Display */}
          {!unlimitedTime && (
            <div
              className={`glass-plate flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 py-1.5 text-xs shadow-sm tabular-nums ${timerColorClass}`}
            >
              <span>{remainingSeconds}s</span>
            </div>
          )}

          {/* Ranked 1v1 Opponent Status */}
          {ranked && opponent && (
            <div className="glass-plate hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs shadow-sm sm:flex">
              <span className="text-[10px] font-semibold text-muted-foreground">VS</span>
              <AvatarFrame name={opponent.nickname} rp={opponent.rp} size={22} />
              <ClanTagPill tag={opponent.clanTag} color={opponent.clanTagColor} />
              <span className="max-w-20 truncate text-xs font-semibold">{opponent.nickname}</span>
              <span
                className={`h-2 w-2 rounded-full ${
                  elapsedSeconds > 4 ? "bg-accent-fill" : "bg-muted-foreground/60"
                }`}
                title={elapsedSeconds > 4 ? "Opponent pinned" : "Opponent thinking"}
              />
            </div>
          )}

          {/* Map Vector Style Picker */}
          <MapStyleSelector
            lang={lang}
            currentStyle={activeMapStyle}
            onSelectStyle={onSelectMapStyle}
          />

          {/* In-Game Settings / Pause Button */}
          <button
            type="button"
            onClick={() => {
              buzz(6);
              onOpenSettings();
            }}
            aria-label="Settings and Pause"
            className="glass-plate grid h-10 w-10 min-h-[44px] min-w-[44px] place-items-center rounded-full text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Bottom Floating Pin Action Controls */}
      {phase === "guess" && (
        <footer className="pointer-events-none fixed inset-x-3 bottom-6 z-40 flex justify-center">
          {mode === "quiz" ? (
            <div className="pointer-events-auto plate w-full max-w-lg p-4 shadow-xl">
              <p className="mb-2.5 text-center text-xs font-medium text-muted-foreground">
                {t(lang, "findCountry")} · Select 1 of 4 Options
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {quizChoices.map((countryOpt) => (
                  <button
                    key={countryOpt}
                    type="button"
                    onClick={() => {
                      buzz(6);
                      onSelectQuizChoice?.(countryOpt);
                    }}
                    className="flex min-h-[44px] items-center justify-center rounded-2xl border border-border bg-background/90 px-4 py-3 text-center text-sm font-semibold transition-all hover:border-foreground/60 hover:bg-accent-fill hover:text-[#03121C] active:scale-95"
                  >
                    <span className="truncate">{countryOpt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2.5">
              {/* Sins Greed Secondary Pin Button */}
              {mode === "sins" && currentSinCard?.id === "greed" && guess && !guess2 && greedChargesLeft > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    buzz(6);
                    onToggleSecondPin?.();
                  }}
                  className={`btn min-h-[44px] text-xs font-semibold shadow-lg backdrop-blur-xl ${
                    placingSecondPin ? "btn-primary" : "btn-outline bg-card/90"
                  }`}
                >
                  {placingSecondPin
                    ? t(lang, "tapMapForSecondPin")
                    : t(lang, "placeSecondPin", { n: greedChargesLeft })}
                </button>
              )}

              {/* Main Drop Pin Button */}
              {guess ? (
                <button
                  type="button"
                  onClick={() => {
                    buzz(8);
                    onSubmit();
                  }}
                  className="game-confirm flex min-h-[48px] items-center gap-2 rounded-full bg-accent-fill px-8 py-3 text-sm font-semibold text-[#03121C] shadow-[0_8px_24px_rgba(0,173,255,0.35)] transition-transform hover:opacity-90 active:scale-[0.96]"
                >
                  <span>{t(lang, "dropPin")}</span>
                  <kbd className="hidden rounded-full bg-black/15 px-2 py-0.5 text-xs font-mono md:inline">
                    {t(lang, "space")}
                  </kbd>
                </button>
              ) : (
                <div className="flex min-h-[44px] items-center gap-2 rounded-full border border-black/10 bg-white/90 px-6 py-2.5 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur-2xl dark:border-white/15 dark:bg-[rgba(28,28,30,0.85)]">
                  <span className="h-2 w-2 rounded-full bg-accent-fill animate-pulse" />
                  <span>{t(lang, "pinMap")}</span>
                </div>
              )}
            </div>
          )}
        </footer>
      )}
    </>
  );
}
