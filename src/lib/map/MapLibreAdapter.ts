import type { LatLng } from "@/lib/game/engine";
import type { IMapAdapter, MapAdapterInitOptions, MapOther, OpenFreeMapStyleId } from "./types";
import { OPENFREEMAP_STYLES } from "./styles";

/**
 * Creates a 64-vertex geodesic circle Polygon Feature in GeoJSON format.
 */
function createGeoJSONCircle(center: LatLng, radiusKm: number, points = 64) {
  const coords: [number, number][] = [];
  const distanceX = radiusKm / (111.32 * Math.cos((center.lat * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center.lng + x, center.lat + y]);
  }
  coords.push(coords[0]!);
  return {
    type: "Feature" as const,
    geometry: {
      type: "Polygon" as const,
      coordinates: [coords],
    },
    properties: {},
  };
}

export class MapLibreAdapter implements IMapAdapter {
  private ml: any = null; // maplibre-gl module
  private map: any = null; // maplibre-gl.Map
  private currentStyleId: OpenFreeMapStyleId;
  private isBlind: boolean;
  private onPick: (p: LatLng) => void;
  private isLocked = false;
  private is3D = false;
  private on3DChange?: ((is3D: boolean) => void) | undefined;
  private guessPos: LatLng | null = null;
  private guess2Pos: LatLng | null = null;
  private targetPos: LatLng | null = null;
  private othersList: MapOther[] = [];
  private shrinkCircleData: { center: LatLng; radiusKm: number } | null = null;

  // HTML Markers
  private guessMarker: any = null;
  private guess2Marker: any = null;
  private targetMarker: any = null;
  private botMarkers: any[] = [];

  constructor(opts: MapAdapterInitOptions) {
    this.currentStyleId = opts.initialStyle;
    this.isBlind = opts.blind;
    this.is3D = Boolean(opts.initial3D);
    this.onPick = opts.onPick;
    this.on3DChange = opts.on3DChange;
    this.init(opts);
  }

  private async init(opts: MapAdapterInitOptions) {
    try {
      const mod = await import("maplibre-gl");
      this.ml = mod.default ?? mod;

      const styleDef = OPENFREEMAP_STYLES[this.currentStyleId] ?? OPENFREEMAP_STYLES["apple-light"];

      const m = new this.ml.Map({
        container: opts.container,
        style: styleDef.url,
        center: [0, 20],
        zoom: 1.8,
        minZoom: 1.2,
        maxZoom: opts.maxZoomLimit ?? 12,
        bearing: 0,
        pitch: this.is3D ? 45 : 0,
        maxPitch: 50,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
      });

      // Strictly lock zoom to in/out only — prevent rotating or flipping upside down
      m.touchZoomRotate?.disableRotation();
      m.dragRotate?.disable();
      m.touchPitch?.disable();
      m.keyboard?.disableRotation();

      // Guard to enforce bearing is always North-up (0)
      m.on("rotate", () => {
        if (m.getBearing() !== 0) {
          m.setBearing(0);
        }
      });

      this.map = m;

      m.on("load", () => {
        this.applyApplePaletteOverrides();
        this.applyBlindLayers();
        this.setupGeoJSONSources();
        this.setup3DBuildingLayer();
        if (this.is3D) {
          this.apply3DState(true);
        }
        opts.onReady?.();
      });

      m.on("style.load", () => {
        this.applyApplePaletteOverrides();
        this.applyBlindLayers();
        this.setupGeoJSONSources();
        this.setup3DBuildingLayer();
        if (this.is3D) {
          this.apply3DState(true);
        }
        this.reapplyDrawings();
      });

      m.on("error", (e: any) => {
        console.warn("[MapLibre] Tile/Layer warning:", e?.error?.message || e);
      });

      m.on("click", (e: any) => {
        if (!this.isLocked) {
          const lngLat = e.lngLat.wrap();
          this.onPick({ lat: lngLat.lat, lng: lngLat.lng });
        }
      });
    } catch (err) {
      console.error("[MapLibre] Failed to initialize map:", err);
      opts.onError?.(err);
    }
  }

