# HerbInventory - CLAUDE.md

## Project Overview

A herbal inventory management web app for a clinical setting. Core workflow:
- **Phone**: Voice-to-text input to update herb inventory on the go
- **Desktop**: Ordering/pricing research when herbs are out of stock

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite (port 8080)
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI components)
- **Backend**: Supabase (PostgreSQL + auth + realtime subscriptions)
- **State**: TanStack React Query v5
- **Voice**: Browser Web Speech API + Speech Synthesis API
- **Routing**: React Router v6
- **Testing**: Vitest
- **Deployment**: GitHub Pages at `/drkherbinventory/` base path

## Key Files

| File | Purpose |
|------|---------|
| [src/pages/Index.tsx](src/pages/Index.tsx) | Main dashboard with tabs, search, voice controls |
| [src/pages/Reports.tsx](src/pages/Reports.tsx) | Inventory stats overview |
| [src/components/VoiceHerbAdd.tsx](src/components/VoiceHerbAdd.tsx) | Voice commands: add/remove/change status |
| [src/components/VoiceQuery.tsx](src/components/VoiceQuery.tsx) | Voice-based inventory queries |
| [src/components/BulkInventorySection.tsx](src/components/BulkInventorySection.tsx) | Bulk herbs inventory view |
| [src/hooks/useInventory.ts](src/hooks/useInventory.ts) | All CRUD operations via React Query + Supabase |
| [src/lib/herbCorrection.ts](src/lib/herbCorrection.ts) | Voice recognition correction (100+ herb name variants) |
| [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) | Database schema types |

## Data Model

**Herbs** tracked across 4 locations: `clinic`, `backstock`, `tincture`, `bulk`
**Status levels**: `full`, `low`, `out`
**Unique constraint**: herb name + location (no duplicates per location)

## Voice Command Patterns

```
"Add to [location] [status] [herb names]"
"Remove from [location] [herb name]"
"Change [location] [herb name] to [status]"
```

Herb name correction uses fuzzy matching (Levenshtein distance) + a 100+ entry synonym map in `herbCorrection.ts`.

## Active Development: Ordering & Pricing Feature

**Goal**: When a bulk herb is `out`, show a ranked list of suppliers with pricing so ordering decisions can be made from the desktop.

**Planned approach**:
- New Supabase table: `suppliers` (name, URL, notes)
- New Supabase table: `herb_pricing` (herb_name, supplier_id, price_per_oz, last_updated, notes, url)
- New page: `/ordering` — shows all `out` bulk herbs with supplier comparison table
- Desktop-optimized layout (not voice-driven)
- Ability to manually update pricing when placing orders

## Device Usage Context

- **Mobile (phone)**: Voice input for inventory updates — keep UI minimal, large touch targets, voice-first
- **Desktop**: Ordering/pricing research — can use dense data tables, multi-column layouts

## Development Commands

```bash
npm run dev        # Start dev server on port 8080
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run Vitest tests
npm run lint       # ESLint check
```

## Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Deployment

GitHub Pages — base path is `/drkherbinventory/`. The `vite.config.ts` base must match. GitHub Actions workflow in `.github/workflows/deploy.yml`.

## Conventions

- Use existing shadcn/ui components from `src/components/ui/` — do not install new UI libraries
- All data mutations go through `useInventory.ts` hook (React Query + Supabase)
- Voice feedback uses browser Speech Synthesis — keep response strings concise
- Herb name correction belongs in `herbCorrection.ts`, not inline in components
- Mobile-first for voice features; desktop-optimized for ordering/reporting features
