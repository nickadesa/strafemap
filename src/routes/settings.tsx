import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";
import { GLASS_PRESETS, useAppearance, useMapStyle, useTheme, type MapStyle } from "@/lib/theme";
import { LANGS, t, type Lang } from "@/lib/i18n";
import { TILES } from "@/components/GameMap";
import { Flag } from "@/components/Flag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { REACTION_SETS, REACTION_SET_IDS, type ReactionSet } from "@/lib/reactions";
import { ChevronDown, User, X } from "lucide-react";

const tile = (u: string) =>
  u.replace("{z}", "2").replace("{y}", "1").replace("{x}", "2").replace("{s}", "a").replace("{r}", "");

const RICH_EMOJI_POOL = [
  "🔥", "🎯", "🤯", "👏", "💀", "🚀", "💯", "⚡", "🏆", "🌍", "🗺️", "📍", "🧭", "😂", "😭", "🤝", "👑", "💎",
  "😎", "🤩", "🥳", "😜", "🥶", "🤖", "🤡", "👽", "👾", "👀", "✨", "🎉", "🥇", "💣", "❤️", "💚", "🧠", "👋",
  "🙌", "💪", "🫡", "🙏", "🍕", "🍔", "☕", "🍺", "🏔️", "🏝️", "✈️", "🚗", "⛵", "🏎️", "⚽", "🏀", "🎮", "🎲",
  "🧩", "🦄", "🦁", "🐧", "🐱", "🐶", "👍", "👎", "✌️", "🤞", "🤟", "🤘", "🤙", "👌", "🤌", "🤏", "👈", "👉"
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
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-border p-0.5 transition-colors ${
        checked ? "bg-[#D2F801]" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full transition-transform ${
          checked ? "translate-x-5 bg-[#161616]" : "translate-x-0 bg-foreground"
        }`}
      />
    </button>
  );
}

function SettingsPage() {
  const [s, update] = useSettings();
  const [theme, setTheme] = useTheme();
  const [mapStyle, setMapStyle] = useMapStyle();
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
      <main className="rail-offset px-4 pb-12 pt-8 md:px-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-4xl md:text-5xl">{t(lang, "settings")}</h1>
          </div>

          {/* 1. General Category */}
          <section className="plate space-y-5 p-6">
            <h2 className="text-xs font-semibold text-[#D2F801]">
              {t(lang, "general")}
            </h2>

            {/* Language Selector with rectangular country flag */}
            <div className="flex items-center justify-between gap-4 min-h-10">
              <p className="text-sm font-semibold">{t(lang, "language")}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-44 justify-between rounded-full px-3.5">
                    <span className="flex items-center gap-2">
                      <Flag country={currentLang.country} size={22} rectangular />
                      <span>{currentLang.label}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {LANGS.map((l) => (
                    <DropdownMenuItem
                      key={l.id}
                      onSelect={() => update({ language: l.id })}
                      className="flex cursor-pointer items-center gap-2.5 py-2"
                    >
                      <Flag country={l.country} size={22} rectangular />
                      <span className="font-medium">{l.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Distance Units */}
            <div className="flex items-center justify-between gap-4 min-h-10">
              <p className="text-sm font-semibold">{t(lang, "units")}</p>
              <div className="seg">
                {(["km", "mi"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => update({ unit: u })}
                    data-on={s.unit === u}
                    className="seg-item !px-4 !py-1.5 text-xs uppercase"
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between gap-4 min-h-10">
              <p className="text-sm font-semibold">{t(lang, "sound")}</p>
              <ToggleSwitch
                label={t(lang, "sound")}
                checked={s.sound}
                onChange={(next) => {
                  update({ sound: next });
                  blip(next);
                }}
              />
            </div>
          </section>

          {/* 2. Gameplay & HUD Category */}
          <section className="plate space-y-5 p-6">
            <h2 className="text-xs font-semibold text-[#D2F801]">
              {t(lang, "gameplay")}
            </h2>

            {/* Hide Map Zoom Buttons */}
            <div className="flex items-center justify-between gap-4 min-h-10">
              <p className="text-sm font-semibold">{t(lang, "hideZoomButtons")}</p>
              <ToggleSwitch
                label={t(lang, "hideZoomButtons")}
                checked={Boolean(s.hideZoomButtons)}
                onChange={(next) => update({ hideZoomButtons: next })}
              />
            </div>

            {/* SmartClue Auto-collapse */}
            <div className="flex items-center justify-between gap-4 min-h-10">
              <p className="text-sm font-semibold">{t(lang, "promptAutoCollapse")}</p>
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
                    className="seg-item !px-3.5 !py-1.5 text-xs"
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Reactions Toggle */}
            <div className="flex items-center justify-between gap-4 min-h-10">
              <p className="text-sm font-semibold">{t(lang, "emojiReactions")}</p>
              <ToggleSwitch
                label={t(lang, "emojiReactions")}
                checked={s.reactions !== false}
                onChange={(next) => update({ reactions: next })}
              />
            </div>

            {/* Quick Emoji Presets Customization */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-semibold">{t(lang, "quickEmojiPresets")}</span>
                  <p className="text-xs text-muted-foreground">Select up to 5 emojis for match reactions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmojiDrawerOpen(true)}
                  className="btn btn-primary !px-4 !py-2 text-xs font-semibold"
                >
                  Choose Emojis ({quickEmojis.length}/5)
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {quickEmojis.map((emo) => (
                  <span
                    key={emo}
                    className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-[#D2F801]/10 text-lg"
                  >
                    {emo}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Emoji Selector Drawer */}
          {emojiDrawerOpen && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setEmojiDrawerOpen(false)}
              />
              <div className="glass-plate pop-in relative z-10 max-h-[85vh] w-full max-w-lg rounded-t-3xl border-t border-border p-5 shadow-2xl flex flex-col">
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center justify-between pb-3 border-b border-border">
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

                <div className="my-3 flex items-center justify-center gap-2 rounded-2xl bg-muted/40 p-2">
                  <span className="text-xs font-semibold text-muted-foreground">Active ({quickEmojis.length}/5):</span>
                  {quickEmojis.map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => toggleQuickEmoji(emo)}
                      title="Tap to remove"
                      className="grid h-9 w-9 place-items-center rounded-xl bg-[#D2F801] text-base text-[#161616] font-semibold shadow-sm"
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
                          className={`grid h-11 w-11 place-items-center rounded-2xl border text-xl transition-colors ${
                            active
                              ? "border-foreground/60 bg-[#D2F801]/15"
                              : "border-border bg-card/70 hover:bg-muted"
                          }`}
                        >
                          {emo}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => setEmojiDrawerOpen(false)}
                    className="btn btn-primary w-full !py-3 text-sm font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Appearance & Map Style Category */}
          <section className="plate space-y-5 p-6">
            <h2 className="text-xs font-semibold text-muted-foreground">
              {t(lang, "appearance")}
            </h2>

            {/* Theme */}
            <div className="flex items-center justify-between gap-4 min-h-10">
              <p className="text-sm font-semibold">{t(lang, "theme")}</p>
              <div className="seg">
                {(["dark", "light"] as const).map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => setTheme(th)}
                    data-on={theme === th}
                    className="seg-item !px-4 !py-1.5 text-xs"
                  >
                    {t(lang, th)}
                  </button>
                ))}
              </div>
            </div>

            {/* Liquid Glass Preset */}
            <div>
              <span className="mb-2 block text-sm font-semibold">{t(lang, "liquidGlass")}</span>
              <div className="seg">
                {GLASS_PRESETS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGlass(g)}
                    className="seg-item !px-3.5 !py-1.5 text-xs"
                    data-on={glass === g}
                  >
                    {t(lang, g === "off" ? "glassOff" : g)}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Style Grid */}
            <div>
              <span className="mb-3 block text-sm font-semibold">{t(lang, "mapStyle")}</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(
                  [
                    ["auto", "Auto"],
                    ["light", "Light"],
                    ["dark", "Dark"],
                    ["voyager", "Voyager"],
                    ["positron", "Positron"],
                    ["darkmatter", "Dark Matter"],
                    ["satellite", "Satellite"],
                  ] as [MapStyle, string][]
                ).map(([v, l]) => {
                  const k = v === "auto" ? (theme === "dark" ? "darkmatter" : "voyager") : v;
                  const on = mapStyle === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMapStyle(v)}
                      className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
                        on ? "border-foreground/60 ring-2 ring-foreground/40" : "border-border/50 hover:border-muted"
                      }`}
                    >
                      <div className="relative aspect-square bg-muted">
                        <img
                          src={tile(TILES[k].base)}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                        <img
                          src={tile(TILES[k].labels)}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div
                        className={`px-2.5 py-1.5 text-xs font-semibold ${
                          on ? "bg-[#D2F801] text-[#161616]" : "bg-card"
                        }`}
                      >
                        {["auto", "light", "dark", "satellite"].includes(v) ? t(lang, v) : l}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
