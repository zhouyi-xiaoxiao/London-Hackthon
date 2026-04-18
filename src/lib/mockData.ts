import type { GeneratedStory, Project, Stop } from "./types";

export const LONDON_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  "Soho": { lat: 51.5137, lng: -0.1337 },
  "Shoreditch": { lat: 51.5228, lng: -0.0779 },
  "Camden": { lat: 51.5391, lng: -0.1426 },
  "South Bank": { lat: 51.5055, lng: -0.1132 },
  "Brixton": { lat: 51.4613, lng: -0.1156 },
  "Hackney": { lat: 51.5449, lng: -0.0553 },
  "Dalston": { lat: 51.5469, lng: -0.0751 },
  "Peckham": { lat: 51.4734, lng: -0.0681 },
  "Bethnal Green": { lat: 51.5275, lng: -0.0544 },
  "Whitechapel": { lat: 51.5191, lng: -0.0604 },
  "Kings Cross": { lat: 51.5309, lng: -0.1233 },
  "Clerkenwell": { lat: 51.5234, lng: -0.1067 },
  "Notting Hill": { lat: 51.5096, lng: -0.2021 },
  "East End": { lat: 51.5246, lng: -0.0612 },
  "Borough Market": { lat: 51.5055, lng: -0.0906 },
};

export const MOCK_STORY_IMAGES = [
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80",
  "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80",
  "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=800&q=80",
  "https://images.unsplash.com/photo-1543832923-44667a44c804?w=800&q=80",
  "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?w=800&q=80",
];

export const MOCK_GENERATED_IMAGES = [
  "https://images.unsplash.com/photo-1573483537983-a46e8e39abb8?w=800&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&q=80",
  "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&q=80",
  "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80",
];

