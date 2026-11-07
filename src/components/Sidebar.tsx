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
  SymbolCross,
  SymbolMenu,
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

const desktopItems: {
  to: string;
  key: string;
  icon: React.ComponentType<SymbolProps>;
  search?: Record<string, string>;
}[] = [
  { to: "/", key: "home", icon: SymbolHouse },
  { to: "/play", key: "modes", icon: SymbolGameController },
  { to: "/rank", key: "rank", icon: SymbolTrophy },
  { to: "/party", key: "party", icon: SymbolPerson2 },
  { to: "/profile", key: "feedAndClan", icon: SymbolCompass, search: { tab: "feed" } },
  { to: "/achievements", key: "achievements", icon: SymbolMedal },
  { to: "/stats", key: "stats", icon: SymbolChartBar },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const rank = loadRank();
  const lvlInfo = computeLevelFromExp(social.exp);

  useEffect(() => {
    document.documentElement.style.setProperty("--rail-w", "240px");
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
            <SymbolBell className="h-4 w-4" fill={unreadCount > 0} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#D2F801] text-[9px] font-black text-[#161616]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {desktopItems.map(({ to, key, icon: Icon, search }) => {
            const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <Link
                key={key}
                to={to}
                search={search as any}
                onClick={() => buzz(6)}
                aria-label={t(lang, key)}
                className="group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "!bg-[#D2F801] !text-[#161616] font-bold shadow-sm" }}
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
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolPerson fill className="h-4 w-4 text-[#D2F801]" /> {t(lang, "profile")}
                  </Link>
                  <Link
                    to="/stats"
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolChartBar fill className="h-4 w-4 text-[#D2F801]" /> {t(lang, "stats")}
                  </Link>
                  <Link
                    to="/profile"
                    search={{ tab: "clan" } as any}
                    onClick={() => {
                      buzz(6);
                      setUserPopoverOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-muted"
                  >
                    <SymbolShield fill className="h-4 w-4 text-[#D2F801]" /> {t(lang, "clan")}
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
                    <SymbolBag fill className="h-4 w-4 text-[#D2F801]" /> Shop
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

      {/* Mobile Top-Left Hamburger Menu Button (Rendered on all mobile screens) */}
      <button
        type="button"
        onClick={() => {
          buzz(6);
          setMobileOpen(true);
        }}
        aria-label="Open navigation menu"
        className="glass-plate fixed left-3 top-3 z-50 grid h-10 w-10 place-items-center rounded-xl text-foreground shadow-md transition-all active:scale-90 hover:bg-muted md:hidden"
      >
        <SymbolMenu className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#D2F801] text-[8px] font-black text-[#161616]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Slide-over Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => {
              buzz(6);
              setMobileOpen(false);
            }}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <aside
            className="glass-plate fixed inset-y-0 left-0 z-10 flex w-72 max-w-[85vw] flex-col border-y-0 border-l-0 p-4 shadow-2xl pop-in"
            style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
          >
            {/* Header: Brand + Close */}
            <div className="flex h-11 items-center justify-between border-b border-border pb-3">
              <Link
                to="/"
                onClick={() => {
                  buzz(6);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2.5 font-display text-xl"
                aria-label="STRAFE"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#D2F801] text-sm font-black text-[#161616]">
                  S
                </span>
                <span className="tracking-tight">STRAFE</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  buzz(6);
                  setMobileOpen(false);
                }}
                aria-label="Close navigation menu"
                className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground transition-all active:scale-90 hover:bg-muted/80 hover:text-foreground"
              >
                <SymbolCross className="h-4 w-4" />
              </button>
            </div>

            {/* User Profile Mini Banner */}
            <div className="border-b border-border py-3">
              <Link
                to="/profile"
                search={{ tab: "overview" } as any}
                onClick={() => {
                  buzz(6);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-xl p-1 transition-colors hover:bg-muted"
              >
                <AvatarFrame
                  src={social.avatarUrl}
                  name={social.nickname}
                  rp={rank.rp}
                  championPosition={rank.championPosition}
                  size={40}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <ClanTagPill tag={social.clanTag} color={social.clanTagColor} />
                    <span className="truncate text-xs font-bold">{social.nickname}</span>
                    <VerifiedBadge type={social.verifiedBadge} size={13} />
                  </div>
                  <p className="readout text-[11px] text-[#D2F801]">
                    Lv.{lvlInfo.level} · {rank.rp.toLocaleString()} RP
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-3">
              {desktopItems.map(({ to, key, icon: Icon, search }) => {
                const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                return (
                  <Link
                    key={key}
                    to={to}
                    search={search as any}
                    onClick={() => {
                      buzz(6);
                      setMobileOpen(false);
                    }}
                    aria-label={t(lang, key)}
                    className="group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
                    activeOptions={{ exact: to === "/" }}
                    activeProps={{ className: "!bg-[#D2F801] !text-[#161616] font-bold shadow-sm" }}
                  >
                    <Icon
                      fill={active}
                      className="h-5 w-5 shrink-0 transition-transform duration-200 group-active:scale-90"
                    />
                    <span className="truncate">{t(lang, key)}</span>
                  </Link>
                );
              })}

              <Link
                to="/profile"
                search={{ tab: "clan" } as any}
                onClick={() => {
                  buzz(6);
                  setMobileOpen(false);
                }}
                className="group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
              >
                <SymbolShield fill className="h-5 w-5 shrink-0 text-[#D2F801] transition-transform duration-200 group-active:scale-90" />
                <span className="truncate">{t(lang, "clan")}</span>
              </Link>

              <Link
                to="/profile"
                search={{ tab: "shop" } as any}
                onClick={() => {
                  buzz(6);
                  setMobileOpen(false);
                }}
                className="group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
              >
                <SymbolBag fill className="h-5 w-5 shrink-0 text-[#D2F801] transition-transform duration-200 group-active:scale-90" />
                <span className="truncate">Shop</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => {
                  buzz(6);
                  setMobileOpen(false);
                }}
                aria-label={t(lang, "settings")}
                className="group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
                activeOptions={{ exact: true }}
                activeProps={{ className: "!bg-[#D2F801] !text-[#161616] font-bold shadow-sm" }}
              >
                <SymbolGearshape
                  fill={location.pathname === "/settings"}
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-active:scale-90"
                />
                <span className="truncate">{t(lang, "settings")}</span>
              </Link>
            </nav>

            {/* Drawer Bottom Actions: Notifications & Logout */}
            <div className="border-t border-border pt-3 space-y-1">
              <button
                type="button"
                onClick={() => {
                  buzz(6);
                  setMobileOpen(false);
                  setNotifOpen(true);
                }}
                className="flex h-10 w-full items-center justify-between rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <SymbolBell className="h-4 w-4" fill={unreadCount > 0} />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#D2F801] px-1 text-[9px] font-black text-[#161616]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  buzz(8);
                  setMobileOpen(false);
                  supabase.auth.signOut();
                }}
                className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.98]"
              >
                <SymbolLogOut className="h-4 w-4" />
                <span>{t(lang, "signOut")}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Mobile Top-Right Bar: Render ONLY on Home page ("/") */}
      {isHome && (
        <div className="fixed right-3 top-3 z-50 flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => {
              buzz(6);
              setNotifOpen((v) => !v);
              setUserPopoverOpen(false);
            }}
            aria-label="Notifications"
            className="glass-plate relative grid h-10 w-10 place-items-center rounded-full text-foreground shadow-md transition-all active:scale-90"
          >
            <SymbolBell className="h-4 w-4" fill={unreadCount > 0} />
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
    </>
  );
}
