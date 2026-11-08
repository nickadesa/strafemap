import { Link } from "@tanstack/react-router";

export function Logo({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 text-left cursor-pointer ${className}`}
        aria-label="STRAFE home"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary">
          <span className="h-3 w-3 rounded-full border-[3px] border-[#161616]" />
        </span>
        <span className="font-display text-2xl">STRAFE</span>
      </button>
    );
  }
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="STRAFE home">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary">
        <span className="h-3 w-3 rounded-full border-[3px] border-[#161616]" />
      </span>
      <span className="font-display text-2xl">STRAFE</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
      <Logo />
    </header>
  );
}

