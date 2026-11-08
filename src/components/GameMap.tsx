import { useEffect, useRef, useState } from "react";
import type { LatLng } from "@/lib/game/engine";
import { t, type Lang } from "@/lib/i18n";
import { useResolvedMapStyle } from "@/lib/theme";
import { MapLibreAdapter } from "@/lib/map/MapLibreAdapter";
import type { MapOther, OpenFreeMapStyleId } from "@/lib/map/types";
import { Plus, Minus } from "lucide-react";

export type { MapOther };

interface Props {
  lang?: Lang;
  blind: boolean;
  guess: LatLng | null;
  guess2?: LatLng | null;
  target: LatLng | null;
  others?: MapOther[];
  circle?: { center: LatLng; radiusKm: number } | null;
  locked: boolean;
  onPick: (p: LatLng) => void;
  resetKey: string | number;
  hideZoomButtons?: boolean;
  maxZoomLimit?: number;
  countryFocusCenter?: LatLng | null;
  activeStyle?: OpenFreeMapStyleId;
}

// Backward-compatible export for any legacy references
export const TILES: Record<string, { base: string; labels: string }> = {
  dark: { base: "https://tiles.openfreemap.org/styles/dark", labels: "" },
  liberty: { base: "https://tiles.openfreemap.org/styles/liberty", labels: "" },
  positron: { base: "https://tiles.openfreemap.org/styles/positron", labels: "" },
  bright: { base: "https://tiles.openfreemap.org/styles/bright", labels: "" },
  fiord: { base: "https://tiles.openfreemap.org/styles/fiord", labels: "" },
  "3d": { base: "https://tiles.openfreemap.org/styles/3d", labels: "" },
};

export function GameMap({
  lang = "en",
  blind,
  guess,
  guess2 = null,
  target,
  others = [],
  circle,
  locked,
  onPick,
  resetKey,
  hideZoomButtons = false,
  maxZoomLimit = 12,
  countryFocusCenter = null,
  activeStyle,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const adapter = useRef<MapLibreAdapter | null>(null);
  const cb = useRef({ onPick, locked, guess });
  cb.current = { onPick, locked, guess };
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [is3DActive, setIs3DActive] = useState(false);

  const resolvedStyle = useResolvedMapStyle();
  const currentStyleId = activeStyle ?? resolvedStyle;

  // Initialize MapLibreAdapter
  useEffect(() => {
    if (!el.current) return;

    const ad = new MapLibreAdapter({
      container: el.current,
      initialStyle: currentStyleId,
      blind,
      maxZoomLimit,
      initial3D: false,
      onPick: (p) => cb.current.onPick(p),
      on3DChange: (active) => setIs3DActive(active),
      onReady: () => setStatus("ready"),
      onError: () => setStatus("error"),
    });

    adapter.current = ad;

    return () => {
      ad.destroy();
      adapter.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update Pick callback
  useEffect(() => {
    adapter.current?.setPickCallback(onPick);
  }, [onPick]);

  // Update Style when changed
  useEffect(() => {
    if (status === "ready") {
      adapter.current?.setStyle(currentStyleId);
    }
  }, [currentStyleId, status]);

  // Update Blind mode (hide/show place names & text labels)
  useEffect(() => {
    adapter.current?.setBlind(blind);
  }, [blind, status]);

  // Update Max Zoom limit (e.g. Sloth sin card)
  useEffect(() => {
    adapter.current?.setMaxZoomLimit(maxZoomLimit);
  }, [maxZoomLimit, status]);

  // Crosshair cursor when guessing
  useEffect(() => {
    const elNode = el.current;
    if (!elNode) return;
    elNode.classList.toggle("crosshair", !locked);
    adapter.current?.setLocked(locked);
  }, [locked, status]);

  // Update Player 1 guess pin
  useEffect(() => {
    adapter.current?.setGuess(guess, locked);
  }, [guess?.lat, guess?.lng, locked, status]);

  // Update Player 2 guess pin (Greed card)
  useEffect(() => {
    adapter.current?.setGuess2(guess2);
  }, [guess2?.lat, guess2?.lng, status]);

  // Update Shrink zone circle
  useEffect(() => {
    adapter.current?.setShrinkCircle(circle ?? null);
  }, [circle?.center.lat, circle?.center.lng, circle?.radiusKm, status]);

  // Reveal target, bots, and trajectories
  useEffect(() => {
    adapter.current?.setReveal(target, others, guess, guess2);
  }, [target?.lat, target?.lng, others, guess?.lat, guess?.lng, guess2?.lat, guess2?.lng, status]);

  // Reset view on new round or country focus
  useEffect(() => {
    adapter.current?.resetView(countryFocusCenter);
  }, [resetKey, countryFocusCenter?.lat, countryFocusCenter?.lng, status]);

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      <div ref={el} className="h-full w-full" />

      {/* Floating Apple Maps 3D/2D and Zoom Controls on Right */}
      {!hideZoomButtons && status === "ready" && (
        <div className="absolute right-4 bottom-18 z-20 flex flex-col items-center gap-2">
          {/* Apple 3D Toggle Capsule */}
          <button
            type="button"
            onClick={() => adapter.current?.toggle3D()}
            aria-label={is3DActive ? "Switch to 2D flat view" : "Switch to 3D perspective & globe view"}
            title={is3DActive ? "2D View" : "3D View"}
            className={`flex h-10 w-10 items-center justify-center rounded-full glass-plate shadow-lg border border-border/80 text-xs font-bold transition-all active:scale-95 ${
              is3DActive ? "bg-foreground text-background font-extrabold" : "text-foreground hover:bg-muted/80"
            }`}
          >
            {is3DActive ? "2D" : "3D"}
          </button>

          {/* Zoom In / Zoom Out Capsule */}
          <div className="flex flex-col overflow-hidden rounded-full glass-plate shadow-lg border border-border/80">
            <button
              type="button"
              onClick={() => adapter.current?.zoomIn()}
              aria-label="Zoom in"
              className="grid h-10 w-10 place-items-center text-foreground hover:bg-muted/80 active:scale-95 transition-all border-b border-border/40"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => adapter.current?.zoomOut()}
              aria-label="Zoom out"
              className="grid h-10 w-10 place-items-center text-foreground hover:bg-muted/80 active:scale-95 transition-all"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading & Error States */}
      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm z-30">
          <p className="font-semibold text-sm text-muted-foreground animate-pulse">
            {status === "loading" ? t(lang, "loadingMap") : t(lang, "mapFailed")}
          </p>
        </div>
      )}

      {/* OpenFreeMap & OSM Legal Attribution */}
      <div className="pointer-events-auto absolute bottom-1 right-2 z-10 rounded-full bg-background/60 px-2.5 py-0.5 text-[9px] text-muted-foreground/80 backdrop-blur-xs select-none">
        <a
          href="https://openfreemap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-foreground"
        >
          OpenFreeMap
        </a>{" "}
        &bull; &copy;{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-foreground"
        >
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}
