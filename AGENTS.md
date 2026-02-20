# HerbInventory - AGENTS.md

Agent guidance for working in this codebase.

## Project Purpose

Herbal inventory app with two primary use contexts:
1. **Phone** — voice-to-text to quickly update herb stock levels at the clinic
2. **Desktop** — research and ordering when herbs are out of stock (pricing + supplier comparison)

## Active Feature: Ordering & Pricing

This is the current development priority. When a bulk herb is marked `out`, the practitioner needs to see a supplier list with pricing from their desktop to place an order.

### What to build

**Database (Supabase)**:
- `suppliers` table: `id`, `name`, `url`, `notes`, `created_at`
- `herb_pricing` table: `id`, `herb_name`, `supplier_id` (FK), `price_per_oz` (numeric), `unit`, `notes`, `url` (product-specific link), `last_updated`, `created_at`

**New page** — `/ordering`:
- Shows all herbs with status `out` in the `bulk` location
- For each herb, shows a table of suppliers sorted by price
- "Update price" inline editing so pricing stays current after each order
- Desktop layout — dense table, not voice-driven
- Link from main inventory: when a bulk herb is `out`, show an "Order" button

**New components**:
- `OrderingPage.tsx` in `src/pages/`
- `SupplierPriceTable.tsx` in `src/components/`
- `AddSupplierDialog.tsx` in `src/components/`
- `AddPricingDialog.tsx` in `src/components/`

**New hook**:
- `useOrdering.ts` in `src/hooks/` — queries for out-of-stock bulk herbs + pricing data

**Routing**: Add `/ordering` route in [src/App.tsx](src/App.tsx)

## Architecture Notes

### Data flow
All data goes through Supabase. Client is initialized in [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts). Types are generated in [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) — update this file when adding new tables.

### State management
Use TanStack React Query for all server state. See [src/hooks/useInventory.ts](src/hooks/useInventory.ts) as the pattern — `useQuery` for reads, `useMutation` with `onSuccess` cache invalidation for writes.

### Voice features
Voice recognition lives in [src/hooks/useVoiceRecognition.ts](src/hooks/useVoiceRecognition.ts). Herb name correction (fuzzy match + synonym map) is in [src/lib/herbCorrection.ts](src/lib/herbCorrection.ts). Do not add ordering features to voice — ordering is desktop-only.

### UI components
Use only existing shadcn/ui components from `src/components/ui/`. Do not add new component libraries. Key components already available: `Dialog`, `Table`, `Button`, `Badge`, `Input`, `Select`, `Card`, `Tabs`, `Toast`.

## Device-Aware Design Rules

| Feature | Phone | Desktop |
|---------|-------|---------|
| Inventory voice input | Primary | Available |
| Ordering / pricing | Not needed | Primary |
| Layout | Single column, large targets | Multi-column, dense tables |
| Voice feedback | Yes | Optional |

Use Tailwind responsive prefixes (`md:`, `lg:`) to differentiate layouts. The `use-mobile.tsx` hook is available for JS-level mobile detection.

## Coding Conventions

- TypeScript throughout — no `any` types
- Zod schemas for form validation (see existing dialogs for pattern)
- React Hook Form for all forms
- Lucide React for icons — check what's already imported before adding new icons
- Herb names stored as entered by user; matching uses `herbCorrection.ts` for fuzzy lookup
- Status values are string literals: `'full'` | `'low'` | `'out'`
- Location values: `'clinic'` | `'backstock'` | `'tincture'` | `'bulk'`

## Testing

Run `npm run test` — Vitest. Add tests in `src/test/`. Focus on:
- Herb name correction/matching logic
- Price comparison sorting
- Voice command parsing

## What NOT to Do

- Do not add voice commands for ordering/pricing — that workflow is desktop-only
- Do not create new UI component libraries — use existing shadcn/ui
- Do not bypass `useInventory.ts` hook for inventory mutations
- Do not hardcode supplier data — it must be user-editable in the database
- Do not use `alert()` or `confirm()` — use shadcn `Dialog` and `sonner` toasts
- Do not modify the GitHub Pages base path in `vite.config.ts` without updating the deploy workflow
