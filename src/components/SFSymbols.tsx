import React from "react";

export interface SymbolProps extends Omit<React.SVGProps<SVGSVGElement>, "fill"> {
  fill?: boolean;
  className?: string;
  size?: number | string;
}

/**
 * Apple SF Symbols Web Component Suite
 * Follows Apple Human Interface Guidelines:
 * - Optical alignment with San Francisco / Inter
 * - Hierarchical depth rendering (100% foreground + 30% secondary layers)
 * - Outline on inactive, .fill on active
 * - Micro-spring bounce interaction
 */

// house / house.fill
export function SymbolHouse({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M11.29 2.47a1 1 0 0 1 1.42 0l8 7.5a1 1 0 0 1 .31.73V20a2 2 0 0 1-2 2h-4.5a1 1 0 0 1-1-1v-5.5a1.5 1.5 0 0 0-3 0V21a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-9.3a1 1 0 0 1 .31-.73l8-7.5Z" />
      <path d="M12 4.2 5 10.76V20h3.5v-4.5a3.5 3.5 0 0 1 7 0V20H19v-9.24L12 4.2Z" className="opacity-30" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v11a1.5 1.5 0 0 0 1.5 1.5H10v-5a2 2 0 0 1 4 0v5h3.5a1.5 1.5 0 0 0 1.5-1.5V9" />
    </svg>
  );
}

// gamecontroller / gamecontroller.fill
export function SymbolGameController({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M6 5h12a6 6 0 0 1 5.92 5.04l.95 6.02a3 3 0 0 1-3.64 3.39l-4.1-.91a4 4 0 0 0-1.74 0l-4.1.91a3 3 0 0 1-3.65-3.39l.96-6.02A6 6 0 0 1 6 5Z" />
      <g fill="#161616" className="dark:fill-[#161616]">
        <path d="M9 10h-1v-1a.75.75 0 0 0-1.5 0v1h-1a.75.75 0 0 0 0 1.5h1v1a.75.75 0 0 0 1.5 0v-1h1a.75.75 0 0 0 0-1.5Z" />
        <circle cx="16" cy="11.5" r=".9" />
        <circle cx="17.5" cy="10" r=".9" />
        <circle cx="17.5" cy="13" r=".9" />
        <circle cx="19" cy="11.5" r=".9" />
      </g>
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M6 12h4M8 10v4" />
      <circle cx="15.5" cy="11" r=".6" fill="currentColor" />
      <circle cx="17.5" cy="13" r=".6" fill="currentColor" />
    </svg>
  );
}

// trophy / trophy.fill
export function SymbolTrophy({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M5 3h14a1 1 0 0 1 1 1v3.5a5.5 5.5 0 0 1-4.8 5.45A6.02 6.02 0 0 1 13 16.92V19h3a1 1 0 0 1 1 1v1H7v-1a1 1 0 0 1 1-1h3v-2.08a6.02 6.02 0 0 1-2.2-3.97A5.5 5.5 0 0 1 4 7.5V4a1 1 0 0 1 1-1Zm-1 2v2.5a3.5 3.5 0 0 0 3 3.46V5H4Zm16 0h-3v5.96a3.5 3.5 0 0 0 3-3.46V5Z" />
      <path d="M7 5h10v3a5 5 0 0 1-10 0V5Z" className="opacity-30" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4Z" />
      <path d="M6 6H3a2 2 0 0 0 2 3.5M18 6h3a2 2 0 0 1-2 3.5" />
      <path d="M12 14v4M8 21h8M10 18h4" />
    </svg>
  );
}

