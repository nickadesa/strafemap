import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/lib/game/storage";
import { blip, buzz } from "@/lib/game/sound";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import {
  Check,
  ClipboardPaste,
  Copy,
  Mic,
  MicOff,
  Pencil,
  SlidersHorizontal,
  Sparkles,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { ScrollFade, useScrollFade } from "@/components/ScrollFade";

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
  const [partyName, setPartyName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const meName = social.nickname || settings.name || "StrafePlayer";
  const followedFriends = COMMUNITY_PLAYERS.filter((p) => social.followingIds.includes(p.id));

  const lobbyFade = useScrollFade();
  const inviteFade = useScrollFade();

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
        clanTagColor: hostFriend.clanTagColor ?? "#00ADFF",
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

  const handlePasteCode = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      const cleaned = clipText.trim().replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
      if (cleaned) {
        setCode(cleaned);
        buzz(10);
        blip(settings.sound, 880, 70);
      }
    } catch {
      // ignore
    }
  };

  const leaveRoom = () => {
    buzz(8);
    setRoom(null);
    setPlayers([]);
    setShowLeaveConfirm(false);
  };

  const startPartyWithFriend = (f: (typeof COMMUNITY_PLAYERS)[0]) => {
    createRoom();
    setTimeout(() => {
      inviteFriendToRoom(f.id);
    }, 80);
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
        clanTagColor: f.clanTagColor ?? "#00ADFF",
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
  const readyCount = players.filter((p) => p.ready).length;

  const renderRoomSettingsControls = () => (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          Game Mode
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MODE_LIST.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMode(m)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedMode === m
                  ? "bg-accent-fill text-[#03121C]"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(lang, m)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t(lang, "timePerRound")}
          </p>
          <div className="seg w-full min-w-0 max-w-full overflow-x-auto no-scrollbar">
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

        <div className="min-w-0">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Room Size (2–16 Players)
          </p>
          <div className="seg w-full min-w-0 max-w-full overflow-x-auto no-scrollbar">
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
        <div className="min-w-0">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t(lang, "category")}
          </p>
          <div className="seg w-full min-w-0 max-w-full overflow-x-auto no-scrollbar">
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

        <div className="min-w-0">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t(lang, "difficulty")}
          </p>
          <div className="seg w-full min-w-0 max-w-full overflow-x-auto no-scrollbar">
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
      <main className="rail-offset w-full max-w-full overflow-x-hidden px-4 pb-16 pt-8 md:px-6">
        <div className="mx-auto w-full max-w-3xl min-w-0">
          {/* Apple Large Title Header */}
          <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t(lang, "party")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                2–16 players
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
                <Users className="h-3.5 w-3.5 text-accent-text" />
                Voice Chat
              </span>
            </div>
          </header>

          {!room ? (
            <div className="mt-6 space-y-6">
              {/* Host Room Configuration Card */}
              <div className="plate space-y-5 p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between border-b border-border pb-3.5 gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-foreground sm:text-2xl">{t(lang, "hostParty")}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Configure rules now — or tweak them anytime inside the waiting lobby
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                    Max {maxPlayers} Players
                  </span>
                </div>

                {renderRoomSettingsControls()}

                <button
                  type="button"
                  onClick={createRoom}
                  className="btn btn-primary w-full py-3.5 text-base font-semibold shadow-md"
                >
                  {t(lang, "hostParty")} ({t(lang, selectedMode)} · {selectedTime === 0 ? "∞" : `${selectedTime}s`})
                </button>
              </div>

              {/* Join Room by Code */}
              <div className="plate p-5 sm:p-7">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">{t(lang, "joinWithCode")}</h2>
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-character room code to join the lobby instantly
                  </p>
                </div>
                <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="flex flex-wrap items-center gap-3">
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

                    <button
                      type="button"
                      onClick={handlePasteCode}
                      className="btn btn-outline inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                      title="Paste from clipboard"
                    >
                      <ClipboardPaste className="h-3.5 w-3.5" />
                      <span>Paste</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={joinRoom}
                    disabled={code.length < 4}
                    className="btn btn-primary w-full sm:w-auto px-7 py-3 text-sm font-semibold disabled:opacity-40"
                  >
                    Join Party
                  </button>
                </div>
              </div>

              {/* Followed Friends & Recent Parties Card */}
              <div className="plate p-5 sm:p-7">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-foreground sm:text-xl">{t(lang, "recentParties")}</h2>
                    <p className="text-xs text-muted-foreground">
                      Quick start a party with friends you follow
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {followedFriends.length} Following
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(followedFriends.length > 0 ? followedFriends : COMMUNITY_PLAYERS.slice(0, 4)).map((f) => {
                    const step = getRank(f.rp, f.championPosition);
                    return (
                      <div
                        key={f.id}
                        className="flex items-center justify-between rounded-2xl border border-border bg-background/50 p-3 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <AvatarFrame
                            name={f.nickname}
                            rp={f.rp}
                            championPosition={f.championPosition}
                            size={40}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <ClanTagPill tag={f.clanTag} color={f.clanTagColor} />
                              <span className="truncate text-sm font-semibold text-foreground">{f.nickname}</span>
                              <VerifiedBadge type={f.verifiedBadge} size={13} />
                            </div>
                            <p className="truncate text-[11px] text-muted-foreground">
                              @{f.username} · <span style={{ color: step.tier.accent }}>{step.name}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => startPartyWithFriend(f)}
                          className="btn btn-outline ml-2 shrink-0 px-3 py-1.5 text-xs font-semibold hover:border-accent-fill hover:bg-accent-fill hover:text-[#03121C]"
                        >
                          + Invite
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {/* Waiting Lobby Card */}
              <div className="plate p-5 sm:p-7">
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {isEditingName ? (
                        <input
                          type="text"
                          value={partyName}
                          onChange={(e) => setPartyName(e.target.value)}
                          onBlur={() => setIsEditingName(false)}
                          onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                          placeholder={`${meName}'s party`}
                          autoFocus
                          className="rounded-lg border border-border bg-background px-2.5 py-1 text-lg font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-accent-fill"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                            {partyName || `${meName}'s party`}
                          </h2>
                          {isHost && (
                            <button
                              type="button"
                              onClick={() => setIsEditingName(true)}
                              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              title="Edit party name"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Code:</span>
                      <span className="readout font-mono text-base font-bold tracking-widest text-accent-text">
                        {room.slice(0, 3)} {room.slice(3)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(room);
                          setCopiedCode(true);
                          buzz(6);
                          toast.success(`Copied room code: ${room.slice(0, 3)} ${room.slice(3)}`);
                          setTimeout(() => setCopiedCode(false), 1500);
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="h-3 w-3 text-accent-text" />
                            <span className="text-[10px] text-accent-text">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="readout text-xs font-semibold text-muted-foreground">
                        {players.length} of {maxPlayers} players
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isHost && (
                      <button
                        type="button"
                        onClick={() => setShowHostSettings((v) => !v)}
                        className="btn btn-outline text-xs font-semibold flex items-center gap-1"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5 text-accent-text" />
                        Rules
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowInviteModal(true)}
                      className="btn btn-primary text-xs font-semibold flex items-center gap-1"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Invite
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowLeaveConfirm(true)}
                      className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      Leave
                    </button>
                  </div>
                </div>

                {/* Live Host Rule Editor inside Waiting Lobby */}
                {isHost && showHostSettings && (
                  <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-accent-text">
                        Host Room Settings (Live Update)
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowHostSettings(false)}
                        className="rounded-full bg-accent-fill px-3 py-1 text-xs font-semibold text-[#03121C]"
                      >
                        Confirm Settings
                      </button>
                    </div>
                    {renderRoomSettingsControls()}
                  </div>
                )}

                {/* Waiting Lobby Players List with BoardUI Progressive Scroll Fade */}
                <div className="relative mt-5">
                  <ScrollFade progress={lobbyFade.progress} surfaceClassName="from-card/95" className="top-0" />
                  <ul
                    onScroll={lobbyFade.onScroll}
                    className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1 scroll-smooth"
                  >
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
                                <span className="truncate text-xs sm:text-sm font-semibold">{p.name}</span>
                                <VerifiedBadge type={p.verified} size={13} />
                                {p.host && (
                                  <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground">
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
                            {/* Speaking Indicator */}
                            {p.speaking && (
                              <span className="relative flex h-2.5 w-2.5" title="Speaking">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-fill opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-fill" />
                              </span>
                            )}

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
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                p.ready
                                  ? "bg-accent-fill/15 text-accent-text"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {p.ready && <Check className="h-3 w-3" />}
                              {p.ready ? "Ready" : "Wait"}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Party Voice Chat Control Bar */}
                <div className="mt-5 rounded-2xl border border-border bg-background/60 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMicOn((m) => !m)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          micOn
                            ? "bg-accent-fill text-[#03121C]"
                            : "bg-destructive text-white"
                        }`}
                      >
                        {micOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                        {micOn ? "Mic Active" : "Mic Muted"}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {micOn ? "Transmitting in Party Room" : "Microphone muted"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Per-player mute available in roster</span>
                    </div>
                  </div>
                </div>

                {/* Ready / Start Match Row */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={toggleReady}
                    className={`btn flex-1 py-3 text-sm font-semibold ${myReady ? "btn-outline" : "btn-primary"}`}
                  >
                    {myReady ? "Unready" : "Ready Up"}
                  </button>
                  {isHost ? (
                    <button
                      type="button"
                      onClick={start}
                      disabled={!allReady}
                      className="btn btn-primary flex-1 py-3 text-sm font-semibold disabled:opacity-40"
                    >
                      {allReady
                        ? "Start Party Match"
                        : `Start Party Match (${readyCount} of ${players.length} ready)`}
                    </button>
                  ) : (
                    myReady && (
                      <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-accent-fill animate-pulse" />
                        <span>{t(lang, "waitingForHost")}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leave Confirmation Dialog */}
          <Dialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Leave Party?</DialogTitle>
                <DialogDescription className="pt-2 text-sm text-muted-foreground">
                  {t(lang, "leavePartyConfirm")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(false)}
                  className="btn btn-outline text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={leaveRoom}
                  className="btn btn-primary bg-destructive text-white hover:bg-destructive/90 text-xs font-semibold"
                >
                  Leave Party
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

            <div className="relative mt-4">
              <ScrollFade progress={inviteFade.progress} surfaceClassName="from-card/95" className="top-0" />
              <div
                onScroll={inviteFade.onScroll}
                className="max-h-72 space-y-2.5 overflow-y-auto pr-1 scroll-smooth"
              >
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
                          <span className="text-sm font-semibold">{f.nickname}</span>
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
        </div>
      )}
    </div>
  );
}
