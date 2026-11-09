export type CardAspect = "16:9" | "1:1" | "4:5" | "9:16";
export type CardResolution = "1080p" | "2K" | "4K";
export type CardTemplate = "daily" | "ranked" | "party" | "classic";

export interface CardRound {
  name: string;
  points: number;
  km: number | null;
  guess: { lat: number; lng: number } | null;
  target: { lat: number; lng: number };
}

export interface CardData {
  mode: string;
  tag: string;
  template?: CardTemplate | undefined;
  aspect?: CardAspect | undefined;
  resolution?: CardResolution | undefined;
  playerName?: string | undefined;
  clanTag?: string | null | undefined;
  rankName?: string | undefined;
  rpChange?: number | null | undefined;
  opponentName?: string | null | undefined;
  total: number;
  max: number;
  avgKm: string;
  perfects: number;
  rounds: CardRound[];
  url: string;
}

const ACCENT = "#00ADFF";
const BG = "#161616";
const PLATE = "#1E1E20";
const LINE = "#2C2E33";
const MUTED = "#9A9D97";
const INK = "#FFFFFF";

export function gradeFor(pct: number) {
  return pct >= 0.9 ? "S" : pct >= 0.75 ? "A" : pct >= 0.55 ? "B" : pct >= 0.35 ? "C" : "D";
}

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

export function dimensionsFor(aspect: CardAspect = "9:16", res: CardResolution = "1080p"): { w: number; h: number } {
  const baseShort = res === "4K" ? 2160 : res === "2K" ? 1440 : 1080;
  if (aspect === "1:1") return { w: baseShort, h: baseShort };
  if (aspect === "4:5") return { w: baseShort, h: Math.round(baseShort * 1.25) };
  if (aspect === "16:9") return { w: Math.round((baseShort * 16) / 9), h: baseShort };
  return { w: baseShort, h: Math.round((baseShort * 16) / 9) };
}

