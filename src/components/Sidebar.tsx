import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  SymbolHouse,
  SymbolGameController,
  SymbolTrophy,
  SymbolPerson2,
  SymbolCompass,
  SymbolMedal,
  SymbolChartBar,
  SymbolGearshape,
  SymbolBell,
  SymbolBag,
  SymbolShield,
  SymbolPerson,
  SymbolLogOut,
  type SymbolProps,
} from "@/components/SFSymbols";
import { useSettings } from "@/lib/game/storage";
import { loadRank } from "@/lib/rank";
import { AvatarFrame, ClanTagPill, VerifiedBadge } from "@/components/RankVisuals";
import { computeLevelFromExp, useNotifications, useSocialProfile } from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { buzz } from "@/lib/game/sound";

const navItems: {
  to: string;
  key: string;
  icon: React.ComponentType<SymbolProps>;
}[] = [
  { to: "/", key: "home", icon: SymbolHouse },
  { to: "/play", key: "play", icon: SymbolGameController },
  { to: "/rank", key: "ranked", icon: SymbolTrophy },
  { to: "/settings", key: "settings", icon: SymbolGearshape },
];

export function Sidebar() {
  const [s] = useSettings();
  const [social] = useSocialProfile();
  const { notifs, markAllRead, unreadCount } = useNotifications();
  const lang = (s.language ?? "en") as Lang;
  const location = useLocation();
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const rank = loadRank();
  const lvlInfo = computeLevelFromExp(social.exp);

  useEffect(() => {
    document.documentElement.style.setProperty("--rail-w", "240px");
    return () => {
      document.documentElement.style.setProperty("--rail-w", "0px");
    };
  }, []);

  // Close popovers on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserPopoverOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close popovers on route change
  useEffect(() => {
    setUserPopoverOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop: Fixed 240px macOS glass sidebar */}
      <aside
        className="glass-plate fixed left-0 top-0 z-50 hidden h-screen w-60 flex-col gap-1 border-y-0 border-l-0 p-3 md:flex"
      >
        <div className="mb-3 flex h-11 items-center justify-between px-1.5">
          <Link
            to="/"
            onClick={() => buzz(6)}
            className="flex items-center gap-3 font-display text-xl tracking-tight"
            aria-label="STRAFE"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent-fill text-sm font-semibold text-[#03121C]">
              S
            </span>
            <span className="tracking-tight text-foreground">STRAFE</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              buzz(6);
              setNotifOpen((v) => !v);
              setUserPopoverOpen(false);
            }}
            className="relative grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground hover:bg-muted/70 transition-colors"
            title="Notifications"
          >
            <SymbolBell className="h-4 w-4" fill={unreadCount > 0} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent-fill text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Desktop navigation">
          {navItems.map(({ to, key, icon: Icon }) => {
            const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <Link
                key={key}
                to={to}
                onClick={() => buzz(6)}
                aria-label={t(lang, key)}
                className="group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.98]"
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "!bg-muted !text-foreground font-semibold" }}
              >
                <Icon
                  fill={active}
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-active:scale-90"
                />
                <span className="truncate">{t(lang, key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile Bar + Popover */}
        <div className="relative mt-1 border-t border-border pt-2">
          <button
            type="button"
            onClick={() => {
              buzz(6);
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
                <span className="truncate text-xs font-semibold">{social.nickname}</span>
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
                    <span className="truncate text-sm font-semibold">{social.nickname}</span>
                    <VerifiedBadge type={social.verifiedBadge} size={14} />
                  </div>
                  <p className="readout text-xs text-accent-text">
                    Level {lvlInfo.level} · {social.coins.toLocaleString()} Coins
                  </p>
                </div>
                <div className="mt-1 flex flex-col gap-0.5 text-sm">
                  <Link
                    to="/profile"
                    search={{ tab: "overview" } as any}
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolPerson fill className="h-4 w-4 text-muted-foreground" /> {t(lang, "profile")}
                  </Link>
                  <Link
                    to="/achievements"
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolMedal fill className="h-4 w-4 text-muted-foreground" /> {t(lang, "achievements")}
                  </Link>
                  <Link
                    to="/stats"
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolChartBar fill className="h-4 w-4 text-muted-foreground" /> {t(lang, "stats")}
                  </Link>
                  <Link
                    to="/profile"
                    search={{ tab: "shop" } as any}
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolBag fill className="h-4 w-4 text-muted-foreground" /> Shop
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolGearshape className="h-4 w-4 text-muted-foreground" /> {t(lang, "settings")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      buzz(8);
                      setUserPopoverOpen(false);
                      supabase.auth.signOut();
                    }}
                    className="mt-1 flex items-center gap-2.5 rounded-xl border-t border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <SymbolLogOut className="h-4 w-4" /> {t(lang, "signOut")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Mobile: Apple HIG Top Navigation Bar */}
      <header className="glass-plate fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-x-0 border-t-0 px-4 md:hidden">
        <Link
          to="/"
          onClick={() => buzz(6)}
          className="flex items-center gap-2.5 font-display text-lg tracking-tight"
          aria-label="STRAFE"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-accent-fill text-xs font-bold text-[#03121C]">
            S
          </span>
          <span className="tracking-tight text-foreground font-semibold">STRAFE</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              buzz(6);
              setNotifOpen((v) => !v);
              setUserPopoverOpen(false);
            }}
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground transition-colors active:scale-95"
          >
            <SymbolBell className="h-4 w-4" fill={unreadCount > 0} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent-fill text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            )}
          </button>

          <Link
            to="/profile"
            onClick={() => buzz(6)}
            aria-label={t(lang, "profile")}
            className="flex items-center gap-1.5 rounded-full bg-muted py-0.5 pl-0.5 pr-2.5 transition-colors active:scale-95"
          >
            <AvatarFrame
              src={social.avatarUrl}
              name={social.nickname}
              rp={rank.rp}
              championPosition={rank.championPosition}
              size={30}
            />
            <span className="readout text-[11px] font-semibold text-accent-text">
              Lv.{lvlInfo.level}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile: Apple HIG 5-Tab Bar (Floating pill at bottom) */}
      <nav
        className="apple-tab-bar md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navItems.map(({ to, key, icon: Icon }) => {
          const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <Link
              key={key}
              to={to}
              onClick={() => buzz(6)}
              aria-label={t(lang, key)}
              className={`flex min-h-[46px] min-w-[62px] flex-col items-center justify-center rounded-2xl px-3 py-1 transition-transform active:scale-90 ${
                active
                  ? "text-accent-text font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              activeOptions={{ exact: to === "/" }}
            >
              <Icon
                fill={active}
                className={`h-5 w-5 transition-transform duration-200 ${active ? "scale-105" : ""}`}
              />
              <span className="mt-0.5 text-[10px] tracking-tight">{t(lang, key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Notification Popover (Desktop & Mobile) */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className="plate pop-in fixed right-3 top-16 z-50 w-80 p-4 shadow-2xl md:left-64 md:right-auto md:top-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-display text-lg">Notifications</span>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-semibold text-accent-text hover:underline"
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
                    n.read ? "border-border bg-background/40" : "border-border bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
