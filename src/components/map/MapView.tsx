"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MapPopupCard } from "./MapPopupCard";
import { useMapData } from "./useMapData";
import { validateMapboxToken, LONDON_CENTER } from "@/lib/services/mapService";
import type { MapMarkerData } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const HAS_MAPBOX = validateMapboxToken(MAPBOX_TOKEN);

export function MapView() {
  const { markers, loading } = useMapData();
  const [selected, setSelected] = useState<MapMarkerData | null>(null);

  if (HAS_MAPBOX) {
    return <MapboxMapView markers={markers} selected={selected} onSelect={setSelected} />;
  }
  return <LeafletMapView markers={markers} selected={selected} onSelect={setSelected} />;
}

// ── Mapbox implementation ─────────────────────────────────────────────────────
function MapboxMapView({
  markers,
  selected,
  onSelect,
}: {
  markers: MapMarkerData[];
  selected: MapMarkerData | null;
  onSelect: (m: MapMarkerData | null) => void;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current) return;

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      if (mapRef.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN!;

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [LONDON_CENTER.lng, LONDON_CENTER.lat],
        zoom: 11.5,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on("load", () => {
        // Route line (connecting markers in order)
        if (markers.length > 1) {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: markers.map((m) => [m.coordinates.lng, m.coordinates.lat]),
              },
              properties: {},
            },
          });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#00f5d4",
              "line-width": 1.5,
              "line-opacity": 0.4,
              "line-dasharray": [4, 4],
            },
          });
        }

        // Add markers
        markers.forEach((marker) => {
          const el = document.createElement("div");
          el.className = "lc-marker";
          const color =
            marker.mode === "punk" ? "#ff2d55" : marker.mode === "fashion" ? "#e8e8e0" : "#00f5d4";
          el.style.background = color;
          el.style.boxShadow = `0 0 12px ${color}80`;

          const inner = document.createElement("div");
          inner.className = "lc-marker-inner";
          el.appendChild(inner);

          el.addEventListener("click", () => onSelect(marker));

          const m = new mapboxgl.Marker({ element: el })
            .setLngLat([marker.coordinates.lng, marker.coordinates.lat])
            .addTo(map);

          markersRef.current.push(m);
        });
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [markers, onSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <PopupOverlay selected={selected} onClose={() => onSelect(null)} />
    </div>
  );
}

// ── Leaflet fallback ──────────────────────────────────────────────────────────
function LeafletMapView({
  markers,
  selected,
  onSelect,
}: {
  markers: MapMarkerData[];
  selected: MapMarkerData | null;
  onSelect: (m: MapMarkerData | null) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || leafletMap.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      // Clear Leaflet's internal marker to prevent StrictMode "already initialized" error
      const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number };
      delete container._leaflet_id;

      const map = L.default.map(mapRef.current, {
        center: [LONDON_CENTER.lat, LONDON_CENTER.lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.default.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        { maxZoom: 18 }
      ).addTo(map);

      leafletMap.current = map;

      if (markers.length > 1) {
        L.default.polyline(
          markers.map((m) => [m.coordinates.lat, m.coordinates.lng]),
          { color: "#00f5d4", weight: 1.5, opacity: 0.4, dashArray: "6 6" }
        ).addTo(map);
      }

      markers.forEach((marker) => {
        const color =
          marker.mode === "punk" ? "#ff2d55" : marker.mode === "fashion" ? "#e8e8e0" : "#00f5d4";

        const icon = L.default.divIcon({
          html: `<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};box-shadow:0 0 10px ${color}80;position:relative"><div style="width:8px;height:8px;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#080808"></div></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 20],
          className: "",
        });

        L.default.marker([marker.coordinates.lat, marker.coordinates.lng], { icon })
          .addTo(map)
          .on("click", () => onSelect(marker));
      });
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [markers, onSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <PopupOverlay selected={selected} onClose={() => onSelect(null)} />
    </div>
  );
}

// ── Shared popup ──────────────────────────────────────────────────────────────
function PopupOverlay({
  selected,
  onClose,
}: {
  selected: MapMarkerData | null;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <AnimatePresence>
        {selected && (
          <div className="pointer-events-auto">
            <MapPopupCard marker={selected} onClose={onClose} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
