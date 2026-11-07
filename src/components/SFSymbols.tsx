import React from "react";

export interface SymbolProps extends Omit<React.SVGProps<SVGSVGElement>, "fill"> {
  fill?: boolean;
  className?: string;
  size?: number | string;
}

/**
 * Apple SF Symbols Web Component Suite
 * Unified, consistent vector geometry (no jumping or distorting on active state)
 */

// house
export function SymbolHouse({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v11a1.5 1.5 0 0 0 1.5 1.5H10v-5a2 2 0 0 1 4 0v5h3.5a1.5 1.5 0 0 0 1.5-1.5V9" />
    </svg>
  );
}

// gamecontroller
export function SymbolGameController({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M6 12h4M8 10v4" />
      <circle cx="15.5" cy="11" r=".75" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="13" r=".75" fill="currentColor" stroke="none" />
    </svg>
  );
}

// trophy
export function SymbolTrophy({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4Z" />
      <path d="M6 6H3a2 2 0 0 0 2 3.5M18 6h3a2 2 0 0 1-2 3.5" />
      <path d="M12 14v4M8 21h8M10 18h4" />
    </svg>
  );
}

// person.2
export function SymbolPerson2({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <circle cx="9" cy="7" r="4" />
      <path d="M2 19a7 7 0 0 1 14 0" />
      <path d="M16 3.5a3.5 3.5 0 0 1 0 7M22 19a6 6 0 0 0-6-6" />
    </svg>
  );
}

// safari / Compass
export function SymbolCompass({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

// medal
export function SymbolMedal({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <circle cx="12" cy="14.5" r="6.5" />
      <path d="M8.21 2.5 12 9.5l3.79-7M5.5 3.5l4 7M18.5 3.5l-4 7" />
    </svg>
  );
}

// chart.bar.xaxis
export function SymbolChartBar({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <path d="M3 20h18M6 20v-7M12 20V4M18 20v-10" />
    </svg>
  );
}

// gearshape
export function SymbolGearshape({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

// bell
export function SymbolBell({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// flame
export function SymbolFlame({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  );
}

// shield
export function SymbolShield({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// bag
export function SymbolBag({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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

// xmark (Cross)
export function SymbolCross({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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

// checkmark
export function SymbolCheckmark({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
  return (
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

// arrow.right
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

// person.crop.circle
export function SymbolPerson({ className = "h-5 w-5", size, fill: _fill, ...props }: SymbolProps) {
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