  private setupGeoJSONSources() {
    if (!this.map) return;

    // 1. Shrink Zone Source & Layers
    if (!this.map.getSource("shrink-zone-source")) {
      this.map.addSource("shrink-zone-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      this.map.addLayer({
        id: "shrink-zone-fill",
        type: "fill",
        source: "shrink-zone-source",
        paint: {
          "fill-color": "#D2F801",
          "fill-opacity": 0.07,
        },
      });

      this.map.addLayer({
        id: "shrink-zone-line",
        type: "line",
        source: "shrink-zone-source",
        paint: {
          "line-color": "#D2F801",
          "line-width": 1.5,
          "line-dasharray": [4, 4],
        },
      });
    }

    // 2. Trajectories Source & Layers
    if (!this.map.getSource("trajectories-source")) {
      this.map.addSource("trajectories-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      this.map.addLayer({
        id: "trajectories-player",
        type: "line",
        source: "trajectories-source",
        filter: ["==", "type", "player"],
        paint: {
          "line-color": "#D2F801",
          "line-width": 2.5,
          "line-dasharray": [2, 2],
        },
      });

      this.map.addLayer({
        id: "trajectories-player2",
        type: "line",
        source: "trajectories-source",
        filter: ["==", "type", "player2"],
        paint: {
          "line-color": "#A855F7",
          "line-width": 2.2,
          "line-dasharray": [2, 2],
        },
      });

