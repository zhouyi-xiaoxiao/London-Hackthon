"use client";

import { useState, useEffect } from "react";
import { getStoredStories } from "@/lib/store";
import type { MapMarkerData } from "@/lib/types";
import type { GeneratedStory } from "@/lib/types";

function storyToMarker(s: GeneratedStory): MapMarkerData | null {
  if (!s.coordinates) return null;
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    locationName: s.locationName || "London",
    coordinates: s.coordinates,
    imageUrl: s.originalImageUrl,
    emotion: s.emotion,
    tags: s.sceneTags,
    mode: s.mode,
  };
}

export function useMapData() {
  const [markers, setMarkers] = useState<MapMarkerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stories = getStoredStories();
    const validMarkers = stories
      .map(storyToMarker)
      .filter((m): m is MapMarkerData => m !== null);
    setMarkers(validMarkers);
    setLoading(false);
  }, []);

  return { markers, loading };
}
