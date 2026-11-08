import React, { useLayoutEffect, useRef } from "react";

export interface TabItem<T extends string | number = string | number> {
  id: T;
  label: React.ReactNode;
}

interface Props<T extends string | number = string | number> {
  tabs: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * SlidingTabs — Transitions.dev 16-tabs-sliding
 * Seamless segmented control with a sliding backdrop pill.
 * Automatically aligns to target tab on click and window resize.
 */
export function SlidingTabs<T extends string | number = string | number>({
  tabs,
  activeId,
  onChange,
  className = "",
}: Props<T>) {
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  const movePill = (targetTab: HTMLElement | null, animate: boolean) => {
    if (!pillRef.current || !targetTab) return;
    const pill = pillRef.current;

    if (!animate) {
      const prev = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${targetTab.offsetLeft}px)`;
      pill.style.width = `${targetTab.offsetWidth}px`;
      void pill.offsetWidth; // force reflow
      pill.style.transition = prev;
    } else {
      pill.style.transform = `translateX(${targetTab.offsetLeft}px)`;
      pill.style.width = `${targetTab.offsetWidth}px`;
    }
  };

  useLayoutEffect(() => {
    if (!barRef.current) return;
    const activeEl = barRef.current.querySelector<HTMLButtonElement>(
      `[data-tab-id="${String(activeId)}"]`
    );

    if (isFirstRender.current) {
      movePill(activeEl, false);
      isFirstRender.current = false;
    } else {
      movePill(activeEl, true);
    }
  }, [activeId]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!barRef.current) return;
      const activeEl = barRef.current.querySelector<HTMLButtonElement>(
        `[data-tab-id="${String(activeId)}"]`
      );
      movePill(activeEl, false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeId]);

  return (
    <div ref={barRef} className={`t-tabs ${className}`} role="tablist">
      <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
      {tabs.map((tab) => {
        const isSelected = tab.id === activeId;
        return (
          <button
            key={String(tab.id)}
            type="button"
            role="tab"
            data-tab-id={String(tab.id)}
            aria-selected={isSelected}
            onClick={() => onChange(tab.id)}
            className="t-tab"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
