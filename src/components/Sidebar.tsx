import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useSettings } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";
import { Logo } from "./SiteHeader";

const items = [
  { to: "/", key: "home" },
  { to: "/rank", key: "rank" },
  { to: "/leaderboard", key: "leaderboard" },
  { to: "/party", key: "party" },
  { to: "/play", key: "modes" },
  { to: "/stats", key: "stats" },
  { to: "/settings", key: "settings" },
] as const;

export function Sidebar() {
  const [s] = useSettings();
  const lang = (s.language ?? "en") as Lang;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-border/40 bg-card/80 backdrop-blur md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-border/40 bg-card/95 p-4 backdrop-blur transition-transform md:translate-x-0 md:bg-card/80 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((it) => (
            <Link
              key={it.key}
              to={it.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "!bg-primary !text-primary-foreground font-semibold" }}
            >
              {t(lang, it.key)}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
