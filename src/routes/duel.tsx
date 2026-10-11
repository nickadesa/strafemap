import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/auth";
import { pickRounds, poolFor } from "@/lib/game/engine";
import { useSettings } from "@/lib/game/storage";

export const Route = createFileRoute("/duel")({
  head: () => ({
    meta: [
      { title: "Live Duels — STRAFE" },
      { name: "description", content: "Challenge a friend to a live 1v1 map duel. Share a 4-letter code and battle for health." },
      { property: "og:title", content: "Live Duels — STRAFE" },
      { property: "og:description", content: "Live 1v1 map duels with a room code. Closest pin wins the round." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DuelLobby,
});

const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const makeCode = () => Array.from({ length: 4 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join("");

function DuelLobby() {
  const user = useUser();
  const [settings] = useSettings();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!user) return;
    setBusy(true); setErr(null);
    const ids = pickRounds(poolFor("world", "medium"), 12).map((l) => l.id);
    for (let i = 0; i < 4; i++) {
      const c = makeCode();
      const { error } = await supabase.from("duels").insert({ code: c, host_id: user.id, host_name: settings.name || "Host", location_ids: ids });
      if (!error) { nav({ to: "/duel/$code", params: { code: c } }); return; }
      if (!error.message.includes("duplicate")) { setErr(error.message); break; }
    }
    setBusy(false);
  };

  const join = async () => {
    const c = code.trim().toUpperCase();
    if (c.length !== 4) { setErr("Codes are 4 letters."); return; }
    setBusy(true); setErr(null);
    const { error } = await supabase.rpc("join_duel", { _code: c, _name: settings.name || "Guest" });
    setBusy(false);
    if (error) setErr(error.message); else nav({ to: "/duel/$code", params: { code: c } });
  };

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5">
        <p className="text-sm font-semibold text-muted-foreground">Multiplayer · 1v1</p>
        <h1 className="font-display mt-2 text-[clamp(3.5rem,12vw,7rem)]">Live Duel</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">Same place, 15 seconds each round. The further pin loses health equal to the points gap. First to zero loses.</p>

        {user === null ? (
          <div className="plate mt-8 p-6">
            <p className="font-semibold">Sign in to play duels.</p>
            <Link to="/auth" className="btn btn-primary mt-4">Sign in</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="plate-ink p-6">
              <p className="font-display text-3xl">Host a room</p>
              <p className="mt-2 text-sm opacity-80">Get a code and send it to a friend.</p>
              <button onClick={create} disabled={busy || !user} className="btn btn-primary mt-6">Create room</button>
            </div>
            <div className="plate p-6">
              <p className="font-display text-3xl">Join a room</p>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))} placeholder="ABCD"
                className="mt-4 w-full rounded-full border border-input bg-background px-5 py-3 text-center font-display text-3xl tracking-[0.3em]" />
              <button onClick={join} disabled={busy || !user} className="btn btn-ink mt-4 w-full">Join</button>
            </div>
          </div>
        )}
        {err && <p className="mt-4 font-semibold text-destructive">{err}</p>}
      </main>
    </div>
  );
}
