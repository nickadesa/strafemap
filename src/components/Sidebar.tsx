import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bell,
  Compass,
  Gamepad2,
  Home,
  LogOut,
  Medal,
  Settings,
  Shield,
  ShoppingBag,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useSettings } from "@/lib/game/storage";
import { loadRank } from "@/lib/rank";
import { AvatarFrame, ClanTagPill, VerifiedBadge } from "@/components/RankVisuals";
import { computeLevelFromExp, useNotifications, useSocialProfile } from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const desktopItems: { to: string; key: string; icon: LucideIcon; search?: Record<string, string> }[] = [
  { to: "/", key: "home", icon: Home },
  { to: "/play", key: "modes", icon: Gamepad2 },
  { to: "/rank", key: "rank", icon: Medal },
  { to: "/party", key: "party", icon: Users },
  { to: "/profile", key: "feedAndClan", icon: Compass, search: { tab: "feed" } },
  { to: "/achievements", key: "achievements", icon: Award },
  { to: "/stats", key: "stats", icon: BarChart3 },
];

/** 5-destination Mobile Bottom Bar: Home, Modes, Rank, Feed / Clan, Settings */
const mobileItems: { to: string; key: string; icon: LucideIcon; search?: Record<string, string> }[] = [
  { to: "/", key: "home", icon: Home },
  { to: "/play", key: "modes", icon: Gamepad2 },
  { to: "/rank", key: "rank", icon: Medal },
  { to: "/profile", key: "feedAndClan", icon: Compass, search: { tab: "feed" } },
  { to: "/settings", key: "settings", icon: Settings },
];

