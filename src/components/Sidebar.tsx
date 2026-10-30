import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";
import { Logo } from "./SiteHeader";

const items = [
  { to: "/", key: "daily", icon: "📅" },
  { to: "/leaderboard", key: "rank", icon: "🏆" },
  { to: "/party", key: "party", icon: "👥" },
  { to: "/play", key: "modes", icon: "🎯" },
  { to: "/stats", key: "stats", icon: "📊" },
  { to: "/settings", key: "settings", icon: "⚙️" },
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
            key={it.to}
            to={it.to}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "!bg-primary/10 !text-primary font-semibold" }}
          >
            <span className="text-base">{it.icon}</span>
            {t(lang, it.key)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
