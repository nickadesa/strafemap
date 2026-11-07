import { useState } from "react";
import { FRAME_AVATAR, getRank } from "@/lib/rank";

export interface RankBannerProps {
  rp?: number | undefined;
  championPosition?: number | null | undefined;
  bannerUrl?: string | undefined;
  width?: number | undefined;
  className?: string | undefined;
  alt?: string | undefined;
  loadingPosition?: boolean | undefined;
}

/**
 * Displays a STRAFE Rank Banner SVG (294×323 native aspect ratio).
 * Division Roman numerals or Champion #1..50 numbers are baked into the SVG.
 */
export function RankBanner({
  rp = 0,
  championPosition = null,
  bannerUrl,
  width = 140,
  className = "",
  alt,
  loadingPosition = false,
}: RankBannerProps) {
  const step = getRank(rp, championPosition, { loadingPosition });
  const src = bannerUrl ?? step.bannerUrl;
  const height = Math.round(width * (323 / 294));

  return (
    <div
      className={`relative inline-flex shrink-0 select-none items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <img
        src={src}
        alt={alt ?? step.name}
        width={width}
        height={height}
        className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.38)]"
        draggable={false}
      />
    </div>
  );
}

export interface AvatarFrameProps {
  src?: string | null | undefined;
  name?: string | undefined;
  rp?: number | undefined;
  championPosition?: number | null | undefined;
  frameUrl?: string | undefined;
  size?: number | undefined;
  className?: string | undefined;
  loadingPosition?: boolean | undefined;
}

/**
 * Places the circular player avatar UNDER the rank frame SVG (400×368).
 * Avatar diameter = width * 0.408, centered at X = 50%, Y = 46.7%.
 */
export function AvatarFrame({
  src,
  name = "Player",
  rp = 0,
  championPosition = null,
  frameUrl,
  size = 64,
  className = "",
  loadingPosition = false,
}: AvatarFrameProps) {
  const [imgErr, setImgErr] = useState(false);
  const step = getRank(rp, championPosition, { loadingPosition });
  const resolvedFrame = frameUrl ?? step.frameUrl;

  const width = size;
  const height = Math.round(size * (368 / 400));
  const avatarDiameter = width * FRAME_AVATAR.sizeRatioOfWidth;
  const centerX = `${FRAME_AVATAR.centerXRatio * 100}%`;
  const centerY = `${FRAME_AVATAR.centerYRatio * 100}%`;
  const initial = (name?.trim()?.[0] ?? "S").toUpperCase();

  return (
    <div
      className={`relative inline-block shrink-0 select-none ${className}`}
      style={{ width, height }}
    >
      {/* Avatar circle UNDER the frame (z-index 1) */}
      <div
        className=" absolute z-[1] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#1E1E20] text-white"
        style={{
          width: avatarDiameter,
          height: avatarDiameter,
          left: centerX,
          top: centerY,
        }}
      >
        {src && !imgErr ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgErr(true)}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center font-display font-bold"
            style={{
              background: "linear-gradient(135deg, #0367FC 0%, #161616 100%)",
              color: "#D2F801",
              fontSize: Math.max(10, Math.round(avatarDiameter * 0.46)),
            }}
          >
            {initial}
          </div>
        )}
      </div>

      {/* Rank frame SVG OVER the avatar (z-index 2) */}
      <img
        src={resolvedFrame}
        alt={`${step.name} frame`}
        width={width}
        height={height}
        className="pointer-events-none relative z-[2] block h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
}

export type VerifiedBadgeType = "gold" | "rainbow" | "green" | "red" | "none";

export function VerifiedBadge({
  type = "gold",
  size = 16,
  className = "",
}: {
  type?: VerifiedBadgeType | undefined;
  size?: number | undefined;
  className?: string | undefined;
}) {
  if (type === "none") return null;

  const gradId = `vb-${type}-${Math.random().toString(36).slice(2, 7)}`;
  const titles: Record<Exclude<VerifiedBadgeType, "none">, string> = {
    gold: "Verified Premium",
    rainbow: "Exclusive Founder Verified",
    green: "Verified Map Creator",
    red: "STRAFE Official Admin",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center align-middle ${className}`}
      title={titles[type]}
      aria-label={titles[type]}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          {type === "rainbow" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0367FC" />
              <stop offset="28%" stopColor="#00E5FF" />
              <stop offset="55%" stopColor="#D2F801" />
              <stop offset="80%" stopColor="#FF2E93" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          )}
          {type === "gold" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#FFC82A" />
              <stop offset="100%" stopColor="#E09F00" />
            </linearGradient>
          )}
          {type === "green" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2F801" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          )}
          {type === "red" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D6D" />
              <stop offset="100%" stopColor="#DC1F30" />
            </linearGradient>
          )}
        </defs>
        <path
          d="M12 2L14.8 4.5L18.5 4.1L19.6 7.6L22.8 9.5L21.9 13.1L23.5 16.5L20.6 18.9L20.1 22.6L16.4 22.9L13.8 25.5L10.6 23.6L7 24.5L5.3 21.2L1.7 20.1L2.1 16.4L0 13.3L2.4 10.5L1.9 6.8L5.5 5.9L7.4 2.7L11 3.8L12 2Z"
          transform="scale(0.92) translate(1, 0.5)"
          fill={`url(#${gradId})`}
        />
        <path
          d="M8.5 12.5L10.8 14.8L15.8 9.5"
          stroke={type === "gold" || type === "green" ? "#161616" : "#FFFFFF"}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ClanTagPill({
  tag,
  color = "#0367FC",
  className = "",
}: {
  tag?: string | null | undefined;
  color?: string | undefined;
  className?: string | undefined;
}) {
  if (!tag) return null;
  const isLime = color.toUpperCase() === "#D2F801" || color.toUpperCase() === "#FFC82A";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase leading-none ${className}`}
      style={{
        backgroundColor: color,
        color: isLime ? "#161616" : "#FFFFFF",
      }}
    >
      [{tag}]
    </span>
  );
}
