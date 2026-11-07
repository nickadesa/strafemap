import React, { useId } from "react";
import { haptic } from "@/lib/game/sound";

interface ActivityRingProps {
  label: string;
  value: number; // Current value (e.g. 4)
  target: number; // Target value (e.g. 5)
  unit?: string;
  color: string;
  radius: number;
  strokeWidth: number;
}

export function ActivityRings({
  rounds = 4,
  roundsTarget = 5,
  accuracy = 84,
  streak = 7,
  streakTarget = 10,
  size = 220,
}: {
  rounds?: number;
  roundsTarget?: number;
  accuracy?: number; // 0-100
  streak?: number;
  streakTarget?: number;
  size?: number;
}) {
  const center = size / 2;
  const strokeWidth = 14;
  const gap = 5;

  const rings: ActivityRingProps[] = [
    {
      label: "Rounds Pinned",
      value: rounds,
      target: roundsTarget,
      unit: "rds",
      color: "#D2F801", // Acid Lime
      radius: center - strokeWidth / 2 - 4,
      strokeWidth,
    },
    {
      label: "Accuracy Rate",
      value: accuracy,
      target: 100,
      unit: "%",
      color: "#06B6D4", // Cyan
      radius: center - strokeWidth / 2 - 4 - strokeWidth - gap,
      strokeWidth,
    },
    {
      label: "Daily Streak",
      value: streak,
      target: streakTarget,
      unit: "days",
      color: "#FF7A00", // Warm Orange
      radius: center - strokeWidth / 2 - 4 - (strokeWidth + gap) * 2,
      strokeWidth,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Concentric SVG Rings */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {rings.map((ring, idx) => {
            const circumference = 2 * Math.PI * ring.radius;
            const pct = Math.min(1, Math.max(0, ring.value / ring.target));
            const dashOffset = circumference * (1 - pct);

            return (
              <g key={idx}>
                {/* Track Background */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeOpacity={0.15}
                />
                {/* Active Progress Bar with Rounded Caps */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              </g>
            );
          })}
        </svg>

        {/* Center Target Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
            {Math.round(((rounds / roundsTarget + accuracy / 100 + streak / streakTarget) / 3) * 100)}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Daily Goal
          </span>
        </div>
      </div>

      {/* Rings Legend List */}
      <div className="flex-1 w-full space-y-3">
        {rings.map((r, i) => {
          const pct = Math.round((r.value / r.target) * 100);
          return (
            <div
              key={i}
              onClick={() => haptic(8)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-card/60 transition-colors hover:border-border cursor-default"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: r.color }}
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">{r.label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {r.value} / {r.target} {r.unit}
                  </p>
                </div>
              </div>
              <span
                className="font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded-md"
                style={{
                  color: r.color,
                  backgroundColor: `${r.color}15`,
                }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface RadarDataPoint {
  metric: string;
  score: number; // 0 - 100
}

export function CartographerRadar({
  data = [
    { metric: "Precision", score: 88 },
    { metric: "Velocity", score: 76 },
    { metric: "Global Reach", score: 92 },
    { metric: "Capitals", score: 85 },
    { metric: "Consistency", score: 80 },
  ],
  size = 240,
}: {
  data?: RadarDataPoint[];
  size?: number;
}) {
  const svgId = useId();
  const center = size / 2;
  const radius = center - 36;
  const count = data.length;

  const getCoordinates = (index: number, scorePct: number) => {
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2;
    const r = radius * scorePct;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Polygon points string for the filled score area
  const scorePoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.score / 100);
      return `${x},${y}`;
    })
    .join(" ");

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <radialGradient id={`radar-grad-${svgId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D2F801" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#D2F801" stopOpacity="0.10" />
            </radialGradient>
          </defs>

          {/* Web Background Polygons */}
          {levels.map((lvl, lIdx) => {
            const pts = data
              .map((_, i) => {
                const { x, y } = getCoordinates(i, lvl);
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={lIdx}
                points={pts}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={1}
              />
            );
          })}

          {/* Spokes from Center */}
          {data.map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.15}
                strokeWidth={1}
              />
            );
          })}

          {/* User Score Polygon */}
          <polygon
            points={scorePoints}
            fill={`url(#radar-grad-${svgId})`}
            stroke="#D2F801"
            strokeWidth={2}
            className="transition-all duration-500 ease-out"
          />

          {/* Score Vertex Dots */}
          {data.map((d, i) => {
            const { x, y } = getCoordinates(i, d.score / 100);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3.5}
                fill="#D2F801"
                stroke="#161616"
                strokeWidth={1.5}
              />
            );
          })}
        </svg>

        {/* Metric Labels positioned around the radar */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, 1.22);
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
              style={{ left: x, top: y }}
            >
              <span className="block text-[11px] font-semibold text-foreground whitespace-nowrap">
                {d.metric}
              </span>
              <span className="block font-mono text-[10px] text-[#D2F801] font-bold tabular-nums">
                {d.score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
