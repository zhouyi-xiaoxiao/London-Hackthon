import { LONDON_LOCATIONS, getRandomLondonCoords } from "../mockData";

export type Coordinates = { lat: number; lng: number };

// TODO: Replace with Mapbox Geocoding API when token is available
// https://docs.mapbox.com/api/search/geocoding/
export async function geocodeLocation(name: string): Promise<Coordinates | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!validateMapboxToken(token)) {
    return getMockCoordinates(name);
  }

  try {
    const query = encodeURIComponent(`${name}, London, UK`);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=GB&proximity=-0.1276,51.5074&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return getMockCoordinates(name);
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return getMockCoordinates(name);
    const [lng, lat] = feature.center;
    return { lat, lng };
  } catch {
    return getMockCoordinates(name);
  }
}

// TODO: Connect to real Mapbox Geocoding API
export function getMockCoordinates(locationName?: string): Coordinates {
  if (locationName) {
    const normalised = Object.keys(LONDON_LOCATIONS).find((k) =>
      locationName.toLowerCase().includes(k.toLowerCase())
    );
    if (normalised) {
      const base = LONDON_LOCATIONS[normalised];
      return {
        lat: base.lat + (Math.random() - 0.5) * 0.005,
        lng: base.lng + (Math.random() - 0.5) * 0.005,
      };
    }
  }
  return getRandomLondonCoords();
}

export function validateMapboxToken(token?: string | null): boolean {
  return !!(token && token.length > 10 && token.startsWith("pk."));
}

export function getMapStyle(hasToken: boolean): string {
  if (hasToken) {
    return "mapbox://styles/mapbox/dark-v11";
  }
  return "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json";
}

export function getLondonBounds(): [[number, number], [number, number]] {
  return [
    [-0.31, 51.41],
    [0.07, 51.60],
  ];
}

export const LONDON_CENTER: Coordinates = { lat: 51.5074, lng: -0.1276 };
