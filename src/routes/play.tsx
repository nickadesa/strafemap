import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { t, type Lang } from "@/lib/i18n";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { Sidebar } from "@/components/Sidebar";
import {
  MODES,
  SIN_CARDS,
  TIME_OPTIONS,
  todayKey,
  type Difficulty,
  type Mode,
  type Pool,
  type SinCardId,
  type TimeLimit,
} from "@/lib/game/engine";
import { getRank, loadRank } from "@/lib/rank";
import { RankBanner } from "@/components/RankVisuals";
import { Calendar, ChevronLeft, ChevronRight, Flame, Info, Medal, Sparkles, Users, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

const modeIds: Mode[] = (Object.keys(MODES) as Mode[]).filter((m) => m !== "quiz");

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Modes Hub — STRAFE" },
      { name: "description", content: "Choose Ranked, Party, Daily Challenge, Find the City, 7 Deadly Sins, or Country Quiz." },
      { property: "og:title", content: "Modes Hub — STRAFE" },
      { property: "og:description", content: "Choose Ranked, Party, Daily Challenge, Find the City, 7 Deadly Sins, or Country Quiz." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => {
    const mode =
      typeof search["mode"] === "string" && modeIds.includes(search["mode"] as Mode)
        ? (search["mode"] as Mode)
        : undefined;
    return mode ? { mode } : {};
  },
  component: PlayHub,
});

const pools: { id: Pool; label: string }[] = [
  { id: "world", label: "World" },
  { id: "capitals", label: "Capitals" },
  { id: "countries", label: "Countries" },
  { id: "landmarks", label: "Landmarks & nature" },
  { id: "stadiums", label: "Football Stadiums" },
  { id: "wonders", label: "World Wonders" },
  { id: "attractions", label: "Tourist Attractions" },
];
const diffs: Difficulty[] = ["easy", "medium", "hard", "expert", "hardcore"];

function Chip({
  on,
  children,
  onClick,
}: {
  on: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} data-on={on} className="seg-item capitalize">
      {children}
    </button>
  );
}

