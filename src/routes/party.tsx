import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { IconCheck } from "@/components/icons";
import { useSettings } from "@/lib/game/storage";
import { blip, buzz } from "@/lib/game/sound";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  MODES,
  TIME_OPTIONS,
  type Difficulty,
  type Mode,
  type Pool,
  type TimeLimit,
} from "@/lib/game/engine";
import { getRank, loadRank } from "@/lib/rank";
import { AvatarFrame, ClanTagPill, RankBanner, VerifiedBadge, type VerifiedBadgeType } from "@/components/RankVisuals";
import { COMMUNITY_PLAYERS, useSocialProfile } from "@/lib/social";
import { t, type Lang } from "@/lib/i18n";
import {
  Check,
  Copy,
  Mic,
  MicOff,
  SlidersHorizontal,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

export const Route = createFileRoute("/party")({
  head: () => ({
    meta: [
      { title: "Party Lobby — STRAFE" },
      { name: "description", content: "Create a 2–16 player STRAFE party with Voice Chat and custom game modes." },
      { property: "og:title", content: "Party Lobby — STRAFE" },
      { property: "og:description", content: "Create a 2–16 player STRAFE party with Voice Chat and custom game modes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartyPage,
});

interface PartyPlayer {
  id: string;
  name: string;
  username: string;
  clanTag: string | null;
  clanTagColor: string;
  verified: VerifiedBadgeType;
  rp: number;
  championPosition?: number | null | undefined;
  ready: boolean;
  host: boolean;
  muted: boolean;
  speaking: boolean;
}


const PLAYER_LIMITS = [2, 4, 8, 12, 16] as const;
const MODE_LIST = Object.keys(MODES) as Mode[];
const POOLS: Pool[] = ["world", "capitals", "countries", "landmarks", "stadiums", "wonders", "attractions"];
const DIFFS: Difficulty[] = ["easy", "medium", "hard", "expert", "hardcore"];

function PartyPage() {
  const [settings] = useSettings();
  const [social] = useSocialProfile();
  const lang = (settings.language ?? "en") as Lang;
  const nav = useNavigate();
  const myRank = loadRank();

  // Room Configuration (Editable both before and after creating room!)
  const [selectedMode, setSelectedMode] = useState<Mode>("classic");
  const [selectedPool, setSelectedPool] = useState<Pool>("world");
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>("medium");
  const [selectedTime, setSelectedTime] = useState<TimeLimit>(30);
  const [maxPlayers, setMaxPlayers] = useState<number>(8);

  const [code, setCode] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const [players, setPlayers] = useState<PartyPlayer[]>([]);
  const [myReady, setMyReady] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showHostSettings, setShowHostSettings] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const meName = social.nickname || settings.name || "StrafePlayer";

  const followedFriends = COMMUNITY_PLAYERS.filter((p) => social.followingIds.includes(p.id));

  const createRoom = () => {
    const c = Math.random().toString(36).slice(2, 8).toUpperCase();
    setRoom(c);
    setPlayers([
      {
        id: "me",
        name: meName,
        username: social.username,
        clanTag: social.clanTag,
        clanTagColor: social.clanTagColor,
        verified: social.verifiedBadge,
        rp: myRank.rp,
        championPosition: myRank.championPosition,
        ready: true,
        host: true,
        muted: false,
        speaking: true,
      },
    ]);
    setMyReady(true);
  };

  const joinRoom = () => {
    if (code.length < 4) return;
    const hostFriend = COMMUNITY_PLAYERS[2]!;
    setRoom(code.toUpperCase());
    setPlayers([
      {
        id: hostFriend.id,
        name: hostFriend.nickname,
        username: hostFriend.username,
        clanTag: hostFriend.clanTag,
        clanTagColor: hostFriend.clanTagColor ?? "#D2F801",
        verified: hostFriend.verifiedBadge,
        rp: hostFriend.rp,
        championPosition: hostFriend.championPosition,
        ready: true,
        host: true,
        muted: false,
        speaking: true,
      },
      {
        id: "me",
        name: meName,
        username: social.username,
        clanTag: social.clanTag,
        clanTagColor: social.clanTagColor,
        verified: social.verifiedBadge,
        rp: myRank.rp,
        championPosition: myRank.championPosition,
        ready: false,
        host: false,
        muted: false,
        speaking: true,
      },
    ]);
    setMyReady(false);
  };

  const inviteFriendToRoom = (friendId: string) => {
    if (players.length >= maxPlayers) return;
    if (players.some((p) => p.id === friendId)) return;
    const f = COMMUNITY_PLAYERS.find((x) => x.id === friendId);
    if (!f) return;
    setPlayers((prev) => [
      ...prev,
      {
        id: f.id,
        name: f.nickname,
        username: f.username,
        clanTag: f.clanTag,
        clanTagColor: f.clanTagColor ?? "#D2F801",
        verified: f.verifiedBadge,
        rp: f.rp,
        championPosition: f.championPosition,
        ready: true,
        host: false,
        muted: false,
        speaking: false,
      },
    ]);
    blip(settings.sound, 760, 90);
  };

  const toggleReady = () => {
    setMyReady((r) => !r);
    setPlayers((ps) => ps.map((p) => (p.id === "me" ? { ...p, ready: !p.ready } : p)));
  };

  const togglePlayerMute = (playerId: string) => {
    setPlayers((ps) => ps.map((p) => (p.id === playerId ? { ...p, muted: !p.muted } : p)));
  };


  const start = () => {
    nav({
      to: "/game/$mode",
      params: { mode: selectedMode },
      search: { pool: selectedPool, difficulty: selectedDiff, time: selectedTime },
    });
  };

  const isHost = players.some((p) => p.id === "me" && p.host);
  const allReady = players.length > 0 && players.every((p) => p.ready);

  const renderRoomSettingsControls = () => (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          Game Mode (All More Modes Supported)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MODE_LIST.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMode(m)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                selectedMode === m
                  ? "bg-[#D2F801] text-[#161616]"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(lang, m)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t(lang, "timePerRound")}
          </p>
          <div className="seg w-full">
            {TIME_OPTIONS.map((tOpt) => (
              <button
                key={tOpt}
                type="button"
                onClick={() => setSelectedTime(tOpt)}
                data-on={selectedTime === tOpt}
                className="seg-item !px-2.5 !py-1 text-xs"
              >
                {tOpt === 0 ? "∞" : `${tOpt}s`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Room Size (2–16 Players)
          </p>
          <div className="seg w-full">
            {PLAYER_LIMITS.map((lim) => (
              <button
                key={lim}
                type="button"
                onClick={() => setMaxPlayers(lim)}
                data-on={maxPlayers === lim}
                className="seg-item !px-2.5 !py-1 text-xs"
              >
                {lim}p
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t(lang, "category")}
          </p>
          <div className="seg w-full">
            {POOLS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPool(p)}
                data-on={selectedPool === p}
                className="seg-item !px-2.5 !py-1 text-xs"
              >
                {t(lang, p)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t(lang, "difficulty")}
          </p>
          <div className="seg w-full">
            {DIFFS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDiff(d)}
                data-on={selectedDiff === d}
                className="seg-item !px-2.5 !py-1 text-xs capitalize"
              >
                {t(lang, d)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-12 pt-8 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D2F801] px-3 py-1 text-xs font-extrabold uppercase text-[#161616]">
              <Users className="h-3.5 w-3.5" /> 2–16 Player Voice Party
            </span>
            <h1 className="font-display mt-3 text-4xl md:text-5xl">{t(lang, "party")}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Customize round timers (including Unlimited ∞), invite followed friends & talk on Voice Chat.
            </p>
          </div>

          {!room ? (
            <div className="mt-8 grid gap-5">
              {/* Host Room Configuration Card */}
              <div className="plate space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 gap-2">
                  <div>
                    <h2 className="font-display text-2xl">Host a Custom Party</h2>
                    <p className="text-xs text-muted-foreground">
                      Configure rules now — or tweak them anytime inside the waiting lobby
                    </p>
                  </div>
                  <span className="rounded-full bg-[#D2F801]/15 px-3 py-1 text-xs font-bold text-[#D2F801]">
                    Max {maxPlayers} Players
                  </span>
                </div>

                {renderRoomSettingsControls()}

                <button
                  type="button"
                  onClick={createRoom}
                  className="btn btn-primary w-full py-3.5 text-base font-extrabold"
                >
                  Create Party Room ({t(lang, selectedMode)} · {selectedTime === 0 ? "∞" : `${selectedTime}s`})
                </button>
              </div>

              {/* Join Room by Code */}
              <div className="plate p-5 sm:p-6">
                <div className="flex flex-col gap-1">
                  <p className="font-display text-2xl">Join a Friend's Room</p>
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-character room code to join the lobby instantly
                  </p>
                </div>
                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={code}
                      onChange={(val) => {
                        const upper = val.toUpperCase();
                        setCode(upper);
                        if (upper.length === 6) {
                          buzz(12);
                          blip(settings.sound, 880, 70);
                        }
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <button
                    type="button"
                    onClick={joinRoom}
                    disabled={code.length < 4}
                    className="btn btn-primary w-full sm:w-auto px-7 py-3 text-sm font-bold"
                  >
                    Join Party
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {/* Waiting Lobby Card */}
              <div className="plate p-4 sm:p-6">
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Room Code
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-3xl tracking-[0.2em] text-[#D2F801]">{room}</p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(room);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 1500);
                          }}
                          className="rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
                          title="Copy room code"
                        >
                          {copiedCode ? <Check className="h-4 w-4 text-[#D2F801]" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Room Summary Pills + Editable Host Settings Toggle */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#D2F801] px-2.5 py-0.5 text-xs font-bold text-[#161616]">
                      {t(lang, selectedMode)}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
                      {selectedTime === 0 ? t(lang, "unlimited") : `${selectedTime}s`} · {t(lang, selectedDiff)}
                    </span>
                    <span className="readout rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold">
                      {players.length}/{maxPlayers} Players
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto">
                    {isHost && (
                      <button
                        type="button"
                        onClick={() => setShowHostSettings((v) => !v)}
                        className="btn btn-outline !px-3 !py-1.5 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5 text-[#D2F801]" />
                        Rules
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowInviteModal(true)}
                      className="btn btn-primary !px-3 !py-1.5 text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Invite
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRoom(null);
                        setPlayers([]);
                      }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground text-center"
                    >
                      Leave
                    </button>
                  </div>
                </div>

                {/* Live Host Rule Editor inside Waiting Lobby */}
                {isHost && showHostSettings && (
                  <div className="mt-4 rounded-2xl border border-[#D2F801]/40 bg-background/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#D2F801]">
                        Host Room Settings (Live Update)
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowHostSettings(false)}
                        className="rounded-full bg-[#D2F801] px-3 py-1 text-xs font-bold text-[#161616]"
                      >
                        Confirm Settings
                      </button>
                    </div>
                    {renderRoomSettingsControls()}
                  </div>
                )}

                {/* Waiting Lobby Players List with AvatarFrame + Rank Banner + [TAG] Pill + Mute Toggle */}
                <ul className="mt-5 space-y-2.5">
                  {players.map((p) => {
                    const step = getRank(p.rp, p.championPosition);
                    return (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/50 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <AvatarFrame
                            name={p.name}
                            rp={p.rp}
                            championPosition={p.championPosition}
                            size={38}
                          />
                          <RankBanner
                            rp={p.rp}
                            championPosition={p.championPosition}
                            width={30}
                            className="hidden sm:inline-flex"
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1">
                              <ClanTagPill tag={p.clanTag} color={p.clanTagColor} />
                              <span className="truncate text-xs sm:text-sm font-bold">{p.name}</span>
                              <VerifiedBadge type={p.verified} size={13} />
                              {p.host && (
                                <span className="rounded-full bg-[#D2F801] px-1.5 py-0.2 text-[9px] font-black text-[#161616]">
                                  HOST
                                </span>
                              )}
                            </div>
                            <p className="truncate text-[11px] text-muted-foreground">
                              @{p.username} · <span style={{ color: step.tier.accent }}>{step.name}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          {/* Per-Player Voice Mute Button */}
                          {p.id !== "me" && (
                            <button
                              type="button"
                              onClick={() => togglePlayerMute(p.id)}
                              className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${
                                p.muted
                                  ? "border-destructive bg-destructive/15 text-destructive"
                                  : "border-border bg-card text-foreground hover:bg-muted"
                              }`}
                              title={p.muted ? `Unmute ${p.name}` : `Mute ${p.name}`}
                            >
                              {p.muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                            </button>
                          )}

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              p.ready
                                ? "bg-[#D2F801] text-[#161616]"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {p.ready && <IconCheck className="h-3 w-3" />}
                            {p.ready ? "Ready" : "Wait"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Party Voice Chat Control Bar */}
                <div className="mt-5 rounded-2xl border border-border bg-background/60 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMicOn((m) => !m)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          micOn
                            ? "bg-[#D2F801] text-[#161616]"
                            : "bg-destructive text-white"
                        }`}
                      >
                        {micOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                        {micOn ? "Mic Active" : "Mic Muted"}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {micOn ? "Transmitting in Party Room" : "Press to unmute"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Per-player mute available in roster</span>
                    </div>
                  </div>
                </div>

                {/* Ready / Start Match Row */}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={toggleReady}
                    className={`btn flex-1 ${myReady ? "btn-outline" : "btn-primary"}`}
                  >
                    {myReady ? "Unready" : "Ready Up"}
                  </button>
                  {isHost && (
                    <button
                      type="button"
                      onClick={start}
                      disabled={!allReady}
                      className="btn btn-primary flex-1 font-extrabold disabled:opacity-40"
                    >
                      Start Party Match →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Invite Followed Friends Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="plate w-full max-w-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl">Invite Followed Friends</h3>
                <p className="text-xs text-muted-foreground">
                  Players you follow can join your Party lobby & voice channel immediately
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 max-h-72 space-y-2.5 overflow-y-auto">
              {(followedFriends.length ? followedFriends : COMMUNITY_PLAYERS.slice(0, 4)).map((f) => {
                const alreadyIn = players.some((p) => p.id === f.id);
                return (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background/50 p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <AvatarFrame
                        name={f.nickname}
                        rp={f.rp}
                        championPosition={f.championPosition}
                        size={40}
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <ClanTagPill tag={f.clanTag} color={f.clanTagColor} />
                          <span className="text-sm font-bold">{f.nickname}</span>
                          <VerifiedBadge type={f.verifiedBadge} size={13} />
                        </div>
                        <p className="text-xs text-muted-foreground">@{f.username}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={alreadyIn}
                      onClick={() => inviteFriendToRoom(f.id)}
                      className={`btn !px-3.5 !py-1.5 text-xs font-semibold ${
                        alreadyIn ? "btn-outline opacity-50" : "btn-primary"
                      }`}
                    >
                      {alreadyIn ? "In Lobby" : "+ Invite"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
