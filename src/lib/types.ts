export type NarrativeMode = "punk" | "fashion" | "cinema";

export type GeneratedStory = {
  id: string;
  slug: string;
  title: string;
  storyText: string;
  generatedImageUrl: string;
  originalImageUrl: string;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  emotion?: string;
  sceneTags: string[];
  styleTags: string[];
  createdAt: string;
  mode: NarrativeMode;
  quote?: string;
  chapter?: number;
};

export type PhotoAsset = {
  id: string;
  dataUrl: string;
  name: string;
  size: number;
  exifData?: {
    lat?: number;
    lng?: number;
    timestamp?: string;
    make?: string;
    model?: string;
  };
};

export type Stop = {
  id: string;
  title: string;
  place: string;
  time?: string;
  story: string;
  quote?: string;
  coverImageUrl: string;
  coordinates?: { lat: number; lng: number };
  order: number;
  emotion?: string;
  tags: string[];
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  stops: Stop[];
  mode: NarrativeMode;
  createdAt: string;
  published: boolean;
};

export type Postcard = {
  storyId: string;
  frontImageUrl: string;
  location: string;
  date: string;
  excerpt: string;
  mode: NarrativeMode;
};

export type MapMarkerData = {
  id: string;
  slug: string;
  title: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  emotion?: string;
  tags: string[];
  mode: NarrativeMode;
};
