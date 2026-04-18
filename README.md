# London Cuts

> One City, Three Cuts.

An AI-native urban storytelling platform. Upload a London memory, receive a story in three narrative modes (Punk / Fashion / Cinema), a collectible postcard, and a pin on the story atlas.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Map Setup (optional but recommended)

1. Copy `.env.local.example` to `.env.local`
2. Add your Mapbox token: `NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here`
3. Get a token free at https://account.mapbox.com/

Without a token, the map falls back to OpenStreetMap tiles (Stadia Maps) — fully functional.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — three mode preview, recent stories |
| `/create` | Upload image → configure → AI generates story |
| `/story/[slug]` | Full story with postcard, mini-map, storyboard |
| `/map` | Interactive London story atlas (Mapbox / Leaflet) |
| `/archive` | All stories, filterable by mode |

## Demo Flow (5 min)

1. Open `/` — see the three cuts concept
2. Click **Create a Cut** → upload any photo
3. Choose a London location and mode (try Cinema)
4. Watch the AI generation sequence
5. View the full story with postcard export
6. Open `/map` — see all story pins on the atlas
7. Click a marker → popup → navigate to story

## Stack

- **Next.js 15** + TypeScript + Tailwind CSS
- **Framer Motion** — cinematic page animations
- **Mapbox GL JS** (with Leaflet fallback)
- **localStorage** — story persistence
- **Mock AI service** — ready for Claude/OpenAI integration

## Extending to Real AI

Replace the mock functions in `src/lib/services/aiService.ts`:
- `generateStory()` → call Claude API with the narrative prompt
- `generateVideoStoryboard()` → call video generation API

Replace `src/lib/services/mapService.ts`:
- `geocodeLocation()` → already wired to Mapbox Geocoding API (just needs token)
