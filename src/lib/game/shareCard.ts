// Renders a 1080x1920 Instagram Story result card on a canvas.
export interface CardRound { name: string; points: number; km: number | null; guess: { lat: number; lng: number } | null; target: { lat: number; lng: number } }
export interface CardData { mode: string; tag: string; total: number; max: number; avgKm: string; perfects: number; rounds: CardRound[]; url: string }

const LIME = "#b9ff24", BG = "#0f0f10", PLATE = "#1b1c1e", LINE = "#27282b", MUTED = "#8a8f98", INK = "#f4f4f5";

export function gradeFor(pct: number) {
  return pct >= 0.9 ? "S" : pct >= 0.75 ? "A" : pct >= 0.55 ? "B" : pct >= 0.35 ? "C" : "D";
}

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath(); c.roundRect(x, y, w, h, r);
}

export async function renderCard(d: CardData): Promise<Blob> {
  await document.fonts?.ready;
  const W = 1080, H = 1920;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const c = cv.getContext("2d")!;
  c.fillStyle = BG; c.fillRect(0, 0, W, H);
  // glow
  const g = c.createRadialGradient(W / 2, 760, 50, W / 2, 760, 700);
  g.addColorStop(0, "rgba(185,255,36,0.18)"); g.addColorStop(1, "rgba(185,255,36,0)");
  c.fillStyle = g; c.fillRect(0, 0, W, H);

  const disp = (px: number) => `900 ${px}px "Inter Tight", Inter, sans-serif`;
  const body = (px: number, w = 600) => `${w} ${px}px Inter, sans-serif`;

  // header
  c.fillStyle = INK; c.font = disp(84); c.textBaseline = "alphabetic"; c.fillText("STRAFE", 80, 180);
  c.font = body(30, 700); const tag = d.tag.toUpperCase(); const tw = c.measureText(tag).width + 56;
  rr(c, W - 80 - tw, 122, tw, 68, 34); c.fillStyle = LIME; c.fill();
  c.fillStyle = "#000"; c.fillText(tag, W - 80 - tw + 28, 168);

  // map plate
  const mx = 80, my = 260, mw = W - 160, mh = 560;
  rr(c, mx, my, mw, mh, 40); c.fillStyle = PLATE; c.fill();
  c.save(); rr(c, mx, my, mw, mh, 40); c.clip();
  const px = (lng: number) => mx + ((lng + 180) / 360) * mw;
  const py = (lat: number) => my + ((90 - Math.max(-60, Math.min(85, lat)) - 5) / 145) * mh;
  c.strokeStyle = LINE; c.lineWidth = 2;
  for (let lng = -180; lng <= 180; lng += 30) { c.beginPath(); c.moveTo(px(lng), my); c.lineTo(px(lng), my + mh); c.stroke(); }
  for (let lat = -60; lat <= 85; lat += 30) { c.beginPath(); c.moveTo(mx, py(lat)); c.lineTo(mx + mw, py(lat)); c.stroke(); }
  d.rounds.forEach((r, i) => {
    const tx = px(r.target.lng), ty = py(r.target.lat);
    if (r.guess) {
      const gx = px(r.guess.lng), gy = py(r.guess.lat);
      c.setLineDash([14, 12]); c.strokeStyle = LIME; c.lineWidth = 5; c.shadowColor = LIME; c.shadowBlur = 18;
      c.beginPath(); c.moveTo(gx, gy); c.lineTo(tx, ty); c.stroke(); c.setLineDash([]); c.shadowBlur = 0;
      c.beginPath(); c.arc(gx, gy, 12, 0, Math.PI * 2); c.fillStyle = INK; c.fill();
    }
    c.beginPath(); c.arc(tx, ty, 20, 0, Math.PI * 2); c.fillStyle = LIME; c.fill();
    c.fillStyle = "#000"; c.font = body(22, 800); c.textAlign = "center"; c.fillText(String(i + 1), tx, ty + 8); c.textAlign = "left";
  });
  c.restore();

  // grade + score
  const pct = d.total / d.max;
  c.fillStyle = LIME; c.font = disp(300); c.fillText(gradeFor(pct), 70, 1150);
  c.font = body(34, 700); c.fillStyle = MUTED; c.fillText("RANK", 80, 1210);
  c.textAlign = "right"; c.fillStyle = INK; c.font = disp(150); c.fillText(d.total.toLocaleString(), W - 80, 1080);
  c.font = body(36, 600); c.fillStyle = MUTED; c.fillText(`/ ${d.max.toLocaleString()} pts`, W - 80, 1140); c.textAlign = "left";

  // stats row
  const stats: [string, string][] = [["Accuracy", `${Math.round(pct * 100)}%`], ["Avg error", d.avgKm], ["Perfect", String(d.perfects)]];
  const sw = (W - 160 - 40) / 3;
  stats.forEach(([k, v], i) => {
    const x = 80 + i * (sw + 20);
    rr(c, x, 1270, sw, 190, 32); c.fillStyle = PLATE; c.fill();
    c.fillStyle = INK; c.font = disp(64); c.fillText(v, x + 32, 1370);
    c.fillStyle = MUTED; c.font = body(28, 600); c.fillText(k, x + 32, 1420);
  });

  // round squares
  const sq = 120, gap = 24, total = d.rounds.length * sq + (d.rounds.length - 1) * gap;
  d.rounds.forEach((r, i) => {
    const x = (W - total) / 2 + i * (sq + gap);
    rr(c, x, 1520, sq, sq, 28);
    c.fillStyle = r.points >= 4000 ? LIME : r.points >= 2000 ? "rgba(185,255,36,0.55)" : r.points > 0 ? "rgba(185,255,36,0.22)" : LINE; c.fill();
    c.fillStyle = r.points >= 2000 ? "#000" : INK; c.font = body(30, 800); c.textAlign = "center";
    c.fillText(r.points >= 1000 ? `${(r.points / 1000).toFixed(1)}k` : String(r.points), x + sq / 2, 1520 + sq / 2 + 11); c.textAlign = "left";
  });

  // footer
  c.textAlign = "center"; c.fillStyle = MUTED; c.font = body(32, 600);
  c.fillText("Can you beat me? Play at", W / 2, 1760);
  c.fillStyle = LIME; c.font = body(40, 800); c.fillText(d.url, W / 2, 1815); c.textAlign = "left";

  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error("render failed"))), "image/png"));
}

/** Opens the native share sheet (Instagram on phones); falls back to a download. */
export async function shareCard(blob: Blob): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], "strafe-result.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title: "STRAFE result" }); return "shared"; }
    catch (e) { if ((e as Error).name === "AbortError") return "cancelled"; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return "downloaded";
}
