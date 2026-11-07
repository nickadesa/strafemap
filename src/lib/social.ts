import { useCallback, useEffect, useState } from "react";
import type { VerifiedBadgeType } from "@/components/RankVisuals";

export type ContinentZone = "Global" | "Asia" | "Europe" | "Americas" | "Africa" | "Oceania";

export interface SocialProfile {
  id: string;
  nickname: string;
  username: string;
  isGuest: boolean;
  bio: string;
  avatarUrl: string | null;
  bannerGradient: string;
  country: string;
  zone: Exclude<ContinentZone, "Global">;
  verifiedBadge: VerifiedBadgeType;
  pinnedBadges: string[]; // Max 5 unlocked achievement IDs
  clanId: string | null;
  clanTag: string | null;
  clanTagColor: string;
  nameColor: string;
  title: string;
  chatAura: "none" | "fire" | "water" | "rainbow" | "vines";
  pinStyle: "blue" | "lime" | "crimson" | "violet";
  trailStyle: "lime" | "blue" | "rainbow" | "solar";
  exp: number;
  coins: number;
  gachaTickets: number;
  followingIds: string[];
  followerIds: string[];
  unlockedCosmetics: string[];
}

export interface CommunityPlayer {
  id: string;
  nickname: string;
  username: string;
  bio: string;
  avatarUrl?: string | null;
  country: string;
  zone: Exclude<ContinentZone, "Global">;
  rp: number;
  championPosition?: number | null;
  clanTag: string | null;
  clanTagColor?: string;
  verifiedBadge: VerifiedBadgeType;
  level: number;
  totalGames: number;
  totalPins: number;
  title: string;
  pinnedBadges: string[];
}

export interface ClanMember {
  id: string;
  nickname: string;
  username: string;
  rp: number;
  role: "Leader" | "Officer" | "Member";
  weeklyContribution: number;
}

export interface ClanInfo {
  id: string;
  tag: string; // 2-5 chars
  name: string; // Unique full name
  iconUrl: string | null;
  description: string;
  level: number; // 1-10
  xp: number;
  maxMembers: number; // 50
  members: ClanMember[];
  totalPoints: number;
  weeklyMissionProgress: number;
  weeklyMissionTarget: number;
}

export type GachaRarity = "Common" | "Rare" | "Epic" | "Mythic";
export type CosmeticCategory = "aura" | "pin" | "trail" | "nameColor" | "tagColor" | "title";

export interface GachaItem {
  id: string;
  name: string;
  category: CosmeticCategory;
  rarity: GachaRarity;
  value: string;
  previewText: string;
  packId: string;
}

export interface GachaPack {
  id: string;
  name: string;
  subtitle: string;
  accent: string;
  costTickets: number;
  costCoins: number;
  featuredItems: string[];
}

export interface StoryHighlight {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorClanTag: string | null;
  authorVerified: VerifiedBadgeType;
  authorRp: number;
  authorChampPos?: number | null | undefined;
  country: string;
  mode: string;
  score: string;
  accuracy: string;
  caption: string;
  gradient: string;
  imageUrl?: string | undefined;
  timestamp: string;
  viewed?: boolean | undefined;
}

