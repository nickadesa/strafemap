import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { getRank, loadRank } from "@/lib/rank";
import { ACH_ALL, loadUnlocked, syncAchievements } from "@/lib/achievements";
import { ActivityRings } from "@/components/BoardUIActivityRings";
import { ContributionsHeatmap } from "@/components/BoardUIContributions";
import { useCountUp } from "@/lib/use-count-up";
import {
  AvatarFrame,
  ClanTagPill,
  RankBanner,
  VerifiedBadge,
  type VerifiedBadgeType,
} from "@/components/RankVisuals";
import { Flag } from "@/components/Flag";
import {
  COMMUNITY_PLAYERS,
  GACHA_ITEMS,
  GACHA_PACKS,
  computeLevelFromExp,
  useClans,
  useFeed,
  useSocialProfile,
  type CommunityPlayer,
  type GachaItem,
  type GachaPack,
  type StoryHighlight,
} from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import {
  SymbolCompass,
  SymbolShield,
  SymbolBag,
  SymbolChartBar,
  SymbolPerson,
  SymbolMedal,
} from "@/components/SFSymbols";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { toast } from "sonner";
import {
  BarChart3,
  Check,
  Compass,
  Edit3,
  Eye,
  Heart,
  Image,
  MessageCircle,
  Plus,
  Send,
  Shield,
  ShoppingBag,
  Sparkles,
  Trophy,
  Upload,
  UserPlus,
  Users,
  Settings,
  X,
} from "lucide-react";

type ProfileTab = "overview" | "achievements" | "stats" | "shop" | "gacha";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile, Shop, Achievements & Stats — STRAFE" },
      { name: "description", content: "Your STRAFE profile, achievements progress, game stats, and cosmetic shop." },
      { property: "og:title", content: "Profile, Shop, Achievements & Stats — STRAFE" },
      { property: "og:description", content: "Your STRAFE profile, achievements progress, game stats, and cosmetic shop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { tab?: ProfileTab } => {
    const tab = s["tab"];
    if (tab === "overview" || tab === "achievements" || tab === "stats" || tab === "shop" || tab === "gacha") return { tab };
    return {};
  },
  component: ProfileHubPage,
});

