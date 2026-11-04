import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { t, type Lang } from "@/lib/i18n";
import { Flag } from "@/components/Flag";

interface Props {
  lang?: Lang;
  collapsed: boolean;
  onToggle: () => void;
  country: string;
  name: string;
  label: string;
  seconds: number | null;
  children: ReactNode;
}

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

    const duration = 720;
    const cardAnimation = card.animate([
      { width: `${oldCard.width}px`, height: `${oldCard.height}px`, borderRadius: collapsed ? "20px" : "999px" },
      { width: `${width}px`, height: `${height}px`, borderRadius: collapsed ? "999px" : "20px" },
    ], { duration: collapsed ? 300 : duration, easing: "cubic-bezier(.32,.72,0,1)" });
    const startX = oldFlag.left - newFlag.left;
    const startY = oldFlag.top - newFlag.top;
    const centreX = collapsed ? (width - 28) / 2 - 13 : 0;
    const start = `translate(${startX}px, ${startY}px) scale(${oldFlag.width / newFlag.width})`;
    const flagAnimation = badge.animate(collapsed ? [
      { transform: start, offset: 0 },
      { transform: `translate(${centreX}px, 0)`, offset: .42 },
      { transform: `translate(${centreX}px, 0)`, offset: .52 },
      { transform: "none", offset: .78 },
      { transform: "none", offset: 1 },
    ] : [
      { transform: start, offset: 0 },
      { transform: `translate(${startX}px, ${startY}px)`, offset: .2 },
      { transform: "none", offset: .72 },
      { transform: "none", offset: 1 },
    ], { duration, easing: "cubic-bezier(.32,.72,0,1)" });
    const textAnimation = content.animate([
      { opacity: 0, transform: collapsed ? "translateX(6px)" : "translateY(5px)" },
      { opacity: 1, transform: "none" },
    ], { duration: 180, delay: collapsed ? 540 : 500, fill: "backwards", easing: "ease-out" });
    animations.current = [cardAnimation, flagAnimation, textAnimation];
  }, [collapsed, name, viewport]);

  useLayoutEffect(() => () => animations.current.forEach((a) => a.cancel()), []);

  return (
    <button ref={shell} type="button" onClick={onToggle} aria-expanded={!collapsed}
      aria-label={`${name} — ${t(lang, collapsed ? "expandClue" : "collapseClue")}`}
      className="clue-pill glass-plate pointer-events-auto" data-collapsed={collapsed}>
      <div ref={flag} className="clue-badge"><Flag country={country} size={collapsed ? 28 : 44} /></div>
      <div ref={body} className={collapsed ? "clue-body clue-compact" : "clue-body clue-full"}>
        {collapsed ? <span className="clue-name" title={name}>{name}</span> : (
          <div className="clue-heading">
            <p className="text-xs font-normal leading-relaxed text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold leading-snug">{name}</p>
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