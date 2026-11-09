import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { todayKey } from "@/lib/game/engine";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { getRank, loadRank, getAdjacentRanks } from "@/lib/rank";
import { ACH_ALL, loadUnlocked, syncAchievements } from "@/lib/achievements";
import { AvatarFrame, ClanTagPill, RankBanner, VerifiedBadge } from "@/components/RankVisuals";
import { Flag } from "@/components/Flag";
import { computeLevelFromExp, useFeed, useSocialProfile, type StoryHighlight } from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import {
  SymbolCompass,
  SymbolTrophy,
  SymbolPerson2,
  SymbolBag,
  SymbolChartBar,
  SymbolMedal,
  SymbolCheckmark,
} from "@/components/SFSymbols";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { Flame, ChevronRight, X, Sparkles, Coins } from "lucide-react";

const QUICK_EXPLORE_MODES = [
  { id: "capitals", name: "Capitals", pool: "capitals", icon: "🏛️", pillClass: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { id: "landmarks", name: "Landmarks", pool: "landmarks", icon: "🗼", pillClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  { id: "stadiums", name: "Stadiums", pool: "stadiums", icon: "⚽", pillClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { id: "wonders", name: "Wonders", pool: "wonders", icon: "✨", pillClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { id: "sins", name: "7 Sins", mode: "sins", icon: "🃏", pillClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  { id: "shrink", name: "Shrink Zone", mode: "shrink", icon: "🎯", pillClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  { id: "country-quiz", name: "Country Quiz", directRoute: "/country-guess", icon: "🚩", pillClass: "bg-orange-500/15 text-orange-300 border-orange-500/30" },
  { id: "duel", name: "1v1 Duel", directRoute: "/duel", icon: "⚔️", pillClass: "bg-red-500/15 text-red-300 border-red-500/30" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STRAFE — Precision Map Game" },
      { name: "description", content: "Daily 5-pin challenge, Ranked ladders, multiplayer parties, and community highlights on STRAFE." },
      { property: "og:title", content: "STRAFE — Precision Map Game" },
      { property: "og:description", content: "Daily 5-pin challenge, Ranked ladders, multiplayer parties, and community highlights on STRAFE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [records] = useRecords();
  const [settings] = useSettings();
  const [social] = useSocialProfile();
  const { stories } = useFeed();
  const lang = (settings.language ?? "en") as Lang;
  const stats = computeStats(records ?? []);
  const rank = loadRank();
  const curRank = getRank(rank.rp, rank.championPosition);
  const adjacent = getAdjacentRanks(rank.rp, rank.championPosition);
  const lvl = computeLevelFromExp(social.exp);

  const todayRecord = (records ?? []).find(
    (r) => r.daily && (r.date.slice(0, 10) === todayKey() || r.seed === todayKey())
  );
  const dailyStreak = Math.max(1, stats.dailies || 4);

  const [unlockedMap, setUnlockedMap] = useState<Record<string, string>>({});
  const [activeStory, setActiveStory] = useState<StoryHighlight | null>(null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [communityTab, setCommunityTab] = useState<"top" | "following">("top");

  useEffect(() => {
    syncAchievements(records ?? [], rank);
    setUnlockedMap(loadUnlocked());
  }, [records, rank.rp]);

  // Formatted date according to active language (e.g., "Sunday, November 8")
  const todayFormatted = useMemo(() => {
    const d = new Date();
    try {
      return new Intl.DateTimeFormat(lang, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return d.toDateString();
    }
  }, [lang]);

  // Next achievement nearest to completion
  const nextAchievement = useMemo(() => {
    return ACH_ALL.find((a) => !unlockedMap[a.id]) ?? ACH_ALL[0]!;
  }, [unlockedMap]);

  const unlockedCount = Object.keys(unlockedMap).length;

  // Filtered community highlights for Home page
  const communityHighlights = useMemo(() => {
    if (communityTab === "following") {
      const followingList = stories.filter((s) => social.followingIds.includes(s.authorId));
      return followingList.length > 0 ? followingList.slice(0, 4) : stories.slice(0, 4);
    }
    return stories.slice(0, 4);
  }, [stories, communityTab, social.followingIds]);

  // Rank progression text
  const rpToNextText = useMemo(() => {
    if (adjacent.next) {
      const rpDiff = Math.max(0, adjacent.next.min - rank.rp);
      return t(lang, "rpToNext", { n: rpDiff, rank: adjacent.next.name });
    }
    return t(lang, "topRank");
  }, [adjacent.next, rank.rp, lang]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-24 pt-4 md:px-6 md:pb-12 md:pt-8">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* 1. Apple Large Title Header + Localized Date + Coins Chip */}
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {todayFormatted}
              </p>
              <h1 className="font-display mt-0.5 text-3xl tracking-tight text-foreground md:text-4xl">
                {t(lang, "welcomeBack")}, {social.nickname}
              </h1>
            </div>

            {/* Top Coins Chip & Level Pill */}
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                search={{ tab: "shop" } as any}
                onClick={() => buzz(6)}
                className="apple-pill flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted active:scale-95 transition-all"
              >
                <Coins className="h-3.5 w-3.5 text-accent-text" />
                <span className="readout">{social.coins.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground">Coins</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => buzz(6)}
                className="apple-pill flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted active:scale-95 transition-all"
              >
                <AvatarFrame
                  src={social.avatarUrl}
                  name={social.nickname}
                  rp={rank.rp}
                  championPosition={rank.championPosition}
                  size={20}
                />
                <span className="readout text-accent-text">Lv.{lvl.level}</span>
              </Link>
            </div>
          </header>

          {/* 2. Hero Card: Today's Five Pins */}
          <section className="plate relative overflow-hidden p-6 md:p-8">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-fill/15 px-3 py-1 text-xs font-semibold text-accent-text">
                <Sparkles className="h-3.5 w-3.5" />
                {t(lang, "daily")} · {todayKey()}
              </span>

              <h2 className="font-display mt-3 text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {t(lang, "todayFivePins")}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t(lang, "sameFivePlaces")}. Drop your pin as close as you can to rack up precision points.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {todayRecord ? (
                  <>
                    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5">
                      <SymbolCheckmark className="h-4 w-4 text-accent-text" />
                      <span className="text-sm font-semibold">
                        {t(lang, "todayScore", { n: todayRecord.score.toLocaleString() })}
                      </span>
                    </div>
                    <Link
                      to="/play"
                      onClick={() => buzz(6)}
                      className="btn btn-outline px-5 py-2.5 text-xs font-semibold"
                    >
                      {t(lang, "chooseMode")}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/game/$mode"
                      params={{ mode: "classic" }}
                      search={{ daily: 1 }}
                      onClick={() => buzz(6)}
                      className="btn btn-primary px-7 py-3 text-sm font-semibold shadow-md active:scale-95"
                    >
                      {t(lang, "playDaily")}
                    </Link>
                    <Link
                      to="/play"
                      onClick={() => buzz(6)}
                      className="btn btn-outline px-6 py-3 text-sm font-semibold"
                    >
                      {t(lang, "chooseMode")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* 3. Explore Modes Carousel (Mobbin Style Horizontal Pills) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                Explore Modes
              </h3>
              <Link
                to="/play"
                onClick={() => buzz(6)}
                className="text-xs font-semibold text-accent-text hover:underline flex items-center gap-0.5"
              >
                See All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
              {QUICK_EXPLORE_MODES.map((item) => {
                if (item.directRoute) {
                  return (
                    <Link
                      key={item.id}
                      to={item.directRoute as any}
                      onClick={() => buzz(6)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 ${item.pillClass}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                }
                if (item.mode) {
                  return (
                    <Link
                      key={item.id}
                      to="/game/$mode"
                      params={{ mode: item.mode as any }}
                      onClick={() => buzz(6)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 ${item.pillClass}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={item.id}
                    to="/game/$mode"
                    params={{ mode: "classic" }}
                    search={{ pool: item.pool as any }}
                    onClick={() => buzz(6)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 ${item.pillClass}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 4. Paired Cards: Streak (7-day bar) & Rank Progress */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Streak Card */}
            <button
              type="button"
              onClick={() => {
                buzz(6);
                setShowDailyModal(true);
              }}
              className="plate flex flex-col justify-between p-5 text-left transition-all hover:bg-muted/30 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Flame className="h-4 w-4 text-accent-text" />
                  {t(lang, "dailyStreak")}
                </span>
                <span className="text-xs text-muted-foreground hover:text-foreground">
                  Calendar →
                </span>
              </div>

              <div className="my-3">
                <p className="font-display text-3xl tracking-tight text-foreground">
                  {t(lang, "dayStreak", { n: dailyStreak })}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Play daily to maintain your global consecutive score
                </p>
              </div>

              {/* Visual 7-Day Streak Bar */}
              <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                  const done = d <= dailyStreak;
                  return (
                    <div
                      key={d}
                      className={`flex flex-col items-center justify-center rounded-xl py-1.5 text-[10px] font-semibold transition-colors ${
                        done
                          ? "bg-accent-fill text-[#03121C]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>D{d}</span>
                      <span className="mt-0.5 text-xs">{done ? "✓" : "·"}</span>
                    </div>
                  );
                })}
              </div>
            </button>

            {/* Rank Card */}
            <Link
              to="/rank"
              onClick={() => buzz(6)}
              className="plate flex flex-col justify-between p-5 transition-all hover:bg-muted/30 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <SymbolTrophy className="h-4 w-4 text-accent-text" />
                  {t(lang, "currentRank")}
                </span>
                <span className="text-xs text-muted-foreground hover:text-foreground">
                  Ladder →
                </span>
              </div>

              <div className="my-3 flex items-center gap-3.5">
                <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={54} />
                <div>
                  <p className="font-display text-2xl" style={{ color: curRank.tier.accent }}>
                    {curRank.name}
                  </p>
                  <p className="readout text-xs font-semibold text-accent-text">
                    {rank.rp.toLocaleString()} RP
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-2.5">
                <p className="truncate text-xs font-medium text-muted-foreground">
                  {rpToNextText}
                </p>
              </div>
            </Link>
          </div>

          {/* 4. Community Highlights (Apple-style list with Top / Following) */}
          <section className="plate p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
              <div>
                <h2 className="font-display text-xl text-foreground">
                  {t(lang, "community")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Recent top precision rounds shared by global players
                </p>
              </div>

              <div className="flex items-center gap-3">
                <SlidingTabs
                  tabs={[
                    { id: "top", label: "Top" },
                    { id: "following", label: "Following" },
                  ]}
                  activeId={communityTab}
                  onChange={(tabId) => {
                    buzz(6);
                    setCommunityTab(tabId as "top" | "following");
                  }}
                />

                <Link
                  to="/community"
                  onClick={() => buzz(6)}
                  className="text-xs font-semibold text-accent-text hover:underline"
                >
                  See all →
                </Link>
              </div>
            </div>

            {/* Compact 4-Row Highlights List */}
            <div className="mt-3 divide-y divide-border">
              {communityHighlights.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setActiveStory(st)}
                  className="flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-muted/40 rounded-xl px-2 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AvatarFrame
                      name={st.authorName}
                      rp={st.authorRp}
                      championPosition={st.authorChampPos}
                      size={36}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <ClanTagPill tag={st.authorClanTag} />
                        <span className="truncate text-xs font-semibold text-foreground">
                          {st.authorName}
                        </span>
                        <VerifiedBadge type={st.authorVerified} size={12} />
                        <Flag country={st.country} size={14} />
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {st.mode} · {st.caption}
                      </p>
                    </div>
                  </div>

                  <div className="pl-3 text-right shrink-0">
                    <p className="font-display text-base text-accent-text">{st.score}</p>
                    <p className="text-[10px] text-muted-foreground">{st.accuracy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Next Achievement & More Grouped List */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Next Achievement Card */}
            <section className="plate flex flex-col justify-between p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-foreground">
                    {t(lang, "nextAchievement")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {unlockedCount} of {ACH_ALL.length} unlocked
                  </p>
                </div>
                <Link
                  to="/achievements"
                  onClick={() => buzz(6)}
                  className="text-xs font-semibold text-accent-text hover:underline"
                >
                  All badges →
                </Link>
              </div>

              <div className="my-4 flex items-center gap-3.5 rounded-2xl border border-border bg-card/60 p-3.5">
                <img
                  src={nextAchievement.files.compact.unlocked}
                  alt={nextAchievement.name}
                  className="h-12 w-12 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-semibold text-foreground">
                    {nextAchievement.name}
                  </span>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {nextAchievement.requirement}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-accent-fill"
                      style={{ width: `${Math.min(100, (stats.games / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Complete daily and ranked matches to claim exclusive cosmetic pins.
              </p>
            </section>

            {/* 6. More: Apple Inset Grouped List (Stats, Party, Shop) */}
            <div className="apple-group self-center">
              <Link
                to="/stats"
                onClick={() => buzz(6)}
                className="apple-row transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-fill/15 text-accent-text">
                    <SymbolChartBar className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {t(lang, "stats")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Accuracy & personal bests ({stats.games} games)
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>

              <Link
                to="/party"
                onClick={() => buzz(6)}
                className="apple-row transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-fill/15 text-accent-text">
                    <SymbolPerson2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {t(lang, "party")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      2–16 players · Voice chat
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>

              <Link
                to="/profile"
                search={{ tab: "shop" } as any}
                onClick={() => buzz(6)}
                className="apple-row transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-fill/15 text-accent-text">
                    <SymbolBag className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      Shop
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Pins, auras and tags ({social.coins.toLocaleString()} Coins)
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md">
          <div className="story-ring relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[24px]">
            {activeStory.imageUrl ? (
              <div className="relative h-full w-full rounded-[21px] overflow-hidden">
                <img src={activeStory.imageUrl} alt={activeStory.caption} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/60 p-6 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AvatarFrame name={activeStory.authorName} rp={activeStory.authorRp} size={32} />
                      <span className="font-semibold text-sm">{activeStory.authorName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStory(null)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-black/60"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-display text-4xl text-accent-text">{activeStory.score}</p>
                    <p className="mt-1 text-sm text-white/90">{activeStory.caption}</p>
                    <Link
                      to="/community"
                      onClick={() => setActiveStory(null)}
                      className="btn btn-primary mt-4 w-full py-2.5 text-xs font-semibold"
                    >
                      View in Community
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex h-full w-full flex-col justify-between rounded-[21px] p-6 text-white"
                style={{ background: activeStory.gradient }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AvatarFrame name={activeStory.authorName} rp={activeStory.authorRp} size={32} />
                    <span className="font-semibold text-sm">{activeStory.authorName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStory(null)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-black/50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="font-display text-5xl text-accent-text">{activeStory.score}</p>
                  <p className="mt-2 text-sm">{activeStory.caption}</p>
                </div>
                <Link
                  to="/community"
                  onClick={() => setActiveStory(null)}
                  className="btn btn-primary w-full py-2.5 text-xs font-semibold"
                >
                  View in Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Streak Calendar Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="plate max-w-md w-full p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Flame className="h-3.5 w-3.5 text-accent-text" /> Daily Streak Hub
              </span>
              <button
                type="button"
                onClick={() => setShowDailyModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-display mt-3 text-3xl flex items-center gap-2">
              <Flame className="h-7 w-7 text-accent-text" /> {dailyStreak} Day Streak
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Global Seed: {todayKey()} · Same 5 coordinates for every player worldwide.
            </p>

            {/* 7-Day Streak Milestones */}
            <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                const done = d <= dailyStreak;
                return (
                  <div
                    key={d}
                    className={`rounded-xl border p-2 ${
                      done
                        ? "border-foreground/60 bg-accent-fill/15 text-accent-text"
                        : "border-border bg-background/40 text-muted-foreground"
                    }`}
                  >
                    <p className="text-[10px] font-semibold">D{d}</p>
                    <p className="mt-1 flex items-center justify-center text-sm">
                      {done ? <Flame className="h-4 w-4 text-accent-text" /> : "·"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex gap-2">
              <Link
                to="/game/$mode"
                params={{ mode: "classic" }}
                search={{ daily: 1 }}
                onClick={() => setShowDailyModal(false)}
                className="btn btn-primary flex-1 py-3 text-sm font-semibold"
              >
                Play Today's Seed
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
