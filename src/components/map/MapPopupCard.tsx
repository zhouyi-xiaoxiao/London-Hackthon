"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MapMarkerData } from "@/lib/types";

interface Props {
  marker: MapMarkerData;
  onClose: () => void;
}

export function MapPopupCard({ marker, onClose }: Props) {
  const modeColor =
    marker.mode === "punk"
      ? "text-magenta border-magenta"
      : marker.mode === "fashion"
      ? "text-chalk border-chalk"
      : "text-neon border-neon";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      className="relative bg-ash border border-chalk/10 w-72 shadow-2xl shadow-void overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={marker.imageUrl}
          alt={marker.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ash to-transparent" />
        <div className="absolute inset-0 scanline opacity-30" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 bg-void/80 text-chalk/50 hover:text-chalk text-xs flex items-center justify-center"
        >
          ✕
        </button>

        {/* Mode badge */}
        <div className="absolute top-2 left-2">
          <span className={cn("font-mono text-[9px] uppercase tracking-widest border px-1.5 py-0.5 bg-void/80", modeColor)}>
            {marker.mode}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-mono text-[10px] text-chalk/40 uppercase tracking-widest mb-1">
          {marker.locationName}
        </p>
        <h3 className="font-condensed text-xl font-bold text-chalk uppercase mb-2 leading-tight">
          {marker.title}
        </h3>

        {/* Tags */}
        {marker.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {marker.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="font-mono text-[9px] text-chalk/40 border border-chalk/10 px-1.5 py-0.5 uppercase">
                {tag}
              </span>
            ))}
            {marker.emotion && (
              <span className={cn("font-mono text-[9px] border px-1.5 py-0.5 uppercase", modeColor)}>
                {marker.emotion}
              </span>
            )}
          </div>
        )}

        <Link
          href={`/story/${marker.slug}`}
          className="block w-full text-center font-mono text-xs uppercase tracking-widest border border-chalk/20 py-2 text-chalk/60 hover:border-neon hover:text-neon transition-all"
        >
          Read Story →
        </Link>
      </div>
    </motion.div>
  );
}
