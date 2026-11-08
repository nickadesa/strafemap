import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  IconPin,
  IconCalendar,
} from "@/components/icons";
import { todayKey } from "@/lib/game/engine";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { getRank, loadRank } from "@/lib/rank";
import { ACH_ALL, loadUnlocked, syncAchievements } from "@/lib/achievements";
import { AvatarFrame, ClanTagPill, RankBanner, VerifiedBadge } from "@/components/RankVisuals";
import { Flag } from "@/components/Flag";
import { computeLevelFromExp, useFeed, useSocialProfile, type StoryHighlight } from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { BarChart3, Flame, Plus, ShoppingBag, Sparkles, Users, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STRAFE — Map guessing game" },
      { name: "description", content: "Play daily map challenges and precision geography games on STRAFE." },
      { property: "og:title", content: "STRAFE — Map guessing game" },
      { property: "og:description", content: "Play daily map challenges and precision geography games on STRAFE." },
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
  const { stories, addStory } = useFeed();
  const lang = (settings.language ?? "en") as Lang;
  const stats = computeStats(records ?? []);
  const rank = loadRank();
  const curRank = getRank(rank.rp, rank.championPosition);
  const lvl = computeLevelFromExp(social.exp);

  const today = (records ?? []).find((r) => r.daily && r.date.slice(0, 10) === todayKey());
  const dailyStreak = Math.max(1, stats.dailies || 4);

  const [unlockedMap, setUnlockedMap] = useState<Record<string, string>>({});
  const [activeStory, setActiveStory] = useState<StoryHighlight | null>(null);
  const [showDailyModal, setShowDailyModal] = useState(false);

  useEffect(() => {
    syncAchievements(records ?? [], rank);
    setUnlockedMap(loadUnlocked());
  }, [records, rank.rp]);

  // Sort achievements so UNLOCKED achievements always appear at the top!
  const sortedAchievements = useMemo(() => {
    return [...ACH_ALL]
      .sort((a, b) => Number(Boolean(unlockedMap[b.id])) - Number(Boolean(unlockedMap[a.id])))
      .slice(0, 8);
  }, [unlockedMap]);

  const unlockedCount = Object.keys(unlockedMap).length;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-12 pt-6 md:px-6 md:pt-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header with Level Progress Pill */}
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-3xl md:text-4xl">STRAFE</h1>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  SEASON 1
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Drop one pin. Know the map, climb the ladder.
              </p>
            </div>

            <Link
              to="/profile"
              className="plate hidden items-center gap-3 px-4 py-2 transition-colors hover:bg-muted/50 sm:flex"
            >
              <AvatarFrame
                src={social.avatarUrl}
                name={social.nickname}
                rp={rank.rp}
                championPosition={rank.championPosition}
                size={42}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <ClanTagPill tag={social.clanTag} color={social.clanTagColor} />
                  <span className="text-sm font-semibold">{social.nickname}</span>
                  <VerifiedBadge type={social.verifiedBadge} size={14} />
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="readout text-xs font-semibold text-accent-text">Lv.{lvl.level}</span>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-accent-fill"
                      style={{ width: `${lvl.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </header>

          {/* Hero Banner: Neon Green Accents on Solid Surface */}
          <section className="plate relative overflow-hidden p-6 md:p-8">
            <div className="relative grid gap-6 md:grid-cols-[1.35fr_1fr] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <Flame className="h-3.5 w-3.5 text-accent-text" />
                  <span>
                    {t(lang, "dailyStreak")}:{" "}
                    <strong className="readout text-accent-text">{dailyStreak} Days</strong>
                  </span>
                  <span className="text-muted-foreground">· {todayKey()}</span>
                </div>

                <h2 className="font-display mt-3 text-4xl leading-none md:text-6xl">
                  {today ? `${today.score.toLocaleString()} pts` : "MAKE YOUR MARK."}
                </h2>
                <p className="mt-2.5 max-w-lg text-sm text-muted-foreground">
                  {today
                    ? `Daily Challenge completed (${today.score.toLocaleString()} / ${today.max.toLocaleString()}). Jump into Ranked or the Modes hub`
                    : "Five precision drops across the globe. Play the Modes Hub or lock in today's global Daily seed."}
                </p>

                {/* Primary Play (#D2F801) + Daily Challenge Outline CTA */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to="/play"
                    className="btn btn-primary px-7 py-3.5 text-base font-semibold shadow-lg"
                  >
                    <IconPin className="h-4 w-4" />
                    {t(lang, "playNow")}
                  </Link>

                  <Link
                    to="/game/$mode"
                    params={{ mode: "classic" }}
                    search={{ daily: 1 }}
                    className="btn btn-outline px-6 py-3.5 text-base font-semibold"
                  >
                    <IconCalendar className="h-4 w-4" />
                    {t(lang, "daily")} Challenge · {dailyStreak} Days
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowDailyModal(true)}
                    className="btn btn-outline !px-4 !py-3 text-xs font-semibold"
                  >
                    Streak Calendar
                  </button>
                </div>
              </div>

              {/* Right Mini Rank & Quick Stats Card */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/50 p-4">
                <div className="flex items-center gap-3">
                  <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={72} />
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {t(lang, "currentRank")}
                    </span>
                    <p className="font-display text-2xl" style={{ color: curRank.tier.accent }}>
                      {curRank.name}
                    </p>
                    <p className="readout text-xs font-semibold text-accent-text">
                      {rank.rp.toLocaleString()} RP
                    </p>
                  </div>
                </div>
                <Link to="/rank" className="btn btn-outline !px-3.5 !py-2 text-xs font-semibold">
                  {t(lang, "rank")}
                </Link>
              </div>
            </div>
          </section>

          {/* 4:5 Story Strip with Rainbow Rounded Borders */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-text" />
                <h2 className="text-sm font-semibold text-muted-foreground">
                  {t(lang, "stories")}
                </h2>
              </div>
              <Link
                to="/profile"
                search={{ tab: "feed" } as any}
                className="text-xs font-semibold text-accent-text hover:underline"
              >
                Open social feed
              </Link>
            </div>

            <div className="no-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
              {/* Post Your Own 4:5 Highlight Card */}
              <button
                type="button"
                onClick={() =>
                  addStory({
                    authorId: "me",
                    authorName: social.nickname,
                    authorUsername: social.username,
                    authorClanTag: social.clanTag,
                    authorVerified: social.verifiedBadge,
                    authorRp: rank.rp,
                    authorChampPos: rank.championPosition,
                    country: social.country,
                    mode: "Daily Challenge",
                    score: `${Math.max(21450, stats.bestScore).toLocaleString()}`,
                    accuracy: "96.4%",
                    caption: "New personal best on STRAFE",
                    gradient: "linear-gradient(160deg, #161616 0%, #262626 100%)",
                  })
                }
                className="story-ring group relative aspect-[4/5] w-36 shrink-0 rounded-[18px] text-left transition-opacity hover:opacity-90 sm:w-40"
              >
                <div className="flex h-full w-full flex-col justify-between rounded-[15.5px] bg-[#161616] p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-accent-fill text-[#161616]">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-base text-white">{t(lang, "addStory")}</p>
                    <p className="text-[11px] text-muted-foreground">{t(lang, "shareRound")}</p>
                  </div>
                </div>
              </button>

              {stories.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStory(st)}
                  className="story-ring group relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-[18px] text-left transition-opacity hover:opacity-90 sm:w-40"
                >
                  {st.imageUrl ? (
                    <div className="relative h-full w-full rounded-[15.5px] overflow-hidden">
                      <img src={st.imageUrl} alt={st.caption} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 p-3 flex flex-col justify-between text-white">
                        <AvatarFrame
                          name={st.authorName}
                          rp={st.authorRp}
                          championPosition={st.authorChampPos}
                          size={32}
                        />
                        <div>
                          <p className="truncate font-semibold text-xs text-white">{st.authorName}</p>
                          <p className="truncate text-[10px] text-white/75">{st.caption}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex h-full w-full flex-col justify-between rounded-[15.5px] p-3 text-white"
                      style={{ background: st.gradient }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <AvatarFrame
                          name={st.authorName}
                          rp={st.authorRp}
                          championPosition={st.authorChampPos}
                          size={34}
                        />
                        <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
                          {st.mode}
                        </span>
                      </div>

                      <div>
                        <p className="font-display text-2xl text-accent-text">{st.score}</p>
                        <p className="line-clamp-2 text-[11px] leading-snug text-white/90">
                          {st.caption}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold">
                          <ClanTagPill tag={st.authorClanTag} />
                          <span className="truncate">{st.authorName}</span>
                          <VerifiedBadge type={st.authorVerified} size={12} />
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>


          {/* Achievements Showcase (Unlocked Sorted to the Top!) + Stats & Party Cards */}
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            {/* Achievements Card (Unlocked First) */}
            <section className="plate p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl">{t(lang, "achievements")}</h2>
                  <p className="readout text-xs text-muted-foreground">
                    {t(lang, "achUnlocked", { n: unlockedCount, total: ACH_ALL.length })} · Unlocked sorted to top
                  </p>
                </div>
                <Link to="/achievements" className="btn btn-outline !px-3.5 !py-1.5 text-xs font-semibold">
                  {t(lang, "viewAll")}
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
                {sortedAchievements.map((a) => {
                  const isUnlocked = Boolean(unlockedMap[a.id]);
                  return (
                    <Link
                      key={a.id}
                      to="/achievements"
                      className={`flex flex-col items-center rounded-2xl border p-2 text-center transition-colors ${
                        isUnlocked
                          ? "border-border bg-accent-fill/10"
                          : "border-border bg-background/40 opacity-60"
                      }`}
                    >
                      <img
                        src={isUnlocked ? a.files.compact.unlocked : a.files.compact.locked}
                        alt={a.name}
                        className="h-12 w-12 object-contain"
                        loading="lazy"
                      />
                      <span className="mt-1 line-clamp-1 text-[11px] font-semibold">{a.name}</span>
                      <span
                        className={`text-[10px] font-semibold ${
                          isUnlocked ? "text-accent-text" : "text-muted-foreground"
                        }`}
                      >
                        {isUnlocked ? "Unlocked" : "Locked"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Quick Links in Apple Inset Grouped Style (Matching One Design System Spec) */}
            <div className="apple-group">
              <Link
                to="/stats"
                className="apple-row transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-fill/15 text-accent-text">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {stats.games} Games · {stats.bestScore.toLocaleString()} PB
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Accuracy & personal bests
                    </p>
                  </div>
                </div>
                <span className="apple-pill bg-muted/80 text-foreground text-xs font-semibold px-3 py-1 shrink-0">
                  View
                </span>
              </Link>

              <Link
                to="/party"
                className="apple-row transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-fill/15 text-accent-text">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{t(lang, "party")} + Voice Chat</p>
                    <p className="text-xs text-muted-foreground truncate">
                      2–16 players · Unlimited ∞ timer
                    </p>
                  </div>
                </div>
                <span className="apple-pill bg-muted/80 text-foreground text-xs font-semibold px-3 py-1 shrink-0">
                  Join
                </span>
              </Link>

              <Link
                to="/profile"
                search={{ tab: "shop" } as any}
                className="apple-row transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-fill/15 text-accent-text">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      Cosmetic Shop ({social.coins?.toLocaleString() ?? "10,000"} Coins)
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Super Chat Auras, Pins & TAGs
                    </p>
                  </div>
                </div>
                <span className="apple-pill bg-accent-fill text-black text-xs font-bold px-3 py-1 shrink-0">
                  Shop
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 4:5 Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md">
          <div className="story-ring relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[24px]">
            {activeStory.imageUrl ? (
              <div className="relative h-full w-full rounded-[21px] overflow-hidden">
                <img src={activeStory.imageUrl} alt={activeStory.caption} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 p-6 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <AvatarFrame
                        name={activeStory.authorName}
                        rp={activeStory.authorRp}
                        championPosition={activeStory.authorChampPos}
                        size={40}
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <ClanTagPill tag={activeStory.authorClanTag} />
                          <span className="font-semibold text-sm">{activeStory.authorName}</span>
                          <VerifiedBadge type={activeStory.authorVerified} size={13} />
                        </div>
                        <p className="text-xs text-white/75">
                          @{activeStory.authorUsername} · {activeStory.timestamp}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStory(null)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {activeStory.mode}
                    </span>
                    <p className="font-display mt-2 text-4xl text-accent-text">{activeStory.score}</p>
                    <p className="mt-1 text-sm text-white/90">{activeStory.caption}</p>
                    <div className="mt-4 flex justify-between gap-2">
                      <Link
                        to="/game/$mode"
                        params={{ mode: "classic" }}
                        onClick={() => setActiveStory(null)}
                        className="btn btn-primary w-full py-2.5 text-xs font-semibold"
                      >
                        Challenge This Score
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex h-full w-full flex-col justify-between rounded-[21px] p-6 text-white"
                style={{ background: activeStory.gradient }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AvatarFrame
                      name={activeStory.authorName}
                      rp={activeStory.authorRp}
                      championPosition={activeStory.authorChampPos}
                      size={44}
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <ClanTagPill tag={activeStory.authorClanTag} />
                        <span className="font-semibold">{activeStory.authorName}</span>
                        <VerifiedBadge type={activeStory.authorVerified} size={14} />
                        <Flag country={activeStory.country} size={16} />
                      </div>
                      <p className="text-xs text-white/75">
                        @{activeStory.authorUsername} · {activeStory.timestamp}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStory(null)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="my-auto text-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {activeStory.mode}
                  </span>
                  <p className="font-display mt-4 text-6xl text-accent-text">{activeStory.score}</p>
                  <p className="mt-1 text-sm font-semibold text-white/80">
                    Accuracy: {activeStory.accuracy}
                  </p>
                  <p className="mt-4 rounded-2xl bg-black/35 p-4 text-sm leading-relaxed backdrop-blur-sm">
                    “{activeStory.caption}”
                  </p>
                </div>

                <div className="flex justify-between gap-2">
                  <Link
                    to="/game/$mode"
                    params={{ mode: "classic" }}
                    onClick={() => setActiveStory(null)}
                    className="btn btn-primary w-full py-3 text-sm font-semibold"
                  >
                    Challenge This Score
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily Challenge Streak & Global Briefing Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="plate max-w-md w-full p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Flame className="h-3.5 w-3.5 text-[#161616]" /> Daily Challenge Hub
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
