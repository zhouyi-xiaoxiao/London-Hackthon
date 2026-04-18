"use client";

import { useEffect, useRef } from "react";
import { validateMapboxToken, LONDON_CENTER } from "@/lib/services/mapService";
import { cn } from "@/lib/utils";
import type { NarrativeMode } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const HAS_MAPBOX = validateMapboxToken(MAPBOX_TOKEN);

interface Props {
  lat: number;
  lng: number;
  title: string;
  mode: NarrativeMode;
}

export function MiniMap({ lat, lng, title, mode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  const markerColor =
    mode === "punk" ? "#ff2d55" : mode === "fashion" ? "#e8e8e0" : "#00f5d4";

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (HAS_MAPBOX) {
      import("mapbox-gl").then(({ default: mapboxgl }) => {
        mapboxgl.accessToken = MAPBOX_TOKEN!;
        const map = new mapboxgl.Map({
          container: containerRef.current!,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [lng, lat],
          zoom: 14,
          interactive: false,
          attributionControl: false,
        });

        const el = document.createElement("div");
        el.style.cssText = `width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${markerColor};box-shadow:0 0 10px ${markerColor}80`;
        new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
        mapRef.current = map;
      });
    } else {
      import("leaflet").then((L) => {
        if (!containerRef.current) return;
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }
        // Clear Leaflet's internal marker so StrictMode double-mount doesn't crash
        const container = containerRef.current as HTMLDivElement & { _leaflet_id?: number };
        delete container._leaflet_id;

        const map = L.default.map(containerRef.current, {
          center: [lat, lng],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          keyboard: false,
          boxZoom: false,
        });
        L.default.tileLayer(
          "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        ).addTo(map);

        const icon = L.default.divIcon({
          html: `<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${markerColor};box-shadow:0 0 10px ${markerColor}80"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 16],
          className: "",
        });
        L.default.marker([lat, lng], { icon }).addTo(map);
        mapRef.current = map;
      });
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, markerColor]);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-48" />
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
      <div className="absolute bottom-2 left-2 font-mono text-[9px] text-chalk/30 pointer-events-none">
        {lat.toFixed(4)}° N · {Math.abs(lng).toFixed(4)}° W
      </div>
    </div>
  );
}
