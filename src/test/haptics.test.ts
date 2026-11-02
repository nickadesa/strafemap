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
