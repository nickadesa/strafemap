import { describe, it, expect } from "vitest";
import { BRAND_COLORS, ACCENTS } from "@/lib/theme";
import { SIN_CARDS } from "@/lib/game/engine";
import { OPENFREEMAP_STYLES } from "@/lib/map/styles";
import { GACHA_ITEMS } from "@/lib/social";

describe("Color Audit & Green Purge Verification", () => {
  it("uses Electric Cyan #00ADFF as primary brand color with AAA ink", () => {
    expect(BRAND_COLORS.cyan).toBe("#00ADFF");
    expect(BRAND_COLORS.inkOnAccent).toBe("#03121C");
    expect(ACCENTS.cyan.primary).toBe("#00ADFF");
  });

  it("ensures no 7 Deadly Sins cards use lime or emerald green", () => {
    const accents = SIN_CARDS.map((card) => card.accent.toUpperCase());
    expect(accents).not.toContain("#D2F801");
    expect(accents).not.toContain("#10B981");
    expect(accents).not.toContain("#22C55E");
  });

  it("ensures map styles do not use lime or emerald green as accents", () => {
    const styleAccents = Object.values(OPENFREEMAP_STYLES).map((s) => s.accent.toUpperCase());
    expect(styleAccents).not.toContain("#D2F801");
    expect(styleAccents).not.toContain("#10B981");
  });

  it("ensures all gacha cosmetics use cyan instead of acid lime", () => {
    const gachaValues = GACHA_ITEMS.map((item) => String(item.value).toUpperCase());
    expect(gachaValues).not.toContain("#D2F801");
  });
});