// person.2 / person.2.fill
export function SymbolPerson2({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M8.5 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM16.5 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      <path d="M8.5 12c-4 0-7 2.2-7 5.25V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.75C15.5 14.2 12.5 12 8.5 12Z" />
      <path d="M16 12.5c2.8.3 5.5 2 5.5 4.75V19a1 1 0 0 1-1 1h-3v-1.75c0-2-1.3-3.6-3.2-4.4 1-.2 1.8-.3 2.7-.35Z" className="opacity-40" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M2 19a7 7 0 0 1 14 0" />
      <path d="M16 3.5a3.5 3.5 0 0 1 0 7M22 19a6 6 0 0 0-6-6" />
    </svg>
  );
}

// safari / safari.fill (Compass)
export function SymbolCompass({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="15.8,8.2 13.5,13.5 8.2,15.8 10.5,10.5" fill="#161616" className="dark:fill-[#161616]" />
      <polygon points="15.8,8.2 12,12 10.5,10.5" fill="#D2F801" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

// medal / medal.fill (Award)
export function SymbolMedal({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <circle cx="12" cy="14.5" r="6.5" />
      <circle cx="12" cy="14.5" r="4.2" className="opacity-30" />
      <path d="M7.5 2.5 10 9l-4.5 1-1-6.5a1 1 0 0 1 1-1.2h2ZM16.5 2.5 14 9l4.5 1 1-6.5a1 1 0 0 0-1-1.2h-2Z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="14.5" r="6.5" />
      <path d="M8.21 2.5 12 9.5l3.79-7M5.5 3.5l4 7M18.5 3.5l-4 7" />
    </svg>
  );
}

// chart.bar.xaxis / chart.bar.xaxis.fill
export function SymbolChartBar({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M2.5 20.5h19a1 1 0 0 0 0-2H2.5a1 1 0 0 0 0 2ZM5 17h3a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1ZM10.5 17h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1ZM16 17h3a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1Z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 20h18M6 20v-7M12 20V4M18 20v-10" />
    </svg>
  );
}

// gearshape / gearshape.fill
export function SymbolGearshape({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8.94 3.16-1.5-.26a7.9 7.9 0 0 0-.64-1.54l.9-1.23a1 1 0 0 0-.15-1.33l-1.68-1.68a1 1 0 0 0-1.33-.15l-1.23.9a7.9 7.9 0 0 0-1.54-.64l-.26-1.5A1 1 0 0 0 12.52 2h-2.38a1 1 0 0 0-.99.83l-.26 1.5a7.9 7.9 0 0 0-1.54.64l-1.23-.9a1 1 0 0 0-1.33.15L3.11 5.9a1 1 0 0 0-.15 1.33l.9 1.23a7.9 7.9 0 0 0-.64 1.54l-1.5.26A1 1 0 0 0 1 11.25v2.38a1 1 0 0 0 .83.99l1.5.26c.16.54.38 1.06.64 1.54l-.9 1.23a1 1 0 0 0 .15 1.33l1.68 1.68a1 1 0 0 0 1.33.15l1.23-.9c.48.26 1 .48 1.54.64l.26 1.5a1 1 0 0 0 .99.83h2.38a1 1 0 0 0 .99-.83l.26-1.5a7.9 7.9 0 0 0 1.54-.64l1.23.9a1 1 0 0 0 1.33-.15l1.68-1.68a1 1 0 0 0 .15-1.33l-.9-1.23c.26-.48.48-1 .64-1.54l1.5-.26a1 1 0 0 0 .83-.99v-2.38a1 1 0 0 0-.83-.99Z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

// bell / bell.fill
export function SymbolBell({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M12 2a1.75 1.75 0 0 0-1.74 1.55c-.01.12-.01.24-.01.37v.2A7.03 7.03 0 0 0 5 11v4.25L3.4 17.13A1 1 0 0 0 4.18 19h15.64a1 1 0 0 0 .78-1.87L19 15.25V11a7.03 7.03 0 0 0-5.25-6.88v-.2c0-.13 0-.25-.01-.37A1.75 1.75 0 0 0 12 2Z" />
      <path d="M9.5 20a2.5 2.5 0 0 0 5 0h-5Z" className="opacity-40" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// flame / flame.fill
export function SymbolFlame({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M12 2c.8 2.6 3.4 4.8 4.6 7.8 1.4 3.5.7 7.7-1.8 10.3A8.6 8.6 0 0 1 4 15.2C4 11 7 8 8.8 5.6c.3 1.8 1.5 3.2 3.2 3.8.3-2.6 0-5.2 0-7.4Z" />
      <path d="M12 14c-1.5 0-2.8 1.2-2.8 2.8 0 1.5 1.2 2.8 2.8 2.8s2.8-1.2 2.8-2.8c0-1.5-1.2-2.8-2.8-2.8Z" className="opacity-40" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  );
}

// shield / shield.fill
export function SymbolShield({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M12 2.2a1 1 0 0 1 .4.08l8 3.5a1 1 0 0 1 .6.92v5.3c0 6.1-4.2 10.2-8.6 11.9a1 1 0 0 1-.8 0C7.2 22.1 3 18 3 12V6.7a1 1 0 0 1 .6-.92l8-3.5a1 1 0 0 1 .4-.08Z" />
      <path d="M12 4.3 5 7.4V12c0 4.8 3.3 8.3 7 9.8 3.7-1.5 7-5 7-9.8V7.4L12 4.3Z" className="opacity-30" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// bag / bag.fill
export function SymbolBag({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M6 7V6a6 6 0 1 1 12 0v1h1.5A2.5 2.5 0 0 1 22 9.5v9a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 2 18.5v-9A2.5 2.5 0 0 1 4.5 7H6Zm2 0h8V6a4 4 0 1 0-8 0v1Z" />
      <path d="M4 11v7.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V11H4Z" className="opacity-30" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// sparkles
export function SymbolSparkles({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M12 2c.4 3 2.5 5.5 5.5 6-3 .5-5.1 3-5.5 6-.4-3-2.5-5.5-5.5-6 3-.5 5.1-3 5.5-6ZM19 14c.2 1.5 1.3 2.7 2.8 3-1.5.3-2.6 1.5-2.8 3-.2-1.5-1.3-2.7-2.8-3 1.5-.3 2.6-1.5 2.8-3ZM5 14c.2 1.5 1.3 2.7 2.8 3-1.5.3-2.6 1.5-2.8 3-.2-1.5-1.3-2.7-2.8-3 1.5-.3 2.6-1.5 2.8-3Z" />
    </svg>
  );
}

// xmark / xmark.circle.fill
export function SymbolCross({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// line.3.horizontal (Menu)
export function SymbolMenu({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

// checkmark / checkmark.circle.fill
export function SymbolCheckmark({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12 2.5 2.5 5-5" stroke="#161616" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// slider.horizontal.3
export function SymbolSliders({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

// arrow.right.square / arrow.right
export function SymbolArrowRight({ className = "h-4 w-4", size, fill: _fill, ...props }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// person.crop.circle / person.crop.circle.fill
export function SymbolPerson({ fill = false, className = "h-5 w-5", size, ...props }: SymbolProps) {
  return fill ? (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="9.5" r="3" fill="#161616" className="dark:fill-[#161616]" />
      <path d="M12 14c-3.3 0-6.1 1.8-7.3 4.4A9.9 9.9 0 0 0 12 22a9.9 9.9 0 0 0 7.3-3.6c-1.2-2.6-4-4.4-7.3-4.4Z" fill="#161616" className="dark:fill-[#161616]" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="9" r="3" />
      <path d="M6.2 18.5c1.4-2.5 3.3-3.5 5.8-3.5s4.4 1 5.8 3.5" />
    </svg>
  );
}

// rectangle.portrait.and.arrow.right (LogOut)
export function SymbolLogOut({ className = "h-4 w-4", size, fill: _fill, ...props }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

// arrow.left
export function SymbolArrowLeft({ className = "h-4 w-4", size, fill: _fill, ...props }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