export function Sidebar() {
  const [s] = useSettings();
  const [social] = useSocialProfile();
  const { notifs, markAllRead, unreadCount } = useNotifications();
  const lang = (s.language ?? "en") as Lang;
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const rank = loadRank();
  const lvlInfo = computeLevelFromExp(social.exp);

  useEffect(() => {
    document.documentElement.style.setProperty("--rail-w", "240px");
  }, []);

  return (
    <>
      {/* Desktop: Fixed 240px sidebar (no collapse toggle) */}
      <aside
        className="glass-plate fixed left-0 top-0 z-50 hidden h-screen w-60 flex-col gap-1 border-y-0 border-l-0 p-3 md:flex"
      >
        <div className="mb-3 flex h-11 items-center justify-between px-1.5">
          <Link to="/" className="flex items-center gap-3 font-display text-xl" aria-label="STRAFE">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#D2F801] text-sm font-black text-[#161616]">
              S
            </span>
            <span className="tracking-tight">STRAFE</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserPopoverOpen(false);
            }}
            className="relative grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground hover:bg-[#D2F801] hover:text-[#161616] transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#D2F801] text-[9px] font-black text-[#161616]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {desktopItems.map(({ to, key, icon: Icon, search }) => (
            <Link
              key={key}
              to={to}
              search={search as any}
              aria-label={t(lang, key)}
              className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "!bg-[#D2F801] !text-[#161616] font-bold" }}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.85} />
              <span className="truncate">{t(lang, key)}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom User Profile Bar + Popover */}
        <div className="relative mt-1 border-t border-border pt-2">
          <button
            type="button"
            onClick={() => {
              setUserPopoverOpen((v) => !v);
              setNotifOpen(false);
            }}
            title={`${social.nickname} (Lv.${lvlInfo.level})`}
            className="flex w-full items-center gap-2.5 rounded-xl p-1 text-left transition-colors hover:bg-muted"
          >
            <AvatarFrame
              src={social.avatarUrl}
              name={social.nickname}
              rp={rank.rp}
              championPosition={rank.championPosition}
              size={38}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <ClanTagPill tag={social.clanTag} color={social.clanTagColor} />
                <span className="truncate text-xs font-bold">{social.nickname}</span>
                <VerifiedBadge type={social.verifiedBadge} size={13} />
              </div>
              <p className="readout truncate text-[10px] text-muted-foreground">
                Lv.{lvlInfo.level} · @{social.username}
              </p>
            </div>
          </button>

          {userPopoverOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserPopoverOpen(false)} />
              <div className="plate pop-in fixed bottom-16 left-16 z-50 w-60 p-2 shadow-2xl">
                <div className="border-b border-border px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <ClanTagPill tag={social.clanTag} color={social.clanTagColor} />
                    <span className="truncate text-sm font-bold">{social.nickname}</span>
                    <VerifiedBadge type={social.verifiedBadge} size={14} />
                  </div>
                  <p className="readout text-xs text-[#D2F801]">
                    Level {lvlInfo.level} · {social.coins.toLocaleString()} Coins
                  </p>
                </div>
                <div className="mt-1 flex flex-col gap-0.5 text-sm">
                  <Link
                    to="/profile"
                    search={{ tab: "overview" } as any}
                    onClick={() => setUserPopoverOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <User className="h-4 w-4 text-[#D2F801]" /> {t(lang, "profile")}
                  </Link>
                  <Link
                    to="/stats"
                    onClick={() => setUserPopoverOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <BarChart3 className="h-4 w-4 text-[#D2F801]" /> {t(lang, "stats")}
                  </Link>
                  <Link
                    to="/profile"
                    search={{ tab: "clan" } as any}
                    onClick={() => setUserPopoverOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <Shield className="h-4 w-4 text-[#D2F801]" /> {t(lang, "clan")}
                  </Link>
                  <Link
                    to="/profile"
                    search={{ tab: "shop" } as any}
                    onClick={() => setUserPopoverOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <ShoppingBag className="h-4 w-4 text-[#D2F801]" /> Shop
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserPopoverOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" /> {t(lang, "settings")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserPopoverOpen(false);
                      supabase.auth.signOut();
                    }}
                    className="mt-1 flex items-center gap-2.5 rounded-xl border-t border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" /> {t(lang, "signOut")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Top-Right Bar: Render ONLY on Home page ("/") */}
      {isHome && (
        <div className="fixed right-3 top-3 z-50 flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserPopoverOpen(false);
            }}
            aria-label="Notifications"
            className="glass-plate relative grid h-10 w-10 place-items-center rounded-full text-foreground shadow-md"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#D2F801] text-[9px] font-black text-[#161616]">
                {unreadCount}
              </span>
            )}
          </button>

          <Link
            to="/profile"
            aria-label={t(lang, "profile")}
            className="glass-plate flex items-center gap-1.5 rounded-full py-0.5 pl-1 pr-2.5 shadow-md"
          >
            <AvatarFrame
              src={social.avatarUrl}
              name={social.nickname}
              rp={rank.rp}
              championPosition={rank.championPosition}
              size={34}
            />
            <span className="readout text-[11px] font-extrabold text-[#D2F801]">Lv.{lvlInfo.level}</span>
          </Link>
        </div>
      )}

      {/* Notification Popover (Desktop & Mobile) */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className="plate pop-in fixed right-3 top-14 z-50 w-80 p-4 shadow-2xl md:left-64 md:right-auto md:top-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-display text-lg">Notifications</span>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-bold text-[#D2F801] hover:underline"
              >
                Mark all read
              </button>
            </div>
            <div className="space-y-2">
              {notifs.map((n) => (
                <Link
                  key={n.id}
                  to={n.link as any}
                  onClick={() => {
                    markAllRead();
                    setNotifOpen(false);
                  }}
                  className={`block rounded-2xl border p-3 transition-colors ${
                    n.read ? "border-border bg-background/40" : "border-[#D2F801]/50 bg-[#D2F801]/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile: Clean 4-item Bottom Navigation Bar (Home, Modes, Rank, Feed / Clan) */}
      <nav
        className="glass-plate fixed inset-x-2 z-50 flex justify-between rounded-[22px] px-1.5 py-1.5 md:hidden"
        style={{ bottom: "calc(8px + env(safe-area-inset-bottom))" }}
      >
        {mobileItems.map(({ to, key, icon: Icon, search }) => (
          <Link
            key={key}
            to={to}
            search={search as any}
            aria-label={t(lang, key)}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-semibold text-muted-foreground"
            activeOptions={{ exact: to === "/" }}
            activeProps={{ className: "!bg-[#D2F801] !text-[#161616] font-extrabold" }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.85} />
            <span className="w-full truncate px-0.5 text-center">{t(lang, key)}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
