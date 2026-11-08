import { useEffect, useRef, useState } from "react";
import type * as LT from "leaflet";
import type { LatLng } from "@/lib/game/engine";
import { t, type Lang } from "@/lib/i18n";
import { useResolvedMapStyle } from "@/lib/theme";

export interface MapOther extends LatLng {
  label: string;
}

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
}

const ATTR = "&copy; CARTO &mdash; Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors";
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
const CARTO = "https://{s}.basemaps.cartocdn.com/rastertiles";
const CK = "?key=cb1_4ipy_1_ad1c7d1170897e7a7e147800";
export const TILES = {
  light: {
    base: `${ESRI}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: `${ESRI}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
  },
  dark: {
    base: `${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: `${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
  },
  voyager: {
    base: `${CARTO}/voyager_nolabels/{z}/{x}/{y}{r}.png${CK}`,
    labels: `${CARTO}/voyager_only_labels/{z}/{x}/{y}{r}.png${CK}`,
  },
  positron: {
    base: `${CARTO}/light_nolabels/{z}/{x}/{y}{r}.png${CK}`,
    labels: `${CARTO}/light_only_labels/{z}/{x}/{y}{r}.png${CK}`,
  },
  darkmatter: {
    base: `${CARTO}/dark_nolabels/{z}/{x}/{y}{r}.png${CK}`,
    labels: `${CARTO}/dark_only_labels/{z}/{x}/{y}{r}.png${CK}`,
  },
  satellite: {
    base: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labels: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  },
} as const;

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
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const L = useRef<typeof LT | null>(null);
  const map = useRef<LT.Map | null>(null);
  const tiles = useRef<LT.LayerGroup | null>(null);
  const guessM = useRef<LT.Marker | null>(null);
  const guess2M = useRef<LT.Marker | null>(null);
  const reveal = useRef<LT.LayerGroup | null>(null);
  const circleL = useRef<LT.Circle | null>(null);
  const cb = useRef({ onPick, locked, guess });
  cb.current = { onPick, locked, guess };
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [tileErr, setTileErr] = useState(false);
  const mapStyle = useResolvedMapStyle();

  useEffect(() => {
    let dead = false;
    import("leaflet")
      .then((mod) => {
        if (dead || !el.current) return;
        const Lf = (mod as any).default ?? mod;
        L.current = Lf;
        const m = Lf.map(el.current, {
          worldCopyJump: true,
          minZoom: 2,
          maxZoom: maxZoomLimit,
          zoomControl: true,
          zoomSnap: 0.1,
          zoomDelta: 0.35,
          wheelPxPerZoomLevel: 140,
          wheelDebounceTime: 0,
          inertia: true,
          inertiaDeceleration: 1800,
          easeLinearity: 0.15,
          zoomAnimation: true,
          fadeAnimation: false,
          markerZoomAnimation: true,
          tapTolerance: 15,
          preferCanvas: false,
        }).setView([20, 0], 2);
        m.attributionControl.setPrefix(false);
        m.zoomControl.setPosition("bottomright");
        m.on("click", (e: LT.LeafletMouseEvent) => {
          if (!cb.current.locked) cb.current.onPick({ lat: e.latlng.lat, lng: e.latlng.wrap().lng });
        });
        reveal.current = Lf.layerGroup().addTo(m);
        map.current = m;
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    return () => {
      dead = true;
      map.current?.remove();
      map.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep maxZoom updated when Sloth sin card or mode changes
  useEffect(() => {
    if (!map.current) return;
    map.current.setMaxZoom(maxZoomLimit);
    if (map.current.getZoom() > maxZoomLimit) {
      map.current.setZoom(maxZoomLimit);
    }
  }, [maxZoomLimit, status]);

  // tiles (labelled vs. label-free style)
  useEffect(() => {
    const Lf = L.current,
      m = map.current;
    if (!Lf || !m) return;
    tiles.current?.remove();
    setTileErr(false);
    let errs = 0;
    const onErr = () => {
      if (++errs > 6) setTileErr(true);
    };
    const g = Lf.layerGroup().addTo(m);
    Lf.tileLayer(TILES[mapStyle].base, { attribution: ATTR, maxZoom: 16 }).on("tileerror", onErr).addTo(g);
    // Blind Map / Hardcore / Find the City uses the label-free base style only
    if (!blind) {
      Lf.tileLayer(TILES[mapStyle].labels, { maxZoom: 16, pane: "overlayPane" }).on("tileerror", onErr).addTo(g);
    }
    tiles.current = g;
  }, [blind, status, mapStyle]);

  // crosshair cursor when actively guessing
  useEffect(() => {
    const elNode = el.current;
    if (!elNode) return;
    elNode.classList.toggle("crosshair", !locked);
  }, [locked, status]);

  // reset view each round (or lock to target country in Find the City mode)
  useEffect(() => {
    const Lf = L.current,
      m = map.current;
    if (!Lf || !m) return;
    if (countryFocusCenter) {
      const d = 11;
      const bounds = Lf.latLngBounds(
        [countryFocusCenter.lat - d, countryFocusCenter.lng - d * 1.3],
        [countryFocusCenter.lat + d, countryFocusCenter.lng + d * 1.3],
      );
      m.setMaxBounds(bounds.pad(0.35));
      m.fitBounds(bounds, { maxZoom: 5 });
    } else {
      m.setMaxBounds(undefined as any);
      m.setView([20, 0], 2);
    }
  }, [resetKey, status, countryFocusCenter?.lat, countryFocusCenter?.lng]);

  // Primary guess marker (#D2F801 Lime)
  useEffect(() => {
    const Lf = L.current,
      m = map.current;
    if (!Lf || !m) return;
    if (!guess) {
      guessM.current?.remove();
      guessM.current = null;
      return;
    }
    if (!guessM.current) {
      guessM.current = Lf.marker([guess.lat, guess.lng], {
        draggable: !locked,
        icon: Lf.divIcon({
          className: "pin-wrap",
          html: '<span class="pin pin-guess pin-drop"></span>',
          iconSize: [18, 18],
        }),
      }).addTo(m);
      guessM.current.on("dragend", (e: any) => {
        const p = e.target.getLatLng().wrap();
        cb.current.onPick({ lat: p.lat, lng: p.lng });
        setTimeout(() => {
          const g = cb.current.guess;
          if (g) guessM.current?.setLatLng([g.lat, g.lng]);
        }, 0);
      });
    } else {
      guessM.current.setLatLng([guess.lat, guess.lng]);
      const n = guessM.current.getElement()?.firstElementChild as HTMLElement | null;
      if (n && !locked) {
        n.classList.remove("pin-drop");
        void n.offsetWidth;
        n.classList.add("pin-drop");
      }
    }
    locked ? guessM.current.dragging?.disable() : guessM.current.dragging?.enable();
  }, [guess, locked, status]);

  // Secondary backup guess marker (Greed Sin Card)
  useEffect(() => {
    const Lf = L.current,
      m = map.current;
    if (!Lf || !m) return;
    if (!guess2) {
      guess2M.current?.remove();
      guess2M.current = null;
      return;
    }
    if (!guess2M.current) {
      guess2M.current = Lf.marker([guess2.lat, guess2.lng], {
        interactive: false,
        icon: Lf.divIcon({
          className: "pin-wrap",
          html: '<span class="pin pin-guess-2 pin-drop"></span>',
          iconSize: [18, 18],
        }),
      })
        .bindTooltip("2nd Pin", { permanent: true, direction: "top", className: "bot-label", offset: [0, -8] })
        .addTo(m);
    } else {
      guess2M.current.setLatLng([guess2.lat, guess2.lng]);
    }
  }, [guess2, status]);

  // shrink zone
  useEffect(() => {
    const Lf = L.current,
      m = map.current;
    if (!Lf || !m) return;
    if (!circle) {
      circleL.current?.remove();
      circleL.current = null;
      return;
    }
    if (!circleL.current) {
      circleL.current = Lf.circle([circle.center.lat, circle.center.lng], {
        radius: circle.radiusKm * 1000,
        color: "#D2F801",
        weight: 1.5,
        dashArray: "4 6",
        fillColor: "#D2F801",
        fillOpacity: 0.07,
        interactive: false,
      }).addTo(m);
    } else {
      circleL.current.setLatLng([circle.center.lat, circle.center.lng]);
      circleL.current.setRadius(circle.radiusKm * 1000);
    }
  }, [circle?.center.lat, circle?.center.lng, circle?.radiusKm, status]);

  // reveal: show opponent/bot pins + animated dashed trajectory from player's pin to target (#D2F801)
  useEffect(() => {
    const Lf = L.current,
      m = map.current,
      g = reveal.current;
    if (!Lf || !m || !g) return;
    g.clearLayers();
    if (!target) return;
    m.setMaxBounds(undefined as any);
    const pts: LT.LatLngExpression[] = [[target.lat, target.lng]];
    for (const o of others) {
      Lf.polyline([[o.lat, o.lng], [target.lat, target.lng]], {
        color: "#FF3B5C",
        weight: 1.75,
        dashArray: "4 6",
      }).addTo(g);
      Lf.marker([o.lat, o.lng], {
        icon: Lf.divIcon({ className: "pin pin-bot", iconSize: [15, 15] }),
        interactive: false,
      })
        .bindTooltip(o.label, { permanent: true, direction: "top", className: "bot-label", offset: [0, -8] })
        .addTo(g);
      pts.push([o.lat, o.lng]);
    }
    if (guess) {
      Lf.polyline([[guess.lat, guess.lng], [target.lat, target.lng]], {
        color: "#D2F801",
        weight: 2.5,
        dashArray: "6 6",
        className: "trajectory-line",
      }).addTo(g);
      pts.push([guess.lat, guess.lng]);
    }
    if (guess2) {
      Lf.polyline([[guess2.lat, guess2.lng], [target.lat, target.lng]], {
        color: "#A855F7",
        weight: 2.2,
        dashArray: "6 6",
        className: "trajectory-line",
      }).addTo(g);
      pts.push([guess2.lat, guess2.lng]);
    }
    Lf.marker([target.lat, target.lng], {
      icon: Lf.divIcon({ className: "pin pin-target", iconSize: [24, 24] }),
      zIndexOffset: 1000,
    }).addTo(g);
    if (pts.length > 1) m.fitBounds(Lf.latLngBounds(pts as any), { padding: [60, 60], maxZoom: 7 });
    else m.setView([target.lat, target.lng], 5);
  }, [target, status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative h-full w-full ${hideZoomButtons ? "hide-zoom-controls" : ""}`}>
      <div ref={el} className="h-full w-full" />
      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center bg-background">
          <p className="font-semibold text-muted-foreground">
            {status === "loading" ? t(lang, "loadingMap") : t(lang, "mapFailed")}
          </p>
        </div>
      )}
      {tileErr && (
        <div className="plate absolute left-1/2 top-3 z-[500] -translate-x-1/2 px-4 py-2 text-sm font-semibold text-destructive">
          {t(lang, "tilesFailed")}
        </div>
      )}
    </div>
  );
}
