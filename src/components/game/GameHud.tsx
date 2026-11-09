import { useState, useMemo } from "react";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import { AvatarFrame } from "@/components/RankVisuals";
import { NumberPopIn } from "@/components/ui/NumberPopIn";
import { SymbolGearshape, SymbolLogOut } from "@/components/SFSymbols";
import { Volume2, VolumeX, ZoomIn } from "lucide-react";
import type { Mode, LatLng, SIN_CARDS } from "@/lib/game/engine";
import type { CommunityPlayer } from "@/lib/social";

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
  onOpenQuitModal: () => void;
  lang: Lang;
  phase?: "guess" | "reveal" | "done" | undefined;
  quizChoices?: string[] | undefined;
  onSelectQuizChoice?: ((choice: string) => void) | undefined;
  sound?: boolean;
  onToggleSound?: () => void;
  hideZoomButtons?: boolean;
  onToggleZoomButtons?: () => void;
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
  onOpenQuitModal,
  lang,
  phase = "guess",
  quizChoices = [],
  onSelectQuizChoice,
  sound = true,
  onToggleSound,
  hideZoomButtons = false,
  onToggleZoomButtons,
}: GameHudProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const remainingSeconds = Math.max(0, Math.ceil(timeLimit - elapsedSeconds));
  const isUrgent = remainingSeconds <= 10;
  const isCritical = remainingSeconds <= 5;

  const timerColorClass = useMemo(() => {
    if (isCritical) return "text-destructive font-bold animate-pulse";
    if (isUrgent) return "text-amber-500 font-bold";
    return "text-foreground font-semibold";
  }, [isCritical, isUrgent]);

  // In ranked mode, opponent pins after ~4 seconds
  const opponentPinned = elapsedSeconds > 4;

  return (
    <>
      {/* Top Floating Glass Header (Apple Glass Architecture) */}
      <header className="pointer-events-none fixed inset-x-3 top-3 z-40 flex items-start justify-between sm:inset-x-4 sm:top-4">
        {/* Top-Left: Settings Button & Glass Popover Menu */}
        <div className="pointer-events-auto relative">
          <button
            type="button"
            onClick={() => {
              buzz(6);
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Settings"
            aria-expanded={menuOpen}
            className={`grid h-12 w-12 min-h-[48px] min-w-[48px] place-items-center rounded-full glass-plate shadow-sm transition-all hover:bg-muted/80 active:scale-95 ${
              menuOpen ? "text-accent-fill ring-2 ring-accent-fill/40" : "text-foreground"
            }`}
          >
            <SymbolGearshape className="h-5 w-5" />
          </button>

          {/* Settings Scrim Overlay */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] dark:bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Settings Glass Popover Menu */}
          {menuOpen && (
            <div
              role="menu"
              className="glass-plate absolute left-0 top-[54px] z-50 w-64 rounded-[26px] p-2 shadow-2xl border border-border/80 animate-in fade-in zoom-in-95 duration-200 origin-top-left"
            >
              {/* Sound Toggle */}
              <div className="flex min-h-[48px] items-center gap-3 rounded-2xl px-3 py-1.5 transition-colors hover:bg-muted/50">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-muted/80 text-foreground">
                  {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  {t(lang, "sound")}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={sound}
                  aria-label={t(lang, "sound")}
                  onClick={() => {
                    buzz(4);
                    onToggleSound?.();
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                    sound ? "bg-accent-fill" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      sound ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Zoom Buttons Toggle */}
              <div className="flex min-h-[48px] items-center gap-3 rounded-2xl px-3 py-1.5 transition-colors hover:bg-muted/50">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-muted/80 text-foreground">
                  <ZoomIn className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  Zoom buttons
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!hideZoomButtons}
                  aria-label="Toggle zoom buttons"
                  onClick={() => {
                    buzz(4);
                    onToggleZoomButtons?.();
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                    !hideZoomButtons ? "bg-accent-fill" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      !hideZoomButtons ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="my-1.5 h-px bg-border/60 mx-2" />

              {/* Exit Game Button */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  buzz(8);
                  setMenuOpen(false);
                  onOpenQuitModal();
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all"
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-destructive/15 text-destructive">
                  <SymbolLogOut className="h-4 w-4" />
                </div>
                <span className="flex-1 font-semibold">
                  {daily || ranked ? "Forfeit Match" : t(lang, "leave")}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Top-Right: Integrated Timer, Round Progress & Points Capsule */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <div className="glass-plate flex items-center gap-3 rounded-full px-4 py-2 shadow-sm border border-border/70">
            {/* Countdown Timer */}
            {!unlimitedTime && (
              <>
                <span className={`tabular-nums text-sm font-extrabold ${timerColorClass}`}>
                  {remainingSeconds}s
                </span>
                <span className="h-4 w-px bg-border/60" />
              </>
            )}

            {/* Round Tracker + 5 Segmented Dot Indicators */}
            <div className="flex flex-col line-tight">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {practice ? t(lang, "practice") : `${t(lang, "round")} ${Math.min(idx + 1, roundsTotal)}/${roundsTotal}`}
              </span>
              <div className="flex gap-1 mt-0.5" aria-hidden="true">
                {Array.from({ length: roundsTotal > 0 ? roundsTotal : 5 }, (_, i) => {
                  const isDone = i < idx;
                  const isCurrent = i === idx;
                  return (
                    <i
                      key={i}
                      className={`h-[3px] w-3 rounded-full transition-colors duration-200 ${
                        isDone
                          ? "bg-accent-fill"
                          : isCurrent
                          ? "bg-foreground"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <span className="h-4 w-px bg-border/60" />

            {/* Score Points Counter */}
            <div className="flex flex-col line-tight">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t(lang, "points")}
              </span>
              <span className="tabular-nums font-extrabold text-sm text-foreground">
                <NumberPopIn value={totalScore.toLocaleString()} />
              </span>
            </div>
          </div>

          {/* Ranked 1v1 Opponent Pill (Floating below Score capsule) */}
          {ranked && opponent && (
            <div className="glass-plate flex items-center gap-2 rounded-full px-3 py-1.5 text-xs shadow-sm border border-border/60 animate-in fade-in duration-200">
              <span className="text-[10px] font-bold text-muted-foreground">VS</span>
              <AvatarFrame name={opponent.nickname} rp={opponent.rp} size={20} />
              <span className="max-w-20 truncate font-semibold text-foreground text-xs">
                {opponent.nickname}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  opponentPinned
                    ? "bg-accent-fill shadow-[0_0_8px_rgba(0,173,255,0.7)]"
                    : "bg-destructive shadow-[0_0_8px_rgba(255,69,58,0.7)]"
                }`}
                title={opponentPinned ? "Opponent pinned" : "Opponent thinking"}
              />
            </div>
          )}

          {/* Sub-chips for Daily / Blind / Sin Card if active */}
          {(daily || blind || currentSinCard) && (
            <div className="flex items-center gap-1.5 pr-1">
              {daily && (
                <span className="rounded-full bg-accent-fill/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent-text">
                  {t(lang, "daily")}
                </span>
              )}
              {blind && (
                <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {t(lang, "labelsHidden")}
                </span>
              )}
              {currentSinCard && (
                <span
                  className="rounded-full bg-card/90 px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ color: currentSinCard.accent }}
                >
                  {currentSinCard.sinName}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Bottom Floating Guess Confirmation Controls */}
      {phase === "guess" && (
        <footer className="pointer-events-none fixed inset-x-3 bottom-6 z-40 flex justify-center">
          {mode === "quiz" ? (
            <div className="pointer-events-auto plate w-full max-w-lg p-4 shadow-xl">
              <p className="mb-2.5 text-center text-xs font-medium text-muted-foreground">
                {t(lang, "findCountry")} &bull; Select 1 of 4 Options
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
            <div className="pointer-events-auto flex flex-col items-center gap-2.5">
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

              {/* Persistent Guess Confirmation Button */}
              {guess ? (
                <button
                  type="button"
                  onClick={() => {
                    buzz(8);
                    onSubmit();
                  }}
                  className="h-[58px] min-h-[58px] w-min min-w-[260px] max-w-[300px] rounded-[29px] bg-accent-fill px-8 text-[18px] font-bold text-[#03121C] shadow-[0_8px_28px_rgba(0,173,255,0.45)] transition-all hover:brightness-105 active:scale-[0.97] select-none flex items-center justify-center gap-2.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  <span>{t(lang, "dropPin")}</span>
                  <kbd className="hidden rounded-full bg-black/15 px-2 py-0.5 text-xs font-mono font-medium md:inline">
                    {t(lang, "space")}
                  </kbd>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="h-[58px] min-h-[58px] w-min min-w-[260px] max-w-[300px] rounded-[29px] glass-plate px-7 text-[16px] font-semibold text-muted-foreground/80 shadow-md backdrop-blur-xl border border-white/10 dark:border-white/10 opacity-70 cursor-not-allowed select-none transition-all flex items-center justify-center gap-2"
                >
                  <span>{t(lang, "pinMap")}</span>
                </button>
              )}
            </div>
          )}
        </footer>
      )}
    </>
  );
}
