import React, { useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * TiltCard — Transitions.dev 19-card-tilt
 * Tilts in 3D perspective toward the pointer with a smooth glare reflection.
 * Outer element tracks pointer coordinates so card edges don't trigger hover flicker.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const outer = outerRef.current;
    const card = cardRef.current;
    if (!outer || !card) return;

    const rect = outer.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

    outer.classList.add("is-hover");
    card.classList.add("is-tilting");

    const ry = ((px - 0.5) * maxTilt).toFixed(2);
    const rx = ((0.5 - py) * maxTilt).toFixed(2);
    const gx = (px * 100).toFixed(1);
    const gy = (py * 100).toFixed(1);

    card.style.setProperty("--tilt-ry", `${ry}deg`);
    card.style.setProperty("--tilt-rx", `${rx}deg`);
    card.style.setProperty("--tilt-gx", `${gx}%`);
    card.style.setProperty("--tilt-gy", `${gy}%`);
  };

  const handleReset = () => {
    const outer = outerRef.current;
    const card = cardRef.current;
    if (!outer || !card) return;

    outer.classList.remove("is-hover");
    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
  };

  return (
    <div
      ref={outerRef}
      className={`t-tilt ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handleReset}
      onPointerUp={handleReset}
      onPointerCancel={handleReset}
    >
      <div ref={cardRef} className="t-tilt-card h-full w-full">
        {children}
        <div className="t-tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
