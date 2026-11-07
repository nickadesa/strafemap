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
  avatarUrl?: string | null | undefined;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderTag?: string | null | undefined;
  senderTagColor?: string | undefined;
  senderRp?: number | undefined;
  senderVerified?: VerifiedBadgeType | undefined;
  senderAvatarUrl?: string | null | undefined;
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

const POLITE_REPLIES: Record<string, string[]> = {
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

const TOXIC_PATTERNS = [
  /กาก/i, /ควาย/i, /เหี้ย/i, /เชี่ย/i, /สัส/i, /สัตว์/i, /มึง/i, /ควย/i, /ด๋อย/i, /อ่อน/i,
  /โง่/i, /กระจอก/i, /ไก่/i, /สถุย/i, /ขยะ/i, /อีห่า/i, /ไอ้/i,
  /\bnoob\b/i, /\bez\b/i, /\btrash\b/i, /\bbot\b/i, /\bfuck\b/i, /\bfk\b/i, /\bbitch\b/i,
  /\bloser\b/i, /\bidiot\b/i, /\bstupid\b/i, /\bgit gud\b/i, /\bl2p\b/i, /\bdumb\b/i
];

const TOXIC_THAI_REPLIES = [
  "เล่นแบบนี้เอาตีนเขี่ยเอายังแม่นกว่าเลยน้อง 55555",
  "ปักไปกลางมหาสมุทรขนาดนั้น ยังกล้าพิมพ์ปากดีอีกเหรอวะ",
  "คะแนนหลักร้อย แต่ความมั่นใจหลักล้าน ไปหัดดูเสาไฟข้างทางใหม่ไป๊",
  "กากขนาดนี้กดยอมแพ้ตั้งแต่รอบแรกเถอะ อย่าฝืนเลย อายเขา",
  "ทรงนี้ไม่ต้องดูธงหรอก ดูความกากของตัวเองก่อนเถอะ",
  "ถามจริง ตาบอดหรือเน็ตหลุด ปักเปรูไปโผล่ญี่ปุ่นได้ไงวะ 555",
  "เล่นเหมือนเพิ่งโหลดเกมมา 5 นาทีแล้วกดลงแรงก์ ขำว่ะ",
  "Ez clap จัดๆ แจกแต้มฟรีขอบใจนะไก่กา",
  "อย่าพิมพ์เยอะ ไปฝึกซ้อมกับบอท Easy ให้รอดก่อนนะน้อง",
  "สกอร์แค่นี้เงียบปากไปเหอะ พิมพ์มาไม่อายหรอวะ",
  "ปักมั่วขนาดนี้ หมาที่บ้านเหยียบคีย์บอร์ดยังได้แต้มเยอะกว่า",
  "โทษเน็ต โทษแผนที่ แต่ไม่เคยโทษความกากของตัวเอง 555"
];

const TOXIC_ENG_REPLIES = [
  "Bro pinned in the Pacific Ocean and thinks he has rights to speak.",
  "0 pts energy right here, pipe down noob.",
  "My grandmother plays better with her monitor turned off.",
  "Thanks for the free RP, easiest win of my entire life.",
  "Did you guess with your eyes closed or are you naturally this lost?",
  "Uninstall and stick to Google Maps walking directions.",
  "Imagine talking trash with that disaster of a score.",
  "You missed by 14,000 km, sit down and take notes.",
  "Is your monitor even plugged in or are you playing by scent?",
  "Pure comedy. Thanks for the free elo, appreciate the donation."
];

function getBotReply(userText: string, isToxic: boolean, isLowScore: boolean, lang: Lang): string {
  const isThaiText = /[ก-๙]/.test(userText) || lang === "th";
  const containsInsult = TOXIC_PATTERNS.some((pat) => pat.test(userText));

  if (isToxic || isLowScore || containsInsult) {
    const list = isThaiText ? TOXIC_THAI_REPLIES : TOXIC_ENG_REPLIES;
    return list[Math.floor(Math.random() * list.length)]!;
  }

  const lower = userText.toLowerCase();
  if (lower.includes("gg")) {
    const arr = POLITE_REPLIES["gg"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  if (lower.includes("rematch")) {
    const arr = POLITE_REPLIES["rematch"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  if (lower.includes("close")) {
    const arr = POLITE_REPLIES["close"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  if (lower.includes("insane") || lower.includes("pin")) {
    const arr = POLITE_REPLIES["insane"]!;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }
  const arr = POLITE_REPLIES["default"]!;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function formatChatTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

export function GameChat({
  opponent,
  inline = true,
  playerScore,
}: {
  opponent?: MatchChatOpponent;
  inline?: boolean;
  playerScore?: number;
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
    avatarUrl: null,
  };

  const isLowScore = typeof playerScore === "number" && playerScore < 3000;
  const [isToxic, setIsToxic] = useState(isLowScore);
  const [showPresets, setShowPresets] = useState(false);
  const [text, setText] = useState("");
  const [opponentTyping, setOpponentTyping] = useState(false);

  const initialBotMsg = isLowScore
    ? lang === "th"
      ? "คะแนนแค่นี้กล้ามากดจบเกมเนอะ 5555 ไปฝึกใหม่เหอะน้อง"
      : "That score was tragic. Free RP for me, thanks!"
    : "Good game. Those rounds were fast.";

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "m-initial",
      senderName: opp.name,
      senderTag: opp.clanTag,
      senderTagColor: opp.clanTagColor ?? "#D2F801",
      senderRp: opp.rp,
      senderVerified: opp.verified ?? "gold",
      senderAvatarUrl: opp.avatarUrl ?? null,
      text: initialBotMsg,
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
      senderAvatarUrl: social.avatarUrl,
      text: trimmed,
      time: formatChatTime(),
      me: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");

    // Opponent typing and reply
    setOpponentTyping(true);
    const typingDelay = 900 + Math.random() * 800;
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
          senderAvatarUrl: opp.avatarUrl ?? null,
          text: getBotReply(trimmed, isToxic, isLowScore, lang),
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
      {/* Header: Chat title only, no vsName */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{t(lang, "chat")}</span>
          <span className="rounded-full border border-border/80 bg-background/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Post-match
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toxic Bot Persona Toggle for quick testing */}
          <button
            type="button"
            onClick={() => setIsToxic((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
              isToxic
                ? "border-red-500/40 bg-red-500/15 text-red-400"
                : "border-border bg-muted/60 text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle Toxic AI Bot persona"
          >
            <span>{isToxic ? "Toxic Bot ON" : "Polite Bot"}</span>
          </button>
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
                src={m.senderAvatarUrl}
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

      {/* Quick Chat Preset Pills (collapsible) */}
      {showPresets && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-card/40 px-3 py-2 animate-in fade-in duration-150">
          {QUICK_CHAT_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => sendMessage(pill)}
              className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-semibold hover:border-foreground/60 hover:text-foreground transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>
      )}

      {/* Input Row with Preset Toggle button on the left */}
      <div className="flex items-center gap-2 border-t border-border p-3 bg-background/60">
        <button
          type="button"
          onClick={() => setShowPresets((v) => !v)}
          title={showPresets ? "Hide presets" : "Show presets"}
          aria-label="Toggle chat presets"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
            showPresets
              ? "border-foreground/60 bg-muted text-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4" />
        </button>

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
