import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/auth";
import { pickRounds, poolFor } from "@/lib/game/engine";
import { useSettings } from "@/lib/game/storage";
import { buzz, blip } from "@/lib/game/sound";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { t, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/duel/")({
  beforeLoad: () => {
    throw redirect({ to: "/play" });
  },
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
  const lang = (settings.language ?? "en") as Lang;
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
      <Sidebar />
      <main className="rail-offset mx-auto max-w-4xl px-4 pt-6 md:px-6 md:pt-8">
        <p className="text-sm font-semibold text-muted-foreground">Multiplayer · 1v1</p>
        <h1 className="font-display mt-2 text-[clamp(3rem,8vw,5rem)]">{t(lang, "liveDuel")}</h1>
        <p className="mt-3 max-w-xl text-sm md:text-base text-muted-foreground">
          Same place, 15 seconds each round. The further pin loses health equal to the points gap. First to zero loses.
        </p>

        {user === null ? (
          <div className="plate mt-8 p-6">
            <p className="font-semibold">{t(lang, "signInToDuel")}</p>
            <Link to="/auth" className="btn btn-primary mt-4">Sign in</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="plate-ink p-6">
              <p className="font-display text-2xl md:text-3xl">Host a room</p>
              <p className="mt-1 text-xs opacity-80">Get a 4-letter room code and send it to a friend.</p>
              <button onClick={create} disabled={busy || !user} className="btn btn-primary mt-6">Create room</button>
            </div>
            <div className="plate p-6">
              <p className="font-display text-2xl md:text-3xl">Join a room</p>
              <p className="mt-1 text-xs text-muted-foreground">Enter 4-letter code to battle</p>
              <div className="mt-4 flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={code}
                  onChange={(val) => {
                    const upper = val.toUpperCase();
                    setCode(upper);
                    if (upper.length === 4) {
                      buzz(12);
                      blip(settings.sound, 880, 70);
                    }
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <button
                onClick={join}
                disabled={busy || !user || code.length !== 4}
                className="btn btn-primary mt-5 w-full py-3 font-semibold"
              >
                Join Duel
              </button>
            </div>
          </div>
        )}
        {err && <p className="mt-4 font-semibold text-destructive">{err}</p>}
      </main>
    </div>
  );
}
