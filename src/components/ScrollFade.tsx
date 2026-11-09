import { useCallback, useState, type UIEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * BoardUI Apple-Style Progressive Top Edge Blur & Surface Fade:
 * - 24px masked 1px backdrop blur
 * - 16px masked 4px blur closer to the edge
 * - Surface gradient wash fading in smoothly as content scrolls
 */

export const SCROLL_FADE_DISTANCE = 24;

export function useScrollFade(distance = SCROLL_FADE_DISTANCE) {
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      setProgress(Math.min(1, Math.max(0, event.currentTarget.scrollTop) / distance));
    },
    [distance]
  );

  const reset = useCallback(() => setProgress(0), []);

  return { progress, onScroll, reset };
}

export interface ScrollFadeProps {
  progress: number;
  surfaceClassName?: string;
  className?: string;
}

export function ScrollFade({
  progress,
  surfaceClassName = "from-card",
  className,
}: ScrollFadeProps) {
  if (progress <= 0) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-20 h-6 overflow-hidden transition-opacity duration-150",
        className
      )}
    >
      {/* 24px masked 1px backdrop blur */}
      <div
        className="absolute inset-0 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{ opacity: progress }}
      />
      {/* 16px masked 4px blur closer to edge */}
      <div
        className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{ opacity: progress }}
      />
      {/* Surface color wash */}
      <div
        className={cn("absolute inset-0 bg-card/60 backdrop-blur-xs", surfaceClassName)}
        style={{ opacity: progress * 0.95 }}
      />
    </div>
  );
}
