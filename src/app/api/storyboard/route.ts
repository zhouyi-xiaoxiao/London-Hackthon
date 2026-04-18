import { NextRequest, NextResponse } from "next/server";
import { generateStoryboard } from "@/lib/services/videoService";
import type { GeneratedStory } from "@/lib/types";

export const maxDuration = 120; // allow up to 2 min for Runway polling

export async function POST(req: NextRequest) {
  try {
    const story: GeneratedStory = await req.json();
    const result = await generateStoryboard(story);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    console.error("[/api/storyboard]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
