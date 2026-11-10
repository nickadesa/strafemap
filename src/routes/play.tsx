import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
import { buzz } from "@/lib/game/sound";
import {
  SymbolGameController,
  SymbolTrophy,
  SymbolPerson2,
  SymbolCheckmark,
} from "@/components/SFSymbols";
import {
  Calendar,
  ChevronRight,
  Flame,
  Search,
  Sparkles,
  Target,
  EyeOff,
  MapPin,
  Bot,
  Globe2,
  X,
  Play,
  SlidersHorizontal,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { SlidingTabs } from "@/components/ui/SlidingTabs";

const modeIds: Mode[] = (Object.keys(MODES) as Mode[]).filter((m) => m !== "quiz");

type ModeCategory = "all" | "solo" | "multiplayer" | "ranked";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play — STRAFE" },
      { name: "description", content: "Choose a game mode: Daily Challenge, Ranked, Party, Classic, Shrink Zone, Find City, 7 Sins, or Country Quiz." },
      { property: "og:title", content: "Play — STRAFE" },
      { property: "og:description", content: "Choose a game mode: Daily Challenge, Ranked, Party, Classic, Shrink Zone, Find City, 7 Sins, or Country Quiz." },
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

const pools: { id: Pool; labelKey: string }[] = [
  { id: "world", labelKey: "categoryWorld" },
  { id: "capitals", labelKey: "categoryCapitals" },
  { id: "countries", labelKey: "categoryCountries" },
  { id: "landmarks", labelKey: "categoryLandmarks" },
  { id: "stadiums", labelKey: "categoryStadiums" },
  { id: "wonders", labelKey: "categoryWonders" },
  { id: "attractions", labelKey: "categoryAttractions" },
];
const diffs: Difficulty[] = ["easy", "medium", "hard", "expert", "hardcore"];

interface PlayModeItem {
  id: string;
  modeKey?: Mode;
  titleKey: string;
  blurbKey: string;
  tagKey: string;
  category: "solo" | "multiplayer" | "ranked";
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  directRoute?: string;
  searchParam?: Record<string, unknown>;
}

export function PlayHub() {
  const [settings] = useSettings();
  const [records] = useRecords();
  const lang = (settings.language ?? "en") as Lang;
  const initial = Route.useSearch().mode;
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<ModeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<Mode>(initial ?? "classic");
  const [pool, setPool] = useState<Pool>("world");
  const [difficulty, setDiff] = useState<Difficulty>("medium");
  const [practice, setPractice] = useState(false);
  const [time, setTime] = useState<TimeLimit>(30);
  const [selectedSin, setSelectedSin] = useState<SinCardId>("pride");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const stats = computeStats(records ?? []);
  const rank = loadRank();
  const dailyStreak = Math.max(1, stats.dailies || 4);

  const todayDailyRecord = (records ?? []).find(
    (r) => r.daily && (r.date.slice(0, 10) === todayKey() || r.seed === todayKey())
  );
  const hasPlayedDailyToday = Boolean(todayDailyRecord);

  // All Play Modes catalog
  const catalog: PlayModeItem[] = useMemo(() => [
    {
      id: "ranked",
      titleKey: "ranked",
      blurbKey: "rankedModeBlurb",
      tagKey: "rankedTag",
      category: "ranked",
      icon: SymbolTrophy,
      accentColor: "#3898FF",
      directRoute: "/rank",
    },
    {
      id: "party",
      titleKey: "party",
      blurbKey: "partyModeBlurb",
      tagKey: "partyTag",
      category: "multiplayer",
      icon: SymbolPerson2,
      accentColor: "#9333EA",
      directRoute: "/party",
    },
    {
      id: "classic",
      modeKey: "classic",
      titleKey: "classic",
      blurbKey: "classicBlurb",
      tagKey: "classicTag",
      category: "solo",
      icon: SymbolGameController,
      accentColor: "#00ADFF",
    },
    {
      id: "shrink",
      modeKey: "shrink",
      titleKey: "shrink",
      blurbKey: "shrinkBlurb",
      tagKey: "shrinkTag",
      category: "solo",
      icon: Target,
      accentColor: "#F59E0B",
    },
    {
      id: "closest",
      modeKey: "closest",
      titleKey: "closest",
      blurbKey: "closestBlurb",
      tagKey: "closestTag",
      category: "solo",
      icon: Bot,
      accentColor: "#0284C7",
    },
    {
      id: "blind",
      modeKey: "blind",
      titleKey: "blind",
      blurbKey: "blindBlurb",
      tagKey: "blindTag",
      category: "solo",
      icon: EyeOff,
      accentColor: "#8B5CF6",
    },
    {
      id: "findCity",
      modeKey: "findCity",
      titleKey: "findCity",
      blurbKey: "findCityBlurb",
      tagKey: "findCityTag",
      category: "solo",
      icon: MapPin,
      accentColor: "#EC4899",
    },
    {
      id: "sins",
      modeKey: "sins",
      titleKey: "sins",
      blurbKey: "sinsBlurb",
      tagKey: "sinsTag",
      category: "solo",
      icon: Sparkles,
      accentColor: "#EF4444",
    },
    {
      id: "quiz",
      titleKey: "countryGuessTrivia",
      blurbKey: "countryGuessBlurb",
      tagKey: "quizTag",
      category: "solo",
      icon: Globe2,
      accentColor: "#06B6D4",
      directRoute: "/country-guess",
    },
  ], []);

  // Filter modes by category & search query
  const filteredModes = useMemo(() => {
    return catalog.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (t(lang, item.titleKey) || item.titleKey).toLowerCase();
        const blurb = (t(lang, item.blurbKey) || item.blurbKey).toLowerCase();
        return title.includes(q) || blurb.includes(q);
      }
      return true;
    });
  }, [catalog, activeCategory, searchQuery, lang]);

  const handleSelectMode = (item: PlayModeItem) => {
    buzz(6);
    if (item.directRoute) {
      navigate({ to: item.directRoute as any });
      return;
    }
    if (item.modeKey) {
      setSelectedMode(item.modeKey);
      setDrawerOpen(true);
    }
  };

  const handleStartGame = () => {
    buzz(8);
    setDrawerOpen(false);
    navigate({
      to: "/game/$mode",
      params: { mode: selectedMode },
      search: {
        pool,
        difficulty,
        time,
        ...(practice ? { practice: 1 } : {}),
        ...(selectedMode === "sins" ? { sin: selectedSin } : {}),
      } as any,
    });
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-24 pt-4 md:px-6 md:pb-12 md:pt-8">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* 1. Large Title "Play" + Search Field */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
                {t(lang, "play")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a game mode or configure custom match rules
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(lang, "searchModes")}
                className="w-full rounded-2xl border-none bg-card/80 py-2.5 pl-9 pr-8 text-sm outline-none shadow-xs transition-colors focus:bg-background focus:ring-1 focus:ring-accent-fill/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Featured Daily Challenge Card (Image 1 & 5 style) */}
          <section className="plate relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-[#00ADFF]/15 via-blue-500/10 to-purple-600/15">
            <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div className="flex items-start gap-4 max-w-xl">
                <div className="grid h-16 w-16 sm:h-18 sm:w-18 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-lg text-3xl">
                  🔥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-fill/20 px-3 py-1 text-xs font-bold text-accent-text">
                      <Calendar className="h-3.5 w-3.5" />
                      {t(lang, "daily")} · {todayKey()}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-xs font-bold text-foreground shadow-2xs">
                      {dailyStreak}d Streak
                    </span>
                  </div>

                  <h2 className="font-display mt-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {t(lang, "todayFivePins")}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {t(lang, "sameFivePlaces")}. Fixed global seed with verified pinpoint coordinates.
                  </p>
                </div>
              </div>

              {/* Status & CTA */}
              <div className="shrink-0 flex items-center justify-end">
                {hasPlayedDailyToday ? (
                  <div className="flex flex-col gap-2 sm:items-end w-full sm:w-auto">
                    <div className="flex items-center gap-2 rounded-full bg-card/90 px-4 py-2.5 shadow-xs">
                      <SymbolCheckmark className="h-4 w-4 text-accent-text" />
                      <span className="text-xs font-bold">
                        {t(lang, "todayScore", { n: todayDailyRecord?.score.toLocaleString() ?? "0" })}
                      </span>
                    </div>
                    <Link
                      to="/game/$mode"
                      params={{ mode: "classic" }}
                      search={{ daily: 1 }}
                      onClick={() => buzz(6)}
                      className="btn btn-outline rounded-full !px-5 !py-2.5 text-xs font-bold text-center"
                    >
                      {t(lang, "viewResults")}
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/game/$mode"
                    params={{ mode: "classic" }}
                    search={{ daily: 1 }}
                    onClick={() => buzz(6)}
                    className="btn btn-primary rounded-full px-8 py-3.5 text-sm font-bold shadow-lg active:scale-95 text-center flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    {t(lang, "playDaily")}
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* 3. Segmented Control: All, Solo, Multiplayer, Ranked */}
          <div className="flex items-center justify-between gap-3">
            <SlidingTabs
              tabs={[
                { id: "all", label: t(lang, "all") },
                { id: "solo", label: t(lang, "solo") },
                { id: "multiplayer", label: t(lang, "multiplayer") },
                { id: "ranked", label: t(lang, "ranked") },
              ]}
              activeId={activeCategory}
              onChange={(nextCat) => {
                buzz(6);
                setActiveCategory(nextCat as ModeCategory);
              }}
            />
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
              {filteredModes.length} modes
            </span>
          </div>

          {/* 4. Rich Mode Cards (Directly matching Reference Image 5) */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {filteredModes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectMode(item)}
                  className="group flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-card/90 hover:bg-card shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer text-left ring-1 ring-black/5 dark:ring-white/5"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* 56px Rich Colored Circular Icon Container (Reference Image 5) */}
                    <div
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white shadow-md transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: item.accentColor,
                      }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground truncate">
                          {t(lang, item.titleKey)}
                        </span>
                        <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                          {t(lang, item.tagKey)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {t(lang, item.blurbKey)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-muted/60 text-muted-foreground group-hover:bg-accent-fill group-hover:text-[#03121C] transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </main>

      {/* 5. Apple HIG / Mobbin Mode Options Bottom Sheet */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="mx-auto max-w-xl p-5 sm:p-6 pb-8 border-none ring-1 ring-black/5 dark:ring-white/5">
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-black/5 dark:border-white/5 px-1 pb-3 pt-0">
            <div className="text-left">
              <DrawerTitle className="capitalize text-xl font-display font-semibold tracking-tight text-foreground">
                {t(lang, selectedMode)} · Match Options
              </DrawerTitle>
              <DrawerDescription className="mt-0.5 text-xs text-muted-foreground">
                Customize category pool, difficulty rating, and round time limit.
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close"
                onClick={() => buzz(4)}
                className="grid h-8 w-8 min-h-[32px] min-w-[32px] place-items-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="mt-4 space-y-4 max-h-[62vh] overflow-y-auto no-scrollbar pr-0.5">
            {/* Category Pool Picker (Apple Inset Grouped List) */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5 px-1">
                {t(lang, "category")}
              </span>
              <div className="space-y-1.5">
                {pools.map((p) => {
                  const active = pool === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        buzz(5);
                        setPool(p.id);
                      }}
                      className={`flex w-full items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all cursor-pointer ${
                        active
                          ? "bg-accent-fill/15 text-accent-text font-bold shadow-2xs ring-1 ring-accent-fill/30"
                          : "hover:bg-muted/40 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl select-none">
                          {p.id === "world" && "🌍"}
                          {p.id === "capitals" && "🏛️"}
                          {p.id === "countries" && "🚩"}
                          {p.id === "landmarks" && "🗼"}
                          {p.id === "stadiums" && "⚽"}
                          {p.id === "wonders" && "✨"}
                          {p.id === "attractions" && "🎢"}
                        </span>
                        <span className="text-sm font-semibold truncate">
                          {t(lang, p.labelKey)}
                        </span>
                      </div>
                      {active && (
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-accent-fill text-[#03121C] font-bold text-xs shadow-2xs">
                          <SymbolCheckmark className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Picker (Image 2 style with Color Accents) */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5 px-1">
                {t(lang, "difficulty")}
              </span>
              <div className="space-y-1.5">
                {diffs.map((d) => {
                  const active = difficulty === d;
                  const dotColor =
                    d === "easy"
                      ? "bg-emerald-500"
                      : d === "medium"
                      ? "bg-blue-500"
                      : d === "hard"
                      ? "bg-amber-500"
                      : d === "expert"
                      ? "bg-orange-500"
                      : "bg-rose-500";
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        buzz(5);
                        setDiff(d);
                      }}
                      className={`flex w-full items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all cursor-pointer ${
                        active
                          ? "bg-accent-fill/15 text-accent-text font-bold shadow-2xs ring-1 ring-accent-fill/30"
                          : "hover:bg-muted/40 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${dotColor}`} />
                        <span className="text-sm font-semibold capitalize">
                          {t(lang, d)}
                        </span>
                      </div>
                      {active && (
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-accent-fill text-[#03121C] font-bold text-xs shadow-2xs">
                          <SymbolCheckmark className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time per round (Horizontal Segmented Chips) */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5 px-1">
                {t(lang, "timePerRound")}
              </span>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((tOpt) => {
                  const active = time === tOpt;
                  return (
                    <button
                      key={tOpt}
                      type="button"
                      onClick={() => {
                        buzz(4);
                        setTime(tOpt);
                      }}
                      className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? "border-accent-fill bg-accent-fill/15 text-accent-text font-bold shadow-xs scale-102"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/60"
                      }`}
                    >
                      {tOpt === 0 ? "Unlimited ∞" : `${tOpt}s`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sins Card Selector (if mode === "sins") */}
            {selectedMode === "sins" && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5 px-1">
                  Select Sin Skill Card
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SIN_CARDS.map((sin) => {
                    const active = selectedSin === sin.id;
                    return (
                      <button
                        key={sin.id}
                        type="button"
                        onClick={() => {
                          buzz(4);
                          setSelectedSin(sin.id);
                        }}
                        className={`rounded-2xl border p-3 text-left transition-all ${
                          active
                            ? "border-accent-fill bg-accent-fill/10 ring-1 ring-accent-fill/30"
                            : "border-border bg-card hover:bg-muted/60"
                        }`}
                      >
                        <p className="text-xs font-bold capitalize text-foreground">{sin.sinName}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                          {sin.skillName} · {sin.boon}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Practice Mode (Apple Inset Grouped Switch Row) */}
            <div className="apple-group">
              <div className="apple-row">
                <div>
                  <p className="text-sm font-semibold text-foreground">Practice Mode</p>
                  <p className="text-[11px] text-muted-foreground">
                    Scores will not affect career stats or rank
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={practice}
                  aria-label="Practice Mode"
                  onClick={() => {
                    buzz(4);
                    setPractice((p) => !p);
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                    practice ? "bg-accent-fill" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      practice ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Start Game Action CTA (Matching Image 2 full pill button) */}
          <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/5 flex gap-2">
            <button
              type="button"
              onClick={handleStartGame}
              className="btn btn-primary w-full py-4 text-base font-bold rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Play className="h-4 w-4 fill-current" />
              Start {t(lang, selectedMode)}
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
