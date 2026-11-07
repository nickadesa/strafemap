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
 * Displays a clean circular player avatar icon or uploaded profile picture.
 */
export function AvatarFrame({
  src,
  name = "Player",
  size = 40,
  className = "",
}: AvatarFrameProps) {
  const [imgErr, setImgErr] = useState(false);
  const initial = (name?.trim()?.[0] ?? "S").toUpperCase();

  return (
    <div
      className={`relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border bg-[#1E1E20] text-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {src && !imgErr ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgErr(true)}
          className="h-full w-full aspect-square object-cover object-center"
          draggable={false}
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center font-display font-bold bg-[#1C1D1F] text-[#D2F801]"
          style={{
            fontSize: Math.max(10, Math.round(size * 0.44)),
          }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

export type VerifiedBadgeType =
  | "gold"
  | "rainbow"
  | "green"
  | "red"
  | "blue"
  | "purple"
  | "diamond"
  | "vip"
  | "bot"
  | "fire"
  | "og"
  | "moderator"
  | "champion"
  | "lightning"
  | "none";

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
    blue: "Verified Partner / Pro",
    purple: "STRAFE Staff & Developer",
    diamond: "Grand Meridian Top 50 Champion",
    vip: "VIP Patron & Supporter",
    bot: "Verified AI Cartographer",
    fire: "Hot Streak Master",
    og: "Alpha Pioneer (OG Cartographer)",
    moderator: "Guardian Moderator",
    champion: "Season Champion",
    lightning: "Speedrun Ace",
  };

  const sealPath =
    "M12 2L14.8 4.5L18.5 4.1L19.6 7.6L22.8 9.5L21.9 13.1L23.5 16.5L20.6 18.9L20.1 22.6L16.4 22.9L13.8 25.5L10.6 23.6L7 24.5L5.3 21.2L1.7 20.1L2.1 16.4L0 13.3L2.4 10.5L1.9 6.8L5.5 5.9L7.4 2.7L11 3.8L12 2Z";

  return (
    <span
      className={`inline-flex shrink-0 select-none items-center justify-center align-middle pointer-events-none ${className}`}
      title={titles[type]}
      aria-label={titles[type]}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="pointer-events-none">
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
          {type === "blue" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          )}
          {type === "purple" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          )}
          {type === "diamond" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#BAE6FD" />
              <stop offset="70%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          )}
          {type === "vip" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          )}
          {type === "bot" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          )}
          {type === "fire" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          )}
          {type === "og" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          )}
          {type === "moderator" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          )}
          {type === "champion" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          )}
          {type === "lightning" && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          )}
        </defs>

        {type === "diamond" ? (
          <>
            <polygon points="12,2 21,9 12,22 3,9" fill={`url(#${gradId})`} />
            <polygon points="12,2 17,9 12,22 7,9" fill="#FFFFFF" fillOpacity="0.25" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
          </>
        ) : type === "fire" ? (
          <>
            <path
              d="M12 2C10.5 4.5 11 7 9 9C7 11 6 13 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 12.5 16 10.5 15.5 8C14.5 10 13 10.5 13 8C13 5.5 15 4 12 2Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M12 11C11 12.5 11.5 14 10.5 15C9.5 16 9 17 9 18C9 19.7 10.3 21 12 21C13.7 21 15 19.7 15 18C15 16.5 14 15.5 13.5 14C13 15 12.5 15 12.5 13.5C12.5 12 13 11 12 11Z"
              fill="#FEF08A"
            />
          </>
        ) : type === "lightning" ? (
          <>
            <circle cx="12" cy="12" r="10" fill="#1C1917" stroke={`url(#${gradId})`} strokeWidth="1.5" />
            <polygon points="13,3 6,13 11.5,13 10.5,21 18,10 12.5,10" fill={`url(#${gradId})`} />
          </>
        ) : type === "champion" ? (
          <>
            <circle cx="12" cy="12" r="10" fill={`url(#${gradId})`} />
            <path
              d="M6 16L7 10L10 13L12 8L14 13L17 10L18 16H6Z"
              fill="#161616"
            />
          </>
        ) : type === "moderator" ? (
          <>
            <path
              d="M12 2L4 5V11C4 16.5 7.4 21.6 12 22.8C16.6 21.6 20 16.5 20 11V5L12 2Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M8.5 12L10.8 14.3L15.5 9.5"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : type === "bot" ? (
          <>
            <rect x="3" y="4" width="18" height="15" rx="4" fill={`url(#${gradId})`} />
            <circle cx="8.5" cy="11.5" r="1.8" fill="#161616" />
            <circle cx="15.5" cy="11.5" r="1.8" fill="#161616" />
            <line x1="8" y1="15.5" x2="16" y2="15.5" stroke="#161616" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="1" x2="12" y2="4" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" />
          </>
        ) : type === "og" ? (
          <>
            <circle cx="12" cy="12" r="10" fill={`url(#${gradId})`} />
            <text
              x="12"
              y="15.5"
              textAnchor="middle"
              fontSize="9"
              fontWeight="900"
              fontFamily="sans-serif"
              fill="#161616"
              letterSpacing="-0.5px"
            >
              OG
            </text>
          </>
        ) : type === "vip" ? (
          <>
            <circle cx="12" cy="12" r="10" fill={`url(#${gradId})`} />
            <text
              x="12"
              y="15.5"
              textAnchor="middle"
              fontSize="8"
              fontWeight="900"
              fontFamily="sans-serif"
              fill="#FFFFFF"
              letterSpacing="-0.5px"
            >
              VIP
            </text>
          </>
        ) : (
          <>
            <path
              d={sealPath}
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
          </>
        )}
      </svg>
    </span>
  );
}

export function ClanTagPill({
  tag,
  color = "#D2F801",
  className = "",
}: {
  tag?: string | null | undefined;
  color?: string | undefined;
  className?: string | undefined;
}) {
  if (!tag) return null;
  const isLime = color.toUpperCase() === "#D2F801" || color.toUpperCase() === "#FFC82A" || color.toUpperCase() === "#B9FF24";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase leading-none ${className}`}
      style={{
        backgroundColor: color,
        color: isLime ? "#161616" : "#FFFFFF",
      }}
    >
      {tag}
    </span>
  );
}
