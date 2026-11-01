import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameMap } from "@/components/GameMap";
import { Logo } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useUser } from "@/lib/auth";
import { distanceKm, formatDistance, scoreFor, type LatLng } from "@/lib/game/engine";
import { LOCATIONS } from "@/lib/game/locations";
import { useSettings } from "@/lib/game/storage";
import { blip } from "@/lib/game/sound";

export const Route = createFileRoute("/duel/$code")({
  ssr: false,
  head: ({ params }) => ({
    meta: [
      { title: `Duel ${params.code} — STRAFE` },
      { name: "description", content: "A live 1v1 STRAFE map duel." },
      { property: "og:title", content: `Duel ${params.code} — STRAFE` },
      { property: "og:description", content: "Join this live 1v1 map duel on STRAFE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DuelRoom,
});

type Duel = Tables<"duels">;
type Guess = Tables<"duel_guesses">;
const ROUND_SECONDS = 15;
const mult = (r: number) => 1 + r * 0.5;

function DuelRoom() {
  const { code } = Route.useParams();
  const user = useUser();
  const [settings] = useSettings();
  const [duel, setDuel] = useState<Duel | null | undefined>(undefined);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [pin, setPin] = useState<LatLng | null>(null);
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const sentRef = useRef<number>(-1);

  // load + subscribe
  useEffect(() => {
    if (!user) return;
    let dead = false;
    let ch: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data } = await supabase.from("duels").select("*").eq("code", code.toUpperCase()).maybeSingle();
      if (dead) return;
      setDuel(data ?? null);
      if (!data) return;
      const { data: g } = await supabase.from("duel_guesses").select("*").eq("duel_id", data.id);
      if (!dead) setGuesses(g ?? []);
      ch = supabase.channel(`duel-${data.id}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "duels", filter: `id=eq.${data.id}` }, (p) => setDuel(p.new as Duel))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "duel_guesses", filter: `duel_id=eq.${data.id}` }, (p) =>
          setGuesses((gs) => gs.some((x) => x.id === (p.new as Guess).id) ? gs : [...gs, p.new as Guess]))
        .subscribe();
    })();
    return () => { dead = true; if (ch) supabase.removeChannel(ch); };
  }, [user, code]);

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);

  const isHost = !!duel && user?.id === duel.host_id;
  const round = duel?.round ?? 0;
  const ids = (duel?.location_ids as string[] | undefined) ?? [];
  const loc = LOCATIONS.find((l) => l.id === ids[round]);
  const roundGuesses = guesses.filter((g) => g.round === round);
  const mine = roundGuesses.find((g) => g.user_id === user?.id);
  const theirs = roundGuesses.find((g) => g.user_id !== user?.id);
  const revealed = !!mine && !!theirs;
  const started = duel?.round_started_at ? new Date(duel.round_started_at).getTime() : now;
  const left = Math.max(0, ROUND_SECONDS - (now - started) / 1000);

  useEffect(() => { setPin(null); }, [round]);

  const send = useCallback(async (p: LatLng | null) => {
    if (!duel || !user || sentRef.current === duel.round) return;
    sentRef.current = duel.round;
    await supabase.from("duel_guesses").insert({ duel_id: duel.id, round: duel.round, user_id: user.id, lat: p?.lat ?? null, lng: p?.lng ?? null });
    blip(settings.sound, 520, 60);
  }, [duel, user, settings.sound]);

  // timeout
  useEffect(() => {
    if (duel?.status === "playing" && !mine && left <= 0) send(pin);
  }, [left, mine, duel?.status, pin, send]);

  const result = useMemo(() => {
    if (!revealed || !loc || !duel) return null;
    const score = (g: Guess) => g.lat === null || g.lng === null ? { km: null, pts: 0 } : (() => { const km = distanceKm({ lat: g.lat!, lng: g.lng! }, loc); return { km, pts: scoreFor(km) }; })();
    const me = score(mine!), op = score(theirs!);
    const dmg = Math.round(Math.abs(me.pts - op.pts) * mult(round));
    return { me, op, dmg, iWin: me.pts >= op.pts };
  }, [revealed, loc, mine, theirs, round, duel]);

  useEffect(() => { if (result) blip(settings.sound, result.iWin ? 880 : 300, 160); }, [!!result]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = useCallback(async () => {
    if (!duel || !result || !isHost) return;
    const hostWon = result.iWin; // host perspective
    const host_hp = Math.max(0, duel.host_hp - (hostWon ? 0 : result.dmg));
    const guest_hp = Math.max(0, duel.guest_hp - (hostWon ? result.dmg : 0));
    const over = host_hp <= 0 || guest_hp <= 0 || duel.round + 1 >= ids.length;
    await supabase.from("duels").update({ host_hp, guest_hp, round: over ? duel.round : duel.round + 1, status: over ? "done" : "playing", round_started_at: new Date().toISOString() }).eq("id", duel.id);
  }, [duel, result, isHost, ids.length]);

  // Spacebar
  const keyRef = useRef({ pin, mine, revealed, next, send });
  keyRef.current = { pin, mine, revealed, next, send };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const k = keyRef.current;
      if (!k.mine && k.pin) { e.preventDefault(); k.send(k.pin); }
      else if (k.revealed) { e.preventDefault(); k.next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (user === null) return <Center><p className="font-semibold">Sign in to join duels.</p><Link to="/auth" className="btn btn-primary mt-4">Sign in</Link></Center>;
  if (duel === undefined) return <Center><p className="font-semibold text-muted-foreground">Connecting…</p></Center>;
  if (duel === null) return <Center><p className="font-semibold">Room {code} not found.</p><Link to="/duel" className="btn btn-ink mt-4">Back</Link></Center>;

  const meName = isHost ? duel.host_name : duel.guest_name ?? "You";
  const opName = isHost ? duel.guest_name ?? "Waiting…" : duel.host_name;
  const myHp = isHost ? duel.host_hp : duel.guest_hp;
  const opHp = isHost ? duel.guest_hp : duel.host_hp;

  if (duel.status === "waiting") {
    const link = `${window.location.origin}/duel/${duel.code}`;
    return (
      <Center>
        <p className="text-sm font-semibold text-muted-foreground">Room code</p>
        <p className="font-display mt-2 text-8xl tracking-widest">{duel.code}</p>
        <p className="mt-4 text-muted-foreground">Waiting for your opponent to join…</p>
        <button onClick={() => navigator.clipboard?.writeText(link).then(() => setCopied(true))} className="btn btn-primary mt-6">{copied ? "Link copied!" : "Copy invite link"}</button>
      </Center>
    );
  }

  if (duel.status === "done") {
    const won = myHp > opHp;
    return (
      <Center>
        <p className="text-sm font-semibold text-muted-foreground">Duel {duel.code} · Final</p>
        <h1 className="font-display mt-2 text-[clamp(4rem,14vw,8rem)]">{myHp === opHp ? "Draw" : won ? "Victory" : "Defeat"}</h1>
        <p className="mt-3 font-semibold">{meName} {myHp.toLocaleString()} HP · {opName} {opHp.toLocaleString()} HP</p>
        <div className="mt-6 flex gap-3"><Link to="/duel" className="btn btn-primary">New duel</Link><Link to="/" className="btn btn-outline">Menu</Link></div>
      </Center>
    );
  }

  if (!loc) return <Center><p>Loading round…</p></Center>;

  const shownMyHp = result ? Math.max(0, myHp - (result.iWin ? 0 : result.dmg)) : myHp;
  const shownOpHp = result ? Math.max(0, opHp - (result.iWin ? result.dmg : 0)) : opHp;
  const opPin = revealed && theirs?.lat != null && theirs.lng != null ? [{ lat: theirs.lat, lng: theirs.lng, label: opName }] : [];

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <div className="flex flex-1 items-center justify-end gap-3 text-sm font-semibold">
          <Hp name={meName} hp={shownMyHp} />
          <span className="rounded-full bg-foreground px-3 py-1.5 text-primary">R{round + 1} · ×{mult(round).toFixed(1)}</span>
          <Hp name={opName} hp={shownOpHp} right />
        </div>
      </header>
      <div className="relative mx-2 mb-2 flex-1 overflow-hidden rounded-2xl md:mx-4 md:mb-4">
        <GameMap blind={false} guess={mine && mine.lat != null && mine.lng != null ? { lat: mine.lat, lng: mine.lng } : pin}
          target={revealed ? loc : null} others={opPin} locked={!!mine} onPick={setPin} resetKey={`${duel.id}-${round}`} />
        <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex justify-center">
          <div className="plate pointer-events-auto max-w-md px-5 py-4 text-center">
            <p className="text-sm text-muted-foreground">Pin the location</p>
            <p className="font-display mt-1 text-3xl md:text-4xl">{loc.name}</p>
            {loc.category !== "country" && <p className="mt-1 text-sm text-muted-foreground">{loc.country}</p>}
            {!revealed && (
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground transition-[width] duration-200" style={{ width: `${(left / ROUND_SECONDS) * 100}%` }} /></div>
                <p className={`mt-1 text-xs font-semibold ${left < 5 ? "text-destructive" : ""}`}>{Math.ceil(left)}s{theirs ? ` · ${opName} has guessed` : ""}</p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-x-3 bottom-6 z-[500] flex justify-center">
          {!mine ? (
            <button onClick={() => send(pin)} disabled={!pin} className="btn btn-primary px-10 py-4 text-lg">
              {pin ? <>Confirm guess <kbd className="hidden rounded-full bg-foreground/10 px-2 py-0.5 text-xs md:inline">Space</kbd></> : "Click the map to pin"}
            </button>
          ) : !result ? (
            <div className="plate px-6 py-4 font-semibold">Locked in. Waiting for {opName}…</div>
          ) : (
            <div className="plate w-full max-w-lg p-5">
              <p className="font-display text-4xl">{result.dmg === 0 ? "Even round" : result.iWin ? `You hit −${result.dmg.toLocaleString()}` : `You took −${result.dmg.toLocaleString()}`}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold">
                <p className="rounded-full bg-primary-pale px-3 py-1">{meName}: {result.me.km === null ? "No guess" : formatDistance(result.me.km, settings.unit)}</p>
                <p className="rounded-full bg-muted px-3 py-1">{opName}: {result.op.km === null ? "No guess" : formatDistance(result.op.km, settings.unit)}</p>
              </div>
              {isHost ? <button onClick={next} className="btn btn-ink mt-4 w-full">Next round</button>
                : <p className="mt-4 text-center text-sm text-muted-foreground">Waiting for host to start the next round…</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Hp({ name, hp, right }: { name: string; hp: number; right?: boolean }) {
  return (
    <div className={`min-w-0 flex-1 max-w-[220px] ${right ? "text-right" : ""}`}>
      <p className="truncate text-xs">{name} · {hp.toLocaleString()}</p>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-card"><div className={`h-full bg-primary transition-[width] duration-700 ${right ? "ml-auto" : ""}`} style={{ width: `${(hp / 6000) * 100}%` }} /></div>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">{children}</div>;
}
