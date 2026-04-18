"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getStoredStories } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import type { GeneratedStory, NarrativeMode } from "@/lib/types";

const FILTERS: { id: NarrativeMode | "all"; label: string }[] = [
  { id: "all", label: "All Cuts" },
  { id: "punk", label: "Punk" },
  { id: "fashion", label: "Fashion" },
  { id: "cinema", label: "Cinema" },
];

export default function ArchivePage() {
  const [stories, setStories] = useState<GeneratedStory[]>([]);
  const [filter, setFilter] = useState<NarrativeMode | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setStories(getStoredStories());
  }, []);

  const filtered =
    filter === "all" ? stories : stories.filter((s) => s.mode === filter);

  return (
    <div className="min-h-screen bg-void pt-14">
      {/* Header */}
      <div className="border-b border-chalk/5 px-6 py-12">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">
            Archive
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-condensed text-5xl md:text-7xl font-black uppercase text-chalk">
              {stories.length} Cuts
            </h1>
            <p className="text-bone max-w-xs text-sm leading-relaxed">
              Every cut stored here. Filter by mode. Each one is a different take on the same city.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-14 z-40 bg-void/90 backdrop-blur-sm border-b border-chalk/5 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
          {/* Mode filter */}
          <div className="flex gap-px">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-all",
                  filter === f.id
                    ? f.id === "punk"
                      ? "border-magenta text-magenta bg-magenta/5"
                      : f.id === "fashion"
                      ? "border-chalk text-chalk bg-chalk/5"
                      : f.id === "cinema"
                      ? "border-neon text-neon bg-neon/5"
                      : "border-chalk text-chalk bg-chalk/5"
                    : "border-chalk/10 text-chalk/30 hover:text-chalk/50"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-px">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-all",
                  view === v
                    ? "border-chalk/40 text-chalk"
                    : "border-chalk/10 text-chalk/20 hover:text-chalk/40"
                )}
              >
                {v === "grid" ? "⊞" : "≡"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-condensed text-3xl text-chalk/20 uppercase mb-4">
              No cuts yet
            </p>
            <Link href="/create" className="font-mono text-sm text-neon hover:text-chalk uppercase tracking-widest underline underline-offset-4">
              Create your first cut →
            </Link>
          </div>
        ) : view === "grid" ? (
          <GridView stories={filtered} />
        ) : (
          <ListView stories={filtered} />
        )}
      </div>
    </div>
  );
}

function GridView({ stories }: { stories: GeneratedStory[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px">
      {stories.map((story, i) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
        >
          <Link href={`/story/${story.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-smoke">
              <Image
                src={story.originalImageUrl}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
              <div className="absolute inset-0 scanline opacity-30" />

              {/* Mode badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5",
                    story.mode === "punk" && "bg-magenta text-void",
                    story.mode === "fashion" && "bg-chalk text-void",
                    story.mode === "cinema" && "bg-neon text-void"
                  )}
                >
                  {story.mode}
                </span>
              </div>

              {/* Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-mono text-[9px] text-chalk/40 uppercase tracking-widest mb-0.5">
                  {story.locationName}
                </p>
                <h3 className="font-condensed text-base font-bold text-chalk uppercase leading-tight line-clamp-2 group-hover:text-neon transition-colors">
                  {story.title}
                </h3>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function ListView({ stories }: { stories: GeneratedStory[] }) {
  return (
    <div className="space-y-px">
      {stories.map((story, i) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Link href={`/story/${story.slug}`} className="group flex gap-4 p-4 bg-ash hover:bg-smoke transition-colors border-b border-chalk/5">
            <div className="relative w-20 h-20 flex-none overflow-hidden">
              <Image src={story.originalImageUrl} alt={story.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5",
                    story.mode === "punk" && "bg-magenta text-void",
                    story.mode === "fashion" && "bg-chalk text-void",
                    story.mode === "cinema" && "bg-neon text-void"
                  )}
                >
                  {story.mode}
                </span>
                <span className="font-mono text-[9px] text-chalk/30 uppercase tracking-widest">
                  {story.locationName}
                </span>
              </div>
              <h3 className="font-condensed text-xl font-bold text-chalk uppercase group-hover:text-neon transition-colors leading-tight">
                {story.title}
              </h3>
              <p className="font-mono text-xs text-chalk/30 mt-1 line-clamp-1">
                {story.storyText.slice(0, 80)}...
              </p>
            </div>
            <div className="flex-none text-right">
              <p className="font-mono text-[9px] text-chalk/20 uppercase">
                {formatDate(story.createdAt)}
              </p>
              {story.emotion && (
                <p className={cn(
                  "font-mono text-[9px] uppercase tracking-widest mt-1",
                  story.mode === "punk" ? "text-magenta" : story.mode === "fashion" ? "text-chalk/50" : "text-neon"
                )}>
                  {story.emotion}
                </p>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
