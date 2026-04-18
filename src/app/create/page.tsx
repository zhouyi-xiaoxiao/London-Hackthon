"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { generateStory } from "@/lib/services/aiService";
import { saveStory } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { NarrativeMode } from "@/lib/types";

type Step = "upload" | "configure" | "generating" | "done";

const LONDON_PLACES = [
  "Shoreditch", "Camden", "South Bank", "Brixton", "Dalston",
  "Peckham", "Hackney", "Notting Hill", "Clerkenwell", "Bethnal Green",
  "Borough Market", "East End", "Kings Cross", "Soho", "Whitechapel",
];

const MODES: { id: NarrativeMode; label: string; desc: string }[] = [
  { id: "punk", label: "Punk", desc: "Zine / raw / manifesto" },
  { id: "fashion", label: "Fashion", desc: "Editorial / clean / composed" },
  { id: "cinema", label: "Cinema", desc: "Scene card / cinematic / sequential" },
];

const LOADING_LINES = [
  "Parsing visual frequencies...",
  "Locating ghost of the city...",
  "Translating light into language...",
  "Assembling narrative fragments...",
  "Composing the cut...",
  "Almost ready...",
];

export default function CreatePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [mode, setMode] = useState<NarrativeMode>("cinema");
  const [personalText, setPersonalText] = useState("");
  const [analyseEmotion, setAnalyseEmotion] = useState(true);
  const [loadingLine, setLoadingLine] = useState(0);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setStep("configure");
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const finalLocation = customLocation || location;

  const handleGenerate = async () => {
    setStep("generating");

    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_LINES.length;
      setLoadingLine(idx);
    }, 600);

    try {
      const story = await generateStory({
        imageDataUrl: imagePreview || undefined,
        locationName: finalLocation || undefined,
        personalText: personalText || undefined,
        mode,
        analyseEmotion,
      });
      saveStory(story);
      clearInterval(interval);
      router.push(`/story/${story.slug}`);
    } catch (err) {
      clearInterval(interval);
      setStep("configure");
    }
  };

  return (
    <div className="min-h-screen bg-void pt-14">
      {/* Header */}
      <div className="border-b border-chalk/5 px-6 py-8">
        <div className="max-w-screen-lg mx-auto">
          <p className="font-mono text-xs text-magenta tracking-[0.3em] uppercase mb-2">
            Studio
          </p>
          <h1 className="font-condensed text-4xl md:text-6xl font-black uppercase text-chalk">
            Create a Cut
          </h1>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* STEP 1: Upload */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                ref={dropRef}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed cursor-pointer transition-all duration-200 p-20 text-center",
                  dragOver
                    ? "border-neon bg-neon/5"
                    : "border-chalk/20 hover:border-chalk/40"
                )}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                <div className="space-y-4">
                  <div className="text-5xl opacity-30">+</div>
                  <p className="font-condensed text-2xl font-bold uppercase text-chalk/60">
                    Drop your London memory here
                  </p>
                  <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest">
                    or click to browse — JPG, PNG, HEIC
                  </p>
                </div>

                {dragOver && (
                  <div className="absolute inset-0 border-2 border-neon bg-neon/5 flex items-center justify-center">
                    <span className="font-condensed text-2xl text-neon font-bold uppercase">
                      Drop It
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {["No image? No problem."].map((tip) => (
                  <div key={tip} className="col-span-3 text-center">
                    <button
                      onClick={() => setStep("configure")}
                      className="font-mono text-xs text-chalk/30 hover:text-chalk/60 uppercase tracking-widest underline underline-offset-4"
                    >
                      Continue without an image →
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Configure */}
          {step === "configure" && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-12"
            >
              {/* Left: preview */}
              <div>
                {imagePreview ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
                    <Image src={imagePreview} alt="Your upload" fill className="object-cover" />
                    <div className="absolute inset-0 scanline opacity-40" />
                    <button
                      onClick={() => { setImagePreview(null); setStep("upload"); }}
                      className="absolute top-3 right-3 font-mono text-xs text-chalk/50 bg-void/80 px-2 py-1 hover:text-magenta"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => { fileRef.current?.click(); }}
                    className="relative aspect-[4/3] bg-ash border border-chalk/10 flex items-center justify-center cursor-pointer hover:border-chalk/30 transition-colors"
                  >
                    <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                    <p className="font-mono text-xs text-chalk/30 uppercase tracking-widest">
                      No image — text only
                    </p>
                  </div>
                )}

                {imagePreview && (
                  <p className="mt-2 font-mono text-xs text-chalk/30 truncate">{imageName}</p>
                )}
              </div>

              {/* Right: form */}
              <div className="space-y-8">
                {/* Location */}
                <div>
                  <label className="block font-mono text-xs text-chalk/50 uppercase tracking-widest mb-3">
                    Location
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {LONDON_PLACES.slice(0, 8).map((place) => (
                      <button
                        key={place}
                        onClick={() => { setLocation(place); setCustomLocation(""); }}
                        className={cn(
                          "font-mono text-xs px-3 py-1 border transition-all",
                          location === place && !customLocation
                            ? "border-neon text-neon"
                            : "border-chalk/20 text-chalk/50 hover:border-chalk/40"
                        )}
                      >
                        {place}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Or type any London location..."
                    value={customLocation}
                    onChange={(e) => { setCustomLocation(e.target.value); setLocation(""); }}
                    className="w-full bg-ash border border-chalk/20 text-chalk px-4 py-3 font-mono text-sm focus:outline-none focus:border-neon transition-colors placeholder:text-chalk/20"
                  />
                </div>

                {/* Mode */}
                <div>
                  <label className="block font-mono text-xs text-chalk/50 uppercase tracking-widest mb-3">
                    Narrative Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={cn(
                          "p-3 border text-left transition-all",
                          mode === m.id
                            ? m.id === "punk"
                              ? "border-magenta bg-magenta/10"
                              : m.id === "fashion"
                              ? "border-chalk bg-chalk/5"
                              : "border-neon bg-neon/10"
                            : "border-chalk/10 hover:border-chalk/30"
                        )}
                      >
                        <span
                          className={cn(
                            "block font-condensed text-lg font-bold uppercase",
                            mode === m.id
                              ? m.id === "punk" ? "text-magenta" : m.id === "fashion" ? "text-chalk" : "text-neon"
                              : "text-chalk/50"
                          )}
                        >
                          {m.label}
                        </span>
                        <span className="block font-mono text-[10px] text-chalk/30 mt-0.5">
                          {m.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal text */}
                <div>
                  <label className="block font-mono text-xs text-chalk/50 uppercase tracking-widest mb-3">
                    Your Memory{" "}
                    <span className="text-chalk/20">(optional)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="A sentence. A feeling. A detail only you remember..."
                    value={personalText}
                    onChange={(e) => setPersonalText(e.target.value)}
                    className="w-full bg-ash border border-chalk/20 text-chalk px-4 py-3 font-mono text-sm focus:outline-none focus:border-neon transition-colors placeholder:text-chalk/20 resize-none"
                  />
                </div>

                {/* Emotion toggle */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAnalyseEmotion(!analyseEmotion)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      analyseEmotion ? "bg-neon" : "bg-chalk/20"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-void transition-transform",
                        analyseEmotion ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                  <span className="font-mono text-xs text-chalk/50 uppercase tracking-widest">
                    Emotion Analysis
                  </span>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  className="w-full bg-magenta text-chalk font-condensed text-xl font-bold uppercase py-4 hover:bg-chalk hover:text-void transition-all duration-200 tracking-wider"
                >
                  Generate the Cut
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Generating */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
            >
              {/* Animated film strip */}
              <div className="relative w-full max-w-sm overflow-hidden">
                <div className="flex gap-1 animate-pulse">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 aspect-[2/3] bg-smoke border border-chalk/5"
                      style={{ opacity: 0.3 + i * 0.1 }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-void pointer-events-none" />
              </div>

              <div className="text-center space-y-3">
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-neon"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingLine}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="font-mono text-sm text-neon uppercase tracking-widest"
                  >
                    {LOADING_LINES[loadingLine]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
