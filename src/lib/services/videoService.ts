import type { GeneratedStory } from "../types";

export type VideoProvider = "runway" | "replicate" | "mock";

export type VideoFrame = {
  url: string;
  label: string;
  duration?: number;
};

export type StoryboardResult = {
  frames: VideoFrame[];
  provider: VideoProvider;
  videoUrl?: string;
  error?: string;
};

// ── Provider detection ────────────────────────────────────────────────────────

export function detectVideoProvider(): VideoProvider {
  if (process.env.RUNWAY_API_KEY) return "runway";
  if (process.env.REPLICATE_API_KEY) return "replicate";
  return "mock";
}

// ── Main entry point ─────────────────────────────────────────────────────────

export async function generateStoryboard(
  story: GeneratedStory
): Promise<StoryboardResult> {
  const provider = detectVideoProvider();

  switch (provider) {
    case "runway":
      return generateWithRunway(story);
    case "replicate":
      return generateWithReplicate(story);
    default:
      return generateMockStoryboard(story);
  }
}

// ── Runway Gen-3 Alpha ────────────────────────────────────────────────────────
// Docs: https://docs.runwayml.com/docs/gen-3-alpha-turbo

async function generateWithRunway(
  story: GeneratedStory
): Promise<StoryboardResult> {
  const apiKey = process.env.RUNWAY_API_KEY!;
  const prompt = buildVideoPrompt(story);

  // Runway requires a publicly accessible image URL or base64 data URL.
  // If the image is already a data URL (user upload), use it directly.
  // If it's an external URL that may have referrer restrictions, proxy it to base64.
  const imageInput = story.originalImageUrl.startsWith("data:")
    ? story.originalImageUrl
    : await fetchImageAsBase64(story.originalImageUrl);

  const body = {
    model: "gen3a_turbo",
    promptImage: imageInput,
    promptText: prompt,
    duration: 5,
    ratio: "1280:768",
    watermark: false,
  };

  const createRes = await fetch("https://api.runwayml.com/v1/image_to_video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Runway-Version": "2024-11-06",
    },
    body: JSON.stringify(body),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    console.error("[Runway] API error:", errText);
    return { ...(await generateMockStoryboard(story)), error: errText };
  }

  const data = await createRes.json();
  const taskId: string = data.id;
  console.log("[Runway] Task created:", taskId);

  // Poll for completion (max 90s)
  const videoUrl = await pollRunwayTask(apiKey, taskId, 90000);

  if (!videoUrl) {
    const msg = "Runway task timed out or failed";
    console.error("[Runway]", msg);
    return { ...(await generateMockStoryboard(story)), error: msg };
  }

  return {
    provider: "runway",
    videoUrl,
    frames: buildFramesFromImages(story),
  };
}

async function pollRunwayTask(
  apiKey: string,
  taskId: string,
  timeoutMs: number
): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await sleep(3000);

    const res = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Runway-Version": "2024-11-06",
      },
    });

    if (!res.ok) break;
    const task = await res.json();

    if (task.status === "SUCCEEDED") {
      return task.output?.[0] ?? null;
    }
    if (task.status === "FAILED") break;
  }

  return null;
}

// ── Replicate (Kling / Wan-I2V) ───────────────────────────────────────────────
// Docs: https://replicate.com/docs/reference/http
// Using Kling v1.6 image-to-video

async function generateWithReplicate(
  story: GeneratedStory
): Promise<StoryboardResult> {
  const apiKey = process.env.REPLICATE_API_KEY!;
  const prompt = buildVideoPrompt(story);

  // Run Kling 1.6 image-to-video
  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "kwaivgi/kling-v1-6-standard-i2v:latest",
      input: {
        image: story.originalImageUrl,
        prompt,
        duration: 5,
        aspect_ratio: "16:9",
        cfg_scale: 0.5,
      },
    }),
  });

  if (!createRes.ok) {
    console.error("Replicate API error:", await createRes.text());
    return generateMockStoryboard(story);
  }

  const prediction = await createRes.json();
  const videoUrl = await pollReplicatePrediction(apiKey, prediction.id, 90000);

  if (!videoUrl) return generateMockStoryboard(story);

  return {
    provider: "replicate",
    videoUrl,
    frames: buildFramesFromImages(story),
  };
}

async function pollReplicatePrediction(
  apiKey: string,
  predictionId: string,
  timeoutMs: number
): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await sleep(4000);

    const res = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!res.ok) break;
    const prediction = await res.json();

    if (prediction.status === "succeeded") {
      const output = prediction.output;
      return Array.isArray(output) ? output[0] : output;
    }
    if (prediction.status === "failed" || prediction.status === "canceled") break;
  }

  return null;
}

// ── Mock fallback ─────────────────────────────────────────────────────────────

const CINEMATIC_FRAMES = [
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
  "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1200&q=80",
  "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=1200&q=80",
];

async function generateMockStoryboard(
  story: GeneratedStory
): Promise<StoryboardResult> {
  await sleep(1200 + Math.random() * 800);
  return {
    provider: "mock",
    frames: buildFramesFromImages(story),
  };
}

function buildFramesFromImages(story: GeneratedStory): VideoFrame[] {
  const base = [
    story.originalImageUrl,
    story.generatedImageUrl,
    CINEMATIC_FRAMES[Math.floor(Math.random() * CINEMATIC_FRAMES.length)],
  ];
  return base.map((url, i) => ({
    url,
    label: `Frame ${String(i + 1).padStart(2, "0")}`,
    duration: 5,
  }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildVideoPrompt(story: GeneratedStory): string {
  const location = story.locationName || "London";
  const mood = story.emotion || "cinematic";

  const styleMap: Record<string, string> = {
    punk: "gritty handheld, high contrast, raw documentary style, street photography motion",
    fashion: "smooth dolly shot, editorial, soft focus, elegant slow motion",
    cinema: "cinematic widescreen, film grain, golden hour light, slow pan",
  };

  const style = styleMap[story.mode] || styleMap.cinema;

  return `${style}. ${location}, London. ${mood} atmosphere. ${story.title}. No text overlays.`;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.warn("[Runway] Could not proxy image, using URL directly:", e);
    return url;
  }
}
