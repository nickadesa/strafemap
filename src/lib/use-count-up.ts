import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * BoardUI Apple-Style Animated Rolling Number Hook.
 * Smoothly rolls displayed number to `target` with an ease-out spring-like curve.
 */
export function useCountUp(target: number, duration = 850, startFromZero = false): number {
  const [display, setDisplay] = useState(() => (startFromZero ? 0 : target));
  const fromRef = useRef(startFromZero ? 0 : target);
  const mountedRef = useRef(false);

  useEffect(() => {
    // If prefers-reduced-motion is enabled, snap directly to target
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    // If startFromZero is true and this is first mount, animate from 0 to target
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (startFromZero && target > 0) {
        fromRef.current = 0;
      } else {
        fromRef.current = target;
        setDisplay(target);
        return;
      }
    }

    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.round(from + (target - from) * easeOutCubic(t));
      fromRef.current = value;
      setDisplay(value);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
        setDisplay(target);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, startFromZero]);

  return display;
}
