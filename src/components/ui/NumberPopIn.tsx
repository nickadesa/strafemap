import React, { useEffect, useRef } from "react";

interface Props {
  value: number | string;
  className?: string;
  stagger?: boolean;
}

/**
 * NumberPopIn — Transitions.dev 02-number-pop-in
 * Swaps changed digits on a 3D drum roll with subtle blur and bounce.
 * Leading digits that remain unchanged stay completely static (data-same).
 */
export function NumberPopIn({ value, className = "", stagger = true }: Props) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const prevValRef = useRef<string>("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const currentStr = String(value);
    const prevStr = prevValRef.current;

    if (prevStr === "" || prevStr === currentStr) {
      el.textContent = currentStr;
      prevValRef.current = currentStr;
      return;
    }

    // Determine how many leading characters are identical
    let sameCount = 0;
    while (
      sameCount < prevStr.length &&
      sameCount < currentStr.length &&
      prevStr[sameCount] === currentStr[sameCount]
    ) {
      sameCount++;
    }

    el.classList.remove("is-animating");
    el.innerHTML = "";

    const chars = [...currentStr];
    chars.forEach((ch, idx) => {
      const isDigit = /\d/.test(ch);
      const isUnchanged = idx < sameCount;

      if (isUnchanged || !isDigit) {
        const span = document.createElement("span");
        span.className = "t-digit";
        span.setAttribute("data-same", "");
        span.textContent = ch;
        el.appendChild(span);
        return;
      }

      const slot = document.createElement("span");
      slot.className = "t-digit-slot";

      if (stagger) {
        const fromEnd = chars.length - 1 - idx;
        if (fromEnd === 1) slot.setAttribute("data-stagger", "1");
        else if (fromEnd === 0) slot.setAttribute("data-stagger", "2");
      }

      // Find old digit corresponding to this slot position
      const oldIdx = prevStr.length - (chars.length - idx);
      const oldChar = prevStr[oldIdx];
      if (oldChar && /\d/.test(oldChar)) {
        const oldSpan = document.createElement("span");
        oldSpan.className = "t-digit-old";
        oldSpan.setAttribute("aria-hidden", "true");
        oldSpan.textContent = oldChar;
        slot.appendChild(oldSpan);
      }

      const newSpan = document.createElement("span");
      newSpan.className = "t-digit";
      newSpan.textContent = ch;
      slot.appendChild(newSpan);

      el.appendChild(slot);
    });

    prevValRef.current = currentStr;
    // Force layout reflow before triggering animation class
    void el.offsetHeight;
    el.classList.add("is-animating");
  }, [value, stagger]);

  return (
    <span
      ref={containerRef}
      className={`t-digit-group ${className}`}
      aria-label={String(value)}
    >
      {String(value)}
    </span>
  );
}
