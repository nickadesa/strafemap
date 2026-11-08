import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";
import { GLASS_PRESETS, useAppearance, useMapStyle, useTheme, type MapStyle } from "@/lib/theme";
import { LANGS, t, type Lang } from "@/lib/i18n";
import { OPENFREEMAP_STYLES, STYLE_ORDER } from "@/lib/map/styles";
import { Flag } from "@/components/Flag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFrame, ClanTagPill, VerifiedBadge } from "@/components/RankVisuals";
import { useSocialProfile } from "@/lib/social";
import { getRank, loadRank } from "@/lib/rank";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Volume2,
  Gauge,
  Smile,
  Palette,
  Sparkles,
  Maximize2,
  Clock,
  X,
} from "lucide-react";

const RICH_EMOJI_POOL = [
  "🔥", "🎯", "🤯", "👏", "💀", "🚀", "💯", "⚡", "🏆", "🌍", "🗺️", "📍", "🧭", "😂", "😭", "🤝", "👑", "💎",
  "😎", "🤩", "🥳", "😜", "🥶", "🤖", "🤡", "👽", "👾", "👀", "✨", "🎉", "🥇", "💣", "❤️", "💚", "🧠", "👋",
  "🙌", "💪", "🫡", "🙏", "🍕", "🍔", "☕", "🍺", "🏔️", "🏝️", "✈️", "🚗", "⛵", "🏎️", "⚽", "🏀", "🎮", "🎲",
  "🧩", "🦄", "🦁", "🐧", "🐱", "🐶", "👍", "👎", "✌️", "🤞", "🤟", "🤘", "🤙", "👌", "🤌", "🤏", "👈", "👉",
];

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — STRAFE" },
      { name: "description", content: "Set your STRAFE language, sound, distance units, quick emojis and map style." },
      { property: "og:title", content: "Settings — STRAFE" },
      { property: "og:description", content: "Set your STRAFE language, sound, distance units, quick emojis and map style." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#34C759] dark:bg-[#32D74B]" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SettingsPage() {
  const [s, update] = useSettings();
  const [theme, setTheme] = useTheme();
  const [mapStyle, setMapStyle] = useMapStyle();
  const [social] = useSocialProfile();
  const rank = loadRank();
  const curRank = getRank(rank.rp, rank.championPosition);
  const lang = (s.language ?? "en") as Lang;
  const { glass, setGlass } = useAppearance();
  const currentLang = LANGS.find((l) => l.id === lang) ?? LANGS[0]!;
  const quickEmojis = s.quickEmojis ?? ["🔥", "🎯", "🤯", "👏", "💀"];
  const [emojiDrawerOpen, setEmojiDrawerOpen] = useState(false);

  const toggleQuickEmoji = (emoji: string) => {
    if (quickEmojis.includes(emoji)) {
      if (quickEmojis.length <= 1) return;
      update({ quickEmojis: quickEmojis.filter((e) => e !== emoji) });
    } else {
      const next = [...quickEmojis.slice(-4), emoji];
      update({ quickEmojis: next });
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-12 pt-8 md:px-8">
        <div className="mx-auto max-w-2xl space-y-7">
          {/* Page Title */}
          <div>
            <h1 className="font-display text-3xl tracking-tight md:text-4xl">{t(lang, "settings")}</h1>
          </div>

          {/* Apple ID Style Profile Row */}
          <Link
            to="/profile"
            className="apple-group block transition-transform active:scale-[0.99]"
          >
            <div className="apple-row hover:bg-muted/40 cursor-pointer py-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <AvatarFrame
                  name={social.nickname}
                  rp={rank.rp}
                  championPosition={rank.championPosition}
                  size={52}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-semibold text-base">{social.nickname}</p>
                    <VerifiedBadge type={social.verifiedBadge} size={14} />
                    <ClanTagPill tag={social.clanTag} />
                  </div>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">
                    @{social.username} · {curRank.name} ({rank.rp.toLocaleString()} RP)
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/60 shrink-0" />
            </div>
          </Link>

          {/* 1. General Section */}
          <section className="space-y-2">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(lang, "general")}
            </h2>
            <div className="apple-group">
              {/* Language Selector */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/15 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "language")}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 gap-2 rounded-full px-3 text-xs font-medium">
                      <Flag country={currentLang.country} size={18} rectangular />
                      <span>{currentLang.label}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-xl backdrop-blur-2xl">
                    {LANGS.map((l) => (
                      <DropdownMenuItem
                        key={l.id}
                        onSelect={() => update({ language: l.id })}
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl py-2 px-3 text-xs font-medium"
                      >
                        <Flag country={l.country} size={18} rectangular />
                        <span>{l.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Distance Units */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-orange-500/15 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400">
                    <Gauge className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "units")}</span>
                </div>
                <div className="seg">
                  {(["km", "mi"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => update({ unit: u })}
                      data-on={s.unit === u}
                      className="seg-item !px-3.5 !py-1 text-xs uppercase font-medium"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Effects */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-pink-500/15 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400">
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "sound")}</span>
                </div>
                <ToggleSwitch
                  label={t(lang, "sound")}
                  checked={s.sound}
                  onChange={(next) => {
                    update({ sound: next });
                    blip(next);
                  }}
                />
              </div>
            </div>
          </section>

          {/* 2. Gameplay & HUD Section */}
          <section className="space-y-2">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(lang, "gameplay")}
            </h2>
            <div className="apple-group">
              {/* Hide Map Zoom Buttons */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-500/15 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "hideZoomButtons")}</span>
                </div>
                <ToggleSwitch
                  label={t(lang, "hideZoomButtons")}
                  checked={Boolean(s.hideZoomButtons)}
                  onChange={(next) => update({ hideZoomButtons: next })}
                />
              </div>

              {/* SmartClue Auto-collapse */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "promptAutoCollapse")}</span>
                </div>
                <div className="seg">
                  {([
                    [0, t(lang, "off")],
                    [3, "3s"],
                    [5, "5s"],
                  ] as const).map(([sec, lbl]) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => update({ promptCollapseSeconds: sec })}
                      data-on={s.promptCollapseSeconds === sec}
                      className="seg-item !px-3 !py-1 text-xs font-medium"
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji Reactions Toggle */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Smile className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "emojiReactions")}</span>
                </div>
                <ToggleSwitch
                  label={t(lang, "emojiReactions")}
                  checked={s.reactions !== false}
                  onChange={(next) => update({ reactions: next })}
                />
              </div>

              {/* Quick Emoji Presets Customization */}
              <div className="apple-row flex-col items-stretch gap-3 py-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t(lang, "quickEmojiPresets")}</span>
                  <button
                    type="button"
                    onClick={() => setEmojiDrawerOpen(true)}
                    className="apple-pill bg-muted/80 text-foreground text-xs font-semibold px-3 py-1 hover:bg-muted"
                  >
                    Customize ({quickEmojis.length}/5)
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {quickEmojis.map((emo) => (
                    <span
                      key={emo}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-background/80 text-base shadow-sm"
                    >
                      {emo}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Appearance Section */}
          <section className="space-y-2">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(lang, "appearance")}
            </h2>
            <div className="apple-group">
              {/* Theme */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-purple-500/15 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">
                    <Palette className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "theme")}</span>
                </div>
                <div className="seg">
                  {(["dark", "light"] as const).map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setTheme(th)}
                      data-on={theme === th}
                      className="seg-item !px-3.5 !py-1 text-xs capitalize font-medium"
                    >
                      {t(lang, th)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liquid Glass Preset */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-500/15 text-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "liquidGlass")}</span>
                </div>
                <div className="seg">
                  {GLASS_PRESETS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGlass(g)}
                      className="seg-item !px-2.5 !py-1 text-xs capitalize font-medium"
                      data-on={glass === g}
                    >
                      {t(lang, g === "off" ? "glassOff" : g)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. Map Style Section */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t(lang, "mapStyle")}
              </h2>
              <span className="text-[11px] text-muted-foreground">
                Powered by OpenFreeMap & OSM
              </span>
            </div>
            <div className="apple-group p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {/* Auto Mode Option */}
                <button
                  type="button"
                  onClick={() => setMapStyle("auto")}
                  className={`overflow-hidden rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    mapStyle === "auto"
                      ? "border-[#D2F801] ring-2 ring-[#D2F801]/30 shadow-md scale-[1.02]"
                      : "border-border/60 hover:border-border opacity-85 hover:opacity-100 bg-card"
                  }`}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 overflow-hidden flex items-center justify-center p-3">
                    <span className="rounded-full bg-card/80 px-2.5 py-1 text-xs font-semibold shadow-xs">
                      {theme === "dark" ? "Auto (Dark)" : "Auto (Liberty)"}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-2 text-xs font-semibold ${
                      mapStyle === "auto" ? "bg-[#D2F801] text-[#161616]" : "bg-card/90"
                    }`}
                  >
                    <span>Auto ({t(lang, "theme")})</span>
                  </div>
                </button>

                {/* 6 Official OpenFreeMap Styles */}
                {STYLE_ORDER.map((id) => {
                  const opt = OPENFREEMAP_STYLES[id];
                  const on = mapStyle === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMapStyle(id)}
                      className={`overflow-hidden rounded-2xl border transition-all text-left flex flex-col justify-between ${
                        on
                          ? "border-[#D2F801] ring-2 ring-[#D2F801]/30 shadow-md scale-[1.02]"
                          : "border-border/60 hover:border-border opacity-85 hover:opacity-100 bg-card"
                      }`}
                    >
                      <div
                        className="relative aspect-video overflow-hidden flex items-center justify-center p-2"
                        style={{ background: opt.gradient }}
                      >
                        {opt.is3D && (
                          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                            3D
                          </span>
                        )}
                      </div>
                      <div
                        className={`px-3 py-2 text-xs font-semibold flex items-center justify-between ${
                          on ? "bg-[#D2F801] text-[#161616]" : "bg-card/90"
                        }`}
                      >
                        <span>{lang === "th" ? opt.nameTh : opt.name}</span>
                        {opt.is3D && <span className="text-[10px] opacity-75">3D</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Emoji Selector Apple Bottom Sheet Drawer */}
          {emojiDrawerOpen && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setEmojiDrawerOpen(false)}
              />
              <div className="glass-plate pop-in relative z-10 max-h-[85vh] w-full max-w-lg rounded-t-[32px] border-t border-border/80 p-5 shadow-2xl flex flex-col">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <div>
                    <h3 className="font-display text-lg">Customize Quick Emojis</h3>
                    <p className="text-xs text-muted-foreground">Tap an emoji to toggle (Max 5)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmojiDrawerOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground hover:bg-muted/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="my-3 flex items-center justify-center gap-2 rounded-2xl bg-muted/40 p-2.5">
                  <span className="text-xs font-medium text-muted-foreground">Active ({quickEmojis.length}/5):</span>
                  {quickEmojis.map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => toggleQuickEmoji(emo)}
                      title="Tap to remove"
                      className="grid h-9 w-9 place-items-center rounded-xl bg-[#D2F801] text-base text-[#161616] font-semibold shadow-sm transition-transform active:scale-90"
                    >
                      {emo}
                    </button>
                  ))}
                </div>

                <div className="no-scrollbar flex-1 overflow-y-auto p-1">
                  <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                    {RICH_EMOJI_POOL.map((emo) => {
                      const active = quickEmojis.includes(emo);
                      return (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => toggleQuickEmoji(emo)}
                          className={`grid h-11 w-11 place-items-center rounded-xl border text-xl transition-all ${
                            active
                              ? "border-[#D2F801] bg-[#D2F801]/15 scale-105"
                              : "border-border/60 bg-card/60 hover:bg-muted/60"
                          }`}
                        >
                          {emo}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 border-t border-border/40 pt-3">
                  <button
                    type="button"
                    onClick={() => setEmojiDrawerOpen(false)}
                    className="btn btn-primary w-full !py-3 text-sm font-semibold rounded-full"
                  >
                    Done
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