      this.map.addLayer({
        id: "trajectories-bots",
        type: "line",
        source: "trajectories-source",
        filter: ["==", "type", "bot"],
        paint: {
          "line-color": "#FF3B5C",
          "line-width": 1.75,
          "line-dasharray": [2, 2],
        },
      });
    }
  }

  private applyApplePaletteOverrides() {
    if (!this.map) return;
    const style = this.map.getStyle();
    if (!style || !style.layers) return;

    const isAppleLight = this.currentStyleId === "apple-light";
    const isAppleDark = this.currentStyleId === "apple-dark";

    if (!isAppleLight && !isAppleDark) return;

    for (const layer of style.layers) {
      const id = layer.id;
      try {
        if (isAppleLight) {
          // Apple Maps Light Palette
          if (id === "background") {
            this.map.setPaintProperty(id, "background-color", "#F4F3F0");
          } else if (id.includes("water") && !id.includes("label")) {
            if (layer.type === "fill") {
              this.map.setPaintProperty(id, "fill-color", "#AADAFF");
            } else if (layer.type === "line") {
              this.map.setPaintProperty(id, "line-color", "#AADAFF");
            }
          } else if (id.includes("park") || id.includes("wood") || id.includes("green")) {
            if (layer.type === "fill") {
              this.map.setPaintProperty(id, "fill-color", "#DDF0DB");
              this.map.setPaintProperty(id, "fill-opacity", 0.7);
            }
          } else if (id.includes("building") && id !== "building-3d") {
            if (layer.type === "fill") {
              this.map.setPaintProperty(id, "fill-color", "#EBE9E4");
            }
          } else if (id.includes("highway") || id.includes("road")) {
            if (layer.type === "line") {
              this.map.setPaintProperty(id, "line-color", "#FFFFFF");
            }
          }
        } else if (isAppleDark) {
          // Apple Maps Dark Palette
          if (id === "background") {
            this.map.setPaintProperty(id, "background-color", "#24252B");
          } else if (id.includes("water") && !id.includes("label")) {
            if (layer.type === "fill") {
              this.map.setPaintProperty(id, "fill-color", "#192634");
            } else if (layer.type === "line") {
              this.map.setPaintProperty(id, "line-color", "#192634");
            }
          } else if (id.includes("park") || id.includes("wood") || id.includes("green")) {
            if (layer.type === "fill") {
              this.map.setPaintProperty(id, "fill-color", "#273A2B");
              this.map.setPaintProperty(id, "fill-opacity", 0.75);
            }
          } else if (id.includes("building") && id !== "building-3d") {
            if (layer.type === "fill") {
              this.map.setPaintProperty(id, "fill-color", "#2F3138");
            }
          } else if (id.includes("highway") || id.includes("road")) {
            if (layer.type === "line") {
              this.map.setPaintProperty(id, "line-color", "#3B3D45");
            }
          }
        }
      } catch {}
    }
  }

  private setup3DBuildingLayer() {
    if (!this.map) return;
    if (this.map.getLayer("building-3d")) return;

    const isDark = this.currentStyleId === "apple-dark" || this.currentStyleId === "dark" || this.currentStyleId === "fiord";
    const buildingColor = isDark ? "#2C2E35" : "#E2DFD9";

    // Add fill-extrusion layer if source "openmaptiles" exists
    if (this.map.getSource("openmaptiles")) {
      try {
        this.map.addLayer({
          id: "building-3d",
          type: "fill-extrusion",
          source: "openmaptiles",
          "source-layer": "building",
          minzoom: 13,
          paint: {
            "fill-extrusion-color": buildingColor,
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              13,
              0,
              14.5,
              ["coalesce", ["get", "render_height"], ["get", "height"], 15],
            ],
            "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], ["get", "min_height"], 0],
            "fill-extrusion-opacity": this.is3D ? 0.88 : 0,
          },
        });
      } catch (err) {
        console.warn("[MapLibre] Could not create building-3d layer:", err);
      }
    }
  }

  private apply3DState(enabled: boolean) {
    if (!this.map) return;

    if (this.map.getLayer("building-3d")) {
      this.map.setPaintProperty("building-3d", "fill-extrusion-opacity", enabled ? 0.88 : 0);
    }

    try {
      if (enabled) {
        this.map.setProjection({ type: "globe" });
      } else {
        this.map.setProjection({ type: "mercator" });
      }
    } catch {}
  }

  private applyBlindLayers() {
    if (!this.map) return;
    const style = this.map.getStyle();
    if (!style || !style.layers) return;

    const visibility = this.isBlind ? "none" : "visible";
    for (const layer of style.layers) {
      if (layer.type === "symbol") {
        try {
          this.map.setLayoutProperty(layer.id, "visibility", visibility);
        } catch {}
      }
    }
  }

  private reapplyDrawings() {
    this.updateShrinkCircleSource();
    this.updateTrajectoriesSource();
  }

  private updateShrinkCircleSource() {
    if (!this.map) return;
    const source = this.map.getSource("shrink-zone-source");
    if (!source) return;

    if (!this.shrinkCircleData) {
      source.setData({ type: "FeatureCollection", features: [] });
    } else {
      const circleFeature = createGeoJSONCircle(
        this.shrinkCircleData.center,
        this.shrinkCircleData.radiusKm,
      );
      source.setData({ type: "FeatureCollection", features: [circleFeature] });
    }
  }

  private updateTrajectoriesSource() {
    if (!this.map) return;
    const source = this.map.getSource("trajectories-source");
    if (!source) return;

    if (!this.targetPos) {
      source.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    const features: any[] = [];
    const targetCoord = [this.targetPos.lng, this.targetPos.lat];

    // Player 1 line
    if (this.guessPos) {
      features.push({
        type: "Feature",
        properties: { type: "player" },
        geometry: {
          type: "LineString",
          coordinates: [[this.guessPos.lng, this.guessPos.lat], targetCoord],
        },
      });
    }

    // Player 2 line (Greed)
    if (this.guess2Pos) {
      features.push({
        type: "Feature",
        properties: { type: "player2" },
        geometry: {
          type: "LineString",
          coordinates: [[this.guess2Pos.lng, this.guess2Pos.lat], targetCoord],
        },
      });
    }

    // Bots lines
    for (const bot of this.othersList) {
      features.push({
        type: "Feature",
        properties: { type: "bot" },
        geometry: {
          type: "LineString",
          coordinates: [[bot.lng, bot.lat], targetCoord],
        },
      });
    }

    source.setData({ type: "FeatureCollection", features });
  }

  public async setStyle(styleId: OpenFreeMapStyleId): Promise<void> {
    if (!this.map || !this.ml) return;
    if (this.currentStyleId === styleId) return;

    this.currentStyleId = styleId;
    const styleDef = OPENFREEMAP_STYLES[styleId] ?? OPENFREEMAP_STYLES["apple-light"];

    // Save camera before switching style
    const center = this.map.getCenter();
    const zoom = this.map.getZoom();
    const pitch = this.is3D ? 45 : 0;

    this.map.setMaxPitch(50);
    this.map.dragRotate?.disable();
    this.map.touchPitch?.disable();
    this.map.touchZoomRotate?.disableRotation();
    this.map.keyboard?.disableRotation();

    // Change style URL without destroying map instance
    this.map.setStyle(styleDef.url);

    this.map.once("style.load", () => {
      this.map.jumpTo({ center, zoom, bearing: 0, pitch });
      this.applyApplePaletteOverrides();
      this.applyBlindLayers();
      this.setupGeoJSONSources();
      this.setup3DBuildingLayer();
      this.apply3DState(this.is3D);
      this.reapplyDrawings();
    });
  }

  public toggle3D(): boolean {
    const next = !this.is3D;
    this.set3D(next);
    return next;
  }

  public set3D(enabled: boolean): void {
    this.is3D = enabled;
    if (!this.map) return;

    this.apply3DState(enabled);

    this.map.easeTo({
      pitch: enabled ? 45 : 0,
      bearing: 0,
      duration: 600,
    });

    this.on3DChange?.(enabled);
  }

  public getIs3D(): boolean {
    return this.is3D;
  }

  public setBlind(blind: boolean): void {
    if (this.isBlind === blind) return;
    this.isBlind = blind;
    this.applyBlindLayers();
  }

  public setMaxZoomLimit(limit: number): void {
    if (!this.map) return;
    this.map.setMaxZoom(limit);
    if (this.map.getZoom() > limit) {
      this.map.setZoom(limit);
    }
  }

  public setPickCallback(cb: (p: LatLng) => void): void {
    this.onPick = cb;
  }

  public setLocked(locked: boolean): void {
    this.isLocked = locked;
    if (this.guessMarker) {
      this.guessMarker.setDraggable(!locked);
    }
  }

  public setGuess(p: LatLng | null, locked: boolean): void {
    this.guessPos = p;
    this.isLocked = locked;
    if (!this.map || !this.ml) return;

    if (!p) {
      if (this.guessMarker) {
        this.guessMarker.remove();
        this.guessMarker = null;
      }
      return;
    }

    if (!this.guessMarker) {
      const el = document.createElement("div");
      el.className = "pin-wrap";
      el.innerHTML = '<span class="pin pin-guess pin-drop"></span>';

      this.guessMarker = new this.ml.Marker({
        element: el,
        draggable: !locked,
        anchor: "center",
      })
        .setLngLat([p.lng, p.lat])
        .addTo(this.map);

      this.guessMarker.on("dragend", () => {
        const lngLat = this.guessMarker.getLngLat().wrap();
        this.onPick({ lat: lngLat.lat, lng: lngLat.lng });
      });
    } else {
      this.guessMarker.setLngLat([p.lng, p.lat]);
      this.guessMarker.setDraggable(!locked);

      const pinEl = this.guessMarker.getElement()?.firstElementChild;
      if (pinEl && !locked) {
        pinEl.classList.remove("pin-drop");
        void (pinEl as HTMLElement).offsetWidth;
        pinEl.classList.add("pin-drop");
      }
    }
  }

  public setGuess2(p: LatLng | null): void {
    this.guess2Pos = p;
    if (!this.map || !this.ml) return;

    if (!p) {
      if (this.guess2Marker) {
        this.guess2Marker.remove();
        this.guess2Marker = null;
      }
      return;
    }

    if (!this.guess2Marker) {
      const el = document.createElement("div");
      el.className = "pin-wrap flex flex-col items-center";
      el.innerHTML = `
        <span class="bot-label mb-1 -mt-5 pointer-events-none select-none">2nd Pin</span>
        <span class="pin pin-guess-2 pin-drop"></span>
      `;

      this.guess2Marker = new this.ml.Marker({
        element: el,
        draggable: false,
        anchor: "bottom",
      })
        .setLngLat([p.lng, p.lat])
        .addTo(this.map);
    } else {
      this.guess2Marker.setLngLat([p.lng, p.lat]);
    }
  }

  public setShrinkCircle(circle: { center: LatLng; radiusKm: number } | null): void {
    this.shrinkCircleData = circle;
    this.updateShrinkCircleSource();
  }

  public setReveal(
    target: LatLng | null,
    others: MapOther[],
    guess: LatLng | null,
    guess2: LatLng | null,
  ): void {
    this.targetPos = target;
    this.othersList = others;
    this.guessPos = guess;
    this.guess2Pos = guess2;

    if (!this.map || !this.ml) return;

    // Clear previous bot markers
    this.botMarkers.forEach((m) => m.remove());
    this.botMarkers = [];

    // Clear target marker
    if (this.targetMarker) {
      this.targetMarker.remove();
      this.targetMarker = null;
    }

    if (!target) {
      this.updateTrajectoriesSource();
      return;
    }

    // Add target marker
    const targetEl = document.createElement("div");
    targetEl.className = "pin-wrap";
    targetEl.innerHTML = '<span class="pin pin-target pin-drop" style="width:24px;height:24px;"></span>';

    this.targetMarker = new this.ml.Marker({
      element: targetEl,
      anchor: "center",
    })
      .setLngLat([target.lng, target.lat])
      .addTo(this.map);

    // Add bot markers
    for (const bot of others) {
      const bEl = document.createElement("div");
      bEl.className = "pin-wrap flex flex-col items-center";
      bEl.innerHTML = `
        <span class="bot-label mb-1 -mt-5 pointer-events-none select-none">${bot.label}</span>
        <span class="pin pin-bot" style="width:15px;height:15px;"></span>
      `;

      const bMarker = new this.ml.Marker({
        element: bEl,
        anchor: "bottom",
      })
        .setLngLat([bot.lng, bot.lat])
        .addTo(this.map);

      this.botMarkers.push(bMarker);
    }

    // Draw trajectory lines
    this.updateTrajectoriesSource();

    // Fit bounds across all pins
    const points: [number, number][] = [[target.lng, target.lat]];
    if (guess) points.push([guess.lng, guess.lat]);
    if (guess2) points.push([guess2.lng, guess2.lat]);
    for (const o of others) points.push([o.lng, o.lat]);

    if (points.length > 1) {
      const bounds = new this.ml.LngLatBounds(points[0], points[0]);
      for (const pt of points) bounds.extend(pt);
      this.map.fitBounds(bounds, {
        padding: { top: 70, bottom: 70, left: 60, right: 60 },
        maxZoom: 7,
        duration: 900,
      });
    } else {
      this.map.flyTo({ center: [target.lng, target.lat], zoom: 5, duration: 800 });
    }
  }

  public resetView(countryFocusCenter?: LatLng | null): void {
    if (!this.map || !this.ml) return;

    if (countryFocusCenter) {
      const d = 11;
      const bounds = new this.ml.LngLatBounds(
        [countryFocusCenter.lng - d * 1.3, countryFocusCenter.lat - d],
        [countryFocusCenter.lng + d * 1.3, countryFocusCenter.lat + d],
      );
      this.map.fitBounds(bounds, { maxZoom: 5, duration: 600 });
    } else {
      this.map.flyTo({
        center: [0, 20],
        zoom: 1.8,
        pitch: 0,
        bearing: 0,
        duration: 800,
      });
    }
  }

  public zoomIn(): void {
    this.map?.zoomIn();
  }

  public zoomOut(): void {
    this.map?.zoomOut();
  }

  public destroy(): void {
    this.botMarkers.forEach((m) => m.remove());
    this.botMarkers = [];
    this.guessMarker?.remove();
    this.guess2Marker?.remove();
    this.targetMarker?.remove();
    this.map?.remove();
    this.map = null;
    this.ml = null;
  }
}
