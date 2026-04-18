"use client";

import dynamic from "next/dynamic";
import { useMapData } from "@/components/map/useMapData";
import { cn } from "@/lib/utils";

// Dynamic import avoids SSR issues with mapbox-gl / leaflet
const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-ash flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="font-mono text-xs text-neon uppercase tracking-widest">
          Loading Atlas...
        </p>
      </div>
    </div>
  );
}

export default function MapPage() {
  const { markers, loading } = useMapData();

  return (
    <div className="h-screen bg-void pt-14 flex flex-col">
      {/* Header bar */}
      <div className="flex-none border-b border-chalk/5 px-6 py-4 flex items-center justify-between bg-void/90 backdrop-blur-sm">
        <div>
          <p className="font-mono text-xs text-neon tracking-[0.3em] uppercase">
            London Story Atlas
          </p>
          <h1 className="font-condensed text-2xl font-black uppercase text-chalk">
            {loading ? "Loading..." : `${markers.length} Cuts on the Map`}
          </h1>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { mode: "punk", color: "bg-magenta", label: "Punk" },
            { mode: "fashion", color: "bg-chalk", label: "Fashion" },
            { mode: "cinema", color: "bg-neon", label: "Cinema" },
          ].map((item) => (
            <div key={item.mode} className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", item.color)} />
              <span className="font-mono text-xs text-chalk/40 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="font-mono text-xs text-chalk/20 hidden md:block">
          51.5074° N · 0.1278° W
        </div>
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 relative">
        <MapView />

        {/* Corner scan line overlay */}
        <div className="absolute inset-0 pointer-events-none scanline opacity-20" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-vignette" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,8,8,0.5) 100%)"
        }} />

        {/* Coordinates watermark */}
        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-chalk/15 pointer-events-none">
          <div>LONDON CUTS / ATLAS VIEW</div>
          <div>© OpenStreetMap contributors</div>
        </div>

        {/* Token warning */}
        {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
          <div className="absolute top-4 right-4 bg-ash/90 border border-gold/30 px-4 py-2 pointer-events-none">
            <p className="font-mono text-[10px] text-gold uppercase tracking-widest">
              Using OSM tiles · Add NEXT_PUBLIC_MAPBOX_TOKEN for Mapbox
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
