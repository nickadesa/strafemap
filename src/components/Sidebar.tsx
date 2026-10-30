import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";
import { Logo } from "./SiteHeader";

const items = [
  { to: "/", key: "home" },
  { to: "/play", key: "rank" },
  { to: "/leaderboard", key: "leaderboard" },
  { to: "/party", key: "party" },
  { to: "/play", key: "modes" },
  { to: "/stats", key: "stats" },
  { to: "/settings", key: "settings" },
] as const;

export function Sidebar() {
  const [s] = useSettings();
  const lang = (s.language ?? "en") as Lang;

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r border-border/40 bg-card/80 p-4 backdrop-blur md:flex">
      <Logo className="mb-8" />
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((it) => (
          <Link
            key={it.key}
            to={it.to}
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "!bg-primary !text-primary-foreground font-semibold" }}
          >
            {t(lang, it.key)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
