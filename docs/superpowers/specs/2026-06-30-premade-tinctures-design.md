# Premade Tinctures: Flagging + Order List

## Context

Some herbs aren't made into tinctures in-house — they're bought premade from a
supplier (currently **Herbal Energetics**, a tiered single-herb tincture price
list: Tier 1/2/3 plus a few individually-priced herbs, each priced across four
bottle sizes — 100ml/250ml/500ml/1000ml). About 20 herbs fall into this
category. Staff need to know, at a glance, which low/out clinic herbs are
"don't make, order instead," and a way to build a premade order without
re-typing prices from the supplier sheet each time.

This builds directly on the "Bulk Out" flagging work just shipped
([InventorySection.tsx](src/components/InventorySection.tsx),
[TinctureRestockPanel.tsx](src/components/TinctureRestockPanel.tsx),
[findMatchingInventoryItem](src/hooks/useInventoryCheck.ts)) and the existing
Ordering page pattern
([Ordering.tsx](src/pages/Ordering.tsx),
[usePricing.ts](src/hooks/usePricing.ts)) for suppliers/pricing/order-suggestion
UI. Bulk-out and premade are **independent, non-exclusive** flags — a herb can
be both (sometimes bulk is available and you make it in-house, sometimes it's
not and you order premade instead) — so both badges render side by side
whenever they apply; neither suppresses the other.

## Data model

Three new tables, all personal (`user_id`-scoped, same RLS pattern as
`suppliers`/`herb_pricing`) — no shared/admin-loaded split needed, since this
is single-supplier reference data specific to one practice.

### `tincture_price_tiers`
Reference pricing, seeded once from the Herbal Energetics sheet (Oct 2024
revision) and editable later if prices change:
- `id`, `user_id`
- `tier_label` (text) — `"Tier 1"`, `"Tier 2"`, `"Tier 3"`, or a pair label for
  individually-priced herbs (e.g. `"Beth root & Zizyphus spinosa"`)
- `price_100ml`, `price_250ml`, `price_500ml`, `price_1000ml` (numeric)

7 rows seeded:
| tier_label | 100ml | 250ml | 500ml | 1000ml |
|---|---|---|---|---|
| Tier 1 | 19.95 | 39.95 | 64.95 | 117.00 |
| Tier 2 | 23.95 | 44.95 | 69.95 | 125.95 |
| Tier 3 | 24.95 | 47.95 | 79.95 | 143.95 |
| Beth root & Zizyphus spinosa | 31.95 | 54.95 | 91.95 | 164.95 |
| Buchu & Pulsatilla | 38.95 | 57.95 | 97.95 | 174.50 |
| Ginseng-Korean & Maitake | 44.95 | 75.95 | 126.50 | 225.90 |
| Ginseng-American & Pine Pollen | 52.95 | 88.95 | 149.50 | 269.00 |

### `tincture_price_herbs`
Maps every herb on the sheet (~140 names) to its tier — pure lookup data,
seeded once from the sheet's herb lists (Tier 1/2/3 herb lists + the 8
individually-priced herb names, transcribed verbatim from the supplied PDF):
- `id`, `user_id`, `herb_name` (text), `tier_id` (FK → `tincture_price_tiers`)

### `premade_tinctures`
The actual ~20-herb flag list staff maintain by hand:
- `id`, `user_id`, `herb_name` (text, unique per user), `notes` (text, nullable),
  `default_size_ml` (integer, nullable — last/preferred bottle size, one of
  100/250/500/1000), `created_at`

No new supplier table — "Herbal Energetics" is just added as a row in the
existing `suppliers` table (name + URL), the same way bulk suppliers are
added today, purely for display/reference (its own pricing already lives in
`tincture_price_tiers`, not `herb_pricing`, since the unit is "bottle size"
not "$/lb").

## Matching logic

A small helper, alongside `findMatchingInventoryItem` in
[useInventoryCheck.ts](src/hooks/useInventoryCheck.ts):

```ts
function findHerbNameMatch(targetName: string, candidates: { herb_name: string }[]): T | undefined
```