export async function renderCard(d: CardData): Promise<Blob> {
  await document.fonts?.ready;
  const aspect = d.aspect ?? "9:16";
  const res = d.resolution ?? "1080p";
  const template = d.template ?? "classic";
  const { w: W, h: H } = dimensionsFor(aspect, res);

  // Render at logical coordinate space (1080 base) and scale smoothly to target WxH
  const logicalW = aspect === "16:9" ? 1920 : 1080;
  const logicalH =
    aspect === "1:1" ? 1080 : aspect === "4:5" ? 1350 : aspect === "16:9" ? 1080 : 1920;

  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d")!;
  c.scale(W / logicalW, H / logicalH);

  // Background
  c.fillStyle = BG;
  c.fillRect(0, 0, logicalW, logicalH);

  // Single brand cyan ambient highlight
  const accentPrimary = ACCENT;
  const accentSecondary = ACCENT;

  const g1 = c.createRadialGradient(logicalW * 0.5, logicalH * 0.08, 40, logicalW * 0.5, logicalH * 0.08, logicalW * 0.6);
  g1.addColorStop(0, "rgba(0,173,255,0.06)");
  g1.addColorStop(1, "rgba(0,173,255,0)");
  c.fillStyle = g1;
  c.fillRect(0, 0, logicalW, logicalH);

  const disp = (px: number) => `900 ${px}px "Inter Tight", Inter, sans-serif`;
  const body = (px: number, w = 600) => `${w} ${px}px Inter, sans-serif`;

  const pad = 64;
  // Header
  c.fillStyle = INK;
  c.font = disp(64);
  c.textBaseline = "alphabetic";
  c.fillText("STRAFE", pad, pad + 56);

  if (d.playerName) {
    c.font = body(26, 700);
    c.fillStyle = MUTED;
    const tagStr = d.clanTag ? `[${d.clanTag}] ` : "";
    c.fillText(`${tagStr}${d.playerName}`, pad, pad + 94);
  }

  // Mode Badge
  c.font = body(26, 800);
  const badgeLabel = d.tag.toUpperCase();
  const tw = c.measureText(badgeLabel).width + 48;
  rr(c, logicalW - pad - tw, pad + 8, tw, 56, 28);
  c.fillStyle = accentPrimary;
  c.fill();
  c.fillStyle = "#03121C";
  c.fillText(badgeLabel, logicalW - pad - tw + 24, pad + 45);

  const pct = d.max > 0 ? d.total / d.max : 0;

  if (aspect === "16:9") {
    // Landscape Layout (Left Map, Right Score & Stats)
    const mx = pad,
      my = pad + 125,
      mw = 920,
      mh = logicalH - my - pad - 50;
    drawMapPlate(c, d, mx, my, mw, mh);

    const rx = mx + mw + 56;
    const rw = logicalW - rx - pad;
    c.fillStyle = ACCENT;
    c.font = disp(190);
    c.fillText(gradeFor(pct), rx, my + 165);

    c.textAlign = "right";
    c.fillStyle = INK;
    c.font = disp(110);
    c.fillText(d.total.toLocaleString(), logicalW - pad, my + 120);
    c.font = body(30, 600);
    c.fillStyle = MUTED;
    c.fillText(`/ ${d.max.toLocaleString()} pts`, logicalW - pad, my + 165);
    c.textAlign = "left";

    const stats: [string, string][] = [
      ["Accuracy", `${Math.round(pct * 100)}%`],
      ["Avg error", d.avgKm],
      ["Perfects", String(d.perfects)],
    ];
    const sw = (rw - 32) / 3;
    stats.forEach(([k, v], i) => {
      const sx = rx + i * (sw + 16);
      rr(c, sx, my + 220, sw, 150, 24);
      c.fillStyle = PLATE;
      c.fill();
      c.fillStyle = INK;
      c.font = disp(46);
      c.fillText(v, sx + 22, my + 295);
      c.fillStyle = MUTED;
      c.font = body(22, 600);
      c.fillText(k, sx + 22, my + 335);
    });

    drawRoundSquares(c, d, rx, my + 415, rw);

    c.fillStyle = accentSecondary;
    c.font = body(28, 800);
    c.fillText(`Play at ${d.url}`, rx, logicalH - pad);
  } else {
    // Vertical / Square Layout (1:1, 4:5, 9:16)
    const mapH = aspect === "1:1" ? 310 : aspect === "4:5" ? 420 : 560;
    const mx = pad,
      my = pad + 125,
      mw = logicalW - pad * 2;
    drawMapPlate(c, d, mx, my, mw, mapH);

    const scoreY = my + mapH + (aspect === "1:1" ? 150 : 210);
    c.fillStyle = ACCENT;
    c.font = disp(aspect === "1:1" ? 150 : 220);
    c.fillText(gradeFor(pct), pad, scoreY);

    c.textAlign = "right";
    c.fillStyle = INK;
    c.font = disp(aspect === "1:1" ? 96 : 130);
    c.fillText(d.total.toLocaleString(), logicalW - pad, scoreY - 40);
    c.font = body(30, 600);
    c.fillStyle = MUTED;
    const subText =
      template === "ranked" && d.rankName
        ? `${d.rankName} (${(d.rpChange ?? 0) >= 0 ? "+" : ""}${d.rpChange ?? 0} RP)`
        : `/ ${d.max.toLocaleString()} pts`;
    c.fillText(subText, logicalW - pad, scoreY + 8);
    c.textAlign = "left";

    const statsY = scoreY + (aspect === "1:1" ? 36 : 55);
    const statsH = aspect === "1:1" ? 130 : 165;
    const stats: [string, string][] = [
      ["Accuracy", `${Math.round(pct * 100)}%`],
      ["Avg error", d.avgKm],
      ["Perfects", String(d.perfects)],
    ];
    const sw = (mw - 32) / 3;
    stats.forEach(([k, v], i) => {
      const sx = pad + i * (sw + 16);
      rr(c, sx, statsY, sw, statsH, 26);
      c.fillStyle = PLATE;
      c.fill();
      c.fillStyle = INK;
      c.font = disp(aspect === "1:1" ? 44 : 54);
      c.fillText(v, sx + 24, statsY + statsH * 0.54);
      c.fillStyle = MUTED;
      c.font = body(24, 600);
      c.fillText(k, sx + 24, statsY + statsH * 0.82);
    });

    if (aspect !== "1:1") {
      drawRoundSquares(c, d, pad, statsY + statsH + 42, mw);
    }

    c.textAlign = "center";
    c.fillStyle = ACCENT;
    c.font = body(32, 800);
    c.fillText(d.url, logicalW / 2, logicalH - pad * 0.65);
    c.textAlign = "left";
  }

  return new Promise((resBlob, rej) =>
    cv.toBlob((b) => (b ? resBlob(b) : rej(new Error("render failed"))), "image/png"),
  );
}

