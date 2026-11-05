import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { t, type Lang } from "@/lib/i18n";
import { Flag } from "@/components/Flag";

interface Props {
  lang?: Lang;
  collapsed: boolean;
  onToggle: () => void;
  country: string;
  name: string;
  /** Accessible description of the clue type; not shown visually. */
  label: string;
  seconds: number | null;
  children: ReactNode;
}

const DURATION = 620;
const EASE = "cubic-bezier(.32,.72,0,1)";

// Flag stays at the far left, content centred, timer + chevron locked right.
// Measure only the active content; hidden details cannot widen a short pill.
export function SmartClue({ lang = "en", collapsed, onToggle, country, name, label, seconds, children }: Props) {
  const shell = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const flag = useRef<HTMLDivElement>(null);
  const previous = useRef<boolean | null>(null);
  const animations = useRef<Animation[]>([]);
  const lastFlag = useRef<DOMRect | null>(null);
  const [viewport, setViewport] = useState(0);

  useLayoutEffect(() => {
    const resize = () => setViewport((v) => v + 1);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useLayoutEffect(() => {
    const card = shell.current;
    const content = body.current;
    const badge = flag.current;
    if (!card || !content || !badge) return;
    const oldCard = card.getBoundingClientRect();
    const oldFlag = lastFlag.current ?? badge.getBoundingClientRect();
    animations.current.forEach((a) => a.cancel());
    card.style.width = "auto";
    card.style.height = "auto";
    const width = content.offsetWidth + 2;
    const height = content.offsetHeight + 2;
    card.style.width = `${width}px`;
    card.style.height = `${height}px`;
    const newFlag = badge.getBoundingClientRect();
    lastFlag.current = newFlag;
    const changing = previous.current !== null && previous.current !== collapsed;
    previous.current = collapsed;
    if (!changing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cardAnimation = card.animate([
      { width: `${oldCard.width}px`, height: `${oldCard.height}px`, borderRadius: collapsed ? "20px" : "999px" },
      { width: `${width}px`, height: `${height}px`, borderRadius: collapsed ? "999px" : "20px" },
    ], { duration: DURATION, easing: EASE });
    const dx = oldFlag.left - newFlag.left;
    const dy = oldFlag.top - newFlag.top;
    const flagAnimation = badge.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${oldFlag.width / newFlag.width})` },
      { transform: "none" },
    ], { duration: DURATION, easing: EASE });
    const textAnimation = content.animate([
      { opacity: 0, transform: collapsed ? "translateX(6px)" : "translateY(4px)" },
      { opacity: 1, transform: "none" },
    ], { duration: 260, delay: DURATION * 0.55, fill: "backwards", easing: "ease-out" });
    animations.current = [cardAnimation, flagAnimation, textAnimation];
  }, [collapsed, name, viewport]);

  useLayoutEffect(() => () => animations.current.forEach((a) => a.cancel()), []);

  return (
    <button ref={shell} type="button" onClick={onToggle} aria-expanded={!collapsed}
      aria-label={`${label}: ${name} — ${t(lang, collapsed ? "expandClue" : "collapseClue")}`}
      className="clue-pill glass-plate pointer-events-auto" data-collapsed={collapsed}>
      <div ref={body} className={collapsed ? "clue-body clue-compact" : "clue-body clue-full"}>
        <div ref={flag} className="clue-badge"><Flag country={country} size={collapsed ? 28 : 40} /></div>
        {collapsed ? <span className="clue-name" title={name}>{name}</span> : (
          <div className="clue-heading">
            <p className="text-xl font-semibold leading-snug">{name}</p>
          </div>
        )}
        <span className="clue-controls">
          {seconds !== null && <span className="readout clue-timer">{seconds}s</span>}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" className={collapsed ? "opacity-60" : "rotate-180 opacity-60"}><path d="M6 9l6 6 6-6" /></svg>
        </span>
        {!collapsed && <div className="clue-details">{children}</div>}
      </div>
    </button>
  );
}
