import { afterEach, describe, expect, it, vi } from "vitest";
import { buzz } from "@/lib/game/sound";

const nav = globalThis.navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean };

afterEach(() => {
  delete nav.vibrate;
  vi.restoreAllMocks();
});

describe("buzz (haptic feedback)", () => {
  it("vibrates for the requested 10 ms when the device supports it", () => {
    const vibrate = vi.fn(() => true);
    nav.vibrate = vibrate;

    buzz(10);

    expect(vibrate).toHaveBeenCalledTimes(1);
    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("defaults to a 10 ms tap", () => {
    const vibrate = vi.fn(() => true);
    nav.vibrate = vibrate;

    buzz();

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("stays silent on devices without vibrate support", () => {
    delete nav.vibrate;

    expect(() => buzz(10)).not.toThrow();
  });

  it("does not throw when the device rejects the vibration", () => {
    nav.vibrate = () => {
      throw new Error("not allowed");
    };

    expect(() => buzz(10)).not.toThrow();
  });
});
