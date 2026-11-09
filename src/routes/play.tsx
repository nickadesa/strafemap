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
                className="w-full rounded-2xl border border-border bg-card py-2 pl-9 pr-8 text-sm outline-none transition-colors focus:border-foreground/60 focus:bg-background"
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

          {/* 2. Featured Daily Challenge Card (Section 7 Item 2) */}
          <section className="plate relative overflow-hidden p-6 md:p-8">
            <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-fill/15 px-3 py-1 text-xs font-semibold text-accent-text">
                    <Calendar className="h-3.5 w-3.5" />
                    {t(lang, "daily")} · {todayKey()}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    <Flame className="h-3.5 w-3.5 text-accent-text" /> {dailyStreak}d Streak
                  </span>
                </div>

                <h2 className="font-display mt-3 text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  {t(lang, "todayFivePins")}
                </h2>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                  {t(lang, "sameFivePlaces")}. Fixed global seed with verified pinpoint coordinates.
                </p>
              </div>

              {/* Status & CTA */}
              <div className="shrink-0">
                {hasPlayedDailyToday ? (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2">
                      <SymbolCheckmark className="h-4 w-4 text-accent-text" />
                      <span className="text-xs font-semibold">
                        {t(lang, "todayScore", { n: todayDailyRecord?.score.toLocaleString() ?? "0" })}
                      </span>
                    </div>
                    <Link
                      to="/game/$mode"
                      params={{ mode: "classic" }}
                      search={{ daily: 1 }}
                      onClick={() => buzz(6)}
                      className="btn btn-outline !px-4 !py-2 text-xs font-semibold"
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
                    className="btn btn-primary px-7 py-3 text-sm font-semibold shadow-md active:scale-95"
                  >
                    <Play className="h-4 w-4 mr-1.5 fill-current" />
                    {t(lang, "playDaily")}
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* 3. Segmented Control: All, Solo, Multiplayer, Ranked (Section 7 Item 3) */}
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
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {filteredModes.length} modes
            </span>
          </div>

          {/* 4. Apple Inset Grouped List of Modes (Section 7 Item 4) */}
          <div className="apple-group">
            {filteredModes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectMode(item)}
                  className="apple-row w-full text-left transition-colors hover:bg-muted/50 active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card border border-border shadow-xs"
                      style={{ color: item.accentColor }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {t(lang, item.titleKey)}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {t(lang, item.tagKey)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {t(lang, item.blurbKey)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </main>

      {/* 5. Mode Options Sheet / Drawer (Section 7 Item 5) */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="mx-auto max-w-2xl p-5 sm:p-6">
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-border px-0 pb-3 pt-1">
            <div>
              <DrawerTitle className="capitalize">
                {t(lang, selectedMode)} · Match Options
              </DrawerTitle>
              <DrawerDescription className="mt-1">
                Customize category pool, difficulty rating, and round time limit.
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
            {/* Category Pool Picker */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                {t(lang, "category")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {pools.map((p) => {
                  const active = pool === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        buzz(4);
                        setPool(p.id);
                      }}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "border-foreground/60 bg-accent-fill/15 text-accent-text"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {t(lang, p.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Picker */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                {t(lang, "difficulty")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {diffs.map((d) => {
                  const active = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        buzz(4);
                        setDiff(d);
                      }}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                        active
                          ? "border-foreground/60 bg-accent-fill/15 text-accent-text"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {t(lang, d)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time per round */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                {t(lang, "timePerRound")}
              </label>
              <div className="flex flex-wrap gap-1.5">
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
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "border-foreground/60 bg-accent-fill/15 text-accent-text"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
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
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                  Select Sin Skill Card
                </label>
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
                        className={`rounded-xl border p-2.5 text-left transition-all ${
                          active
                            ? "border-accent-fill bg-accent-fill/10"
                            : "border-border bg-card hover:bg-muted"
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

            {/* Practice Mode Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Practice Mode</p>
                <p className="text-[11px] text-muted-foreground">
                  Score will not be saved to records or stats
                </p>
              </div>
              <input
                type="checkbox"
                checked={practice}
                onChange={(e) => setPractice(e.target.checked)}
                className="h-4 w-4 accent-accent-fill"
              />
            </div>
          </div>

          {/* Start Game Action */}
          <div className="mt-5 pt-3 border-t border-border flex gap-2">
            <button
              type="button"
              onClick={handleStartGame}
              className="btn btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
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