function ProfileHubPage() {
  const search = Route.useSearch();
  const [settings, updateSettings] = useSettings();
  const [records] = useRecords();
  const [social, updateSocial] = useSocialProfile();
  const lang = (settings.language ?? "en") as Lang;
  const [tab, setTab] = useState<ProfileTab>(search.tab ?? "overview");

  useEffect(() => {
    if (search.tab) setTab(search.tab);
  }, [search.tab]);

  const rank = loadRank();
  const stats = computeStats(records ?? []);
  const lvl = computeLevelFromExp(social.exp);

  const [unlockedMap, setUnlockedMap] = useState<Record<string, string>>({});
  useEffect(() => {
    syncAchievements(records ?? [], rank);
    setUnlockedMap(loadUnlocked());
  }, [records, rank.rp]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Top Navigation Segmented Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SlidingTabs
              tabs={[
                {
                  id: "overview",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <SymbolPerson fill={tab === "overview"} className="h-4 w-4" />
                      {t(lang, "overview")}
                    </span>
                  ),
                },
                {
                  id: "achievements",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <SymbolMedal fill={tab === "achievements"} className="h-4 w-4" />
                      {t(lang, "achievements")}
                    </span>
                  ),
                },
                {
                  id: "stats",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <SymbolChartBar fill={tab === "stats"} className="h-4 w-4" />
                      {t(lang, "stats")}
                    </span>
                  ),
                },
                {
                  id: "shop",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <SymbolBag fill={tab === "shop" || tab === "gacha"} className="h-4 w-4" />
                      {t(lang, "shop")}
                    </span>
                  ),
                },
              ]}
              activeId={tab === "gacha" ? "shop" : tab}
              onChange={(nextTab) => {
                buzz(6);
                setTab(nextTab as ProfileTab);
              }}
            />

            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="inline-grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95"
                title={t(lang, "settings")}
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {tab === "overview" && (
            <XStyleProfileTab
              social={social}
              updateSocial={updateSocial}
              updateSettings={updateSettings}
              rank={rank}
              stats={stats}
              lvl={lvl}
              unlockedMap={unlockedMap}
              lang={lang}
            />
          )}

          {tab === "achievements" && (
            <div className="plate p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">{t(lang, "achievements")}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t(lang, "achUnlocked", { n: Object.keys(unlockedMap).length, total: ACH_ALL.length })}
                  </p>
                </div>
                <Link to="/achievements" className="btn btn-primary text-xs font-semibold">
                  Browse All 250 →
                </Link>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted p-0.5">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${(Object.keys(unlockedMap).length / ACH_ALL.length) * 100}%`,
                    backgroundColor: "var(--accent-fill)",
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
                {ACH_ALL.slice(0, 12).map((a) => {
                  const on = Boolean(unlockedMap[a.id]);
                  return (
                    <div
                      key={a.id}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border border-border/50 p-2.5 text-center transition-all ${
                        on ? "bg-card/80" : "bg-card/25 opacity-50"
                      }`}
                    >
                      <img
                        src={on ? a.files.compact.unlocked : a.files.compact.locked}
                        alt=""
                        loading="lazy"
                        className="aspect-[288/280] w-full"
                      />
                      <span className="line-clamp-1 text-[11px] font-medium text-foreground">{a.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "stats" && (
            <div className="space-y-4">
              <div className="plate p-6">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-foreground sm:text-2xl">{t(lang, "stats")}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Review your performance, accuracy, and concentric velocity metrics.
                    </p>
                  </div>
                  <Link to="/stats" className="btn btn-primary text-xs font-semibold">
                    Detailed Stats →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-6">
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <p className="readout text-2xl font-bold text-foreground">{stats.games.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t(lang, "gamesLabel") || "Games"}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <p className="readout text-2xl font-bold text-foreground">{stats.bestScore.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t(lang, "bestScore") || "Best score"}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <p className="readout text-2xl font-bold text-foreground">{Math.round(stats.accuracy * 100)}%</p>
                    <p className="text-xs text-muted-foreground">{t(lang, "accuracy") || "Accuracy"}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <p className="readout text-2xl font-bold text-foreground">{stats.currentStreak}</p>
                    <p className="text-xs text-muted-foreground">{t(lang, "currentStreak") || "Streak"}</p>
                  </div>
                </div>

                <div className="flex justify-center py-2">
                  <ActivityRings
                    rounds={stats.rounds || 4}
                    roundsTarget={10}
                    accuracy={Math.round((stats.accuracy || 0.84) * 100)}
                    streak={stats.currentStreak || 7}
                    streakTarget={14}
                    size={220}
                  />
                </div>
              </div>
            </div>
          )}


          {(tab === "shop" || tab === "gacha") && (
            <CosmeticShopTab social={social} updateSocial={updateSocial} lang={lang} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
 * 1. X-STYLE PROFILE TAB
 * ========================================================================== */
function XStyleProfileTab({
  social,
  updateSocial,
  updateSettings,
  rank,
  stats,
  lvl,
  unlockedMap,
  lang,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  updateSocial: ReturnType<typeof useSocialProfile>[1];
  updateSettings: ReturnType<typeof useSettings>[1];
  rank: ReturnType<typeof loadRank>;
  stats: ReturnType<typeof computeStats>;
  lvl: ReturnType<typeof computeLevelFromExp>;
  unlockedMap: Record<string, string>;
  lang: Lang;
}) {
  const [editing, setEditing] = useState(false);
  const [nickInput, setNickInput] = useState(social.nickname);
  const [userInput, setUserInput] = useState(social.username);
  const [bioInput, setBioInput] = useState(social.bio);
  const [countryInput, setCountryInput] = useState(social.country);
  const [showAllUnlockedModal, setShowAllUnlockedModal] = useState(false);
  const [inspectedPlayer, setInspectedPlayer] = useState<CommunityPlayer | null>(null);

  // Sync inputs whenever editing drawer opens or social profile updates
  useEffect(() => {
    if (editing) {
      setNickInput(social.nickname);
      setUserInput(social.username);
      setBioInput(social.bio);
      setCountryInput(social.country);
    }
  }, [editing, social.nickname, social.username, social.bio, social.country]);

  const curRank = getRank(rank.rp, rank.championPosition);
  const animatedRp = useCountUp(rank.rp, 850, true);
  const animatedLvl = useCountUp(lvl.level, 850, true);
  const animatedExp = useCountUp(lvl.currentLevelExp, 850, true);

  // All unlocked achievement objects (ensure at least 5 fallback unlocked for demo if fresh profile)
  const unlockedBadges = useMemo(() => {
    const realUnlocked = ACH_ALL.filter((a) => Boolean(unlockedMap[a.id]));
    if (realUnlocked.length >= 5) return realUnlocked;
    const defaults = ACH_ALL.slice(0, 6);
    return Array.from(new Set([...realUnlocked, ...defaults]));
  }, [unlockedMap]);

  // Up to 5 pinned unlocked badges in 1 row
  const fivePinnedBadges = useMemo(() => {
    const pinned = unlockedBadges.filter((b) => social.pinnedBadges.includes(b.id));
    const combined = [...pinned, ...unlockedBadges.filter((b) => !social.pinnedBadges.includes(b.id))];
    return combined.slice(0, 5);
  }, [unlockedBadges, social.pinnedBadges]);

  const saveProfileEdits = () => {
    const cleanNick = nickInput.trim() || "StrafePlayer";
    const cleanUser = userInput.trim().toLowerCase().replace(/[^a-z0-9_]/g, "") || "strafe_ace";
    updateSocial({
      nickname: cleanNick,
      username: cleanUser,
      bio: bioInput.trim(),
      country: countryInput,
      isGuest: false,
    });
    updateSettings({ name: cleanNick });
    setNickInput(cleanNick);
    setUserInput(cleanUser);
    setEditing(false);
  };

  const handleAvatarFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        updateSocial({ avatarUrl: res });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        updateSocial({ bannerImageUrl: res });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleFollow = (playerId: string) => {
    const isFollowing = social.followingIds.includes(playerId);
    const next = isFollowing
      ? social.followingIds.filter((id) => id !== playerId)
      : [...social.followingIds, playerId];
    updateSocial({ followingIds: next });
  };

  const totalPinsCount = social.totalPins ?? Math.max(stats.rounds, 45);
  const totalGamesCount = social.totalGames ?? Math.max(stats.games, 9);

  return (
    <div className="space-y-5">
      {/* X-Style Profile Card */}
      <section className="plate overflow-hidden">
        {/* Banner Header (Apple Style Quiet Gray Default / Custom Color / Uploaded Image) */}
        <div
          className="relative h-36 w-full sm:h-44 bg-cover bg-center transition-colors"
          style={{
            backgroundColor: social.bannerColor || "#27272a",
            backgroundImage: social.bannerImageUrl ? `url(${social.bannerImageUrl})` : undefined,
          }}
        >
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={58} />
          </div>
        </div>

        {/* Profile Body */}
        <div className="relative px-5 pb-6 sm:px-8">
          {/* AvatarFrame overlapping banner + Edit Profile Button */}
          <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
            <div className="inline-flex shrink-0 items-center justify-center rounded-full bg-card p-1 shadow-2xl ring-4 ring-card">
              <AvatarFrame
                src={social.avatarUrl}
                name={social.nickname}
                rp={rank.rp}
                championPosition={rank.championPosition}
                size={96}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="btn btn-outline !px-4 !py-2 text-xs font-semibold"
              >
                <Edit3 className="h-3.5 w-3.5" />
                {editing ? (t(lang, "cancel") || "Cancel") : t(lang, "editProfile")}
              </button>
            </div>
          </div>

          {/* Identity Row: [TAG] + Nickname + VerifiedBadge + Flag | @username + Title */}
          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <ClanTagPill tag={social.clanTag} color={social.clanTagColor} />
              <h1
                className="font-display text-3xl sm:text-4xl"
                style={{ color: social.nameColor || undefined }}
              >
                {social.nickname}
              </h1>
              <VerifiedBadge type={social.verifiedBadge} size={20} />
              <Flag country={social.country} size={22} />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="readout font-semibold">
                @{social.username}
              </span>
              <span>·</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 font-semibold text-foreground">
                {social.title}
              </span>
              <span>·</span>
              <span className="font-semibold" style={{ color: curRank.tier.accent }}>
                {curRank.name} ({animatedRp.toLocaleString()} RP)
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/90">
              {social.bio}
            </p>
          </div>

          {/* Inline Profile Editor with Avatar & Banner Customization */}
          {editing && (
            <div className="mt-4 space-y-3 rounded-2xl border border-border bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-accent-text">
                  Edit Profile Information
                </span>
              </div>

              {/* Profile Avatar & Banner Customization Row */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Profile Avatar Upload */}
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/60 p-3">
                  <AvatarFrame
                    src={social.avatarUrl}
                    name={social.nickname}
                    rp={rank.rp}
                    championPosition={rank.championPosition}
                    size={48}
                  />
                  <div className="flex-1 min-w-[140px]">
                    <span className="block text-xs font-semibold text-muted-foreground">Avatar Photo</span>
                    <label className="btn btn-outline mt-1 inline-flex cursor-pointer items-center gap-1.5 !px-3 !py-1 text-xs font-semibold">
                      <Upload className="h-3.5 w-3.5 text-accent-text" /> Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleAvatarFile(f);
                        }}
                      />
                    </label>
                    {social.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => updateSocial({ avatarUrl: null })}
                        className="ml-2 text-xs text-muted-foreground hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Banner Customization (Color + Image Upload) */}
                <div className="space-y-2 rounded-xl border border-border bg-card/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="block text-xs font-semibold text-muted-foreground">Profile Banner</span>
                    <div className="flex items-center gap-2">
                      <label className="btn btn-outline inline-flex cursor-pointer items-center gap-1.5 !px-3 !py-1 text-xs font-semibold">
                        <Upload className="h-3.5 w-3.5 text-accent-text" /> Upload Banner
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleBannerFile(f);
                          }}
                        />
                      </label>
                      {social.bannerImageUrl && (
                        <button
                          type="button"
                          onClick={() => updateSocial({ bannerImageUrl: null })}
                          className="text-xs text-muted-foreground hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {[
                      ["#27272a", "Graphite"],
                      ["#1e1e20", "Space Gray"],
                      ["#2d2d30", "Charcoal"],
                      ["#1e293b", "Slate"],
                      ["#064e3b", "Pine"],
                      ["#2e1065", "Royal"],
                    ].map(([hex, label]) => (
                      <button
                        key={hex}
                        type="button"
                        title={label}
                        onClick={() => updateSocial({ bannerColor: hex, bannerImageUrl: null })}
                        className={`h-5 w-5 rounded-full border transition-transform ${
                          (social.bannerColor || "#27272a") === hex && !social.bannerImageUrl
                            ? "ring-2 ring-foreground/40 scale-110 border-white"
                            : "border-border/80"
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                    <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer ml-1">
                      <span>Custom:</span>
                      <input
                        type="color"
                        value={social.bannerColor || "#27272a"}
                        onChange={(e) => updateSocial({ bannerColor: e.target.value, bannerImageUrl: null })}
                        className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block text-xs">
                  <span className="font-semibold text-muted-foreground">Nickname</span>
                  <input
                    value={nickInput}
                    maxLength={24}
                    onChange={(e) => setNickInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-semibold text-muted-foreground">@username</span>
                  <input
                    value={userInput}
                    maxLength={20}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-semibold text-muted-foreground">Country</span>
                  <input
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <label className="block text-xs">
                <span className="font-semibold text-muted-foreground">Bio</span>
                <textarea
                  rows={2}
                  value={bioInput}
                  maxLength={160}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={saveProfileEdits}
                className="btn btn-primary !px-6 !py-2 text-xs font-semibold"
              >
                Save Profile Changes
              </button>
            </div>
          )}

          {/* Level 1–1,000 Progress Bar */}
          <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-accent-text">
                LEVEL {animatedLvl} / 1,000
              </span>
              <span className="readout text-muted-foreground">
                {animatedExp.toLocaleString()} / {lvl.nextLevelExp.toLocaleString()} EXP · Next Milestone: +250 Coins
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted p-0.5">
              <div
                className="h-full rounded-full transition-[width] duration-500 bg-accent-fill"
                style={{
                  width: `${lvl.progressPct}%`,
                }}
              />
            </div>
          </div>

          {/* X-Style Metrics Row: Following, Followers, Total Pins, Total Games */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background/40 p-3.5 text-center">
              <p className="font-display text-2xl">{social.followingIds.length}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-3.5 text-center">
              <p className="font-display text-2xl">{social.followerIds.length}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-3.5 text-center">
              <p className="font-display text-2xl text-accent-text">{totalPinsCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Pins Dropped</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-3.5 text-center">
              <p className="font-display text-2xl text-foreground">{totalGamesCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Games Played</p>
            </div>
          </div>

          {/* Showcase Row: Up to 5 Unlocked Achievement Badges in 1 Row */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl">Achievement Badges</h2>
                <p className="text-xs text-muted-foreground">
                  Only unlocked badges are displayed on public profiles
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllUnlockedModal(true)}
                className="btn btn-outline !px-3.5 !py-1.5 text-xs font-semibold"
              >
                View All Unlocked ({unlockedBadges.length})
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {fivePinnedBadges.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col items-center rounded-2xl border border-border bg-accent-fill/5 p-2.5 text-center"
                >
                  <img
                    src={b.files.compact.unlocked}
                    alt={b.name}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  />
                  <span className="mt-1.5 line-clamp-1 text-[11px] font-semibold">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground">{b.rarity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal: View All Unlocked Badges Only */}
      {showAllUnlockedModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="plate max-h-[80vh] w-full max-w-xl overflow-y-auto p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl">Unlocked Achievement Badges ({unlockedBadges.length})</h3>
                <p className="text-xs text-muted-foreground">
                  Public profile showcase hides locked badges automatically
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllUnlockedModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {unlockedBadges.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col items-center rounded-2xl border border-border bg-background/50 p-3 text-center"
                >
                  <img src={b.files.compact.unlocked} alt={b.name} className="h-14 w-14 object-contain" />
                  <span className="mt-1.5 line-clamp-1 text-xs font-semibold">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground">{b.requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 2. COSMETIC SHOP TAB
 * ========================================================================== */
function CosmeticLivePreview({
  item,
  social,
}: {
  item: GachaItem;
  social: ReturnType<typeof useSocialProfile>[0];
}) {
  if (item.category === "aura") {
    const auraStyles: Record<string, string> = {
      fire: "border border-orange-500/80 bg-orange-500/10 text-orange-200",
      water: "border border-sky-400/80 bg-sky-500/10 text-sky-200",
      rainbow: "border border-purple-400/80 bg-purple-500/10 text-purple-200",
      vines: "border border-cyan-400/80 bg-cyan-500/10 text-cyan-200",
    };
    return (
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Live Chat Aura Preview</p>
        <div className="flex items-end gap-2.5">
          <AvatarFrame src={social.avatarUrl} name={social.nickname} size={32} />
          <div className="max-w-[80%]">
            <span className="text-[11px] font-semibold text-muted-foreground mb-0.5 block">{social.nickname}</span>
            <div className={`rounded-[18px] rounded-bl-xs px-3.5 py-1.5 text-xs font-medium ${auraStyles[item.value] ?? "border border-border bg-muted text-foreground"}`}>
              GG! That pin was seriously fast.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (item.category === "pin") {
    const pinColors: Record<string, string> = {
      lime: "#00ADFF",
      cyan: "#00ADFF",
      crimson: "#DC1F30",
      violet: "#9333EA",
    };
    const c = pinColors[item.value] ?? "#00ADFF";
    return (
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Map Pin Marker Preview</p>
        <div className="relative h-20 w-full rounded-xl border border-border/60 bg-[#161618] flex items-center justify-center overflow-hidden">
          <div className="absolute h-14 w-14 rounded-full border border-border/40" />
          <div className="absolute h-8 w-8 rounded-full border border-border/60" />
          <div className="relative flex flex-col items-center">
            <div
              className="h-6 w-6 rounded-full border-2 border-[#161616] flex items-center justify-center shadow-md scale-110"
              style={{ backgroundColor: c }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-black/80" />
            </div>
            <div className="h-2 w-0.5" style={{ backgroundColor: c }} />
          </div>
        </div>
      </div>
    );
  }

  if (item.category === "trail") {
    const trailColors: Record<string, string> = {
      blue: "bg-[#00ADFF]",
      rainbow: "bg-[#BF5AF2]",
      solar: "bg-[#FF9F0A]",
    };
    const c = trailColors[item.value] ?? "bg-[#00ADFF]";
    return (
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Trajectory Laser Trail Preview</p>
        <div className="relative h-20 w-full rounded-xl border border-border/60 bg-[#161618] flex items-center justify-between px-6 overflow-hidden">
          <div className="h-3 w-3 rounded-full bg-foreground shadow-sm" />
          <div className={`h-0.5 flex-1 mx-2 ${c} opacity-80`} />
          <div className="h-3 w-3 rounded-full bg-[#00ADFF] shadow-sm" />
        </div>
      </div>
    );
  }

  if (item.category === "tagColor") {
    return (
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Clan TAG Pill Preview</p>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-3">
          <ClanTagPill tag={social.clanTag ?? "POR"} color={item.value} />
          <span className="font-semibold text-sm">{social.nickname}</span>
          <VerifiedBadge type={social.verifiedBadge} size={14} />
        </div>
      </div>
    );
  }

  if (item.category === "nameColor") {
    return (
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Nickname Display Color Preview</p>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-3">
          <AvatarFrame src={social.avatarUrl} name={social.nickname} size={30} />
          <span className="font-semibold text-base" style={{ color: item.value }}>
            {social.nickname}
          </span>
          <span className="text-xs text-muted-foreground">@{social.username}</span>
        </div>
      </div>
    );
  }

  return null;
}

function CosmeticShopTab({
  social,
  updateSocial,
  lang,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  updateSocial: ReturnType<typeof useSocialProfile>[1];
  lang: Lang;
}) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [previewItem, setPreviewItem] = useState<GachaItem | null>(null);

  const rarityPrices: Record<GachaItem["rarity"], number> = {
    Common: 250,
    Rare: 500,
    Epic: 1000,
    Mythic: 2500,
  };

  const rarityColor: Record<GachaItem["rarity"], string> = {
    Common: "#8E8E93",
    Rare: "#00ADFF",
    Epic: "#BF5AF2",
    Mythic: "#FF375F",
  };

  const categories = [
    { id: "all", label: t(lang, "all") || "All Items" },
    { id: "pin", label: t(lang, "pins") || "Map Pins" },
    { id: "aura", label: t(lang, "auras") || "Chat Auras" },
    { id: "tagColor", label: t(lang, "tags") || "TAG Colors" },
    { id: "trail", label: "Trails" },
    { id: "nameColor", label: "Name Colors" },
  ];

  const filteredItems = useMemo(() => {
    if (categoryFilter === "all") return GACHA_ITEMS;
    return GACHA_ITEMS.filter((i) => i.category === categoryFilter);
  }, [categoryFilter]);

  const isEquipped = (item: GachaItem): boolean => {
    if (item.category === "aura") return social.chatAura === item.value;
    if (item.category === "pin") return social.pinStyle === item.value;
    if (item.category === "trail") return social.trailStyle === item.value;
    if (item.category === "tagColor") return social.clanTagColor === item.value;
    if (item.category === "nameColor") return social.nameColor === item.value;
    return false;
  };

  const equipItem = (item: GachaItem) => {
    if (item.category === "aura") {
      updateSocial({ chatAura: item.value as any });
    } else if (item.category === "pin") {
      updateSocial({ pinStyle: item.value as any });
    } else if (item.category === "trail") {
      updateSocial({ trailStyle: item.value as any });
    } else if (item.category === "tagColor") {
      updateSocial({ clanTagColor: item.value });
    } else if (item.category === "nameColor") {
      updateSocial({ nameColor: item.value });
    }
    toast.success(`Equipped: ${item.name}`);
  };

  const buyItem = (item: GachaItem) => {
    const cost = rarityPrices[item.rarity];
    const currentCoins = social.coins ?? 10000;
    if (currentCoins < cost) {
      toast.error(`Need ${(cost - currentCoins).toLocaleString()} more Coins`);
      return;
    }
    const nextUnlocked = Array.from(new Set([...social.unlockedCosmetics, item.id]));
    updateSocial({
      coins: currentCoins - cost,
      unlockedCosmetics: nextUnlocked,
    });
    equipItem(item);
  };

  return (
    <div className="space-y-6">
      {/* Shop Header & Currency Balance */}
      <section className="plate p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5" /> {t(lang, "shop")}
            </span>
            <h2 className="font-display mt-2 text-3xl">{t(lang, "shop")}</h2>
            <p className="text-xs text-muted-foreground">
              Purchase Chat Auras, Custom Map Pins, Trajectory Trails, Clan TAG Colors & Nickname Colors directly with Coins. (Titles are earned via Achievements).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="readout rounded-full border border-foreground/60 bg-muted px-4 py-1.5 text-sm font-semibold text-foreground">
              {(social.coins ?? 10000).toLocaleString()} Coins
            </span>
            <button
              type="button"
              onClick={() => updateSocial({ coins: (social.coins ?? 10000) + 2000 })}
              className="btn btn-outline !px-3.5 !py-1.5 text-xs font-semibold"
            >
              +2,000 Coins (Demo)
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryFilter(c.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === c.id
                  ? "bg-foreground text-background"
                  : "border border-border bg-background/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Cosmetics Grid with Live Previews */}
      <section className="plate p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl">
            Items ({filteredItems.length})
          </h3>
          <span className="text-xs text-muted-foreground">
            {social.unlockedCosmetics.length} / {GACHA_ITEMS.length} Owned
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const owned = social.unlockedCosmetics.includes(item.id);
            const equipped = isEquipped(item);
            const price = rarityPrices[item.rarity];
            const color = rarityColor[item.rarity];
            const currentCoins = social.coins ?? 10000;
            const canAfford = currentCoins >= price;

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition-colors ${
                  equipped
                    ? "border-foreground/60 bg-muted/30"
                    : owned
                    ? "border-border bg-background/50"
                    : "border-border/60 bg-background/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${color}22`,
                        color: color,
                        border: `1px solid ${color}44`,
                      }}
                    >
                      {item.rarity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      title="View Live Preview"
                    >
                      <Eye className="h-3 w-3" /> Preview
                    </button>
                  </div>

                  <h4 className="font-display mt-2.5 text-lg font-semibold">{item.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.previewText}
                  </p>

                  {/* Inline Mini Live Preview Thumbnail */}
                  <div className="mt-3">
                    <CosmeticLivePreview item={item} social={social} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50">
                  {equipped ? (
                    <div className="flex items-center justify-center gap-1.5 rounded-xl border border-accent-fill/30 bg-accent-fill/15 py-2 text-xs font-semibold text-accent-text">
                      <Check className="h-4 w-4" /> {t(lang, "equipped")}
                    </div>
                  ) : owned ? (
                    <button
                      type="button"
                      onClick={() => equipItem(item)}
                      className="btn btn-outline w-full !py-2 text-xs font-semibold"
                    >
                      {t(lang, "equip")}
                    </button>
                  ) : canAfford ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="readout text-xs font-semibold text-foreground">
                        {price.toLocaleString()} coins
                      </span>
                      <button
                        type="button"
                        onClick={() => buyItem(item)}
                        className="btn btn-primary !px-4 !py-1.5 text-xs font-semibold"
                      >
                        Buy
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="readout text-xs font-semibold text-muted-foreground">
                        {price.toLocaleString()} coins
                      </span>
                      <button
                        type="button"
                        disabled
                        className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-semibold text-muted-foreground opacity-60 cursor-not-allowed"
                      >
                        Need {(price - currentCoins).toLocaleString()} more
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Focused Live Preview Modal Dialog */}
      {previewItem && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="plate max-h-[85vh] w-full max-w-md overflow-hidden p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  Cosmetic Preview · {previewItem.category}
                </span>
                <h3 className="font-display mt-1 text-xl font-semibold">{previewItem.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">{previewItem.previewText}</p>

            {/* Live Interactive Rendering Box */}
            <CosmeticLivePreview item={previewItem} social={social} />

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-xs text-muted-foreground">
                Price:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {rarityPrices[previewItem.rarity].toLocaleString()} coins
                </span>
              </div>
              <div className="flex items-center gap-2">
                {social.unlockedCosmetics.includes(previewItem.id) ? (
                  isEquipped(previewItem) ? (
                    <span className="text-xs font-semibold text-accent-text flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> {t(lang, "equipped")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        equipItem(previewItem);
                        setPreviewItem(null);
                      }}
                      className="btn btn-outline !px-4 !py-1.5 text-xs font-semibold"
                    >
                      {t(lang, "equip")}
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled={(social.coins ?? 10000) < rarityPrices[previewItem.rarity]}
                    onClick={() => {
                      buyItem(previewItem);
                      setPreviewItem(null);
                    }}
                    className="btn btn-primary !px-4 !py-1.5 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(social.coins ?? 10000) >= rarityPrices[previewItem.rarity]
                      ? "Buy & Equip"
                      : `Need ${(rarityPrices[previewItem.rarity] - (social.coins ?? 10000)).toLocaleString()} more`}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="btn btn-secondary !px-3 !py-1.5 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
