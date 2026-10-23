import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { IconTarget, IconCheck } from "@/components/icons";
import { useUser } from "@/lib/auth";
import { useSettings } from "@/lib/game/storage";

export const Route = createFileRoute("/party")({
  head: () => ({
    meta: [
      { title: "Party — STRAFE" },
      { name: "description", content: "Host or join a party. Ready up before the host starts." },
    ],
  }),
  component: PartyPage,
});

type Player = { id: string; name: string; ready: boolean; host: boolean };

function PartyPage() {
  const user = useUser();
  const [settings] = useSettings();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myReady, setMyReady] = useState(false);

  const meName = settings.name || user?.email?.split("@")[0] || "Guest";

  const createRoom = () => {
    const c = Math.random().toString(36).slice(2, 6).toUpperCase();
    setRoom(c);
    setPlayers([{ id: "me", name: meName, ready: false, host: true }]);
    setMyReady(false);
  };

  const joinRoom = () => {
    if (code.length < 4) return;
    setRoom(code.toUpperCase());
    setPlayers([
      { id: "host", name: "Host", ready: true, host: true },
      { id: "me", name: meName, ready: false, host: false },
    ]);
    setMyReady(false);
  };

  const toggleReady = () => {
    setMyReady((r) => !r);
    setPlayers((ps) => ps.map((p) => (p.id === "me" ? { ...p, ready: !p.ready } : p)));
  };

  const start = () => {
    // For now, start a local classic game. Full multiplayer needs Supabase party tables.
    nav({ to: "/game/$mode", params: { mode: "classic" }, search: {} });
  };

  const allReady = players.length > 0 && players.every((p) => p.ready);

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-5">
        <div className="mt-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <IconTarget className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl">Party</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ready up. Host starts when everyone is ready.</p>
        </div>

        {!room ? (
          <div className="mt-8 grid gap-4">
            <div className="plate p-6">
              <p className="font-display text-2xl">Host a room</p>
              <p className="mt-1 text-sm text-muted-foreground">Create a code and share it.</p>
              <button onClick={createRoom} className="btn btn-primary mt-4 w-full">Create room</button>
            </div>
            <div className="plate p-6">
              <p className="font-display text-2xl">Join a room</p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
                placeholder="CODE"
                className="mt-3 w-full rounded-full border border-input bg-background px-5 py-3 text-center font-display text-2xl tracking-[0.3em]"
              />
              <button onClick={joinRoom} disabled={code.length < 4} className="btn btn-ink mt-3 w-full">Join</button>
            </div>
          </div>
        ) : (
          <div className="plate mt-8 p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-3xl tracking-widest">{room}</p>
              <button onClick={() => { setRoom(null); setPlayers([]); }} className="text-sm text-muted-foreground">Leave</button>
            </div>
            <ul className="mt-6 space-y-3">
              {players.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-8 w-8 place-items-center rounded-full ${p.ready ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                      {p.ready ? <IconCheck className="h-4 w-4" /> : <span className="text-xs">{p.name[0]}</span>}
                    </div>
                    <span className="font-semibold">{p.name}{p.host && " · Host"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.ready ? "Ready" : "Not ready"}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <button onClick={toggleReady} className={`btn flex-1 ${myReady ? "btn-outline" : "btn-primary"}`}>
                {myReady ? "Unready" : "Ready"}
              </button>
              {players.some((p) => p.id === "me" && p.host) && (
                <button onClick={start} disabled={!allReady} className="btn btn-ink flex-1 disabled:opacity-40">
                  Start
                </button>
              )}
            </div>
            {!allReady && <p className="mt-3 text-center text-xs text-muted-foreground">Waiting for everyone to ready up</p>}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/duel" className="text-sm text-muted-foreground underline">Classic 1v1 Duel</Link>
        </div>
      </main>
    </div>
  );
}