function drawMapPlate(
  c: CanvasRenderingContext2D,
  d: CardData,
  mx: number,
  my: number,
  mw: number,
  mh: number,
) {
  rr(c, mx, my, mw, mh, 34);
  c.fillStyle = PLATE;
  c.fill();
  c.save();
  rr(c, mx, my, mw, mh, 34);
  c.clip();
  const px = (lng: number) => mx + ((lng + 180) / 360) * mw;
  const py = (lat: number) => my + ((90 - Math.max(-60, Math.min(85, lat)) - 5) / 145) * mh;
  c.strokeStyle = LINE;
  c.lineWidth = 2;
  for (let lng = -180; lng <= 180; lng += 30) {
    c.beginPath();
    c.moveTo(px(lng), my);
    c.lineTo(px(lng), my + mh);
    c.stroke();
  }
  for (let lat = -60; lat <= 85; lat += 30) {
    c.beginPath();
    c.moveTo(mx, py(lat));
    c.lineTo(mx + mw, py(lat));
    c.stroke();
  }
  d.rounds.forEach((r, i) => {
    const tx = px(r.target.lng),
      ty = py(r.target.lat);
    if (r.guess) {
      const gx = px(r.guess.lng),
        gy = py(r.guess.lat);
      c.setLineDash([12, 10]);
      c.strokeStyle = "rgba(0,173,255,0.85)";
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(gx, gy);
      c.lineTo(tx, ty);
      c.stroke();
      c.setLineDash([]);
      c.beginPath();
      c.arc(gx, gy, 10, 0, Math.PI * 2);
      c.fillStyle = "#FFFFFF";
      c.fill();
    }
    c.beginPath();
    c.arc(tx, ty, 17, 0, Math.PI * 2);
    c.fillStyle = ACCENT;
    c.fill();
    c.fillStyle = "#03121C";
    c.font = `800 19px Inter, sans-serif`;
    c.textAlign = "center";
    c.fillText(String(i + 1), tx, ty + 7);
    c.textAlign = "left";
  });
  c.restore();
}

function drawRoundSquares(
  c: CanvasRenderingContext2D,
  d: CardData,
  startX: number,
  y: number,
  availW: number,
) {
  const count = Math.max(1, d.rounds.length);
  const gap = 16;
  const sq = Math.min(108, Math.floor((availW - (count - 1) * gap) / count));
  const totalW = count * sq + (count - 1) * gap;
  d.rounds.forEach((r, i) => {
    const x = startX + (availW - totalW) / 2 + i * (sq + gap);
    rr(c, x, y, sq, sq, 22);
    c.fillStyle =
      r.points >= 4000
        ? ACCENT
        : r.points >= 2000
          ? "#2D3035"
          : r.points > 0
            ? "#222428"
            : LINE;
    c.fill();
    c.fillStyle = r.points >= 4000 ? "#03121C" : INK;
    c.font = `800 24px Inter, sans-serif`;
    c.textAlign = "center";
    c.fillText(
      r.points >= 1000 ? `${(r.points / 1000).toFixed(1)}k` : String(r.points),
      x + sq / 2,
      y + sq / 2 + 9,
    );
    c.textAlign = "left";
  });
}

/** Opens the native share sheet; falls back to a download. */
export async function shareCard(blob: Blob, filename = "strafe-result.png"): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "STRAFE result" });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "cancelled";
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return "downloaded";
}