Same exact → prefix → typo-tolerant matching already used elsewhere, but
operating on plain herb-name strings instead of `InventoryItem`s (since
`premade_tinctures` and `tincture_price_herbs` rows aren't inventory rows).
Used to:
1. Match a `premade_tinctures` entry to its clinic `InventoryItem` (to check
   low/out status and read `getDisplayName`).
2. Match a `premade_tinctures.herb_name` to a `tincture_price_herbs.herb_name`
   (to find its tier and look up the price).

## UI

### Badges (independent, can co-occur)
- **Clinic row** ([InventorySection.tsx](src/components/InventorySection.tsx)),
  shown when clinic status is `low`/`out`:
  - "Bulk OUT" (existing, unchanged)
  - "Premade" (new, purple) — herb is in `premade_tinctures`
- **Clinic Needs panel** ([TinctureRestockPanel.tsx](src/components/TinctureRestockPanel.tsx)):
  same two badges, rendered side by side next to the existing status/backstock
  badges. No change to the existing `TinctureBadge` action-hint text — it
  keeps showing "Grab backstock"/"Start tincture"/"Bulk out — can't make" as
  today; "Premade" is purely an additional badge, not a replacement.

### Premade Order List (new card)
Lives on the **Tinctures tab** in [Index.tsx](src/pages/Index.tsx), directly
below the existing 3-column grid (backstock/tincture/clinic), as its own
`Card` — not a new top-level tab.

- **Row per premade herb currently low/out in clinic**: herb name, clinic
  status badge, a bottle-size `Select` (100/250/500/1000ml, defaulting to
  `default_size_ml` or 500ml), live price (looked up via
  `premade_tinctures.herb_name` → `tincture_price_herbs` → `tincture_price_tiers`
  → selected size column), subtotal, remove-from-list-this-session control
  (mirrors `Ordering.tsx`'s session-only remove pattern).
- **Footer**: running total; an editable "Order minimum $" number input
  (default `300`, persisted — simplest as a `localStorage` value scoped to
  this card, no new table needed for a single number); a "Ready to order"
  green badge once total ≥ minimum, else "$X more to reach minimum" in muted
  text.
- **Collapsible "Manage premade herbs"** (collapsed by default, same pattern
  as Ordering.tsx's "Manage Suppliers & Pricing"): add a herb to
  `premade_tinctures` via autocomplete against the existing herb list, set/edit
  its `default_size_ml`, remove a herb from the list.
- **Collapsible "Price reference"** (collapsed by default, read-only): the
  full seeded `tincture_price_tiers` × `tincture_price_herbs` table, so any
  herb on the sheet can be looked up even before it's added to the premade
  list.

## Out of scope

- No generic CSV/file upload UI for price lists — the Herbal Energetics sheet
  is seeded once via migration SQL (same one-time pattern as the existing
  `scripts/import-*.ts` → SQL-in-migration flow for bulk suppliers); editing
  `tincture_price_tiers`/`tincture_price_herbs` afterward is a manual SQL
  edit, not a built UI, since the sheet changes rarely (matches how shared
  bulk pricing is maintained today).
- No real checkout/cart integration with Herbal Energetics — this is an
  in-app checklist + total, not e-commerce.
- Order minimum is a single global number (per earlier decision), not
  per-supplier — fine since there's currently one premade supplier.
- Not touching `VoiceQuery.tsx`/`VoiceHerbAdd.tsx`/`Reports.tsx`.

## Verification

1. `npm run dev`; confirm the migration seeds 7 tier rows and ~140 herb→tier
   mappings (spot check Valerian → Tier 2 → $69.95 @ 500ml; Reishi → Tier 3 →
   $79.95 @ 500ml; Zizyphus spinosa → its pair tier → $91.95 @ 500ml).
2. Add ~3 herbs to "Manage premade herbs," set one clinic item among them to
   `out`. Confirm it appears in the Premade Order List with the right tier
   price, and shows a purple "Premade" badge in both the clinic row and the
   Clinic Needs panel — alongside the "Bulk OUT" badge if that herb's bulk is
   also out (both visible at once).
3. Change the bottle size on a row; confirm price/subtotal/total update live.
4. Edit the order minimum; confirm the "Ready to order" badge flips at the
   threshold.
5. Run `npm run lint`, `npx tsc --noEmit`, `npm run test`.
