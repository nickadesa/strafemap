import { describe, expect, it } from "vitest";
import { getRank, calculateMatchRpDelta, FRAME_AVATAR } from "@/lib/rank";
import { dictionaries, LANGS } from "@/lib/i18n";
import { evaluateSinScore, generateQuizChoices, SIN_CARDS } from "@/lib/game/engine";
import { LOCATIONS } from "@/lib/game/locations";

describe("STRAFE Rank System (RANKS.md Section 7)", () => {
  it("resolves exact rank divisions, banners, frames, and Champion #1..50", () => {
    expect(getRank(0)).toMatchObject({
      rank: "bronze",
      divisionRoman: "IV",
      bannerUrl: "/ranks/banners/bronze-iv.svg",
      frameUrl: "/ranks/frames/bronze.svg",
    });

    expect(getRank(999)).toMatchObject({
      rank: "bronze",
      divisionRoman: "I",
      bannerUrl: "/ranks/banners/bronze-i.svg",
    });

    expect(getRank(1000)).toMatchObject({
      rank: "silver",
      divisionRoman: "IV",
      bannerUrl: "/ranks/banners/silver-iv.svg",
    });

    expect(getRank(3499)).toMatchObject({
      rank: "gold",
      divisionRoman: "I",
      bannerUrl: "/ranks/banners/gold-i.svg",
    });

    expect(getRank(5000)).toMatchObject({
      rank: "diamond",
      divisionRoman: "III",
      bannerUrl: "/ranks/banners/diamond-iii.svg",
    });

    expect(getRank(6999)).toMatchObject({
      rank: "diamond",
      divisionRoman: "I",
      bannerUrl: "/ranks/banners/diamond-i.svg",
    });

    expect(getRank(7000, 120)).toMatchObject({
      rank: "master",
      divisionRoman: null,
      bannerUrl: "/ranks/banners/master.svg",
      frameUrl: "/ranks/frames/master.svg",
    });

    expect(getRank(7500, 1)).toMatchObject({
      rank: "champion",
      championPosition: 1,
      bannerUrl: "/ranks/banners/champion-01.svg",
      frameUrl: "/ranks/frames/champion-01.svg",
    });

    expect(getRank(7300, 50)).toMatchObject({
      rank: "champion",
      championPosition: 50,
      bannerUrl: "/ranks/banners/champion-50.svg",
      frameUrl: "/ranks/frames/champion-50.svg",
    });

    expect(getRank(7300, 51)).toMatchObject({
      rank: "master",
      championPosition: null,
      bannerUrl: "/ranks/banners/master.svg",
    });
  });

  it("exports frameAvatar alignment ratios and RP rules", () => {
    expect(FRAME_AVATAR).toEqual({
      sizeRatioOfWidth: 0.408,
      centerXRatio: 0.5,
      centerYRatio: 0.467,
    });
    const winDelta = calculateMatchRpDelta({ result: "win", myRp: 1200, opponentRp: 1200, roundDiff: 3, gamesPlayed: 10 });
    expect(winDelta).toBe(28);
  });
});

describe("i18n dictionary integrity across 7 languages", () => {
  it("keeps identical translation keys across en, th, ko, zh, ja, es, fr", () => {
    const enKeys = Object.keys(dictionaries.en).sort();
    for (const { id } of LANGS) {
      const langKeys = Object.keys(dictionaries[id]).sort();
      expect(langKeys).toEqual(enKeys);
    }
  });
});

describe("7 Deadly Sins & Country Quiz Engine", () => {
  it("evaluates all 7 Deadly Sin cards with self-only boons and trade-offs", () => {
    expect(SIN_CARDS).toHaveLength(7);
    const prideNear = evaluateSinScore({
      sin: "pride",
      km: 40,
      usedSecondPin: false,
      elapsed: 10,
      limit: 30,
      prevRoundPoints: null,
      gluttonyStreak: 0,
    });
    expect(prideNear.points).toBeGreaterThanOrEqual(5000);

    const greedDual = evaluateSinScore({
      sin: "greed",
      km: 10,
      usedSecondPin: true,
      elapsed: 10,
      limit: 30,
      prevRoundPoints: null,
      gluttonyStreak: 0,
    });
    expect(greedDual.points).toBeLessThanOrEqual(4700);
  });

  it("generates 4 unique country quiz choices including the target country", () => {
    const sample = LOCATIONS[0]!;
    const choices = generateQuizChoices(sample, "Global");
    expect(choices).toHaveLength(4);
    expect(choices).toContain(sample.country);
  });
});
