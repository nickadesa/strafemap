import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { getRank, loadRank } from "@/lib/rank";
import { ACH_ALL, loadUnlocked, syncAchievements } from "@/lib/achievements";
import { ActivityRings } from "@/components/BoardUIActivityRings";
import { ContributionsHeatmap } from "@/components/BoardUIContributions";
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
} from "@/components/SFSymbols";
import {
  BarChart3,
  Check,
  Compass,
  Edit3,
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
  X,
} from "lucide-react";

type ProfileTab = "overview" | "feed" | "clan" | "shop" | "gacha";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile, Clan, Shop & Feed — STRAFE" },
      { name: "description", content: "Your X-style STRAFE profile, Clan hub, Cosmetic Shop, and Social Feed." },
      { property: "og:title", content: "Profile, Clan, Shop & Feed — STRAFE" },
      { property: "og:description", content: "Your X-style STRAFE profile, Clan hub, Cosmetic Shop, and Social Feed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { tab?: ProfileTab } => {
    const tab = s["tab"];
    if (tab === "overview" || tab === "feed" || tab === "clan" || tab === "shop" || tab === "gacha") return { tab };
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
            <div className="seg">
              <button
                type="button"
                onClick={() => {
                  buzz(6);
                  setTab("overview");
                }}
                data-on={tab === "overview"}
                className="seg-item flex items-center gap-1.5"
              >
                <SymbolPerson fill={tab === "overview"} className="h-4 w-4" />
                {t(lang, "profile")}
              </button>
              <button
                type="button"
                onClick={() => {
                  buzz(6);
                  setTab("feed");
                }}
                data-on={tab === "feed"}
                className="seg-item flex items-center gap-1.5"
              >
                <SymbolCompass fill={tab === "feed"} className="h-4 w-4" />
                {t(lang, "feedAndClan").split("&")[0]?.trim() || "Feed"}
              </button>
              <button
                type="button"
                onClick={() => {
                  buzz(6);
                  setTab("clan");
                }}
                data-on={tab === "clan"}
                className="seg-item flex items-center gap-1.5"
              >
                <SymbolShield fill={tab === "clan"} className="h-4 w-4" />
                {t(lang, "clan")}
              </button>
              <button
                type="button"
                onClick={() => {
                  buzz(6);
                  setTab("shop");
                }}
                data-on={tab === "shop" || tab === "gacha"}
                className="seg-item flex items-center gap-1.5"
              >
                <SymbolBag fill={tab === "shop" || tab === "gacha"} className="h-4 w-4" />
                Shop
              </button>
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

          {tab === "feed" && (
            <SocialFeedTab social={social} rank={rank} stats={stats} lang={lang} />
          )}

          {tab === "clan" && (
            <ClanSystemTab social={social} updateSocial={updateSocial} rank={rank} />
          )}

          {(tab === "shop" || tab === "gacha") && (
            <CosmeticShopTab social={social} updateSocial={updateSocial} />
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

  const totalPinsCount = Math.max(stats.rounds, 45);
  const totalGamesCount = Math.max(stats.games, 9);

  return (
    <div className="space-y-5">
      {/* X-Style Profile Card */}
      <section className="plate overflow-hidden">
        {/* Banner Header (Apple Style Quiet Gray Default / Custom Color / Uploaded Image) */}
        <div
          className="relative h-36 w-full sm:h-44 bg-cover bg-center transition-colors"
          style={{
            backgroundColor: social.bannerColor || "#27272a",
            backgroundImage: social.bannerImageUrl ? `url(${social.bannerImageUrl})` : (social.bannerColor ? undefined : social.bannerGradient),
          }}
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
              <span className="rounded-full bg-[#D2F801]/15 px-2.5 py-0.5 font-bold text-[#D2F801]">
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

          {/* Inline Profile Editor with Avatar & Banner Customization */}
          {editing && (
            <div className="mt-4 space-y-3 rounded-2xl border border-[#D2F801]/40 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#D2F801]">
                  Edit Profile Information
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
                    <label className="btn btn-outline mt-1 inline-flex cursor-pointer items-center gap-1.5 !px-3 !py-1 text-xs font-bold">
                      <Upload className="h-3.5 w-3.5 text-[#D2F801]" /> Upload Photo
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
                      <label className="btn btn-outline inline-flex cursor-pointer items-center gap-1.5 !px-3 !py-1 text-xs font-bold">
                        <Upload className="h-3.5 w-3.5 text-[#D2F801]" /> Upload Banner
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
                            ? "ring-2 ring-[#D2F801] scale-110 border-white"
                            : "border-border/80 hover:scale-105"
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
                {lvl.currentLevelExp} / {lvl.nextLevelExp} EXP · Next Milestone: +250 Coins
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted p-0.5">
              <div
                className="h-full rounded-full transition-[width] duration-500 bg-[#D2F801]"
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
              <p className="font-display text-2xl text-[#D2F801]">{totalPinsCount.toLocaleString()}</p>
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
  const isLeader = myClan
    ? myClan.members.some((m) => m.id === "me" && m.role === "Leader") || myClan.tag === social.clanTag
    : false;
  const [editingClan, setEditingClan] = useState(false);
  const [editClanName, setEditClanName] = useState(myClan?.name ?? "");
  const [editClanTag, setEditClanTag] = useState(myClan?.tag ?? "");
  const [editClanIcon, setEditClanIcon] = useState<string | null>(myClan?.iconUrl ?? null);

  const handleSaveClanEdits = () => {
    if (!myClan) return;
    const cleanTag = editClanTag.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanName = editClanName.trim();
    if (cleanTag.length < 2 || cleanTag.length > 5) {
      alert("Clan TAG must be 2 to 5 characters.");
      return;
    }
    if (cleanName.length < 3) {
      alert("Clan name must be at least 3 characters.");
      return;
    }
    const updated = clans.map((c) => (c.id === myClan.id ? { ...c, name: cleanName, tag: cleanTag, iconUrl: editClanIcon ?? c.iconUrl } : c));
    saveClans(updated);
    updateSocial({ clanTag: cleanTag });
    setEditingClan(false);
  };

  const handleCreateClan = () => {
    const cleanTag = tagInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanName = nameInput.trim();
    if (cleanTag.length < 2 || cleanTag.length > 5) {
      setErrorMsg("Clan TAG must be 2 to 5 characters.");
      return;
    }
    if (cleanName.length < 3) {
      setErrorMsg("Clan full name must be at least 3 characters.");
      return;
    }
    if (clans.some((c) => c.name.toLowerCase() === cleanName.toLowerCase() || c.tag === cleanTag)) {
      setErrorMsg("Clan name or TAG is already taken!");
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
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-[#D2F801]/40 bg-[#D2F801]/10 font-display text-xl text-[#D2F801]">
                {myClan.iconUrl ? (
                  <img src={myClan.iconUrl} alt={myClan.name} className="h-full w-full object-cover" />
                ) : (
                  myClan.tag
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
                <p className="readout mt-1 text-xs font-semibold text-[#D2F801]">
                  Members: {myClan.members.length} / {myClan.maxMembers} · Party Clan Bonus: +15% Clan Points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLeader && (
                <button
                  type="button"
                  onClick={() => {
                    setEditClanName(myClan.name);
                    setEditClanTag(myClan.tag);
                    setEditingClan((v) => !v);
                  }}
                  className="btn btn-outline !px-3 !py-1.5 text-xs font-bold"
                >
                  <Edit3 className="mr-1 inline h-3.5 w-3.5" />
                  {editingClan ? "Cancel" : "Edit Clan"}
                </button>
              )}
              <button
                type="button"
                onClick={() => updateSocial({ clanId: null, clanTag: null })}
                className="btn btn-outline !px-4 !py-1.5 text-xs"
              >
                Leave Clan
              </button>
            </div>
          </div>

          {/* Clan Leader Edit Form */}
          {editingClan && (
            <div className="mt-4 space-y-3 rounded-2xl border border-[#D2F801]/40 bg-background/60 p-4">
              <span className="text-xs font-semibold text-[#D2F801]">
                Leader Management: Edit Clan Name & Tag
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs">
                  <span className="font-semibold text-muted-foreground">Clan Name</span>
                  <input
                    value={editClanName}
                    onChange={(e) => setEditClanName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-semibold text-muted-foreground">Clan TAG (2–5 Chars)</span>
                  <input
                    value={editClanTag}
                    maxLength={5}
                    onChange={(e) => setEditClanTag(e.target.value.toUpperCase())}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-display tracking-wider"
                  />
                </label>
                <label className="block text-xs sm:col-span-2">
                  <span className="font-semibold text-muted-foreground">Clan Profile / Avatar Photo</span>
                  <div className="mt-1 flex items-center gap-3">
                    {editClanIcon && (
                      <img src={editClanIcon} alt="Clan Icon" className="h-10 w-10 rounded-xl object-cover border border-border" />
                    )}
                    <label className="btn btn-outline inline-flex cursor-pointer items-center gap-1.5 !px-3 !py-1 text-xs font-bold">
                      <Upload className="h-3.5 w-3.5 text-[#D2F801]" /> Upload Clan Avatar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const res = ev.target?.result as string;
                              if (res) setEditClanIcon(res);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {editClanIcon && (
                      <button
                        type="button"
                        onClick={() => setEditClanIcon(null)}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </label>
              </div>
              <button
                type="button"
                onClick={handleSaveClanEdits}
                className="btn btn-primary !px-5 !py-2 text-xs font-bold"
              >
                Save Clan Changes
              </button>
            </div>
          )}

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
            <h3 className="mb-2.5 text-xs font-semibold text-muted-foreground">
              Clan Roster ({myClan.members.length}/{myClan.maxMembers})
            </h3>
            <div className="divide-y divide-border rounded-2xl border border-border bg-background/30">
              {myClan.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <AvatarFrame name={m.nickname} rp={m.rp} size={36} />
                    <div className="flex items-center gap-1.5">
                      <ClanTagPill tag={myClan.tag} />
                      <span className="font-bold">{m.nickname}</span>
                      <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
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
              <span className="font-bold text-muted-foreground">Upload Clan Avatar (Optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const res = ev.target?.result as string;
                      if (res) setIconUrlInput(res);
                    };
                    reader.readAsDataURL(file);
                  }
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
    </div>
  );
}

/* ============================================================================
 * 3. COSMETIC SHOP TAB (Direct Buy with Coins, Equip Loadout & Categories)
 * ========================================================================== */
function CosmeticShopTab({
  social,
  updateSocial,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  updateSocial: ReturnType<typeof useSocialProfile>[1];
}) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const rarityPrices: Record<GachaItem["rarity"], number> = {
    Common: 250,
    Rare: 500,
    Epic: 1000,
    Mythic: 2500,
  };

  const rarityColor: Record<GachaItem["rarity"], string> = {
    Common: "#9A9D97",
    Rare: "#3898FF",
    Epic: "#D2F801",
    Mythic: "#DC1F30",
  };

  const categories = [
    { id: "all", label: "All Items" },
    { id: "aura", label: "Chat Auras" },
    { id: "pin", label: "Map Pins" },
    { id: "trail", label: "Trails" },
    { id: "tagColor", label: "TAG Colors" },
    { id: "nameColor", label: "Name Colors" },
    { id: "title", label: "Titles" },
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
    if (item.category === "title") return social.title === item.value;
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
    } else if (item.category === "title") {
      updateSocial({ title: item.value });
    }
  };

  const buyItem = (item: GachaItem) => {
    const cost = rarityPrices[item.rarity];
    const currentCoins = social.coins ?? 10000;
    if (currentCoins < cost) {
      alert(`Not enough Coins! This item costs ${cost.toLocaleString()} Coins (You have ${currentCoins.toLocaleString()} Coins).`);
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
            <span className="inline-flex items-center gap-1 rounded-full bg-[#D2F801] px-3 py-0.5 text-xs font-extrabold uppercase text-[#161616]">
              <ShoppingBag className="h-3.5 w-3.5" /> Cosmetic Shop
            </span>
            <h2 className="font-display mt-2 text-3xl">Direct Cosmetic Store</h2>
            <p className="text-xs text-muted-foreground">
              Purchase Super Chat Auras, Custom Map Pins, Trajectory Trails, Clan TAG Colors & Titles directly with Coins
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="readout rounded-full border border-[#D2F801] bg-[#D2F801]/10 px-4 py-1.5 text-sm font-extrabold text-[#D2F801]">
              🪙 {(social.coins ?? 10000).toLocaleString()} Coins
            </span>
            <button
              type="button"
              onClick={() => updateSocial({ coins: (social.coins ?? 10000) + 2000 })}
              className="btn btn-outline !px-3.5 !py-1.5 text-xs font-bold"
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
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                categoryFilter === c.id
                  ? "bg-[#D2F801] text-[#161616]"
                  : "border border-border bg-background/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Cosmetics Grid */}
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

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition-colors ${
                  equipped
                    ? "border-[#D2F801] bg-[#D2F801]/5"
                    : owned
                    ? "border-border bg-background/50"
                    : "border-border/60 bg-background/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase"
                      style={{
                        backgroundColor: color === "#D2F801" ? "#D2F801" : `${color}22`,
                        color: color === "#D2F801" ? "#161616" : color,
                        border: color === "#D2F801" ? "none" : `1px solid ${color}44`,
                      }}
                    >
                      {item.rarity}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="font-display mt-2.5 text-lg font-bold">{item.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.previewText}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50">
                  {equipped ? (
                    <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D2F801] bg-[#D2F801]/10 py-2 text-xs font-extrabold text-[#D2F801]">
                      <Check className="h-4 w-4" /> Equipped
                    </div>
                  ) : owned ? (
                    <button
                      type="button"
                      onClick={() => equipItem(item)}
                      className="btn btn-outline w-full !py-2 text-xs font-bold"
                    >
                      Equip
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="readout text-xs font-extrabold text-[#D2F801]">
                        🪙 {price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => buyItem(item)}
                        className="btn btn-primary !px-4 !py-1.5 text-xs font-extrabold"
                      >
                        Buy Now
                      </button>
                    </div>
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
  const { posts, stories, addPost, toggleLike, addComment, addStory } = useFeed();
  const [postText, setPostText] = useState("");
  const [attachResultCard, setAttachResultCard] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeStory, setActiveStory] = useState<StoryHighlight | null>(null);

  const handleUploadStory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result as string;
      addStory({
        authorId: "me",
        authorName: social.nickname,
        authorUsername: social.username,
        authorClanTag: social.clanTag,
        authorVerified: social.verifiedBadge,
        authorRp: rank.rp,
        authorChampPos: rank.championPosition,
        country: social.country,
        mode: "Photo Story",
        score: "Story",
        accuracy: "100%",
        caption: "Shared a new photo story",
        gradient: "linear-gradient(160deg, #161616 0%, #262626 100%)",
        imageUrl: imgUrl,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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
      {/* Story Strip */}
      <section>
        <h2 className="mb-2.5 text-xs font-semibold text-muted-foreground">
          {t(lang, "stories")}
        </h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {/* + Add Story Button */}
          <label className="story-ring relative aspect-[4/5] w-28 shrink-0 cursor-pointer rounded-[18px] text-center transition-opacity hover:opacity-90">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadStory}
            />
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[15.5px] bg-card p-2 text-foreground">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#D2F801] text-[#161616]">
                <Plus className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-[#D2F801]">+ Add Story</span>
              <span className="text-[10px] text-muted-foreground">Upload photo</span>
            </div>
          </label>

          {stories.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStory(st)}
              className="story-ring relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-[18px] text-left transition-opacity hover:opacity-90"
            >
              {st.imageUrl ? (
                <div className="relative h-full w-full rounded-[15.5px] overflow-hidden">
                  <img src={st.imageUrl} alt={st.caption} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-2.5 flex flex-col justify-between text-white">
                    <AvatarFrame
                      name={st.authorName}
                      rp={st.authorRp}
                      championPosition={st.authorChampPos}
                      size={28}
                    />
                    <div>
                      <p className="truncate text-xs font-bold text-white">{st.authorName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-full w-full flex-col justify-between rounded-[15.5px] p-2.5 text-white"
                  style={{ background: st.gradient }}
                >
                  <AvatarFrame
                    name={st.authorName}
                    rp={st.authorRp}
                    championPosition={st.authorChampPos}
                    size={28}
                  />
                  <div>
                    <p className="font-display text-lg text-[#D2F801]">{st.score}</p>
                    <p className="truncate text-[10px] font-bold">{st.authorName}</p>
                  </div>
                </div>
              )}
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
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#D2F801]"
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
                  <span className="rounded-full bg-[#D2F801] px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#161616]">
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
                className="flex-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs outline-none focus:border-[#D2F801]"
              />
              <button
                type="button"
                onClick={() => submitComment(post.id)}
                className="rounded-full bg-[#D2F801] px-3.5 py-1.5 text-xs font-bold text-[#161616]"
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
          <div className="story-ring relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[24px]">
            {activeStory.imageUrl ? (
              <div className="relative h-full w-full rounded-[21px] overflow-hidden">
                <img src={activeStory.imageUrl} alt={activeStory.caption} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 p-6 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">{activeStory.authorName}</span>
                    <button
                      type="button"
                      onClick={() => setActiveStory(null)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-black/60"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-display text-4xl text-[#D2F801]">{activeStory.score}</p>
                    <p className="mt-2 text-sm text-white/90">{activeStory.caption}</p>
                    <button
                      type="button"
                      onClick={() => setActiveStory(null)}
                      className="btn btn-primary mt-4 w-full py-2.5 text-xs font-bold"
                    >
                      Close Story
                    </button>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
