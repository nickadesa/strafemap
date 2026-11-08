import { Link } from "@tanstack/react-router";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import { MAX_POINTS, ROUNDS, formatDistance, type Mode } from "@/lib/game/engine";
import { NumberPopIn } from "@/components/ui/NumberPopIn";
import { useCountUp } from "@/lib/use-count-up";
import { Logo } from "@/components/SiteHeader";
import { RankBanner } from "@/components/RankVisuals";
import { GameChat } from "@/components/GameChat";
import { ShareCardStudio } from "@/components/game/ShareCardStudio";
import type { RankStep } from "@/lib/rank";
import type { Location } from "@/lib/game/locations";
import type { LatLng } from "@/lib/game/engine";
import type { CardData, CardTemplate } from "@/lib/game/shareCard";
import type { CommunityPlayer } from "@/lib/social";
import { RotateCcw, Sparkles } from "lucide-react";

interface RoundResult {
  loc: Location;
  guess: LatLng | null;
  km: number | null;
  points: number;
  mult?: number | undefined;
  sinNote?: string | undefined;
  bots?: { name: string; km: number; points: number }[] | undefined;
}

interface GameSummaryProps {
  mode: Mode;
  daily: boolean;
  ranked: boolean;
  total: number;
  results: RoundResult[];
  rankAfter?: RankStep | null;
  rpDelta?: number;
  personalBest: number;
  isNewPersonalBest: boolean;
  onPlayAgain: () => void;
  lang: Lang;
  unit: "km" | "mi";
  opponent?: CommunityPlayer | undefined;
  standingsRows?: [string, { pts: number; best: boolean }][];
  defaultTemplate: CardTemplate;
  cardBaseData: CardData;
}

export function GameSummary({
  mode,
  daily,
  ranked,
  total,
  results,
  rankAfter,
  rpDelta = 0,
  personalBest,
  isNewPersonalBest,
  onPlayAgain,
  lang,
  unit,
  opponent,
  standingsRows,
  defaultTemplate,
  cardBaseData,
}: GameSummaryProps) {
  const animatedTotal = useCountUp(total, 900, true);

  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:px-6 md:pb-16">
      <div className="mx-auto max-w-4xl pb-4">
        <Logo />
      </div>

      <main className="mx-auto max-w-4xl space-y-6">
        {/* Main Score Plate */}
        <section className="plate relative overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
                {t(lang, mode)}
                {daily && ` · ${t(lang, "daily")}`}
                {ranked && ` · ${t(lang, "ranked")}`} · {t(lang, "final")}
              </span>

              {/* Largest Total Score Display with NumberPopIn */}
              <h1 className="font-display mt-3 text-6xl text-foreground dark:text-accent-text sm:text-7xl md:text-8xl">
                <NumberPopIn value={animatedTotal.toLocaleString()} />
                <span className="ml-2 text-2xl font-sans font-medium text-muted-foreground">
                  / {(MAX_POINTS * ROUNDS).toLocaleString()}
                </span>
              </h1>

              {/* Personal Best Comparison */}
              <div className="mt-2 flex items-center gap-2 text-sm">
                {isNewPersonalBest ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-fill/20 px-3 py-0.5 text-xs font-bold text-accent-text">
                    <Sparkles className="h-3.5 w-3.5" /> New Personal Best!
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Your best: <strong className="text-foreground">{personalBest.toLocaleString()} pts</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Ranked RP Progress Banner */}
            {ranked && rankAfter && (
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4 shadow-sm">
                <RankBanner rp={rankAfter.min} championPosition={null} width={56} />
                <div>
                  <p className="font-display text-xl">{rankAfter.name}</p>
                  <p className="readout text-xs font-semibold text-accent-text">
                    {rpDelta >= 0 ? `+${rpDelta}` : rpDelta} RP ({rankAfter.min.toLocaleString()} RP)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* List of 5 Rounds */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rounds Summary
            </h3>
            <div className="divide-y divide-border rounded-2xl border border-border bg-background/40">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 sm:px-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {r.loc.name}, {r.loc.country}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.km === null ? t(lang, "noGuess") : formatDistance(r.km, unit)}
                        {r.mult !== undefined && ` · ×${r.mult.toFixed(2)}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <p className="font-display text-lg text-accent-text">
                      +{r.points.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standings List (if Bots / Multiplayer) */}
          {standingsRows && standingsRows.length > 0 && (
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Match Standings
              </h3>
              <div className="divide-y divide-border rounded-2xl border border-border bg-background/40">
                {standingsRows.map(([name, data], i) => (
                  <div
                    key={name}
                    className={`flex items-center justify-between p-3.5 sm:px-4 ${
                      data.best ? "bg-accent-fill/10 font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                      <span className="text-sm font-semibold">{name}</span>
                      {data.best && (
                        <span className="rounded-full bg-accent-fill px-2 py-0.5 text-[10px] font-bold text-[#161616]">
                          Best Pin
                        </span>
                      )}
                    </div>
                    <span className="font-display text-base text-foreground">
                      {data.pts.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons: Play Again (Primary), Change Mode, Back to Menu */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-6">
            {!daily && (
              <button
                type="button"
                onClick={() => {
                  buzz(8);
                  onPlayAgain();
                }}
                className="btn btn-primary px-8 py-3 text-sm font-semibold shadow-md active:scale-95 flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t(lang, "playAgain")}
              </button>
            )}

            {ranked ? (
              <Link
                to="/rank"
                onClick={() => buzz(6)}
                className="btn btn-outline px-6 py-3 text-sm font-semibold"
              >
                {t(lang, "backRank")}
              </Link>
            ) : (
              <Link
                to="/play"
                onClick={() => buzz(6)}
                className="btn btn-outline px-6 py-3 text-sm font-semibold"
              >
                {t(lang, "changeMode")}
              </Link>
            )}

            <Link
              to="/"
              onClick={() => buzz(6)}
              className="btn btn-outline px-6 py-3 text-sm font-semibold"
            >
              {t(lang, "menu")}
            </Link>
          </div>
        </section>

        {/* Inline Match Chat for GG / Rematch */}
        {opponent && (
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
        )}

        {/* Share Card Studio with 4 Aspects & Export */}
        <ShareCardStudio
          baseData={cardBaseData}
          defaultTemplate={defaultTemplate}
          lang={lang}
        />
      </main>
    </div>
  );
}
