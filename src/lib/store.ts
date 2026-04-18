import type { GeneratedStory, NarrativeMode } from "./types";
import { MOCK_STORIES } from "./mockData";

const STORIES_KEY = "london_cuts_stories";
const MODE_KEY = "london_cuts_mode";

export function getStoredStories(): GeneratedStory[] {
  if (typeof window === "undefined") return MOCK_STORIES;
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    const stored: GeneratedStory[] = raw ? JSON.parse(raw) : [];
    const existingSlugs = new Set(stored.map((s) => s.slug));
    const merged = [
      ...stored,
      ...MOCK_STORIES.filter((s) => !existingSlugs.has(s.slug)),
    ];
    return merged;
  } catch {
    return MOCK_STORIES;
  }
}

export function saveStory(story: GeneratedStory): void {
  if (typeof window === "undefined") return;
  try {
    const stories = getStoredStories();
    const existing = stories.findIndex((s) => s.id === story.id);
    if (existing >= 0) {
      stories[existing] = story;
    } else {
      stories.unshift(story);
    }
    const userStories = stories.filter(
      (s) => !MOCK_STORIES.find((m) => m.id === s.id)
    );
    localStorage.setItem(STORIES_KEY, JSON.stringify(userStories));
  } catch {}
}

export function getStoryBySlug(slug: string): GeneratedStory | undefined {
  return getStoredStories().find((s) => s.slug === slug);
}

export function deleteStory(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    const stored: GeneratedStory[] = raw ? JSON.parse(raw) : [];
    const filtered = stored.filter((s) => s.id !== id);
    localStorage.setItem(STORIES_KEY, JSON.stringify(filtered));
  } catch {}
}

export function getMode(): NarrativeMode {
  if (typeof window === "undefined") return "cinema";
  return (localStorage.getItem(MODE_KEY) as NarrativeMode) || "cinema";
}

export function setMode(mode: NarrativeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_KEY, mode);
}
