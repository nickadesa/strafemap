import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { getRank, loadRank } from "@/lib/rank";
import { ACH_ALL, loadUnlocked, syncAchievements } from "@/lib/achievements";
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
import {
  BarChart3,
  Check,
  Compass,
  Edit3,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Shield,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type ProfileTab = "overview" | "feed" | "clan" | "gacha";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile, Clan, Gacha & Feed — STRAFE" },
      { name: "description", content: "Your X-style STRAFE profile, Clan hub, Multi-Pack Gacha Vault, and Social Feed." },
      { property: "og:title", content: "Profile, Clan, Gacha & Feed — STRAFE" },
      { property: "og:description", content: "Your X-style STRAFE profile, Clan hub, Multi-Pack Gacha Vault, and Social Feed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { tab?: ProfileTab } => {
    const tab = s["tab"];
    if (tab === "overview" || tab === "feed" || tab === "clan" || tab === "gacha") return { tab };
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
          <div className="flex flex-wrap items-center justify-between gap-3 pr-20 md:pr-0">
            <div className="seg">
              <button
                type="button"
                onClick={() => setTab("overview")}
                data-on={tab === "overview"}
                className="seg-item"
              >
                {t(lang, "profile")}
              </button>
              <button
                type="button"
                onClick={() => setTab("feed")}
                data-on={tab === "feed"}
                className="seg-item"
              >
                <Compass className="mr-1.5 inline h-4 w-4" />
                {t(lang, "feedAndClan").split("&")[0]?.trim() || "Feed"}
              </button>
              <button
                type="button"
                onClick={() => setTab("clan")}
                data-on={tab === "clan"}
                className="seg-item"
              >
                <Shield className="mr-1.5 inline h-4 w-4" />
                {t(lang, "clan")}
              </button>
              <button
                type="button"
                onClick={() => setTab("gacha")}
                data-on={tab === "gacha"}
                className="seg-item"
              >
                <Sparkles className="mr-1.5 inline h-4 w-4" />
                {t(lang, "gacha")} ({social.gachaTickets})
              </button>
            </div>

            <Link to="/stats" className="btn btn-outline !px-4 !py-2 text-xs font-bold">
              <BarChart3 className="h-4 w-4 text-[#D2F801]" />
              {t(lang, "stats")} →
            </Link>
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

          {tab === "feed" && (
            <SocialFeedTab social={social} rank={rank} stats={stats} lang={lang} />
          )}

          {tab === "clan" && (
            <ClanSystemTab social={social} updateSocial={updateSocial} rank={rank} />
          )}

          {tab === "gacha" && (
            <GachaVaultTab social={social} updateSocial={updateSocial} />
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

  const curRank = getRank(rank.rp, rank.championPosition);

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
    const cleanUser = social.isGuest
      ? "guest_locked"
      : userInput.trim().toLowerCase().replace(/[^a-z0-9_]/g, "") || "strafe_ace";
    updateSocial({
      nickname: cleanNick,
      username: cleanUser,
      bio: bioInput.trim(),
      country: countryInput,
    });
    updateSettings({ name: cleanNick });
    setEditing(false);
  };

  const toggleFollow = (playerId: string) => {
    const isFollowing = social.followingIds.includes(playerId);
    const next = isFollowing
      ? social.followingIds.filter((id) => id !== playerId)
      : [...social.followingIds, playerId];
    updateSocial({ followingIds: next });
  };

  const totalPinsCount = Math.max(stats.rounds, 45);
  const totalGamesCount = Math.max(stats.games, 9);

  return (
    <div className="space-y-5">
      {/* X-Style Profile Card */}
      <section className="plate overflow-hidden">
        {/* Banner Header */}
        <div
          className="relative h-36 w-full sm:h-44"
          style={{ background: social.bannerGradient }}
        >
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={58} />
          </div>
        </div>

        {/* Profile Body */}
        <div className="relative px-5 pb-6 sm:px-8">
          {/* AvatarFrame overlapping banner + Edit Profile Button */}
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="rounded-full bg-card p-1.5 shadow-xl">
              <AvatarFrame
                src={social.avatarUrl}
                name={social.nickname}
                rp={rank.rp}
                championPosition={rank.championPosition}
                size={92}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="btn btn-outline !px-4 !py-2 text-xs font-bold"
              >
                <Edit3 className="h-3.5 w-3.5" />
                {editing ? "Cancel" : "Edit Profile"}
              </button>
              <Link to="/stats" className="btn btn-primary !px-4 !py-2 text-xs font-extrabold">
                <BarChart3 className="h-3.5 w-3.5" />
                View Full {t(lang, "stats")}
              </Link>
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
                @{social.isGuest ? "guest_locked (Guest Account)" : social.username}
              </span>
              <span>·</span>
              <span className="rounded-full bg-[#0367FC]/15 px-2.5 py-0.5 font-bold text-[#0367FC]">
                {social.title}
              </span>
              <span>·</span>
              <span className="font-bold" style={{ color: curRank.tier.accent }}>
                {curRank.name} ({rank.rp.toLocaleString()} RP)
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/90">
              {social.bio}
            </p>
          </div>

          {/* Verified Badge Preview Switcher (Gold Default, Exclusive Rainbow for Owner, Green Creator, Red Admin) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/50 p-3.5">
            <div>
              <p className="text-xs font-bold">Verified Badge Preview Switcher</p>
              <p className="text-[11px] text-muted-foreground">
                Gold is enabled by default. Preview Exclusive Rainbow (Owner only), Green (Creator), or Red (Admin):
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["gold", "Gold (Premium)"],
                  ["rainbow", "Rainbow (Exclusive You)"],
                  ["green", "Green (Creator)"],
                  ["red", "Red (Admin)"],
                ] as [VerifiedBadgeType, string][]
              ).map(([bType, bLabel]) => (
                <button
                  key={bType}
                  type="button"
                  onClick={() => updateSocial({ verifiedBadge: bType })}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                    social.verifiedBadge === bType
                      ? "border-[#D2F801] bg-[#D2F801]/15 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <VerifiedBadge type={bType} size={14} />
                  {bLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Inline Profile Editor */}
          {editing && (
            <div className="mt-4 space-y-3 rounded-2xl border border-[#0367FC]/60 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0367FC]">
                  Edit X-Style Profile
                </span>
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={social.isGuest}
                    onChange={(e) => updateSocial({ isGuest: e.target.checked })}
                    className="h-4 w-4 accent-[#D2F801]"
                  />
                  Simulate Guest Account (Locks @username)
                </label>
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
                  <span className="font-semibold text-muted-foreground">
                    @username {social.isGuest && "(Locked for Guests)"}
                  </span>
                  <input
                    value={social.isGuest ? "guest_locked" : userInput}
                    disabled={social.isGuest}
                    maxLength={20}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono disabled:opacity-50"
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
                className="btn btn-primary !px-6 !py-2 text-xs font-extrabold"
              >
                Save Profile Changes
              </button>
            </div>
          )}

          {/* Level 1–1,000 Progress Bar */}
          <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#D2F801]">
                LEVEL {lvl.level} / 1,000
              </span>
              <span className="readout text-muted-foreground">
                {lvl.currentLevelExp} / {lvl.nextLevelExp} EXP · Next Milestone: +1 Gacha Ticket
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${lvl.progressPct}%`,
                  background: "linear-gradient(90deg, #0367FC 0%, #D2F801 100%)",
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
              <p className="font-display text-2xl text-[#D2F801]">{totalPinsCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Pins Dropped</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-3.5 text-center">
              <p className="font-display text-2xl text-[#0367FC]">{totalGamesCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Games Played</p>
            </div>
          </div>

          {/* Showcase Row: Up to 5 Unlocked Achievement Badges in 1 Row */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl">Featured Achievement Badges (Max 5)</h2>
                <p className="text-xs text-muted-foreground">
                  Only unlocked badges are displayed on public profiles
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllUnlockedModal(true)}
                className="btn btn-outline !px-3.5 !py-1.5 text-xs font-bold"
              >
                View All Unlocked ({unlockedBadges.length}) →
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {fivePinnedBadges.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col items-center rounded-2xl border border-[#D2F801]/40 bg-[#D2F801]/5 p-2.5 text-center"
                >
                  <img
                    src={b.files.compact.unlocked}
                    alt={b.name}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  />
                  <span className="mt-1.5 line-clamp-1 text-[11px] font-bold">{b.name}</span>
                  <span className="text-[9px] text-muted-foreground">{b.rarity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Players Directory (Follow / Unfollow & Inspect Profile) */}
      <section className="plate p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Cartographer Network · Follow & Inspect</h2>
            <p className="text-xs text-muted-foreground">
              Follow players to invite them to Party Voice rooms or inspect their X-style profile
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMMUNITY_PLAYERS.slice(0, 6).map((p) => {
            const isFollowing = social.followingIds.includes(p.id);
            const followsMe = social.followerIds.includes(p.id);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/40 p-3.5"
              >
                <button
                  type="button"
                  onClick={() => setInspectedPlayer(p)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                >
                  <AvatarFrame
                    name={p.nickname}
                    rp={p.rp}
                    championPosition={p.championPosition}
                    size={46}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <ClanTagPill tag={p.clanTag} color={p.clanTagColor} />
                      <span className="truncate text-sm font-bold hover:underline">{p.nickname}</span>
                      <VerifiedBadge type={p.verifiedBadge} size={13} />
                      <Flag country={p.country} size={15} />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      @{p.username} · Lv.{p.level} {followsMe ? "· Follows you" : ""}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFollow(p.id)}
                  className={`btn !px-3.5 !py-1.5 text-xs font-bold ${
                    isFollowing ? "btn-outline" : "btn-blue"
                  }`}
                >
                  {isFollowing ? "Following" : "+ Follow"}
                </button>
              </div>
            );
          })}
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
                  className="flex flex-col items-center rounded-2xl border border-[#D2F801]/40 bg-background/50 p-3 text-center"
                >
                  <img src={b.files.compact.unlocked} alt={b.name} className="h-14 w-14 object-contain" />
                  <span className="mt-1.5 line-clamp-1 text-xs font-bold">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground">{b.requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Inspect Another Player's X-Style Profile */}
      {inspectedPlayer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="plate w-full max-w-lg overflow-hidden">
            <div
              className="flex h-28 items-end justify-between p-4"
              style={{ background: "linear-gradient(135deg, #0367FC 0%, #161616 65%, #D2F801 100%)" }}
            >
              <AvatarFrame
                name={inspectedPlayer.nickname}
                rp={inspectedPlayer.rp}
                championPosition={inspectedPlayer.championPosition}
                size={72}
              />
              <button
                type="button"
                onClick={() => setInspectedPlayer(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <ClanTagPill tag={inspectedPlayer.clanTag} color={inspectedPlayer.clanTagColor} />
                    <h3 className="font-display text-2xl">{inspectedPlayer.nickname}</h3>
                    <VerifiedBadge type={inspectedPlayer.verifiedBadge} size={16} />
                    <Flag country={inspectedPlayer.country} size={18} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{inspectedPlayer.username} · Level {inspectedPlayer.level} · {inspectedPlayer.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollow(inspectedPlayer.id)}
                  className={`btn !px-4 !py-1.5 text-xs font-bold ${
                    social.followingIds.includes(inspectedPlayer.id) ? "btn-outline" : "btn-blue"
                  }`}
                >
                  {social.followingIds.includes(inspectedPlayer.id) ? "Following" : "+ Follow"}
                </button>
              </div>
              <p className="mt-3 text-sm text-foreground/90">{inspectedPlayer.bio}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl border border-border p-2.5">
                  <p className="font-display text-lg text-[#D2F801]">
                    {inspectedPlayer.rp.toLocaleString()} RP
                  </p>
                  <p className="text-muted-foreground">Rank Points</p>
                </div>
                <div className="rounded-xl border border-border p-2.5">
                  <p className="font-display text-lg">{inspectedPlayer.totalPins.toLocaleString()}</p>
                  <p className="text-muted-foreground">Pins Dropped</p>
                </div>
                <div className="rounded-xl border border-border p-2.5">
                  <p className="font-display text-lg">{inspectedPlayer.totalGames.toLocaleString()}</p>
                  <p className="text-muted-foreground">Games</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-bold uppercase text-muted-foreground">
                Unlocked Showcase ({inspectedPlayer.pinnedBadges.length} / 5)
              </p>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {inspectedPlayer.pinnedBadges.slice(0, 5).map((bid) => {
                  const badge = ACH_ALL.find((x) => x.id === bid) ?? ACH_ALL[0]!;
                  return (
                    <div
                      key={bid}
                      className="flex flex-col items-center rounded-xl border border-border p-2 text-center"
                    >
                      <img src={badge.files.compact.unlocked} alt={badge.name} className="h-10 w-10" />
                      <span className="mt-1 line-clamp-1 text-[10px] font-semibold">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 2. CLAN SYSTEM TAB (Max 50 Members, Level 1–10, Clan Leaderboard)
 * ========================================================================== */
function ClanSystemTab({
  social,
  updateSocial,
  rank,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  updateSocial: ReturnType<typeof useSocialProfile>[1];
  rank: ReturnType<typeof loadRank>;
}) {
  const [clans, saveClans] = useClans();
  const [tagInput, setTagInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [iconUrlInput, setIconUrlInput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const myClan = clans.find((c) => c.id === social.clanId) ?? null;

  const handleCreateClan = () => {
    const cleanTag = tagInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanName = nameInput.trim();
    if (cleanTag.length < 2 || cleanTag.length > 5) {
      setErrorMsg("Clan [TAG] must be 2 to 5 characters.");
      return;
    }
    if (cleanName.length < 3) {
      setErrorMsg("Clan full name must be at least 3 characters.");
      return;
    }
    if (clans.some((c) => c.name.toLowerCase() === cleanName.toLowerCase() || c.tag === cleanTag)) {
      setErrorMsg("Clan name or [TAG] is already taken!");
      return;
    }

    const isGoldOrHigher = rank.rp >= 2000;
    if (!isGoldOrHigher) {
      setErrorMsg("Requires Rank Gold IV (2,000+ RP) or higher to found a Clan.");
      return;
    }
    if ((social.coins ?? 10000) < 2000) {
      setErrorMsg(`Requires 2,000 Coins to found a Clan (Current: ${(social.coins ?? 10000).toLocaleString()} Coins).`);
      return;
    }

    const created = {
      id: `clan-${Date.now()}`,
      tag: cleanTag,
      name: cleanName,
      iconUrl: iconUrlInput,
      description: descInput.trim() || "Competitive STRAFE Cartography Clan",
      level: 1,
      xp: 500,
      maxMembers: 50,
      totalPoints: rank.rp * 10,
      weeklyMissionProgress: 5,
      weeklyMissionTarget: 50,
      members: [
        {
          id: "me",
          nickname: social.nickname,
          username: social.username,
          rp: rank.rp,
          role: "Leader" as const,
          weeklyContribution: 1200,
        },
      ],
    };
    saveClans([created, ...clans]);
    updateSocial({
      clanId: created.id,
      clanTag: created.tag,
      coins: Math.max(0, (social.coins ?? 10000) - 2000),
    });
    setTagInput("");
    setNameInput("");
    setDescInput("");
    setErrorMsg(null);
  };

  const handleJoinClan = (clanId: string) => {
    const target = clans.find((c) => c.id === clanId);
    if (!target || target.members.length >= target.maxMembers) return;
    updateSocial({ clanId: target.id, clanTag: target.tag });
  };

  return (
    <div className="space-y-6">
      {/* Current Clan Banner */}
      {myClan ? (
        <section className="plate p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-[#0367FC] bg-[#0367FC]/15 font-display text-xl text-[#D2F801]">
                {myClan.iconUrl ? (
                  <img src={myClan.iconUrl} alt={myClan.name} className="h-full w-full object-cover" />
                ) : (
                  `[${myClan.tag}]`
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <ClanTagPill tag={myClan.tag} color={social.clanTagColor} />
                  <h2 className="font-display text-2xl sm:text-3xl">{myClan.name}</h2>
                  <span className="rounded-full bg-[#D2F801] px-2.5 py-0.5 text-xs font-extrabold text-[#161616]">
                    Clan Lv.{myClan.level} / 10
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{myClan.description}</p>
                <p className="readout mt-1 text-xs font-semibold text-[#0367FC]">
                  Members: {myClan.members.length} / {myClan.maxMembers} · Party Clan Bonus: +15% Clan Points
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateSocial({ clanId: null, clanTag: null })}
              className="btn btn-outline !px-4 !py-1.5 text-xs"
            >
              Leave Clan
            </button>
          </div>

          {/* Weekly Clan Mission Bar */}
          <div className="mt-5 rounded-2xl border border-border bg-background/50 p-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Weekly Clan Mission: Win 50 Party or Ranked Rounds Together</span>
              <span className="readout text-[#D2F801]">
                {myClan.weeklyMissionProgress} / {myClan.weeklyMissionTarget}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-[#D2F801]"
                style={{
                  width: `${Math.min(100, (myClan.weeklyMissionProgress / myClan.weeklyMissionTarget) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Clan Roster */}
          <div className="mt-5">
            <h3 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Clan Roster ({myClan.members.length}/{myClan.maxMembers})
            </h3>
            <div className="divide-y divide-border rounded-2xl border border-border bg-background/30">
              {myClan.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <AvatarFrame name={m.nickname} rp={m.rp} size={36} />
                    <div>
                      <span className="font-bold">
                        [{myClan.tag}] {m.nickname}
                      </span>
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
                        {m.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="readout text-xs font-bold text-[#D2F801]">{m.rp.toLocaleString()} RP</p>
                    <p className="text-[10px] text-muted-foreground">
                      +{m.weeklyContribution.toLocaleString()} Weekly XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Create a Clan Card */
        <section className="plate space-y-4 p-6">
          <h2 className="font-display text-2xl">Create a New Clan (Max 50 Members · Lv.1–10)</h2>
          {errorMsg && (
            <p className="rounded-xl bg-destructive/15 px-3 py-2 text-xs font-bold text-destructive">
              {errorMsg}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-xs">
              <span className="font-bold text-muted-foreground">Clan [TAG] (2–5 chars)</span>
              <input
                value={tagInput}
                maxLength={5}
                placeholder="STRF"
                onChange={(e) => setTagInput(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm font-bold uppercase"
              />
            </label>
            <label className="block text-xs sm:col-span-2">
              <span className="font-bold text-muted-foreground">Unique Clan Full Name</span>
              <input
                value={nameInput}
                maxLength={36}
                placeholder="STRAFE Horizon Vanguard"
                onChange={(e) => setNameInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="font-bold text-muted-foreground">Clan Motto / Description</span>
              <input
                value={descInput}
                maxLength={100}
                placeholder="Global Ranked & Party Voice grinders"
                onChange={(e) => setDescInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="font-bold text-muted-foreground">Upload Clan Icon (Optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setIconUrlInput(URL.createObjectURL(file));
                }}
                className="mt-1 w-full text-xs text-muted-foreground"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleCreateClan}
            className="btn btn-primary !px-6 !py-2.5 text-xs font-extrabold"
          >
            Create Clan
          </button>
        </section>
      )}

      {/* Global Clan Leaderboard */}
      <section className="plate p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Global Clan Leaderboard</h2>
            <p className="text-xs text-muted-foreground">
              Ranked by member performance, Party clan-mate bonus & weekly missions
            </p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[...clans]
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((c, idx) => {
              const isMine = c.id === social.clanId;
              return (
                <div
                  key={c.id}
                  className={`flex flex-wrap items-center justify-between gap-3 py-3.5 ${
                    isMine ? "bg-[#D2F801]/5 px-3 rounded-xl" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display w-6 text-lg text-[#D2F801]">#{idx + 1}</span>
                    <ClanTagPill tag={c.tag} />
                    <div>
                      <p className="font-bold">
                        {c.name}{" "}
                        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-extrabold">
                          Lv.{c.level}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.members.length}/{c.maxMembers} Members · {c.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="readout text-sm font-extrabold text-[#D2F801]">
                      {c.totalPoints.toLocaleString()} pts
                    </span>
                    {!isMine && (
                      <button
                        type="button"
                        onClick={() => handleJoinClan(c.id)}
                        className="btn btn-blue !px-3.5 !py-1.5 text-xs font-bold"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
 * 3. MULTI-PACK GACHA VAULT TAB (4 Packs + Tear & Flip Animation)
 * ========================================================================== */
function GachaVaultTab({
  social,
  updateSocial,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  updateSocial: ReturnType<typeof useSocialProfile>[1];
}) {
  const [selectedPack, setSelectedPack] = useState<GachaPack>(GACHA_PACKS[0]!);
  const [openingPhase, setOpeningPhase] = useState<"idle" | "tearing" | "revealed">("idle");
  const [pulledItems, setPulledItems] = useState<GachaItem[]>([]);

  const rarityGlow: Record<GachaItem["rarity"], string> = {
    Common: "#9A9D97",
    Rare: "#0367FC",
    Epic: "#D2F801",
    Mythic: "#DC1F30",
  };

  const openPack = (pack: GachaPack) => {
    const currentCoins = social.coins ?? 10000;
    const canAffordCoins = currentCoins >= pack.costCoins;
    const canAffordTickets = social.gachaTickets >= pack.costTickets;

    if (!canAffordCoins && !canAffordTickets) {
      alert(`Not enough Coins or Tickets! This pack costs ${pack.costCoins.toLocaleString()} Coins (You have ${currentCoins.toLocaleString()} Coins).`);
      return;
    }

    setSelectedPack(pack);
    setOpeningPhase("tearing");
    setTimeout(() => {
      const pool = GACHA_ITEMS.filter((i) => i.packId === pack.id || pack.id === "mythic-pack");
      const draws: GachaItem[] = [];
      for (let k = 0; k < 3; k++) {
        const pick = pool[Math.floor(Math.random() * pool.length)] ?? GACHA_ITEMS[0]!;
        draws.push(pick);
      }
      setPulledItems(draws);
      const nextUnlocked = Array.from(
        new Set([...social.unlockedCosmetics, ...draws.map((d) => d.id)]),
      );

      if (canAffordCoins) {
        updateSocial({
          coins: currentCoins - pack.costCoins,
          unlockedCosmetics: nextUnlocked,
        });
      } else {
        updateSocial({
          gachaTickets: Math.max(0, social.gachaTickets - pack.costTickets),
          unlockedCosmetics: nextUnlocked,
        });
      }
      setOpeningPhase("revealed");
    }, 650);
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
    } else if (item.category === "title") {
      updateSocial({ title: item.value });
    }
  };

  return (
    <div className="space-y-6">
      <section className="plate p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#D2F801] px-3 py-0.5 text-xs font-extrabold uppercase text-[#161616]">
              <Sparkles className="h-3.5 w-3.5" /> Multi-Pack Cosmetic Vault
            </span>
            <h2 className="font-display mt-2 text-3xl">Select a Pack to Tear Open</h2>
            <p className="text-xs text-muted-foreground">
              Unlock Super Chat Auras, Custom Map Pins, Trajectory Trails, [TAG] Colors & Titles
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="readout rounded-full border border-[#D2F801] bg-[#D2F801]/10 px-3.5 py-1 text-sm font-extrabold text-[#D2F801]">
              🪙 {(social.coins ?? 10000).toLocaleString()} Coins
            </span>
            <span className="readout rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-bold text-muted-foreground">
              🎟️ {social.gachaTickets} Tickets
            </span>
            <button
              type="button"
              onClick={() => updateSocial({ coins: (social.coins ?? 10000) + 2000 })}
              className="btn btn-outline !px-3 !py-1 text-xs font-bold"
            >
              +2,000 Coins
            </button>
          </div>
        </div>

        {/* 4 Gacha Packs Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GACHA_PACKS.map((pack) => {
            const currentCoins = social.coins ?? 10000;
            const canAfford = currentCoins >= pack.costCoins || social.gachaTickets >= pack.costTickets;
            return (
              <div
                key={pack.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background/50 p-4 transition-transform hover:-translate-y-1"
                style={{ boxShadow: `inset 0 2px 0 0 ${pack.accent}` }}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase"
                      style={{
                        backgroundColor: pack.accent,
                        color: pack.accent === "#D2F801" ? "#161616" : "#FFFFFF",
                      }}
                    >
                      🪙 {pack.costCoins.toLocaleString()} Coins
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      or {pack.costTickets} 🎟️
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-xl">{pack.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{pack.subtitle}</p>
                  <ul className="mt-3 space-y-1 text-[11px] text-foreground/80">
                    {pack.featuredItems.map((fi) => (
                      <li key={fi}>• {fi}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={openingPhase === "tearing" || !canAfford}
                  onClick={() => openPack(pack)}
                  className="btn btn-primary mt-4 w-full !py-2.5 text-xs font-extrabold disabled:opacity-50"
                >
                  {canAfford ? `Tear Pack (${pack.costCoins} 🪙)` : "Insufficient Coins"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Pack Opening & Card Flip Stage */}
        {openingPhase !== "idle" && (
          <div className="mt-6 rounded-2xl border border-[#D2F801]/50 bg-[#161616] p-6 text-center">
            {openingPhase === "tearing" ? (
              <div className="py-10">
                <div className="mx-auto grid h-36 w-28 animate-bounce place-items-center rounded-2xl border-2 border-[#D2F801] bg-gradient-to-b from-[#0367FC] to-[#161616] shadow-[0_0_40px_rgba(210,248,1,0.5)]">
                  <Sparkles className="h-10 w-10 text-[#D2F801]" />
                </div>
                <p className="font-display mt-4 text-2xl text-[#D2F801]">
                  Tearing Open {selectedPack.name}…
                </p>
              </div>
            ) : (
              <div className="rise-in">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#D2F801]">
                  Pack Opened · 3 Cosmetics Revealed!
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {pulledItems.map((item, i) => {
                    const color = rarityGlow[item.rarity];
                    return (
                      <div
                        key={`${item.id}-${i}`}
                        className="flex flex-col justify-between rounded-2xl border p-4 text-left"
                        style={{
                          borderColor: color,
                          boxShadow: `0 0 24px ${color}33`,
                          background: "#1E1E20",
                        }}
                      >
                        <div>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase"
                            style={{
                              backgroundColor: color,
                              color: color === "#D2F801" ? "#161616" : "#FFFFFF",
                            }}
                          >
                            {item.rarity}
                          </span>
                          <h4 className="font-display mt-2.5 text-xl text-white">{item.name}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">{item.previewText}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => equipItem(item)}
                          className="btn btn-blue mt-4 w-full !py-2 text-xs font-bold"
                        >
                          Equip Now
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Cosmetic Inventory & Active Loadout */}
      <section className="plate p-6">
        <h3 className="font-display text-2xl">Your Unlocked Cosmetics ({social.unlockedCosmetics.length})</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GACHA_ITEMS.map((item) => {
            const owned = social.unlockedCosmetics.includes(item.id);
            const color = rarityGlow[item.rarity];
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border p-3.5 ${
                  owned ? "border-border bg-background/50" : "border-border/40 opacity-50"
                }`}
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase" style={{ color }}>
                    {item.rarity} · {item.category}
                  </span>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.previewText}</p>
                </div>
                {owned && (
                  <button
                    type="button"
                    onClick={() => equipItem(item)}
                    className="btn btn-outline !px-3 !py-1.5 text-xs font-bold"
                  >
                    Equip
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
 * 4. SOCIAL FEED & 4:5 STORIES TAB
 * ========================================================================== */
function SocialFeedTab({
  social,
  rank,
  stats,
  lang,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  rank: ReturnType<typeof loadRank>;
  stats: ReturnType<typeof computeStats>;
  lang: Lang;
}) {
  const { posts, stories, addPost, toggleLike, addComment } = useFeed();
  const [postText, setPostText] = useState("");
  const [attachResultCard, setAttachResultCard] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeStory, setActiveStory] = useState<StoryHighlight | null>(null);

  const publishPost = () => {
    if (!postText.trim() && !attachResultCard) return;
    addPost({
      authorId: "me",
      authorName: social.nickname,
      authorUsername: social.username,
      authorClanTag: social.clanTag,
      authorVerified: social.verifiedBadge,
      authorRp: rank.rp,
      authorChampPos: rank.championPosition,
      country: social.country,
      content: postText.trim() || "Check out my latest STRAFE session card! 🌍🎯",
      resultCard: attachResultCard
        ? {
            mode: "Ranked 1v1 · Season 1",
            score: Math.max(22450, stats.bestScore),
            maxScore: 25000,
            accuracy: "94%",
            avgError: "32.4 km",
            grade: "S",
          }
        : null,
    });
    setPostText("");
  };

  const submitComment = (postId: string) => {
    const txt = (commentInputs[postId] ?? "").trim();
    if (!txt) return;
    addComment(postId, {
      authorName: social.nickname,
      authorUsername: social.username,
      authorClanTag: social.clanTag,
      authorVerified: social.verifiedBadge,
      text: txt,
    });
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* 4:5 Rainbow-Bordered Story Strip */}
      <section>
        <h2 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          4:5 {t(lang, "stories")}
        </h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {stories.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStory(st)}
              className="rainbow-border aspect-[4/5] w-32 shrink-0 rounded-[18px] text-left transition-transform hover:scale-[1.02]"
            >
              <div
                className="flex h-full w-full flex-col justify-between rounded-[15.5px] p-2.5 text-white"
                style={{ background: st.gradient }}
              >
                <AvatarFrame
                  name={st.authorName}
                  rp={st.authorRp}
                  championPosition={st.authorChampPos}
                  size={30}
                />
                <div>
                  <p className="font-display text-xl text-[#D2F801]">{st.score}</p>
                  <p className="truncate text-[10px] font-bold">{st.authorName}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Post Composer (Supports Free-Form Text & Result Card Attachment) */}
      <section className="plate p-5">
        <div className="flex gap-3">
          <AvatarFrame
            src={social.avatarUrl}
            name={social.nickname}
            rp={rank.rp}
            championPosition={rank.championPosition}
            size={46}
          />
          <div className="flex-1">
            <textarea
              rows={2}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share a geography tip, invite players to a Party lobby, or post your Results Card…"
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#0367FC]"
            />
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={attachResultCard}
                  onChange={(e) => setAttachResultCard(e.target.checked)}
                  className="h-4 w-4 accent-[#D2F801]"
                />
                Attach Latest Match Results Card
              </label>
              <button
                type="button"
                onClick={publishPost}
                className="btn btn-primary !px-5 !py-2 text-xs font-extrabold"
              >
                <Send className="h-3.5 w-3.5" />
                Post to Feed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="plate p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AvatarFrame
                  name={post.authorName}
                  rp={post.authorRp}
                  championPosition={post.authorChampPos}
                  size={44}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <ClanTagPill tag={post.authorClanTag} />
                    <span className="font-bold">{post.authorName}</span>
                    <VerifiedBadge type={post.authorVerified} size={14} />
                    <Flag country={post.country} size={16} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{post.authorUsername} · {post.timestamp}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed">{post.content}</p>

            {/* Attached Results Card */}
            {post.resultCard && (
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#D2F801]/40 bg-[#161616] p-4 text-white">
                <div>
                  <span className="rounded-full bg-[#0367FC] px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    {post.resultCard.mode}
                  </span>
                  <p className="font-display mt-2 text-3xl text-[#D2F801]">
                    {post.resultCard.score.toLocaleString()}{" "}
                    <span className="text-xs text-white/60">
                      / {post.resultCard.maxScore.toLocaleString()} pts
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-white/75">
                    Accuracy: {post.resultCard.accuracy} · Avg Error: {post.resultCard.avgError}
                  </p>
                </div>
                <div className="font-display text-5xl text-[#D2F801]">
                  {post.resultCard.grade}
                </div>
              </div>
            )}

            {/* Like & Comment Bar */}
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={`inline-flex items-center gap-1.5 ${
                  post.likedByMe ? "text-[#D2F801]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className="h-4 w-4" fill={post.likedByMe ? "#D2F801" : "none"} />
                {post.likes} Likes
              </button>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                {post.comments.length} Comments
              </span>
            </div>

            {/* Comments List + Input */}
            {post.comments.length > 0 && (
              <div className="mt-3 space-y-2 rounded-2xl bg-background/40 p-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="text-xs">
                    <div className="flex items-center gap-1">
                      <ClanTagPill tag={c.authorClanTag} />
                      <span className="font-bold">{c.authorName}</span>
                      <VerifiedBadge type={c.authorVerified ?? "none"} size={12} />
                      <span className="text-muted-foreground">· {c.timestamp}</span>
                    </div>
                    <p className="mt-0.5 text-foreground/90">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <input
                value={commentInputs[post.id] ?? ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                placeholder="Write a comment…"
                className="flex-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs outline-none focus:border-[#0367FC]"
              />
              <button
                type="button"
                onClick={() => submitComment(post.id)}
                className="rounded-full bg-[#0367FC] px-3.5 py-1.5 text-xs font-bold text-white"
              >
                Reply
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Story Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md">
          <div className="rainbow-border aspect-[4/5] w-full max-w-sm rounded-[24px]">
            <div
              className="flex h-full w-full flex-col justify-between rounded-[21px] p-6 text-white"
              style={{ background: activeStory.gradient }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{activeStory.authorName}</span>
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-black/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center">
                <p className="font-display text-5xl text-[#D2F801]">{activeStory.score}</p>
                <p className="mt-2 text-sm">{activeStory.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="btn btn-primary w-full py-2.5 text-xs font-bold"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
