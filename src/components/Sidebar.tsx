import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BarChart3, Gamepad2, Home, ListOrdered, Medal, PanelLeftClose, PanelLeftOpen, Settings, Users, type LucideIcon } from "lucide-react";
import { useSettings } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";

const items: { to: string; key: string; icon: LucideIcon }[] = [
  { to: "/", key: "home", icon: Home },
  { to: "/play", key: "modes", icon: Gamepad2 },
  { to: "/rank", key: "rank", icon: Medal },
  { to: "/party", key: "party", icon: Users },
  { to: "/leaderboard", key: "leaderboard", icon: ListOrdered },
  { to: "/stats", key: "stats", icon: BarChart3 },
  { to: "/settings", key: "settings", icon: Settings },
];

const KEY = "strafe-rail-open";

export function Sidebar() {
  const [s] = useSettings();
  const lang = (s.language ?? "en") as Lang;
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(localStorage.getItem(KEY) === "1"); }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--rail-w", open ? "224px" : "64px");
  }, [open]);
  const toggle = () => setOpen((o) => { localStorage.setItem(KEY, o ? "0" : "1"); return !o; });

  return (
    <>
      {/* Desktop: collapsible icon rail */}
      <aside className="glass-plate fixed left-0 top-0 z-50 hidden h-screen flex-col gap-1 overflow-hidden border-y-0 border-l-0 p-3 transition-[width] duration-300 md:flex"
        style={{ width: open ? 224 : 64 }}>
        <Link to="/" className="mb-4 flex h-10 items-center gap-3 px-1.5 font-display text-xl" aria-label="STRAFE">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">S</span>
          {open && <span>STRAFE</span>}
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map(({ to, key, icon: Icon }) => (
            <Link key={key} to={to} title={open ? undefined : t(lang, key)} aria-label={t(lang, key)}
              className="flex h-10 items-center gap-3 rounded-xl px-[11px] text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "!bg-primary !text-primary-foreground font-semibold" }}>
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              {open && <span className="truncate">{t(lang, key)}</span>}
            </Link>
          ))}
        </nav>
        <button onClick={toggle} className="flex h-10 items-center gap-3 rounded-xl px-[11px] text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={t(lang, open ? "collapseMenu" : "expandMenu")} title={t(lang, open ? "collapseMenu" : "expandMenu")}>
          {open ? <PanelLeftClose className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} /> : <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />}
          {open && <span className="truncate">{t(lang, "collapseMenu")}</span>}
        </button>
      </aside>

      {/* Mobile: bottom navigation bar */}
      <nav className="glass-plate fixed inset-x-2 z-50 flex justify-between rounded-[22px] px-1.5 py-1.5 md:hidden"
        style={{ bottom: "calc(8px + env(safe-area-inset-bottom))" }}>
        {items.map(({ to, key, icon: Icon }) => (
          <Link key={key} to={to} aria-label={t(lang, key)}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[9px] font-medium text-muted-foreground"
            activeOptions={{ exact: to === "/" }}
            activeProps={{ className: "!bg-primary !text-primary-foreground" }}>
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            <span className="w-full truncate px-0.5 text-center">{t(lang, key)}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
