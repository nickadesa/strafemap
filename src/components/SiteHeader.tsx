import { useTheme } from "@/lib/theme";
import { useState } from "react";
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
  { to: "/party", label: "Party" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/stats", label: "Stats" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
] as const;

export function SiteHeader() {
  const user = useUser();
  const [theme, setTheme] = useTheme();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="glass sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
      <Logo />

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="btn btn-outline !px-4 !py-2"
        >
          <span className="flex flex-col items-end gap-1" aria-hidden="true">
            <span className="block h-[2px] w-4 bg-foreground" />
            <span className="block h-[2px] w-4 bg-foreground" />
            <span className="block h-[2px] w-4 bg-foreground" />
          </span>
          Menu
        </button>

        {open && (
          <>
            {/* Close when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
            <div
              role="menu"
              className="plate glass-plate pop-in absolute right-0 z-50 mt-2 w-52 border border-border overflow-hidden p-2"
            >
              <nav className="flex flex-col">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={close}
                    role="menuitem"
                    className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                    activeProps={{ className: "!bg-primary !text-primary-foreground", "aria-current": "page" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <div className="mb-1 grid grid-cols-2 gap-1 rounded-full bg-muted p-1" role="group" aria-label="Theme">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      aria-pressed={theme === t}
                      className={`rounded-full py-1.5 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${theme === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}
                    >
                      {t === "light" ? "Light" : "Dark"}
                    </button>
                  ))}
                </div>
                {user === null && (
                  <Link
                    to="/auth"
                    onClick={close}
                    className="btn btn-primary mt-1 !px-4 !py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    Sign in
                  </Link>
                )}
                {user && (
                  <>
                    <div className="truncate px-4 py-1.5 text-xs font-medium text-muted-foreground">
                      {user.email}
                    </div>
                    <button
                      onClick={() => {
                        close();
                        supabase.auth.signOut();
                      }}
                      className="btn btn-outline mt-1 !px-4 !py-2.5 text-sm outline-none hover:!bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Sign out
                    </button>
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
