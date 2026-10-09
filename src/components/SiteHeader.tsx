import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="STRAFE home">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary">
        <span className="h-3 w-3 rounded-full border-[3px] border-foreground" />
      </span>
      <span className="font-display text-2xl">STRAFE</span>
    </Link>
  );
}

const links = [
  { to: "/play", label: "Play" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/stats", label: "Stats" },
  { to: "/settings", label: "Settings" },
] as const;

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <Logo />
      <nav className="flex gap-1 text-sm font-semibold">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="rounded-full px-3 py-2 hover:bg-card" activeProps={{ className: "bg-card" }}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
