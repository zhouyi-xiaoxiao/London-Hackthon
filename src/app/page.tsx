"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MOCK_STORIES } from "@/lib/mockData";
import { cn, formatDate } from "@/lib/utils";
import type { NarrativeMode } from "@/lib/types";

const MODES: { id: NarrativeMode; label: string; desc: string; accent: string }[] = [
  {
    id: "punk",
    label: "Punk",
    desc: "Zine energy. Graffiti logic. London as manifesto.",
    accent: "text-magenta border-magenta",
  },
  {
    id: "fashion",
    label: "Fashion",
    desc: "Editorial restraint. The city as lookbook.",
    accent: "text-chalk border-chalk",
  },
  {
    id: "cinema",
    label: "Cinema",
    desc: "Scene cards. Voice-over logic. London as storyboard.",
    accent: "text-neon border-neon",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [activeMode, setActiveMode] = useState<NarrativeMode>("cinema");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-void">
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen flex items-end overflow-hidden">
        {/* Background collage */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 grid grid-cols-3 gap-px"
        >
          {MOCK_STORIES.slice(0, 6).map((story, i) => (
            <div
              key={story.id}
              className="relative overflow-hidden"
              style={{ opacity: 0.6 + (i % 3) * 0.1 }}
            >
              <Image
                src={story.originalImageUrl}
                alt=""
                fill
                className={cn(
                  "object-cover",
                  i % 2 === 0 ? "object-center" : "object-top"
                )}
                priority={i < 3}
              />
              <div className="absolute inset-0 bg-void/40 scanline" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
        </motion.div>

        {/* Hero text */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full px-6 pb-20 max-w-screen-xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs text-neon tracking-[0.3em] uppercase mb-6"
          >
            London / {new Date().getFullYear()} / AI-Native Storytelling
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-condensed text-[clamp(4rem,12vw,10rem)] font-black leading-none tracking-tight uppercase text-chalk"
          >
            ONE CITY,
            <br />
            <span className="text-neon glow-neon">THREE CUTS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 max-w-xl text-bone font-grotesk text-lg leading-relaxed"
          >
            Upload a London memory set. AI turns it into a story atlas, three
            narrative modes, and collectible postcards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/create"
              className="font-mono text-sm uppercase tracking-widest bg-neon text-void px-8 py-3 hover:bg-chalk transition-colors duration-200 font-bold"
            >
              Create a Cut
            </Link>
            <Link
              href="/map"
              className="font-mono text-sm uppercase tracking-widest border border-chalk/30 text-chalk px-8 py-3 hover:border-chalk transition-colors duration-200"
            >
              Explore Atlas
            </Link>
          </motion.div>
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-16 right-6 font-mono text-xs text-chalk/20 text-right">
          <div>51.5074° N</div>
          <div>0.1278° W</div>
        </div>
      </section>

      {/* MODES SECTION */}
      <section className="relative py-32 px-6 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between"
        >
          <div>
            <p className="font-mono text-xs text-neon tracking-[0.3em] uppercase mb-3">
              Narrative Modes
            </p>
            <h2 className="font-condensed text-5xl md:text-7xl font-black uppercase text-chalk">
              Three Cuts
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-bone text-sm leading-relaxed">
            The same memory. Three completely different editorial grammars.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-chalk/5">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                "relative cursor-pointer p-8 bg-ash transition-all duration-300 group",
                activeMode === mode.id ? "bg-smoke" : "hover:bg-smoke/60"
              )}
            >
              {activeMode === mode.id && (
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-px",
                    mode.id === "punk" ? "bg-magenta" : mode.id === "fashion" ? "bg-chalk" : "bg-neon"
                  )}
                />
              )}
              <div className="relative h-48 mb-6 overflow-hidden">
                <Image
                  src={MOCK_STORIES[i * 2]?.originalImageUrl || MOCK_STORIES[0].originalImageUrl}
                  alt={mode.label}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700 group-hover:scale-105",
                    mode.id === "punk" && "filter contrast-150 saturate-50",
                    mode.id === "fashion" && "filter brightness-110 contrast-90",
                    mode.id === "cinema" && "filter contrast-110 sepia-20"
                  )}
                />
                <div className="absolute inset-0 bg-void/30 scanline" />
              </div>

              <span
                className={cn(
                  "font-mono text-xs uppercase tracking-widest border px-2 py-0.5",
                  mode.accent
                )}
              >
                {mode.label}
              </span>
              <p className="mt-3 text-bone text-sm leading-relaxed">{mode.desc}</p>

              {activeMode === mode.id && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className={cn(
                    "absolute bottom-0 left-0 h-px",
                    mode.id === "punk" ? "bg-magenta" : mode.id === "fashion" ? "bg-chalk" : "bg-neon"
                  )}
                />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* STORIES GRID */}
      <section className="py-24 px-6 bg-ash">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <p className="font-mono text-xs text-magenta tracking-[0.3em] uppercase mb-3">
                Recent Cuts
              </p>
              <h2 className="font-condensed text-4xl md:text-6xl font-black uppercase text-chalk">
                From the Archive
              </h2>
            </div>
            <Link href="/archive" className="btn-ghost hidden md:inline-block">
              View All
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
            {MOCK_STORIES.slice(0, 6).map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/story/${story.slug}`} className="group block relative">
                  <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
                    <Image
                      src={story.originalImageUrl}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                    <div className="absolute inset-0 scanline opacity-50" />

                    {/* Mode badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-widest px-2 py-0.5",
                          story.mode === "punk" && "bg-magenta text-void",
                          story.mode === "fashion" && "bg-chalk text-void",
                          story.mode === "cinema" && "bg-neon text-void"
                        )}
                      >
                        {story.mode}
                      </span>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-mono text-[10px] text-bone/60 uppercase tracking-widest mb-1">
                        {story.locationName}
                      </p>
                      <h3 className="font-condensed text-xl font-bold text-chalk uppercase leading-tight group-hover:text-neon transition-colors">
                        {story.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POSTCARD STRIP */}
      <section className="py-24 overflow-hidden">
        <div className="px-6 max-w-screen-xl mx-auto mb-10">
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">
            Artifacts
          </p>
          <h2 className="font-condensed text-4xl md:text-6xl font-black uppercase text-chalk">
            Collectible Postcards
          </h2>
        </div>

        <div className="flex gap-4 px-6 overflow-x-auto pb-4 scroll-smooth">
          {MOCK_STORIES.map((story) => (
            <Link
              key={story.id}
              href={`/story/${story.slug}`}
              className="flex-none w-64 group"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-smoke border border-chalk/10 group-hover:border-neon/40 transition-colors">
                <Image
                  src={story.generatedImageUrl}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-void/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="font-mono text-[9px] text-neon/70 uppercase tracking-widest">
                    {story.locationName}
                  </p>
                  <p className="font-condensed text-sm font-bold text-chalk uppercase">
                    {story.title}
                  </p>
                </div>
                <div className="absolute top-3 right-3 font-mono text-[10px] text-chalk/30 text-right">
                  <div>LC/{String(story.chapter || 1).padStart(2, "0")}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-void via-smoke to-void" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <p className="font-mono text-xs text-neon tracking-[0.3em] uppercase mb-6">
            Your Turn
          </p>
          <h2 className="font-condensed text-5xl md:text-8xl font-black uppercase text-chalk mb-6">
            What's Your Cut?
          </h2>
          <p className="text-bone mb-10 leading-relaxed">
            Upload a photo. Name a place. Write a sentence—or don't. AI does the
            rest.
          </p>
          <Link
            href="/create"
            className="font-mono text-sm uppercase tracking-widest bg-magenta text-chalk px-10 py-4 hover:bg-chalk hover:text-void transition-all duration-200 font-bold inline-block"
          >
            Create Your Cut
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-chalk/5 py-8 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs text-chalk/30 uppercase tracking-widest">
            London Cuts © {new Date().getFullYear()}
          </span>
          <span className="font-mono text-xs text-chalk/20">
            One City, Three Cuts.
          </span>
        </div>
      </footer>
    </div>
  );
}