function PlayHub() {
  const [settings] = useSettings();
  const [records] = useRecords();
  const lang = (settings.language ?? "en") as Lang;
  const initial = Route.useSearch().mode;
  const [mode, setMode] = useState<Mode>(initial ?? "classic");
  const [pool, setPool] = useState<Pool>("world");
  const [difficulty, setDiff] = useState<Difficulty>("medium");
  const [practice, setPractice] = useState(false);
  const [time, setTime] = useState<TimeLimit>(30);
  const [selectedSin, setSelectedSin] = useState<SinCardId>("pride");
  const [inspectedSin, setInspectedSin] = useState<typeof SIN_CARDS[number] | null>(null);
  const [moreModesOpen, setMoreModesOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 240;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const stats = computeStats(records ?? []);
  const rank = loadRank();
  const curRank = getRank(rank.rp, rank.championPosition);
  const dailyStreak = Math.max(1, stats.dailies || 4);

  const hasPlayedDailyToday = (records ?? []).some(
    (r) => r.daily && (r.date === todayKey() || r.seed === todayKey()),
  );
  const todayDailyRecord = (records ?? []).find(
    (r) => r.daily && (r.date === todayKey() || r.seed === todayKey()),
  );

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-28 pt-6 md:px-6 md:pt-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Top Event / Announcement Banner */}
          <section className="plate relative overflow-hidden border-border p-5 md:p-6">
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> Season 1 Global Event
                </span>
                <h1 className="font-display mt-2 text-3xl md:text-4xl">
                  7 Deadly Sins & Global Geography Expansion
                </h1>
                <p className="mt-1 max-w-2xl text-xs text-muted-foreground md:text-sm">
                  Explore 12,000+ enriched global coordinates, test your reflexes in 4-Choice Country Quiz, or climb to Champion Top 50!
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("sins");
                    setMoreModesOpen(true);
                  }}
                  className="btn btn-primary !px-4 !py-2.5 text-xs font-semibold"
                >
                  Try 7 Deadly Sins
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("findCity");
                    setMoreModesOpen(true);
                  }}
                  className="btn btn-outline !px-4 !py-2.5 text-xs font-semibold"
                >
                  Play Find the City
                </button>
              </div>
            </div>
          </section>

          {/* Core Match Modes: Ranked Mode, Party Mode, Daily Challenge */}
          <section className="grid gap-4 lg:grid-cols-3">
            {/* Ranked Mode Card */}
            <div className="plate flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-foreground">
                    <Medal className="mr-1 inline h-3.5 w-3.5" />
                    {t(lang, "rankedTag")}
                  </span>
                  <span className="readout text-xs font-semibold text-muted-foreground">
                    {rank.rp.toLocaleString()} RP
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={58} />
                  <div>
                    <h2 className="font-display text-2xl">{t(lang, "playRanked")}</h2>
                    <p className="text-xs font-semibold" style={{ color: curRank.tier.accent }}>
                      {curRank.name}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{t(lang, "rankedModeBlurb")}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to="/game/$mode"
                  params={{ mode: "classic" }}
                  search={{ ranked: 1 }}
                  className="btn btn-primary inline-flex px-5 py-2 text-xs font-semibold"
                >
                  {t(lang, "playRanked")}
                </Link>
                <Link to="/rank" className="btn btn-outline inline-flex px-4 py-2 text-xs">
                  Ladder
                </Link>
              </div>
            </div>

            {/* Party Mode Card */}
            <div className="plate flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-foreground">
                    <Users className="mr-1 inline h-3.5 w-3.5" />
                    {t(lang, "partyTag")} · 2–16 Players
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                    Voice Chat
                  </span>
                </div>
                <h2 className="font-display mt-3 text-2xl">{t(lang, "party")} Lobby</h2>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Host custom rooms for 2–16 players with Unlimited ∞ timer, More Modes selection, Invite Friends & Voice Chat.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/party"
                  className="btn btn-primary inline-flex px-6 py-2 text-xs font-semibold"
                >
                  {t(lang, "openParty")}
                </Link>
              </div>
            </div>

            {/* Daily Challenge & Streak Card */}
            <div className="plate flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                    <Calendar className="mr-1 inline h-3.5 w-3.5" />
                    {t(lang, "daily")} · {todayKey()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D2F801]">
                    <Flame className="h-3.5 w-3.5" /> {dailyStreak}d Streak
                  </span>
                </div>
                <h2 className="font-display mt-3 text-2xl">Global Daily Briefing</h2>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <div
                      key={d}
                      className={`rounded-lg border py-1 text-[10px] font-semibold ${
                        d <= dailyStreak
                          ? "border-foreground/60 bg-[#D2F801]/15 text-[#D2F801]"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      D{d}
                    </div>
                  ))}
                </div>
              </div>

              {hasPlayedDailyToday ? (
                <div className="mt-4 space-y-1.5">
                  <div className="rounded-xl border border-border bg-[#D2F801]/10 px-3 py-1 text-center text-xs font-semibold text-[#D2F801]">
                    Completed Today ({todayDailyRecord?.score?.toLocaleString()} pts)
                  </div>
                  <button
                    type="button"
                    disabled
                    className="btn btn-outline inline-flex px-4 py-1.5 text-xs font-semibold opacity-60 cursor-not-allowed"
                  >
                    Played Today
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <Link
                    to="/game/$mode"
                    params={{ mode: "classic" }}
                    search={{ daily: 1 }}
                    className="btn btn-primary inline-flex px-6 py-2 text-xs font-semibold"
                  >
                    Play Daily Seed
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Standalone Country Guess Trivia Banner */}
          <section className="plate relative overflow-hidden border border-border p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-xl">
                <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                  No map
                </span>
                <h2 className="font-display mt-2 text-2xl sm:text-3xl">Country Guess Trivia</h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  10 quick questions on flags, capitals and population. No pin, just pick the country.
                </p>
              </div>
              <Link
                to="/country-guess"
                className="btn btn-primary !px-6 !py-3 text-xs font-semibold flex items-center gap-2"
              >
                Play Country Guess
              </Link>
            </div>
          </section>

          {/* More Modes Card */}
          <section className="plate p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-foreground">
                  Custom Rules & Special Variations
                </span>
                <h2 className="font-display mt-2 text-2xl sm:text-3xl">More Game Modes</h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  7 Deadly Sins, Find the City, Closest Wins, Blind Map, Shrinking Zone, and Classic.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMoreModesOpen(true)}
                className="btn btn-primary !px-6 !py-3 text-xs font-semibold"
              >
                Choose & Configure Modes ({modeIds.length} Modes)
              </button>
            </div>
          </section>

          {/* More Modes iOS Drawer */}
          <Drawer open={moreModesOpen} onOpenChange={setMoreModesOpen}>
            <DrawerContent className="mx-auto max-w-4xl p-5 sm:p-6">
              <DrawerHeader className="flex flex-row items-center justify-between border-b border-border px-0 pb-3 pt-1">
                <div>
                  <DrawerTitle>{t(lang, "modes")} & Custom Rules</DrawerTitle>
                  <DrawerDescription className="mt-1">
                    Select a mode and customize categories, difficulty & timer
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <button
                    type="button"
                    aria-label="Close drawer"
                    className="rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DrawerClose>
              </DrawerHeader>

              <div className="no-scrollbar mt-4 max-h-[70vh] overflow-y-auto space-y-5 pr-1">
                {/* Mode Carousel with Navigation Arrows */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Game Modes ({modeIds.length})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => scrollCarousel("left")}
                        aria-label="Previous mode"
                        className="h-8 w-8 rounded-full border border-border bg-card/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCarousel("right")}
                        aria-label="Next mode"
                        className="h-8 w-8 rounded-full border border-border bg-card/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div
                    ref={carouselRef}
                    className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-0.5"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {modeIds.map((m) => {
                      const active = mode === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMode(m)}
                          className={`flex-none w-[205px] sm:w-[225px] snap-start rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-foreground/70 bg-[#D2F801]/10 ring-1 ring-foreground/40 shadow-sm"
                              : "border-border bg-card/60 hover:bg-muted/80"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {t(lang, `${m}Tag`)}
                            </span>
                            {(m === "findCity" || m === "sins") && (
                              <span className="rounded-full bg-[#D2F801]/20 px-2 py-0.5 text-[10px] font-bold text-foreground">
                                NEW
                              </span>
                            )}
                          </div>
                          <h4 className="font-display mt-2 text-base truncate">{t(lang, m)}</h4>
                          <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground leading-snug">
                            {t(lang, `${m}Blurb`)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mode Configuration Card */}
                <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-display text-lg">{t(lang, mode)} Configuration</span>
                    {difficulty === "hardcore" && (
                      <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-white">
                        Hardcore Active
                      </span>
                    )}
                  </div>

                  {/* 7 Deadly Sins Card Selector */}
                  {mode === "sins" && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Deadly Sin Skill Card (Tap (i) for skill details)
                        </p>
                      </div>
                      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                        {SIN_CARDS.map((card) => {
                          const on = selectedSin === card.id;
                          return (
                            <div
                              key={card.id}
                              onClick={() => setSelectedSin(card.id)}
                              className={`group relative flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition-all ${
                                on
                                  ? "border-foreground/70 bg-[#D2F801]/10 ring-1 ring-foreground/40 shadow-sm"
                                  : "border-border bg-background/50 hover:bg-muted/50"
                              }`}
                            >
                              <div className="min-w-0 pr-1">
                                <span className="font-display text-sm truncate block" style={{ color: card.accent }}>
                                  {card.sinName}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate block">
                                  {card.skillName}
                                </span>
                              </div>
                              <button
                                type="button"
                                aria-label={`View info for ${card.sinName}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectedSin(card);
                                }}
                                className="h-6 w-6 shrink-0 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                              >
                                <Info className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Category Selector */}
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                      {t(lang, "category")}
                    </p>
                    <div className="seg">
                      {pools.map((p) => (
                        <Chip key={p.id} on={pool === p.id} onClick={() => setPool(p.id)}>
                          {t(lang, p.id)}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selector */}
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                      {t(lang, "difficulty")}
                    </p>
                    <div className="seg">
                      {diffs.map((d) => (
                        <Chip key={d} on={difficulty === d} onClick={() => setDiff(d)}>
                          {t(lang, d)}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Time Per Round */}
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                      {t(lang, "timePerRound")}
                    </p>
                    <div className="seg">
                      {TIME_OPTIONS.map((tOpt) => (
                        <Chip key={tOpt} on={time === tOpt} onClick={() => setTime(tOpt)}>
                          {tOpt === 0 ? t(lang, "unlimited") : `${tOpt}s`}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={practice}
                      onChange={(e) => setPractice(e.target.checked)}
                      className="h-4 w-4 accent-[#D2F801]"
                    />
                    {t(lang, "practiceNote")}
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end border-t border-border pt-3">
                <Link
                  to="/game/$mode"
                  params={{ mode }}
                  search={{
                    pool,
                    difficulty,
                    time,
                    ...(practice ? { practice: 1 as const } : {}),
                    ...(mode === "sins" ? { sin: selectedSin } : {}),
                  }}
                  className="btn btn-primary inline-flex px-8 py-2.5 text-center text-sm font-semibold"
                >
                  Start {t(lang, mode)} Match
                </Link>
              </div>
            </DrawerContent>
          </Drawer>
          {/* Sin Card Info Modal */}
          {inspectedSin && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="plate max-w-sm w-full p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: inspectedSin.accent }} />
                    <h3 className="font-display text-lg" style={{ color: inspectedSin.accent }}>
                      {inspectedSin.sinName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectedSin(null)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="rounded-xl border border-border/80 bg-background/60 p-3">
                    <span className="text-[10px] font-semibold text-[#D2F801] uppercase tracking-wider block mb-1">
                      Skill Name
                    </span>
                    <p className="font-semibold text-foreground text-sm">{inspectedSin.skillName}</p>
                  </div>

                  <div className="rounded-xl border border-positive/30 bg-positive/10 p-3">
                    <span className="text-[10px] font-semibold text-positive uppercase tracking-wider block mb-1">
                      Boon
                    </span>
                    <p className="text-foreground/90 leading-relaxed">{inspectedSin.boon}</p>
                  </div>

                  <div className="rounded-xl border border-warning/30 bg-warning/10 p-3">
                    <span className="text-[10px] font-semibold text-warning uppercase tracking-wider block mb-1">
                      Trade-off
                    </span>
                    <p className="text-foreground/90 leading-relaxed">{inspectedSin.tradeoff}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSin(inspectedSin.id);
                      setInspectedSin(null);
                    }}
                    className="btn btn-primary flex-1 !py-2.5 text-xs font-semibold rounded-full"
                  >
                    Select {inspectedSin.sinName.replace(/^\d+\.\s*/, "")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedSin(null)}
                    className="btn btn-outline !py-2.5 px-4 text-xs font-semibold rounded-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