export const MOCK_STORIES: GeneratedStory[] = [
  {
    id: "story-001",
    slug: "shoreditch-static",
    title: "Static & Smoke",
    storyText:
      "The walls speak louder at 2am. Shoreditch exhales its graffiti like breath in winter—each tag a timestamp, each colour a frequency. I found myself between a shuttered club and an open sky, watching the city perform its own autopsy. The neon bled into puddles and I couldn't tell where the art ended and the concrete began. This is where London keeps its unfinished sentences.",
    generatedImageUrl: MOCK_GENERATED_IMAGES[0],
    originalImageUrl: MOCK_STORY_IMAGES[0],
    locationName: "Shoreditch",
    coordinates: LONDON_LOCATIONS["Shoreditch"],
    emotion: "electric",
    sceneTags: ["urban", "night", "street art", "neon"],
    styleTags: ["punk", "raw", "documentary"],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    mode: "punk",
    quote: "The walls speak louder at 2am.",
    chapter: 1,
  },
  {
    id: "story-002",
    slug: "camden-cathedral",
    title: "Cathedral of Chaos",
    storyText:
      "Camden is a cathedral built without permission. Its congregation wears leather and vintage velvet, worships at the altar of the second-hand and the subcultural. I traced the canal as it curved through market stalls selling memories and manifestos. Every face here has a story it's still writing. Every sound is both an ending and an overture to something wilder.",
    generatedImageUrl: MOCK_GENERATED_IMAGES[1],
    originalImageUrl: MOCK_STORY_IMAGES[1],
    locationName: "Camden",
    coordinates: LONDON_LOCATIONS["Camden"],
    emotion: "defiant",
    sceneTags: ["market", "canal", "subculture", "crowd"],
    styleTags: ["editorial", "archive", "cinematic"],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    mode: "cinema",
    quote: "Every face here has a story it's still writing.",
    chapter: 2,
  },
  {
    id: "story-003",
    slug: "south-bank-dissolution",
    title: "Dissolution at Golden Hour",
    storyText:
      "The Thames doesn't care about your narrative. It simply continues—grey and pewter and occasionally gold when the light performs miracles. South Bank at dusk is a stage nobody owns, where skateboarders perform beneath the Brutalist arches and tourists and locals share the same frame without ever meeting. I sat here and felt the city breathe around me, indifferent and magnificent.",
    generatedImageUrl: MOCK_GENERATED_IMAGES[2],
    originalImageUrl: MOCK_STORY_IMAGES[2],
    locationName: "South Bank",
    coordinates: LONDON_LOCATIONS["South Bank"],
    emotion: "melancholic",
    sceneTags: ["river", "dusk", "architecture", "people"],
    styleTags: ["fashion", "editorial", "cinematic"],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    mode: "fashion",
    quote: "The Thames doesn't care about your narrative.",
    chapter: 3,
  },
  {
    id: "story-004",
    slug: "dalston-frequency",
    title: "Frequency / Dalston",
    storyText:
      "There's a specific frequency Dalston operates on—too fast for nostalgia, too layered for easy description. The Turkish bakeries open when the clubs close. The vinyl shops keep analog time. I came here chasing something I couldn't name and found it between a Windrush mural and a construction hoarding, in the face of a woman who'd seen the neighbourhood become itself, then something else, then return.",
    generatedImageUrl: MOCK_GENERATED_IMAGES[3],
    originalImageUrl: MOCK_STORY_IMAGES[3],
    locationName: "Dalston",
    coordinates: LONDON_LOCATIONS["Dalston"],
    emotion: "nostalgic",
    sceneTags: ["multicultural", "street", "vinyl", "architecture"],
    styleTags: ["documentary", "punk", "zine"],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    mode: "punk",
    quote: "Too fast for nostalgia, too layered for easy description.",
    chapter: 4,
  },
  {
    id: "story-005",
    slug: "brixton-electric",
    title: "Electric Brixton",
    storyText:
      "Brixton carries its history like a second skin—the uprising of '81 lives in the architecture, the diaspora in the music spilling from every open door. I walked the market at midday and felt like I was moving through a living archive. Every face was a chapter, every stall a footnote. The city remembers even when it pretends to forget.",
    generatedImageUrl: MOCK_GENERATED_IMAGES[4],
    originalImageUrl: MOCK_STORY_IMAGES[4],
    locationName: "Brixton",
    coordinates: LONDON_LOCATIONS["Brixton"],
    emotion: "alive",
    sceneTags: ["market", "diaspora", "music", "history"],
    styleTags: ["documentary", "editorial", "cinematic"],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    mode: "cinema",
    quote: "The city remembers even when it pretends to forget.",
    chapter: 5,
  },
  {
    id: "story-006",
    slug: "peckham-rising",
    title: "Peckham Is Rising",
    storyText:
      "The rooftops of Peckham offer a different London. From Bussey Building's heights you see the city's geometry—the towers emerging, the Victorian terraces holding their ground, the sky vast and uncommitted. This is where young artists came when they couldn't afford Shoreditch, and made something better. The edges are where the real city grows.",
    generatedImageUrl: MOCK_GENERATED_IMAGES[5],
    originalImageUrl: MOCK_STORY_IMAGES[5],
    locationName: "Peckham",
    coordinates: LONDON_LOCATIONS["Peckham"],
    emotion: "hopeful",
    sceneTags: ["rooftop", "skyline", "art", "community"],
    styleTags: ["fashion", "editorial", "aspirational"],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    mode: "fashion",
    quote: "The edges are where the real city grows.",
    chapter: 6,
  },
];

export const MOCK_PROJECT: Project = {
  id: "project-001",
  slug: "london-cuts-demo",
  title: "London Cuts",
  description: "Six stops through the city's living archive.",
  coverImageUrl: MOCK_STORY_IMAGES[0],
  stops: MOCK_STORIES.map((s, i) => ({
    id: `stop-${i + 1}`,
    title: s.title,
    place: s.locationName || "London",
    story: s.storyText,
    quote: s.quote,
    coverImageUrl: s.originalImageUrl,
    coordinates: s.coordinates,
    order: i + 1,
    emotion: s.emotion,
    tags: s.sceneTags,
  })),
  mode: "cinema",
  createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  published: true,
};

export function getMockStoryBySlug(slug: string): GeneratedStory | undefined {
  return MOCK_STORIES.find((s) => s.slug === slug);
}

export function getRandomLondonCoords(): { lat: number; lng: number } {
  const locations = Object.values(LONDON_LOCATIONS);
  const base = locations[Math.floor(Math.random() * locations.length)];
  return {
    lat: base.lat + (Math.random() - 0.5) * 0.01,
    lng: base.lng + (Math.random() - 0.5) * 0.01,
  };
}
