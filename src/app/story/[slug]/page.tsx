"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { getStoryBySlug } from "@/lib/store";
import type { StoryboardResult } from "@/lib/services/videoService";
import { PostcardPreview } from "@/components/story/PostcardPreview";
import { cn, formatDate, modeAccentClass, modeBorderClass } from "@/lib/utils";
import type { GeneratedStory } from "@/lib/types";

const MiniMap = dynamic(() => import("@/components/map/MiniMap").then((m) => m.MiniMap), {
  ssr: false,
  loading: () => <div className="h-48 bg-ash animate-pulse" />,
});

export default function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [story, setStory] = useState<GeneratedStory | null | undefined>(undefined);
  const [storyboard, setStoryboard] = useState<StoryboardResult | null>(null);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = getStoryBySlug(slug);
    setStory(s || null);
  }, [slug]);

  if (story === undefined) {
    return (
      <div className="min-h-screen bg-void pt-14 flex items-center justify-center">
        <div className="font-mono text-xs text-neon uppercase tracking-widest animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!story) return notFound();

  const accentClass = modeAccentClass(story.mode);
  const borderClass = modeBorderClass(story.mode);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateBoard = async () => {
    setLoadingBoard(true);
    try {
      const res = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
      const result: StoryboardResult = await res.json();
      setStoryboard(result);
    } catch {
      setStoryboard(null);
    } finally {
      setLoadingBoard(false);
    }
  };

  return (
    <div className={cn("min-h-screen bg-void pt-14", `mode-${story.mode}`)}>
      {/* HERO */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src={story.originalImageUrl}
          alt={story.title}
          fill
          className="object-cover story-image"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/10" />
        <div className="absolute inset-0 scanline opacity-30" />

        {/* Mode badge */}
        <div className="absolute top-6 left-6">
          <span className={cn("font-mono text-xs uppercase tracking-widest border px-3 py-1 bg-void/80", `border-${story.mode === 'punk' ? 'magenta' : story.mode === 'fashion' ? 'chalk' : 'neon'}`, accentClass)}>
            {story.mode}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 max-w-screen-lg mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs text-chalk/50 uppercase tracking-widest mb-3"
          >
            {story.locationName} · {formatDate(story.createdAt)}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "font-condensed font-black uppercase leading-none",
              "text-[clamp(2.5rem,7vw,6rem)] text-chalk",
              story.mode === "punk" && "tracking-tighter",
              story.mode === "fashion" && "tracking-widest",
              story.mode === "cinema" && "tracking-tight"
            )}
          >
            {story.title}
          </motion.h1>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-screen-lg mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="md:col-span-2 space-y-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {story.emotion && (
              <span className={cn("font-mono text-xs uppercase tracking-widest border px-3 py-1", accentClass, borderClass)}>
                {story.emotion}
              </span>
            )}
            {story.sceneTags.map((tag) => (
              <span key={tag} className="font-mono text-xs uppercase tracking-widest border border-chalk/15 text-chalk/40 px-3 py-1">
                {tag}
              </span>
            ))}
            {story.styleTags.map((tag) => (
              <span key={tag} className="font-mono text-xs uppercase tracking-widest border border-chalk/10 text-chalk/25 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>

          {/* Story text */}
          <div>
            {story.mode === "punk" ? (
              <div>
                {story.quote && (
                  <blockquote className="font-condensed text-2xl text-magenta font-bold uppercase mb-6 border-l-4 border-magenta pl-4 leading-snug">
                    {story.quote}
                  </blockquote>
                )}
                <p className="text-bone leading-relaxed text-base font-grotesk">
                  {story.storyText}
                </p>
              </div>
            ) : story.mode === "fashion" ? (
              <div>
                <p className="text-chalk text-lg leading-loose font-light tracking-wide max-w-prose">
                  {story.storyText}
                </p>
                {story.quote && (
                  <p className="mt-8 font-condensed text-xl text-chalk/40 uppercase tracking-[0.2em]">
                    — {story.quote}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="font-mono text-xs text-neon uppercase tracking-widest mb-4">
                  EXT. {story.locationName?.toUpperCase()} — CONTINUOUS
                </div>
                <p className="font-mono text-sm text-bone leading-loose">
                  {story.storyText}
                </p>
                {story.quote && (
                  <div className="mt-6 border-l-2 border-neon pl-4">
                    <p className="font-mono text-xs text-neon/70 italic">V.O.: "{story.quote}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Generated image */}
          <div>
            <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest mb-4">
              AI-Generated Visual
            </p>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={story.generatedImageUrl}
                alt="AI generated"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 scanline opacity-20" />
            </div>
          </div>

          {/* Map embed */}
          {story.coordinates && (
            <div>
              <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest mb-4">
                Location
              </p>
              <MiniMap
                lat={story.coordinates.lat}
                lng={story.coordinates.lng}
                title={story.locationName || ""}
                mode={story.mode}
              />
            </div>
          )}

          {/* Video Storyboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest">
                  Video Storyboard
                </p>
                {storyboard && (
                  <p className="font-mono text-[10px] mt-0.5 text-chalk/20">
                    via {storyboard.provider === "mock" ? "preview frames" : storyboard.provider}
                    {storyboard.error && (
                      <span className="ml-2 text-magenta/60" title={storyboard.error}>
                        ⚠ fallback
                      </span>
                    )}
                  </p>
                )}
              </div>
              {!storyboard && (
                <button
                  onClick={handleGenerateBoard}
                  disabled={loadingBoard}
                  className={cn(
                    "font-mono text-xs uppercase tracking-widest border px-4 py-1.5 transition-all disabled:opacity-40",
                    accentClass, borderClass
                  )}
                >
                  {loadingBoard ? "Generating..." : "Generate"}
                </button>
              )}
            </div>

            {/* Real video from Runway / Replicate */}
            {storyboard?.videoUrl && (
              <div className="mb-4">
                <video
                  src={storyboard.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full border border-chalk/10"
                />
              </div>
            )}

            {/* Frame grid */}
            {storyboard && (
              <div className="grid grid-cols-3 gap-px">
                {storyboard.frames.map((frame, i) => (
                  <div key={i} className="relative aspect-video overflow-hidden bg-smoke">
                    <Image src={frame.url} alt={frame.label} fill className="object-cover" />
                    <div className="absolute inset-0 scanline opacity-20" />
                    <div className="absolute bottom-1 left-2 font-mono text-[9px] text-chalk/40">
                      {frame.label}
                    </div>
                    {frame.duration && (
                      <div className="absolute bottom-1 right-2 font-mono text-[9px] text-chalk/25">
                        {frame.duration}s
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!storyboard && !loadingBoard && (
              <div className="h-24 bg-ash border border-chalk/5 flex items-center justify-center">
                <p className="font-mono text-xs text-chalk/20 uppercase tracking-widest">
                  Generate cinematic frames
                </p>
              </div>
            )}

            {loadingBoard && (
              <div className="h-24 bg-ash border border-chalk/5 flex items-center justify-center gap-3">
                {[0,1,2].map(i => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full animate-pulse", accentClass.replace("text-","bg-"))}
                    style={{ animationDelay: `${i*0.2}s` }} />
                ))}
                <span className="font-mono text-xs text-chalk/30 uppercase tracking-widest">
                  Generating frames...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Postcard */}
          <div>
            <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest mb-4">
              Postcard
            </p>
            <PostcardPreview story={story} />
          </div>

          {/* Share */}
          <div>
            <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest mb-4">
              Share
            </p>
            <div className="space-y-2">
              <div className="bg-ash border border-chalk/10 px-3 py-2">
                <p className="font-mono text-[10px] text-chalk/30 truncate">
                  londoncutsapp.com/story/{story.slug}
                </p>
              </div>
              <button
                onClick={handleShare}
                className={cn(
                  "w-full font-mono text-xs uppercase tracking-widest border py-2 transition-all duration-200",
                  copied ? "border-neon text-neon" : "border-chalk/20 text-chalk/50 hover:border-chalk/40"
                )}
              >
                {copied ? "Link Copied ✓" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest mb-4">
              Continue
            </p>
            <div className="space-y-2">
              <Link href="/archive" className="block border border-chalk/10 px-4 py-3 hover:border-chalk/30 transition-colors group">
                <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest group-hover:text-chalk/50">
                  View Archive →
                </p>
              </Link>
              <Link href="/create" className="block border border-chalk/10 px-4 py-3 hover:border-magenta transition-colors group">
                <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest group-hover:text-magenta">
                  Create New Cut →
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
