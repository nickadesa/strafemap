import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/auth";

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
  { to: "/duel", label: "Duel" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/stats", label: "Stats" },
  { to: "/settings", label: "Settings" },
] as const;

export function SiteHeader() {
  const user = useUser();
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <Logo />
      <nav className="flex gap-1 text-sm font-semibold">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="rounded-full px-3 py-2 hover:bg-card" activeProps={{ className: "bg-card" }}>
            {l.label}
          </Link>
        ))}
        {user === null && <Link to="/auth" className="rounded-full bg-foreground px-4 py-2 text-primary">Sign in</Link>}
        {user && <button onClick={() => supabase.auth.signOut()} className="rounded-full px-3 py-2 hover:bg-card" title={user.email ?? ""}>Sign out</button>}
      </nav>
    </header>
  );
}
