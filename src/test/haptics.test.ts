import { afterEach, describe, expect, it, vi } from "vitest";
import { buzz } from "@/lib/game/sound";

type Vibrate = (pattern: number | number[]) => boolean;
const nav = globalThis.navigator as unknown as { vibrate?: Vibrate | undefined };

afterEach(() => {
  nav.vibrate = undefined;
  vi.restoreAllMocks();
});

describe("buzz (haptic feedback)", () => {
  it("vibrates for the requested 10 ms when the device supports it", () => {
    const vibrate = vi.fn<Vibrate>(() => true);
    nav.vibrate = vibrate;

    buzz(10);

    expect(vibrate).toHaveBeenCalledTimes(1);
    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("defaults to a 10 ms tap", () => {
    const vibrate = vi.fn<Vibrate>(() => true);
    nav.vibrate = vibrate;

    buzz();

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("stays silent on devices without vibrate support", () => {
    nav.vibrate = undefined;

    expect(() => buzz(10)).not.toThrow();
  });

  it("does not throw when the device rejects the vibration", () => {
    nav.vibrate = () => {
      throw new Error("not allowed");
    };

    expect(() => buzz(10)).not.toThrow();
  });
});

describe("Reduced Motion compliance", () => {
  it("snaps useCountUp directly to target without animation under prefers-reduced-motion", async () => {
    const { renderHook } = await import("@testing-library/react");
    const { useCountUp } = await import("@/lib/use-count-up");

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useCountUp(5000, 850, true));
    expect(result.current).toBe(5000);

    window.matchMedia = originalMatchMedia;
  });
});
