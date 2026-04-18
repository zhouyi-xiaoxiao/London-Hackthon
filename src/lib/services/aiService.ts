import { v4 as uuidv4 } from "uuid";
import type { GeneratedStory, NarrativeMode } from "../types";
import { geocodeLocation } from "./mapService";
import {
  MOCK_GENERATED_IMAGES,
  MOCK_STORY_IMAGES,
} from "../mockData";

const PUNK_NARRATIVES = [
  "The city doesn't ask permission. Neither do you. {location} holds its scars like badges—every cracked pavement, every shuttered doorway a testament to something that happened here and refuses to be forgotten. You came with a camera and left with a manifesto.",
  "Rage has an architecture in {location}. It's built from neglect and resistance, from music played too loud in spaces too small. Your photograph is a fist held up against the disappearing act the city performs on its own history.",
  "{location} at this hour is a frequency only some people can tune into. The rest walk through it like ghosts. You stayed and listened. What you heard will take years to fully understand.",
];

const FASHION_NARRATIVES = [
  "There is an elegance to impermanence that {location} understands intuitively. The light falls at this particular angle only in this city, only in this season, only at this hour. You were there. That is the beginning of the story.",
  "{location} curates itself without trying. The grey and the gold, the old stone and the new glass—it composes itself into something that editorial teams spend thousands to recreate. You found it by accident. That is the only way.",
  "The city wears its contradictions well. {location} in particular—layered, considered, entirely itself. Your image captured the moment before self-consciousness, when the city was simply being. That moment is now yours to keep.",
];

const CINEMA_NARRATIVES = [
  "SCENE: {location}. Late. The kind of late that makes the city feel like a set that forgot to send everyone home. Your protagonist—which is you—stands in frame. The camera loves the uncertainty. Cut to: the street. The story begins here.",
  "EXT. {location} — CONTINUOUS. The city in this frame is both backdrop and character. Every detail is intentional: the light, the weather, the particular quality of silence that exists between sounds. This is the establishing shot. Everything else follows.",
  "FADE IN: {location}. The image you've captured exists at the intersection of documentary and dream. Real enough to believe, strange enough to remember. This is the cinema the city makes of itself when no one is officially watching.",
];

const PUNK_TITLES = [
  "No Permission Required",
  "Static & Signal",
  "The Unscheduled Hours",
  "Frequency / District",
  "Against the Grain",
  "This Side of the Hoarding",
];

const FASHION_TITLES = [
  "Light Study",
  "The Considered Hour",
  "Grey Matter",
  "Composition in Motion",
  "Editorial: City",
  "The Architecture of Elegance",
];

const CINEMA_TITLES = [
  "Establishing Shot",
  "Scene Undocumented",
  "Fade In",
  "The Continuous Take",
  "Off Script",
  "Interior: City, Exterior: Self",
];

const EMOTIONS = ["electric", "melancholic", "defiant", "alive", "nostalgic", "liminal", "raw", "tender"];
const SCENE_TAGS_POOL = ["urban", "night", "dusk", "street", "architecture", "people", "neon", "rain", "market", "canal", "rooftop", "underground"];
const STYLE_TAGS_POOL = ["documentary", "editorial", "raw", "cinematic", "zine", "archive", "atmospheric"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50) + "-" + Date.now().toString(36);
}

export type GenerateStoryInput = {
  imageDataUrl?: string;
  locationName?: string;
  personalText?: string;
  mode: NarrativeMode;
  analyseEmotion?: boolean;
};

// TODO: Replace mock generation with real Claude/OpenAI API calls
export async function generateStory(
  input: GenerateStoryInput
): Promise<GeneratedStory> {
  await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200));

  const location = input.locationName || "London";
  const narrativePool =
    input.mode === "punk"
      ? PUNK_NARRATIVES
      : input.mode === "fashion"
      ? FASHION_NARRATIVES
      : CINEMA_NARRATIVES;

  const titlePool =
    input.mode === "punk"
      ? PUNK_TITLES
      : input.mode === "fashion"
      ? FASHION_TITLES
      : CINEMA_TITLES;

  const rawNarrative = randomFrom(narrativePool).replace(/{location}/g, location);
  const storyText = input.personalText
    ? `${rawNarrative}\n\n${input.personalText}`
    : rawNarrative;

  const title = randomFrom(titlePool);
  const coordinates = await geocodeLocation(location);

  return {
    id: uuidv4(),
    slug: generateSlug(title),
    title,
    storyText,
    generatedImageUrl: randomFrom(MOCK_GENERATED_IMAGES),
    originalImageUrl: input.imageDataUrl || randomFrom(MOCK_STORY_IMAGES),
    locationName: input.locationName,
    coordinates: coordinates || undefined,
    emotion: input.analyseEmotion ? randomFrom(EMOTIONS) : undefined,
    sceneTags: pickN(SCENE_TAGS_POOL, 3),
    styleTags: pickN(STYLE_TAGS_POOL, 2),
    createdAt: new Date().toISOString(),
    mode: input.mode,
    quote: storyText.split(". ")[0] + ".",
    chapter: Math.floor(Math.random() * 6) + 1,
  };
}

// TODO: Replace with real video storyboard generation
export async function generateVideoStoryboard(
  story: GeneratedStory
): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 1200));
  return [
    story.originalImageUrl,
    story.generatedImageUrl,
    randomFrom(MOCK_STORY_IMAGES),
  ];
}
