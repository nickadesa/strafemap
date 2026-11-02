import { useState, useRef, useEffect } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  name: string;
  text: string;
  me?: boolean;
}

export function GameChat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", name: "System", text: "Match started" },
  ]);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("close-game-panels", close);
    return () => window.removeEventListener("close-game-panels", close);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) window.dispatchEvent(new Event("close-game-panels"));
  };

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), name: "You", text: text.trim(), me: true },
    ]);
    setText("");
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col items-start">
      {open && (
        <div className="mb-2 w-72 overflow-hidden rounded-xl border border-border/40 bg-card/95 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border/30 px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground">Chat</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-48 space-y-1.5 overflow-y-auto p-3 text-sm">
            {messages.map((m) => (
              <div key={m.id} className={`${m.me ? "text-right" : ""}`}>
                <span className="text-[10px] text-muted-foreground">{m.name}</span>
                <p className={`mt-0.5 inline-block rounded-lg px-2.5 py-1 ${m.me ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.text}
                </p>
              </div>
            ))}
            <div ref={bottom} />
          </div>
          <div className="flex border-t border-border/30 p-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 rounded-md bg-background/60 px-3 py-1.5 text-sm outline-none"
            />
            <button onClick={send} className="ml-1 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground">
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        className="grid h-11 w-11 place-items-center rounded-full border border-border/40 bg-card/95 backdrop-blur-md hover:bg-card"
        title="Chat"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
