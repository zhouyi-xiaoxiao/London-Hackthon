"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn, formatDate, modeAccentClass } from "@/lib/utils";
import type { GeneratedStory } from "@/lib/types";

interface Props {
  story: GeneratedStory;
}

export function PostcardPreview({ story }: Props) {
  const [side, setSide] = useState<"front" | "back">("front");
  const cardRef = useRef<HTMLDivElement>(null);

  const modeColor = modeAccentClass(story.mode);

  const handleExport = async () => {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current!, {
        scale: 2,
        backgroundColor: "#080808",
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `london-cuts-${story.slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Export failed — try right-clicking the postcard to save.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Side toggle */}
      <div className="flex gap-px">
        {(["front", "back"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              "flex-1 font-mono text-xs uppercase tracking-widest py-2 border transition-all",
              side === s
                ? "border-neon text-neon bg-neon/5"
                : "border-chalk/10 text-chalk/30 hover:text-chalk/50"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Card */}
      <div ref={cardRef}>
        {side === "front" ? (
          <div className="postcard-front bg-smoke border border-chalk/10">
            {story.generatedImageUrl && (
              <Image
                src={story.generatedImageUrl}
                alt={story.title}
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
            <div className="absolute inset-0 scanline opacity-30" />

            {/* Edition label */}
            <div className="absolute top-4 right-4 text-right">
              <div className={cn("font-mono text-[9px] uppercase tracking-widest", modeColor)}>
                {story.mode}
              </div>
              <div className="font-mono text-[9px] text-chalk/30 mt-0.5">
                LONDON CUTS
              </div>
            </div>

            {/* Title */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-condensed text-2xl font-black uppercase text-chalk leading-tight">
                {story.title}
              </h3>
            </div>
          </div>
        ) : (
          <div className="postcard-back bg-smoke border border-chalk/10 p-4 gap-0 min-h-[180px]">
            {/* Left: content */}
            <div className="pr-4 space-y-3">
              <div>
                <p className={cn("font-mono text-[9px] uppercase tracking-widest", modeColor)}>
                  Location
                </p>
                <p className="font-condensed text-sm font-bold text-chalk uppercase">
                  {story.locationName || "London"}
                </p>
              </div>
              <div>
                <p className={cn("font-mono text-[9px] uppercase tracking-widest", modeColor)}>
                  Date
                </p>
                <p className="font-mono text-xs text-chalk/70">
                  {formatDate(story.createdAt)}
                </p>
              </div>
              {story.quote && (
                <div>
                  <p className={cn("font-mono text-[9px] uppercase tracking-widest mb-1", modeColor)}>
                    Cut
                  </p>
                  <p className="font-mono text-[10px] text-chalk/60 italic leading-relaxed line-clamp-3">
                    "{story.quote}"
                  </p>
                </div>
              )}
              <div className="pt-1">
                <p className="font-mono text-[8px] text-chalk/20 uppercase tracking-widest">
                  londoncutsapp.com/{story.slug}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-chalk/10 self-stretch" />

            {/* Right: stamp area */}
            <div className="pl-4 flex flex-col items-end justify-between">
              <div className="w-16 h-20 border border-dashed border-chalk/20 flex items-center justify-center">
                <span className="font-mono text-[8px] text-chalk/20 uppercase rotate-90">
                  Stamp
                </span>
              </div>
              <div className="w-16 h-16 bg-ash border border-chalk/10 flex items-center justify-center">
                <span className="font-mono text-[8px] text-chalk/20 text-center uppercase">
                  QR
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        className="w-full font-mono text-xs uppercase tracking-widest border border-chalk/20 py-2 text-chalk/50 hover:border-gold hover:text-gold transition-all duration-200"
      >
        Export PNG
      </button>
    </div>
  );
}