export interface FeedComment {
  id: string;
  authorName: string;
  authorUsername: string;
  authorClanTag?: string | null | undefined;
  authorVerified?: VerifiedBadgeType | undefined;
  text: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorClanTag: string | null;
  authorVerified: VerifiedBadgeType;
  authorRp: number;
  authorChampPos?: number | null | undefined;
  country: string;
  timestamp: string;
  content: string;
  resultCard?: {
    mode: string;
    score: number;
    maxScore: number;
    accuracy: string;
    avgError: string;
    grade: string;
  } | null | undefined;
  likes: number;
  likedByMe: boolean;
  comments: FeedComment[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link: string;
}

export const LEVEL_MAX = 1000;
export const EXP_PER_LEVEL = 500;

export function computeLevelFromExp(exp: number): {
  level: number;
  currentLevelExp: number;
  nextLevelExp: number;
  progressPct: number;
} {
  const safeExp = Math.max(0, Math.floor(exp));
  const rawLevel = Math.floor(safeExp / EXP_PER_LEVEL) + 1;
  const level = Math.min(LEVEL_MAX, rawLevel);
  const currentLevelExp = level >= LEVEL_MAX ? EXP_PER_LEVEL : safeExp % EXP_PER_LEVEL;
  const progressPct = level >= LEVEL_MAX ? 100 : Math.round((currentLevelExp / EXP_PER_LEVEL) * 100);
  return { level, currentLevelExp, nextLevelExp: EXP_PER_LEVEL, progressPct };
}

export const GACHA_PACKS: GachaPack[] = [
  {
    id: "identity-pack",
    name: "Identity & Title Pack",
    subtitle: "Custom [TAG] pill colors, titles & name colors (Starter Tier)",
    accent: "#A855F7",
    costTickets: 1,
    costCoins: 250,
    featuredItems: ["Acid Lime [TAG] Pill", "Crimson Sovereign Name", "Title: Grand Meridian", "Title: 7-Sin Conqueror"],
  },
  {
    id: "cartographer-pack",
    name: "Cartographer Pin & Trail Pack",
    subtitle: "Custom map pins & animated trajectory lines on round reveal",
    accent: "#D2F801",
    costTickets: 1,
    costCoins: 500,
    featuredItems: ["Acid Lime Sovereign Pin", "Solar Flare Trajectory", "Prismatic Pulse Trail", "Violet Nebula Pin"],
  },
  {
    id: "aura-pack",
    name: "Aura & Super Chat Pack",
    subtitle: "Unlock animated elemental & rainbow chat bubble borders",
    accent: "#0367FC",
    costTickets: 1,
    costCoins: 750,
    featuredItems: ["Inferno Chat Aura", "Tidal Wave Chat Aura", "Prismatic Rainbow Aura", "Emerald Vines Aura"],
  },
  {
    id: "mythic-pack",
    name: "Mythic Sovereign Vault",
    subtitle: "Boosted drop rates for Epic & Mythic seasonal cosmetics",
    accent: "#DC1F30",
    costTickets: 2,
    costCoins: 1000,
    featuredItems: ["Prismatic Rainbow Aura", "Title: World Sovereign", "Gold [TAG] Pill", "Prismatic Pulse Trail"],
  },
];

export const GACHA_ITEMS: GachaItem[] = [
  { id: "aura-fire", name: "Inferno Flame Chat", category: "aura", rarity: "Epic", value: "fire", previewText: "🔥 Blazing orange-red chat border", packId: "aura-pack" },
  { id: "aura-water", name: "Tidal Current Chat", category: "aura", rarity: "Rare", value: "water", previewText: "🌊 Deep electric blue ocean glow", packId: "aura-pack" },
  { id: "aura-rainbow", name: "Prismatic Sovereign Chat", category: "aura", rarity: "Mythic", value: "rainbow", previewText: "🌈 Full-spectrum holographic chat aura", packId: "mythic-pack" },
  { id: "aura-vines", name: "Emerald Vines Chat", category: "aura", rarity: "Rare", value: "vines", previewText: "🌿 Botanical neon-lime chat border", packId: "aura-pack" },
  { id: "pin-lime", name: "Acid Lime Bullseye Pin", category: "pin", rarity: "Epic", value: "lime", previewText: "📍 High-voltage #D2F801 map pin", packId: "cartographer-pack" },
  { id: "pin-crimson", name: "Champion Crimson Pin", category: "pin", rarity: "Epic", value: "crimson", previewText: "📍 Apex red map marker", packId: "cartographer-pack" },
  { id: "pin-violet", name: "Nebula Violet Pin", category: "pin", rarity: "Rare", value: "violet", previewText: "📍 Ultraviolet precision pin", packId: "cartographer-pack" },
  { id: "trail-blue", name: "Electric Blue Laser Trail", category: "trail", rarity: "Rare", value: "blue", previewText: "⚡ #0367FC dashed reveal trajectory", packId: "cartographer-pack" },
  { id: "trail-rainbow", name: "Prismatic Trajectory Beam", category: "trail", rarity: "Mythic", value: "rainbow", previewText: "✨ Multi-spectrum reveal line", packId: "mythic-pack" },
  { id: "trail-solar", name: "Solar Gold Trajectory", category: "trail", rarity: "Epic", value: "solar", previewText: "☀️ Golden arc to target location", packId: "cartographer-pack" },
  { id: "tag-lime", name: "Acid Lime [TAG] Pill", category: "tagColor", rarity: "Epic", value: "#D2F801", previewText: "[TAG] in #D2F801 with #161616 text", packId: "identity-pack" },
  { id: "tag-crimson", name: "Crimson Elite [TAG] Pill", category: "tagColor", rarity: "Epic", value: "#DC1F30", previewText: "[TAG] in Champion Crimson", packId: "identity-pack" },
  { id: "tag-gold", name: "Sovereign Gold [TAG] Pill", category: "tagColor", rarity: "Mythic", value: "#FFC82A", previewText: "[TAG] in gleaming Gold", packId: "mythic-pack" },
  { id: "tag-purple", name: "Void Violet [TAG] Pill", category: "tagColor", rarity: "Rare", value: "#9333EA", previewText: "[TAG] in Royal Purple", packId: "identity-pack" },
  { id: "name-lime", name: "Acid Lime Nickname", category: "nameColor", rarity: "Epic", value: "#D2F801", previewText: "Glowing Acid Lime display name", packId: "identity-pack" },
  { id: "name-blue", name: "Electric Blue Nickname", category: "nameColor", rarity: "Rare", value: "#3898FF", previewText: "Electric Blue display name", packId: "identity-pack" },
  { id: "name-gold", name: "Sovereign Gold Nickname", category: "nameColor", rarity: "Mythic", value: "#FFC82A", previewText: "Gold leaf display name", packId: "mythic-pack" },
  { id: "title-meridian", name: "Title: Grand Meridian", category: "title", rarity: "Rare", value: "Grand Meridian", previewText: "Displayed beneath your profile & lobby name", packId: "identity-pack" },
  { id: "title-sins", name: "Title: 7-Sin Conqueror", category: "title", rarity: "Epic", value: "7-Sin Conqueror", previewText: "Master of the 7 Deadly Sins mode", packId: "identity-pack" },
  { id: "title-sovereign", name: "Title: World Sovereign", category: "title", rarity: "Mythic", value: "World Sovereign", previewText: "Ultimate global cartography title", packId: "mythic-pack" },
  { id: "title-blind", name: "Title: Blindfold Oracle", category: "title", rarity: "Common", value: "Blindfold Oracle", previewText: "Unerring memory without map labels", packId: "identity-pack" },
];

export const COMMUNITY_PLAYERS: CommunityPlayer[] = [
  {
    id: "p-1",
    nickname: "AetherPin",
    username: "aetherpin",
    bio: "Top 1 Global Cartographer · Zero-label specialist · 25,000 PB",
    country: "Japan",
    zone: "Asia",
    rp: 8420,
    championPosition: 1,
    clanTag: "APEX",
    clanTagColor: "#DC1F30",
    verifiedBadge: "gold",
    level: 412,
    totalGames: 1840,
    totalPins: 9200,
    title: "World Sovereign",
    pinnedBadges: ["B-09", "N-05", "A-06", "E-08", "H-13"],
  },
  {
    id: "p-2",
    nickname: "ValkyrieGeo",
    username: "valkyrie_geo",
    bio: "Coastlines & mountain passes. EU Champion finalist.",
    country: "Sweden",
    zone: "Europe",
    rp: 8190,
    championPosition: 2,
    clanTag: "NORD",
    clanTagColor: "#0367FC",
    verifiedBadge: "green",
    level: 389,
    totalGames: 1620,
    totalPins: 8100,
    title: "Grand Cartographer",
    pinnedBadges: ["N-05", "B-04", "C-08", "I-10", "H-08"],
  },
  {
    id: "p-3",
    nickname: "SiamStriker",
    username: "siam_striker",
    bio: "SEA #1 · Pride & Wrath card main in 7 Deadly Sins 🔥",
    country: "Thailand",
    zone: "Asia",
    rp: 7940,
    championPosition: 3,
    clanTag: "STRF",
    clanTagColor: "#D2F801",
    verifiedBadge: "red",
    level: 355,
    totalGames: 1490,
    totalPins: 7450,
    title: "7-Sin Conqueror",
    pinnedBadges: ["N-05", "B-09", "E-10", "D-10", "F-11"],
  },
  {
    id: "p-4",
    nickname: "MercatorX",
    username: "mercator_x",
    bio: "Hardcore mode only. No borders, no mercy.",
    country: "United States",
    zone: "Americas",
    rp: 7610,
    championPosition: 7,
    clanTag: "APEX",
    clanTagColor: "#DC1F30",
    verifiedBadge: "gold",
    level: 298,
    totalGames: 1210,
    totalPins: 6050,
    title: "Celestial Navigator",
    pinnedBadges: ["N-04", "B-03", "C-04", "A-04"],
  },
  {
    id: "p-5",
    nickname: "KestrelMap",
    username: "kestrel_kr",
    bio: "Fastest 0.8s capital pin in Ranked.",
    country: "South Korea",
    zone: "Asia",
    rp: 7280,
    championPosition: 19,
    clanTag: "SEOUL",
    clanTagColor: "#0367FC",
    verifiedBadge: "gold",
    level: 264,
    totalGames: 980,
    totalPins: 4900,
    title: "Grand Meridian",
    pinnedBadges: ["N-04", "H-08", "B-03"],
  },
  {
    id: "p-6",
    nickname: "AndesCondor",
    username: "andes_condor",
    bio: "South America & Southern Hemisphere specialist.",
    country: "Brazil",
    zone: "Americas",
    rp: 6540,
    championPosition: null,
    clanTag: "SUL",
    clanTagColor: "#10B981",
    verifiedBadge: "green",
    level: 215,
    totalGames: 840,
    totalPins: 4200,
    title: "Celestial Navigator",
    pinnedBadges: ["N-03", "B-02", "E-06"],
  },
  {
    id: "p-7",
    nickname: "SaharaPulse",
    username: "sahara_pulse",
    bio: "54 African countries in 40 seconds.",
    country: "Egypt",
    zone: "Africa",
    rp: 5820,
    championPosition: null,
    clanTag: "NILE",
    clanTagColor: "#FFC82A",
    verifiedBadge: "gold",
    level: 184,
    totalGames: 710,
    totalPins: 3550,
    title: "Atlas Vanguard",
    pinnedBadges: ["N-03", "A-03", "E-02"],
  },
  {
    id: "p-8",
    nickname: "TasmanDrift",
    username: "tasman_drift",
    bio: "Oceania & Pacific atolls.",
    country: "Australia",
    zone: "Oceania",
    rp: 4720,
    championPosition: null,
    clanTag: "REEF",
    clanTagColor: "#0367FC",
    verifiedBadge: "none",
    level: 142,
    totalGames: 530,
    totalPins: 2650,
    title: "Atlas Vanguard",
    pinnedBadges: ["N-02", "B-02"],
  },
  {
    id: "p-9",
    nickname: "LumenParis",
    username: "lumen_paris",
    bio: "Daily challenge 120-day streak holder.",
    country: "France",
    zone: "Europe",
    rp: 3890,
    championPosition: null,
    clanTag: "NORD",
    clanTagColor: "#0367FC",
    verifiedBadge: "gold",
    level: 118,
    totalGames: 460,
    totalPins: 2300,
    title: "Golden Sovereign",
    pinnedBadges: ["N-02", "E-03"],
  },
];

const INITIAL_CLANS: ClanInfo[] = [
  {
    id: "clan-strf",
    tag: "STRF",
    name: "STRAFE Official Vanguard",
    iconUrl: null,
    description: "Official elite cartographers of STRAFE. Weekly Party rooms & Ranked grind!",
    level: 9,
    xp: 8450,
    maxMembers: 50,
    totalPoints: 148900,
    weeklyMissionProgress: 42,
    weeklyMissionTarget: 50,
    members: [
      { id: "p-3", nickname: "SiamStriker", username: "siam_striker", rp: 7940, role: "Leader", weeklyContribution: 4200 },
      { id: "me", nickname: "StrafePlayer", username: "strafe_ace", rp: 1120, role: "Officer", weeklyContribution: 1950 },
      { id: "p-5", nickname: "KestrelMap", username: "kestrel_kr", rp: 7280, role: "Member", weeklyContribution: 3100 },
    ],
  },
  {
    id: "clan-apex",
    tag: "APEX",
    name: "Apex Meridian Syndicate",
    iconUrl: null,
    description: "Top 50 Champion grinders and Blind Map specialists.",
    level: 10,
    xp: 10000,
    maxMembers: 50,
    totalPoints: 192400,
    weeklyMissionProgress: 50,
    weeklyMissionTarget: 50,
    members: [
      { id: "p-1", nickname: "AetherPin", username: "aetherpin", rp: 8420, role: "Leader", weeklyContribution: 5800 },
      { id: "p-4", nickname: "MercatorX", username: "mercator_x", rp: 7610, role: "Officer", weeklyContribution: 4600 },
    ],
  },
  {
    id: "clan-nord",
    tag: "NORD",
    name: "Nordic Compass Collective",
    iconUrl: null,
    description: "European geography masters & weekend Party voice lobbies.",
    level: 8,
    xp: 7200,
    maxMembers: 50,
    totalPoints: 129300,
    weeklyMissionProgress: 36,
    weeklyMissionTarget: 50,
    members: [
      { id: "p-2", nickname: "ValkyrieGeo", username: "valkyrie_geo", rp: 8190, role: "Leader", weeklyContribution: 4900 },
      { id: "p-9", nickname: "LumenParis", username: "lumen_paris", rp: 3890, role: "Member", weeklyContribution: 2400 },
    ],
  },
];

const INITIAL_STORIES: StoryHighlight[] = [
  {
    id: "st-1",
    authorId: "p-1",
    authorName: "AetherPin",
    authorUsername: "aetherpin",
    authorClanTag: "APEX",
    authorVerified: "gold",
    authorRp: 8420,
    authorChampPos: 1,
    country: "Japan",
    mode: "Hardcore Blind",
    score: "24,980",
    accuracy: "99.9%",
    caption: "0.4 km off Ushuaia with zero labels! Can anyone top this?",
    gradient: "linear-gradient(160deg, #0367FC 0%, #161616 55%, #D2F801 100%)",
    timestamp: "12m ago",
  },
  {
    id: "st-2",
    authorId: "p-3",
    authorName: "SiamStriker",
    authorUsername: "siam_striker",
    authorClanTag: "STRF",
    authorVerified: "red",
    authorRp: 7940,
    authorChampPos: 3,
    country: "Thailand",
    mode: "7 Deadly Sins",
    score: "25,000",
    accuracy: "100%",
    caption: "Pride Card +12% Bullseye radius paid off every single round 🔥",
    gradient: "linear-gradient(160deg, #DC1F30 0%, #161616 60%, #FFC82A 100%)",
    timestamp: "41m ago",
  },
  {
    id: "st-3",
    authorId: "p-2",
    authorName: "ValkyrieGeo",
    authorUsername: "valkyrie_geo",
    authorClanTag: "NORD",
    authorVerified: "green",
    authorRp: 8190,
    authorChampPos: 2,
    country: "Sweden",
    mode: "Find the City",
    score: "24,410",
    accuracy: "97.6%",
    caption: "No city names in Brazil & Japan — pure coastline triangulation.",
    gradient: "linear-gradient(160deg, #10B981 0%, #161616 60%, #0367FC 100%)",
    timestamp: "1h ago",
  },
  {
    id: "st-4",
    authorId: "p-4",
    authorName: "MercatorX",
    authorUsername: "mercator_x",
    authorClanTag: "APEX",
    authorVerified: "gold",
    authorRp: 7610,
    authorChampPos: 7,
    country: "United States",
    mode: "Ranked 1v1",
    score: "23,890",
    accuracy: "95.5%",
    caption: "10-round Ranked streak into Champion Top 10!",
    gradient: "linear-gradient(160deg, #9333EA 0%, #161616 60%, #D2F801 100%)",
    timestamp: "3h ago",
  },
];

const INITIAL_POSTS: FeedPost[] = [
  {
    id: "post-1",
    authorId: "p-3",
    authorName: "SiamStriker",
    authorUsername: "siam_striker",
    authorClanTag: "STRF",
    authorVerified: "red",
    authorRp: 7940,
    authorChampPos: 3,
    country: "Thailand",
    timestamp: "18m ago",
    content: "Just dropped a full 25,000 in 7 Deadly Sins using the Pride card (Precision Bullseye)! What Sin card is everyone maining this season?",
    resultCard: {
      mode: "7 Deadly Sins · Pride",
      score: 25000,
      maxScore: 25000,
      accuracy: "100%",
      avgError: "14.2 km",
      grade: "S",
    },
    likes: 48,
    likedByMe: false,
    comments: [
      {
        id: "c-1",
        authorName: "AetherPin",
        authorUsername: "aetherpin",
        authorClanTag: "APEX",
        authorVerified: "gold",
        text: "Wrath (Snap Lock) is insane if you pin within the first 40% of the timer!",
        timestamp: "10m ago",
      },
    ],
  },
  {
    id: "post-2",
    authorId: "p-2",
    authorName: "ValkyrieGeo",
    authorUsername: "valkyrie_geo",
    authorClanTag: "NORD",
    authorVerified: "green",
    authorRp: 8190,
    authorChampPos: 2,
    country: "Sweden",
    timestamp: "1h ago",
    content: "Hosting a 16-player Party lobby tonight at 20:00 UTC with Voice Chat & Find the City mode! Drop your @username if you want an invite 🌍🎙️",
    resultCard: null,
    likes: 31,
    likedByMe: true,
    comments: [],
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-1",
    title: "Season 1 Ranked Rewards",
    body: "Reach Gold or higher to unlock the Golden Sovereign Title & Avatar Frame!",
    time: "Just now",
    read: false,
    link: "/rank",
  },
  {
    id: "n-2",
    title: "SiamStriker [STRF] followed you",
    body: "You can now invite each other to Party voice rooms.",
    time: "25m ago",
    read: false,
    link: "/profile",
  },
  {
    id: "n-3",
    title: "Free Gacha Ticket Claimed",
    body: "You have 5 Gacha Tickets ready to open in the Gacha Vault!",
    time: "1h ago",
    read: false,
    link: "/profile?tab=gacha",
  },
];

const SOCIAL_KEY = "strafe.social.profile";
const CLANS_KEY = "strafe.social.clans";
const POSTS_KEY = "strafe.social.posts";
const STORIES_KEY = "strafe.social.stories";
const NOTIFS_KEY = "strafe.social.notifs";
const EVT = "strafe:social";

const DEFAULT_SOCIAL_PROFILE: SocialProfile = {
  id: "me",
  nickname: "StrafePlayer",
  username: "strafe_ace",
  isGuest: false,
  bio: "Exploring every meridian. Dual-core cartographer on STRAFE 🌍📍",
  avatarUrl: null,
  bannerGradient: "linear-gradient(135deg, #0367FC 0%, #161616 55%, #D2F801 100%)",
  country: "Thailand",
  zone: "Asia",
  verifiedBadge: "gold",
  pinnedBadges: ["A-01", "B-01", "E-01", "F-01", "H-01"],
  clanId: "clan-strf",
  clanTag: "STRF",
  clanTagColor: "#0367FC",
  nameColor: "#FFFFFF",
  title: "Grand Meridian",
  chatAura: "rainbow",
  pinStyle: "blue",
  trailStyle: "lime",
  exp: 6850,
  coins: 10000,
  gachaTickets: 6,
  followingIds: ["p-1", "p-2", "p-3"],
  followerIds: ["p-2", "p-3", "p-5", "p-9"],
  unlockedCosmetics: ["aura-rainbow", "aura-water", "pin-lime", "trail-blue", "tag-lime", "title-meridian"],
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function loadSocialProfile(): SocialProfile {
  const p = readStorage<SocialProfile>(SOCIAL_KEY, DEFAULT_SOCIAL_PROFILE);
  return { ...DEFAULT_SOCIAL_PROFILE, ...p, coins: p.coins ?? 10000 };
}

export function saveSocialProfile(patch: Partial<SocialProfile>): SocialProfile {
  const next = { ...loadSocialProfile(), ...patch };
  if (typeof window !== "undefined") {
    localStorage.setItem(SOCIAL_KEY, JSON.stringify(next));
    // Also keep legacy strafe.settings name synced so game records match
    try {
      const sRaw = localStorage.getItem("strafe.settings");
      const sObj = sRaw ? JSON.parse(sRaw) : {};
      if (patch.nickname && sObj.name !== patch.nickname) {
        sObj.name = patch.nickname;
        localStorage.setItem("strafe.settings", JSON.stringify(sObj));
        window.dispatchEvent(new Event("strafe:settings"));
      }
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(EVT));
  }
  return next;
}

export function awardCoins(amount: number) {
  const cur = loadSocialProfile();
  saveSocialProfile({
    coins: Math.max(0, (cur.coins ?? 10000) + Math.round(amount)),
  });
}

export function addPlayerExp(amount: number) {
  const cur = loadSocialProfile();
  const beforeLvl = computeLevelFromExp(cur.exp).level;
  const nextExp = cur.exp + Math.max(0, amount);
  const afterLvl = computeLevelFromExp(nextExp).level;
  const bonusTickets = Math.max(0, afterLvl - beforeLvl);
  saveSocialProfile({
    exp: nextExp,
    gachaTickets: cur.gachaTickets + bonusTickets,
  });
}

export function useSocialProfile() {
  const [profile, setProfile] = useState<SocialProfile>(DEFAULT_SOCIAL_PROFILE);
  useEffect(() => {
    const sync = () => setProfile(loadSocialProfile());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const updateProfile = useCallback((patch: Partial<SocialProfile>) => {
    saveSocialProfile(patch);
  }, []);
  return [profile, updateProfile] as const;
}

export function useClans() {
  const [clans, setClans] = useState<ClanInfo[]>(INITIAL_CLANS);
  useEffect(() => {
    const sync = () => setClans(readStorage(CLANS_KEY, INITIAL_CLANS));
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  const saveClans = useCallback((next: ClanInfo[]) => {
    localStorage.setItem(CLANS_KEY, JSON.stringify(next));
    setClans(next);
    window.dispatchEvent(new Event(EVT));
  }, []);
  return [clans, saveClans] as const;
}

export function useFeed() {
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<StoryHighlight[]>(INITIAL_STORIES);

  useEffect(() => {
    const sync = () => {
      setPosts(readStorage(POSTS_KEY, INITIAL_POSTS));
      setStories(readStorage(STORIES_KEY, INITIAL_STORIES));
    };
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);

  const addPost = useCallback((post: Omit<FeedPost, "id" | "timestamp" | "likes" | "likedByMe" | "comments">) => {
    const current = readStorage(POSTS_KEY, INITIAL_POSTS);
    const created: FeedPost = {
      ...post,
      id: `post-${Date.now()}`,
      timestamp: "Just now",
      likes: 1,
      likedByMe: true,
      comments: [],
    };
    const next = [created, ...current];
    localStorage.setItem(POSTS_KEY, JSON.stringify(next));
    setPosts(next);
    window.dispatchEvent(new Event(EVT));
  }, []);

  const toggleLike = useCallback((postId: string) => {
    const current = readStorage(POSTS_KEY, INITIAL_POSTS);
    const next = current.map((p) =>
      p.id === postId
        ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? Math.max(0, p.likes - 1) : p.likes + 1 }
        : p,
    );
    localStorage.setItem(POSTS_KEY, JSON.stringify(next));
    setPosts(next);
    window.dispatchEvent(new Event(EVT));
  }, []);

  const addComment = useCallback((postId: string, comment: Omit<FeedComment, "id" | "timestamp">) => {
    const current = readStorage(POSTS_KEY, INITIAL_POSTS);
    const next = current.map((p) =>
      p.id === postId
        ? {
            ...p,
            comments: [
              ...p.comments,
              { ...comment, id: `c-${Date.now()}`, timestamp: "Just now" },
            ],
          }
        : p,
    );
    localStorage.setItem(POSTS_KEY, JSON.stringify(next));
    setPosts(next);
    window.dispatchEvent(new Event(EVT));
  }, []);

  const addStory = useCallback((story: Omit<StoryHighlight, "id" | "timestamp">) => {
    const current = readStorage(STORIES_KEY, INITIAL_STORIES);
    const created: StoryHighlight = {
      ...story,
      id: `st-${Date.now()}`,
      timestamp: "Just now",
    };
    const next = [created, ...current];
    localStorage.setItem(STORIES_KEY, JSON.stringify(next));
    setStories(next);
    window.dispatchEvent(new Event(EVT));
  }, []);

  return { posts, stories, addPost, toggleLike, addComment, addStory } as const;
}

export function useNotifications() {
  const [notifs, setNotifs] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  useEffect(() => {
    const sync = () => setNotifs(readStorage(NOTIFS_KEY, INITIAL_NOTIFICATIONS));
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  const markAllRead = useCallback(() => {
    const next = notifs.map((n) => ({ ...n, read: true }));
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(next));
    setNotifs(next);
    window.dispatchEvent(new Event(EVT));
  }, [notifs]);
  return { notifs, markAllRead, unreadCount: notifs.filter((n) => !n.read).length } as const;
}
