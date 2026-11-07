import { useState, useRef, useEffect } from "react";
import { AvatarFrame, ClanTagPill, VerifiedBadge, type VerifiedBadgeType } from "@/components/RankVisuals";
import { useSocialProfile } from "@/lib/social";
import { useSettings } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";
import { Send, Sparkles } from "lucide-react";

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
  time: string;
  me?: boolean | undefined;
  system?: boolean | undefined;
}

const QUICK_CHAT_PILLS = [
  "GG",
  "Well played",
  "Close match",
  "Great pin",
  "Rematch?",
];

const SMART_REPLIES: Record<string, string[]> = {
  gg: [
    "GG, that was intense",
    "GGs, really well played",
    "GG WP, you know your geography",
  ],
  rematch: [
    "Down for a rematch. Ready when you are",
    "Let's queue another one",
  ],
  close: [
    "Thought I had you in round 3. Close one",
    "Down to the wire. Respect",
  ],
  insane: [
    "Thanks, got lucky with the coastline clue",
    "Hours of practice paying off",
  ],
  default: [
    "Well played. See you on the leaderboard",
    "Nice match, thanks for the game",
    "Great guesses throughout",
  ],
};

function getSmartReply(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes("gg")) {
    const arr = SMART_REPLIES["gg"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  if (lower.includes("rematch")) {
    const arr = SMART_REPLIES["rematch"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  if (lower.includes("close")) {
    const arr = SMART_REPLIES["close"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  if (lower.includes("insane") || lower.includes("pin")) {
    const arr = SMART_REPLIES["insane"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  const arr = SMART_REPLIES["default"]!;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function formatChatTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

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
  const [opponentTyping, setOpponentTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "m-initial",
      senderName: opp.name,
      senderTag: opp.clanTag,
      senderTagColor: opp.clanTagColor ?? "#D2F801",
      senderRp: opp.rp,
      senderVerified: opp.verified ?? "gold",
      text: "Good game! Those rounds were seriously fast.",
      time: formatChatTime(),
      me: false,
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, opponentTyping]);

  const sendMessage = (msgText: string) => {
    const trimmed = msgText.trim();
    if (!trimmed) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}-${Math.random()}`,
      senderName: social.nickname || settings.name || t(lang, "you"),
      senderTag: social.clanTag,
      senderTagColor: social.clanTagColor,
      senderRp: 1120,
      senderVerified: social.verifiedBadge,
      text: trimmed,
      time: formatChatTime(),
      me: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");

    // Simulate realistic opponent typing and intelligent reply
    setOpponentTyping(true);
    const typingDelay = 1100 + Math.random() * 900;
    setTimeout(() => {
      setOpponentTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `opp-${Date.now()}`,
          senderName: opp.name,
          senderTag: opp.clanTag,
          senderTagColor: opp.clanTagColor ?? "#D2F801",
          senderRp: opp.rp,
          senderVerified: opp.verified ?? "gold",
          text: getSmartReply(trimmed),
          time: formatChatTime(),
          me: false,
        },
      ]);
    }, typingDelay);
  };

  return (
    <section
      className={`plate overflow-hidden border border-border ${
        inline ? "mt-6 w-full" : "fixed bottom-4 left-4 z-[999] w-80"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{t(lang, "matchChat")}</span>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            {t(lang, "vsName", { name: `${opp.clanTag ? `${opp.clanTag} ` : ""}${opp.name}` })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border/80 bg-background/50 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Post-match room
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div ref={listRef} className="max-h-64 space-y-3 overflow-y-auto p-4 scroll-smooth">
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
                  className={`mb-1 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground ${
                    m.me ? "justify-end" : "justify-start"
                  }`}
                >
                  <ClanTagPill tag={m.senderTag} color={m.senderTagColor} />
                  <span className="font-semibold text-foreground">{m.senderName}</span>
                  <VerifiedBadge type={m.senderVerified ?? "none"} size={13} />
                  <span className="text-[10px] opacity-60 ml-1">{m.time}</span>
                </div>
                <div
                  className={`inline-block px-4 py-2 text-sm leading-relaxed ${
                    m.me
                      ? "rounded-[20px] rounded-br-sm bg-[#D2F801] text-[#161616] font-semibold"
                      : "rounded-[20px] rounded-bl-sm bg-muted text-foreground font-medium"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}

        {opponentTyping && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground italic pl-11">
            <span className="inline-flex gap-1 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
            <span>{opp.name} is typing...</span>
          </div>
        )}
      </div>

      {/* Quick Chat Preset Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-card/40 px-3 py-2">
        {QUICK_CHAT_PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => sendMessage(pill)}
            className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-semibold hover:border-foreground/60 hover:text-[#D2F801] transition-colors"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2 border-t border-border p-3 bg-background/60">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(text)}
          placeholder={t(lang, "chatPlaceholder")}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-foreground/60 transition-colors"
        />
        <button
          type="button"
          onClick={() => sendMessage(text)}
          disabled={!text.trim()}
          className="btn btn-primary !px-4 !py-2 text-sm disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          {t(lang, "send")}
        </button>
      </div>
    </section>
  );
}
