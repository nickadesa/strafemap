import { useState, useRef, useEffect } from "react";
import { AvatarFrame, ClanTagPill, VerifiedBadge, type VerifiedBadgeType } from "@/components/RankVisuals";
import { useSocialProfile } from "@/lib/social";
import { useSettings } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";
import { Send, Sparkles, LogOut } from "lucide-react";

export interface MatchChatOpponent {
  name: string;
  clanTag?: string | null | undefined;
  clanTagColor?: string | undefined;
  rp: number;
  verified?: VerifiedBadgeType | undefined;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderTag?: string | null | undefined;
  senderTagColor?: string | undefined;
  senderRp?: number | undefined;
  senderVerified?: VerifiedBadgeType | undefined;
  text: string;
  me?: boolean | undefined;
  system?: boolean | undefined;
  aura?: "none" | "fire" | "water" | "rainbow" | "vines" | undefined;
}

const QUICK_CHAT_PRESET_KEYS = ["chatPreset1", "chatPreset2", "chatPreset3", "chatPreset4", "chatPreset5"];
const AURA_KEYS = {
  none: "auraNone",
  fire: "auraFire",
  water: "auraWater",
  rainbow: "auraRainbow",
  vines: "auraVines",
} as const;

export function GameChat({
  opponent,
  inline = true,
}: {
  opponent?: MatchChatOpponent;
  inline?: boolean;
}) {
  const [settings] = useSettings();
  const [social] = useSocialProfile();
  const lang = (settings.language ?? "en") as Lang;
  const opp: MatchChatOpponent = opponent ?? {
    name: "KestrelMap",
    clanTag: "SEOUL",
    clanTagColor: "#D2F801",
    rp: 7280,
    verified: "gold",
  };

  const [text, setText] = useState("");
  const [selectedAura, setSelectedAura] = useState<"none" | "fire" | "water" | "rainbow" | "vines">(
    social.chatAura ?? "none",
  );
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      senderName: opp.name,
      senderTag: opp.clanTag,
      senderTagColor: opp.clanTagColor ?? "#D2F801",
      senderRp: opp.rp,
      senderVerified: opp.verified ?? "gold",
      text: t(lang, "chatDemoMsg"),
      me: false,
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const sendMessage = (msgText: string) => {
    const trimmed = msgText.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}-${Math.random()}`,
        senderName: social.nickname || settings.name || t(lang, "you"),
        senderTag: social.clanTag,
        senderTagColor: social.clanTagColor,
        senderRp: 1120,
        senderVerified: social.verifiedBadge,
        text: trimmed,
        me: true,
        aura: selectedAura,
      },
    ]);
    setText("");
  };

  const triggerOpponentLeave = () => {
    if (opponentLeft) return;
    setOpponentLeft(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        senderName: "System",
        text: t(lang, "leftMatch", { name: opp.name }),
        system: true,
      },
    ]);
  };

  const auraClass = (aura?: ChatMessage["aura"]) => {
    if (aura === "fire") return "chat-aura-fire";
    if (aura === "water") return "chat-aura-water";
    if (aura === "rainbow") return "chat-aura-rainbow";
    if (aura === "vines") return "chat-aura-vines";
    return "";
  };

  return (
    <section
      className={`plate overflow-hidden border border-border ${
        inline ? "mt-6 w-full" : "fixed bottom-4 left-4 z-[999] w-80"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D2F801]" />
          <span className="text-sm font-bold">{t(lang, "matchChat")}</span>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            {t(lang, "vsName", { name: `${opp.clanTag ? `${opp.clanTag} ` : ""}${opp.name}` })}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#D2F801]" />
          {(["none", "fire", "water", "rainbow", "vines"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setSelectedAura(a)}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize transition-colors ${
                selectedAura === a
                  ? "bg-[#D2F801] text-[#161616]"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title={t(lang, "auraTitle", { aura: t(lang, AURA_KEYS[a]) })}
            >
              {t(lang, AURA_KEYS[a])}
            </button>
          ))}
          {!opponentLeft && (
            <button
              type="button"
              onClick={triggerOpponentLeave}
              className="ml-1 inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
              title={t(lang, "simLeaveTitle")}
            >
              <LogOut className="h-3 w-3" /> {t(lang, "simLeave")}
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div ref={listRef} className="max-h-64 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          if (m.system) {
            return (
              <div key={m.id} className="flex justify-center py-1">
                <span className="rounded-full border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {m.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2.5 ${m.me ? "flex-row-reverse" : "flex-row"}`}
            >
              <AvatarFrame
                name={m.senderName}
                rp={m.senderRp ?? 1200}
                size={34}
              />
              <div className={`max-w-[78%] ${m.me ? "items-end text-right" : "items-start text-left"}`}>
                <div
                  className={`mb-1 flex flex-wrap items-center gap-1 text-xs ${
                    m.me ? "justify-end" : "justify-start"
                  }`}
                >
                  <ClanTagPill tag={m.senderTag} color={m.senderTagColor} />
                  <span className="font-bold text-foreground">{m.senderName}</span>
                  <VerifiedBadge type={m.senderVerified ?? "none"} size={13} />
                </div>
                <div
                  className={`inline-block px-4 py-2 text-sm font-medium ${
                    m.me
                      ? "rounded-[22px] rounded-br-sm bg-[#D2F801] text-[#161616] font-semibold"
                      : "rounded-[22px] rounded-bl-sm bg-muted text-foreground"
                  } ${auraClass(m.aura)}`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(text)}
          placeholder={t(lang, "chatPlaceholder")}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-[#D2F801]"
        />
        <button
          type="button"
          onClick={() => sendMessage(text)}
          className="btn btn-primary !px-4 !py-2 text-sm"
        >
          <Send className="h-4 w-4" />
          {t(lang, "send")}
        </button>
      </div>
    </section>
  );
}
