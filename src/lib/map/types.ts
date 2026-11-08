import type { LatLng } from "@/lib/game/engine";

export type OpenFreeMapStyleId =
  | "dark"
  | "liberty"
  | "positron"
  | "bright"
  | "fiord"
  | "3d";

export interface MapOther extends LatLng {
  label: string;
}

export interface MapStyleOption {
  id: OpenFreeMapStyleId;
  name: string;
  nameTh: string;
  url: string;
  accent: string;
  gradient: string;
  description: string;
  descriptionTh: string;
  is3D?: boolean;
}

export interface MapAdapterInitOptions {
  container: HTMLElement;
  initialStyle: OpenFreeMapStyleId;
  blind: boolean;
  maxZoomLimit?: number;
  onPick: (p: LatLng) => void;
  onReady?: () => void;
  onError?: (err: unknown) => void;
}

export interface IMapAdapter {
  setStyle(styleId: OpenFreeMapStyleId): Promise<void>;
  setBlind(blind: boolean): void;
  setMaxZoomLimit(limit: number): void;
  setPickCallback(cb: (p: LatLng) => void): void;
  setLocked(locked: boolean): void;
  setGuess(p: LatLng | null, locked: boolean): void;
  setGuess2(p: LatLng | null): void;
  setShrinkCircle(circle: { center: LatLng; radiusKm: number } | null): void;
  setReveal(
    target: LatLng | null,
    others: MapOther[],
    guess: LatLng | null,
    guess2: LatLng | null,
  ): void;
  resetView(countryFocusCenter?: LatLng | null): void;
  zoomIn(): void;
  zoomOut(): void;
  destroy(): void;
}
