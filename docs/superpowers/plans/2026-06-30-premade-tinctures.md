# Premade Tinctures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let staff flag ~20 herbs as "ordered premade" (not made in-house), see that flag wherever a low/out clinic herb is shown, and build a premade order from Herbal Energetics' real tier pricing without retyping it.

**Architecture:** Three new Supabase tables (two shared reference tables seeded once from the supplier's price sheet, one personal flag list), a small pure name-matching/price-lookup module, two badge insertions into existing components, and one new card component wired into the existing Tinctures tab.

**Tech Stack:** React 18 + TypeScript, TanStack React Query v5, Supabase (Postgres + RLS), Vitest, Tailwind/shadcn.

## Global Constraints

- Currency/display: dollar amounts formatted as `$X.XX` (2 decimals), matching `fmt()` in [Ordering.tsx](src/pages/Ordering.tsx).
- Bottle sizes are exactly `100 | 250 | 500 | 1000` (ml) — no other values.
- `tincture_price_tiers` / `tincture_price_herbs` are **shared, world-readable, no `user_id`** — same pattern as `shared_suppliers`/`shared_herb_pricing` in [20260530_shared_pricing_tables.sql](supabase/migrations/20260530_shared_pricing_tables.sql). They are seeded once via migration; the app never writes to them.
- `premade_tinctures` is **personal** (`user_id`-scoped, full RLS CRUD) — same pattern as `suppliers` in [20260220_ordering_tables.sql](supabase/migrations/20260220_ordering_tables.sql).
- Bulk-out and premade badges are independent — never hide one because the other is showing.
- `src/integrations/supabase/types.ts` is hand-maintained in this repo (no live codegen access) — new tables must be added there manually, matching its existing `Row`/`Insert`/`Update`/`Relationships` shape exactly, or `supabase.from(...)` calls will fail `tsc --noEmit`.

---

## File Structure

| File | Responsibility |
|---|---|
| `supabase/migrations/20260630_premade_tinctures.sql` | Create 3 tables, RLS, seed tier pricing + ~147 herb→tier reference rows |
| `src/integrations/supabase/types.ts` (modify) | Add `Database["public"]["Tables"]` entries for the 3 new tables |
| `src/hooks/useInventoryCheck.ts` (modify) | Extract `matchHerbName` core matcher; add `findHerbNameMatch` generic helper |
| `src/hooks/useInventoryCheck.test.ts` (new) | Unit tests for `matchHerbName` / `findHerbNameMatch` |
| `src/hooks/usePremadeTinctures.ts` (new) | Types + CRUD hooks for the 3 tables + pure `lookupTincturePrice` |
| `src/hooks/usePremadeTinctures.test.ts` (new) | Unit tests for `lookupTincturePrice` |
| `src/components/InventorySection.tsx` (modify) | Add "Premade" badge on clinic rows |
| `src/components/TinctureRestockPanel.tsx` (modify) | Add "Premade" badge in Clinic Needs panel |
| `src/components/PremadeOrderList.tsx` (new) | Order list card: rows, size picker, total/minimum, manage list, price reference |
| `src/pages/Index.tsx` (modify) | Render `<PremadeOrderList />` below the 3-column grid on the Tinctures tab |

---

### Task 1: Migration — tables + seed data

**Files:**
- Create: `supabase/migrations/20260630_premade_tinctures.sql`

**Interfaces:**
- Produces: tables `tincture_price_tiers(id, tier_label, price_100ml, price_250ml, price_500ml, price_1000ml, created_at)`, `tincture_price_herbs(id, herb_name, tier_id, created_at)`, `premade_tinctures(id, user_id, herb_name, notes, default_size_ml, created_at, updated_at)`.

This task has no Vitest cycle (it's SQL, verified by running it against Supabase and querying). Write the full file in one step.

- [ ] **Step 1: Write the migration file**

```sql
-- ============================================================
-- Premade tinctures: tier pricing reference (shared) + per-user flag list
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tier pricing — shared, world-readable reference data (no user_id)
CREATE TABLE public.tincture_price_tiers (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_label   TEXT NOT NULL UNIQUE,
  price_100ml  NUMERIC(10,2) NOT NULL,
  price_250ml  NUMERIC(10,2) NOT NULL,
  price_500ml  NUMERIC(10,2) NOT NULL,
  price_1000ml NUMERIC(10,2) NOT NULL,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tincture_price_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tincture price tiers"
  ON public.tincture_price_tiers FOR SELECT USING (true);

-- 2. Herb → tier lookup — shared, world-readable reference data (no user_id)
CREATE TABLE public.tincture_price_herbs (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  herb_name  TEXT NOT NULL UNIQUE,
  tier_id    UUID NOT NULL REFERENCES public.tincture_price_tiers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tincture_price_herbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tincture price herbs"
  ON public.tincture_price_herbs FOR SELECT USING (true);

-- 3. Premade tinctures — personal flag list, full RLS CRUD
CREATE TABLE public.premade_tinctures (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL,
  herb_name       TEXT NOT NULL,
  notes           TEXT,
  default_size_ml INTEGER,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, herb_name),
  CHECK (default_size_ml IS NULL OR default_size_ml IN (100, 250, 500, 1000))
);

ALTER TABLE public.premade_tinctures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own premade_tinctures"
  ON public.premade_tinctures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own premade_tinctures"
  ON public.premade_tinctures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own premade_tinctures"
  ON public.premade_tinctures FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own premade_tinctures"
  ON public.premade_tinctures FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_premade_tinctures_updated_at
  BEFORE UPDATE ON public.premade_tinctures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Seed: Herbal Energetics price sheet (Oct 2024 revision)
-- ============================================================

INSERT INTO public.tincture_price_tiers (tier_label, price_100ml, price_250ml, price_500ml, price_1000ml) VALUES
  ('Tier 1', 19.95, 39.95, 64.95, 117.00),
  ('Tier 2', 23.95, 44.95, 69.95, 125.95),
  ('Tier 3', 24.95, 47.95, 79.95, 143.95),
  ('Beth root & Zizyphus spinosa', 31.95, 54.95, 91.95, 164.95),
  ('Buchu & Pulsatilla', 38.95, 57.95, 97.95, 174.50),
  ('Ginseng-Korean & Maitake', 44.95, 75.95, 126.50, 225.90),
  ('Ginseng-American & Pine Pollen', 52.95, 88.95, 149.50, 269.00);

WITH tier1 AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Tier 1')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, tier1.id FROM tier1, (VALUES
  ('Achyranthes root'), ('Agastache'), ('Alfalfa'), ('Anemarrhena'), ('Anise'),
  ('Artichoke'), ('Ashwagandha'), ('Astragalus'), ('Black Walnut'), ('Bladderwrack'),
  ('Boldo'), ('Borage'), ('Buckthorn'), ('Burdock'), ('Butcher''s Broom'),
  ('Calendula'), ('Cascara Sagrada'), ('Cat''s Claw'), ('Chickweed'), ('Cilantro'),
  ('Cinnamon'), ('Cleavers'), ('Coltsfoot'), ('Comfrey leaf'), ('Dandelion leaf'),
  ('Dandelion root'), ('Dulse'), ('Elderberries'), ('Eleuthero'), ('Fennel seed'),
  ('Fenugreek seed'), ('Fo-Ti'), ('Garlic'), ('Ginger'), ('Gingko'),
  ('Goat''s Rue'), ('Goldenrod'), ('Green Tea'), ('Hawthorne berries'), ('Hawthorne leaves & flowers'),
  ('Hawthorne Combo'), ('Hibiscus'), ('Holy Basil'), ('Horse Chestnut'), ('Horsetail'),
  ('Hyssop'), ('Juniper berries'), ('Lemon Balm'), ('Licorice Root'), ('Lovage Root'),
  ('Meadowsweet'), ('Milk Thistle'), ('Moutan'), ('Mucuna'), ('Muira Puama'),
  ('Mullein leaf'), ('Nettle leaf'), ('Noni fruit'), ('Oat seed, milky tops'), ('Olive leaf'),
  ('Oregano'), ('Parsley leaf'), ('Parsley root'), ('Passionflower'), ('Pau D''Arco'),
  ('Peppermint'), ('Perillae leaf'), ('Privet berries'), ('Raspberry leaf'), ('Red Peony'),
  ('Rosemary leaf & flower'), ('Sage'), ('Shatavari'), ('Thyme'), ('Tribulus Fruit'),
  ('Turkey Rhubarb'), ('Turmeric'), ('Vitex/Chaste tree berries'), ('Water Plantain'), ('Willow bark'),
  ('Witch Hazel'), ('Wormwood'), ('Yarrow')
) AS v(herb_name);

WITH tier2 AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Tier 2')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, tier2.id FROM tier2, (VALUES
  ('Angelica root'), ('Atractylodes'), ('Bacopa'), ('Baical Skullcap'), ('Balloon flower'),
  ('Barberry'), ('Bilberry Leaves'), ('Bitter Melon'), ('Bitter Orange'), ('Black Cohosh'),
  ('Blessed thistle'), ('Blue Flag'), ('Blue Vervain'), ('Boneset'), ('Bugleweed'),
  ('Bupleurum'), ('California Poppy'), ('Catnip'), ('Cayenne'), ('Celandine'),
  ('Chamomile'), ('Chapparal'), ('Citrus/Mandarin Peel'), ('Coleus'), ('Comfrey root'),
  ('Corn silk'), ('Cornus fruit'), ('Corydalis'), ('Couchgrass'), ('Cramp Bark'),
  ('Cyperus'), ('Damiana'), ('Devil''s Claw'), ('Dong Quai'), ('Echinacea purpurea'),
  ('Echinacea Combo'), ('Elecampane'), ('Elder flowers'), ('Eucommia'), ('Eyebright'),
  ('Feverfew'), ('Figwort'), ('Forsythia fruit'), ('Frankincense'), ('Gardenia fruit'),
  ('Gentian'), ('Gotu Kola'), ('Gravel root'), ('Grindelia'), ('Guggul'),
  ('Gymnema'), ('Horehound'), ('Horny Goat weed'), ('Horseradish'), ('Hydrangea root'),
  ('Isatis/Indigo Woad'), ('Jamaican Dogwood'), ('Japanese Knotweed'), ('Khella seeds'), ('Kudzu'),
  ('Lady''s Mantle'), ('Lavender'), ('Lily of the Valley'), ('Linden'), ('Lobelia'),
  ('Lomatium'), ('Lycii/Gogi berry'), ('Maca'), ('Magnolia bark'), ('Marshmallow root'),
  ('Mimosa Bark'), ('Mistletoe'), ('Motherwort'), ('Mugwort'), ('Mulberry leaf'),
  ('Myrrh'), ('Nettle root'), ('Nettle seed'), ('Oat straw'), ('Ophiopogon'),
  ('Oregon Grape Root'), ('Pellitory of the Wall'), ('Periwinkle'), ('Pinellia'), ('Poke Root'),
  ('Polygala root'), ('Poria'), ('Prickly Ash Bark'), ('Red Cedar Tips'), ('Red Clover blossoms'),
  ('Red Sage root'), ('Rehmannia'), ('Sarsparilla'), ('Saw Palmetto Berries'), ('Schisandra berries'),
  ('Scrophularia'), ('Shepherd''s Purse'), ('Silers root'), ('Skullcap'), ('Spanish needles'),
  ('Stone Root'), ('Teasel'), ('Uva Ursi'), ('Valerian'), ('Wild Cherry bark'),
  ('Wild Lettuce'), ('White Peony'), ('Yellow Dock'), ('Yohimbe')
) AS v(herb_name);

WITH tier3 AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Tier 3')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, tier3.id FROM tier3, (VALUES
  ('Andrographis'), ('Aconite root'), ('Bilberry Berries'), ('Bilberry Combo'), ('Blue Cohosh'),
  ('Chaga'), ('Chanca piedra'), ('Codonopsis'), ('Coptis'), ('Cordyceps'),
  ('Cranesbill'), ('Damask Rose'), ('Echinacea angustifolia'), ('Fringetree'), ('Honeysuckle'),
  ('Hops'), ('Kava'), ('Partridge berry'), ('Pipssissewa'), ('Rauwolfia'),
  ('Red Root'), ('Reishi'), ('Rhodiola root'), ('Safflowers'), ('Solomon''s Seal'),
  ('St. John''s Wort'), ('Stillingia'), ('Usnea'), ('Wild Indigo'), ('Wild Yam')
) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Beth root & Zizyphus spinosa')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Beth root'), ('Zizyphus spinosa')) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Buchu & Pulsatilla')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Buchu'), ('Pulsatilla')) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Ginseng-Korean & Maitake')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Ginseng - Korean'), ('Maitake')) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Ginseng-American & Pine Pollen')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Ginseng - American'), ('Pine Pollen')) AS v(herb_name);
```

- [ ] **Step 2: Apply the migration**

Run it via the Supabase Dashboard SQL Editor (same instruction as the other migrations in this repo — there is no local Supabase stack wired up for this project). If you have CLI access instead: `supabase db push`.

- [ ] **Step 3: Verify the seed**

In the SQL Editor, run:
```sql
SELECT count(*) FROM public.tincture_price_herbs; -- expect 147
SELECT t.tier_label, t.price_500ml FROM public.tincture_price_herbs h
  JOIN public.tincture_price_tiers t ON t.id = h.tier_id
  WHERE h.herb_name IN ('Valerian', 'Reishi', 'Zizyphus spinosa');
-- expect: Valerian -> Tier 2 / 69.95, Reishi -> Tier 3 / 79.95,
--         Zizyphus spinosa -> 'Beth root & Zizyphus spinosa' / 91.95
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260630_premade_tinctures.sql
git commit -m "Add premade tincture pricing tables + Herbal Energetics seed data"
```

---

### Task 2: Add the 3 tables to `types.ts`

**Files:**
- Modify: `src/integrations/supabase/types.ts:328` (insert right after the `herb_reorder_qty` block, before `subscriptions`)

**Interfaces:**
- Consumes: nothing
- Produces: `Database["public"]["Tables"]["tincture_price_tiers" | "tincture_price_herbs" | "premade_tinctures"]` — required before Task 4's hooks will typecheck.

No test cycle (type-only change) — verified by `tsc --noEmit` in Step 2.

- [ ] **Step 1: Insert the three table blocks**

Find this exact text at line 326-329:
```ts
        Relationships: []
      }
      subscriptions: {
```

Replace it with (note: this keeps the existing `herb_reorder_qty` closing brace, then adds three new blocks before `subscriptions`):
```ts
        Relationships: []
      }
      tincture_price_tiers: {
        Row: {
          id: string
          tier_label: string
          price_100ml: number
          price_250ml: number
          price_500ml: number
          price_1000ml: number
          created_at: string
        }
        Insert: {
          id?: string
          tier_label: string
          price_100ml: number
          price_250ml: number
          price_500ml: number
          price_1000ml: number
          created_at?: string
        }
        Update: {
          id?: string
          tier_label?: string
          price_100ml?: number
          price_250ml?: number
          price_500ml?: number
          price_1000ml?: number
          created_at?: string
        }
        Relationships: []
      }
      tincture_price_herbs: {
        Row: {
          id: string
          herb_name: string
          tier_id: string
          created_at: string
        }
        Insert: {
          id?: string
          herb_name: string
          tier_id: string
          created_at?: string
        }
        Update: {
          id?: string
          herb_name?: string
          tier_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tincture_price_herbs_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "tincture_price_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      premade_tinctures: {
        Row: {
          id: string
          user_id: string
          herb_name: string
          notes: string | null
          default_size_ml: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          herb_name: string
          notes?: string | null
          default_size_ml?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          herb_name?: string
          notes?: string | null
          default_size_ml?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
```

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no new errors (the pre-existing unrelated errors in other files, if any, are out of scope — compare against a baseline run before this change if unsure).

- [ ] **Step 3: Commit**

```bash
git add src/integrations/supabase/types.ts
git commit -m "Add Database types for premade tincture tables"
```

---

### Task 3: Shared herb-name matcher

**Files:**
- Modify: `src/hooks/useInventoryCheck.ts:12-37` (the existing `findMatchingInventoryItem`)
- Create: `src/hooks/useInventoryCheck.test.ts`

**Interfaces:**
- Produces: `matchHerbName(targetName: string, candidateNames: string[]): string | undefined` and `findHerbNameMatch<T extends { herb_name: string }>(targetName: string, candidates: T[]): T | undefined` — Task 4 and Task 5/6 depend on `findHerbNameMatch`.
- `findMatchingInventoryItem`'s exported signature and behavior are unchanged — this is a pure internal refactor to share the matching algorithm.

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useInventoryCheck.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { matchHerbName, findHerbNameMatch } from './useInventoryCheck';

describe('matchHerbName', () => {
  it('returns the exact match, case-insensitive', () => {
    expect(matchHerbName('Valerian', ['Skullcap', 'Valerian', 'Yarrow'])).toBe('Valerian');
    expect(matchHerbName('valerian', ['Valerian'])).toBe('Valerian');
  });

  it('falls back to a prefix match', () => {
    expect(matchHerbName('Bupleurum', ['Bupleurum chinensis'])).toBe('Bupleurum chinensis');
  });

  it('falls back to a typo-tolerant match on the first 6 characters', () => {
    expect(matchHerbName('Buplureum', ['Bupleurum'])).toBe('Bupleurum');
  });

  it('returns undefined when nothing matches', () => {
    expect(matchHerbName('Ginseng', ['Valerian', 'Yarrow'])).toBeUndefined();
  });

  it('returns undefined for an empty target', () => {
    expect(matchHerbName('', ['Valerian'])).toBeUndefined();
  });
});

describe('findHerbNameMatch', () => {
  const candidates = [
    { herb_name: 'Valerian', tier: 2 },
    { herb_name: 'Reishi', tier: 3 },
  ];

  it('matches by herb_name and returns the whole candidate object', () => {
    expect(findHerbNameMatch('valerian', candidates)).toEqual({ herb_name: 'Valerian', tier: 2 });
  });

  it('returns undefined when no candidate matches', () => {
    expect(findHerbNameMatch('Ginseng', candidates)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- --run src/hooks/useInventoryCheck.test.ts`
Expected: FAIL — `matchHerbName` and `findHerbNameMatch` are not exported yet.

- [ ] **Step 3: Implement `matchHerbName` and `findHerbNameMatch`, refactor `findMatchingInventoryItem`**

In `src/hooks/useInventoryCheck.ts`, replace lines 10-37 (the comment and the whole `findMatchingInventoryItem` function) with:
```ts
// Core name matcher: exact (case-insensitive) → prefix → typo-tolerant
// (first-6-characters) match. Returns the matching candidate name as given.
export function matchHerbName(targetName: string, candidateNames: string[]): string | undefined {
  const target = targetName.toLowerCase().trim();
  if (!target) return undefined;

  let prefixMatch: string | undefined;
  let typoMatch: string | undefined;
  for (const raw of candidateNames) {
    const name = raw.toLowerCase().trim();
    if (name === target) return raw;
    if (!prefixMatch && (name.startsWith(target) || target.startsWith(name))) {
      prefixMatch = raw;
    }
    if (!typoMatch && target.length >= 5 && name.length >= 5 && target.slice(0, 6) === name.slice(0, 6)) {
      typoMatch = raw;
    }
  }
  return prefixMatch ?? typoMatch;
}

// Generic version of matchHerbName for any candidate shape with a herb_name field
// (e.g. tincture_price_herbs rows, premade_tinctures rows).
export function findHerbNameMatch<T extends { herb_name: string }>(
  targetName: string,
  candidates: T[]
): T | undefined {
  const byName = new Map(candidates.map(c => [c.herb_name, c]));
  const matchedName = matchHerbName(targetName, candidates.map(c => c.herb_name));
  return matchedName ? byName.get(matchedName) : undefined;
}

// Matches an inventory item to its counterpart in another location's item list,
// by herb_id first, then by display name via matchHerbName.
export function findMatchingInventoryItem(
  target: InventoryItem,
  candidates: InventoryItem[]
): InventoryItem | undefined {
  const byId = candidates.find(c => c.herb_id === target.herb_id);
  if (byId) return byId;

  if (!target.herbs) return undefined;
  const targetName = getDisplayName(target.herbs).toLowerCase().trim();
  if (!targetName) return undefined;

  const named = candidates.filter((c): c is InventoryItem & { herbs: NonNullable<InventoryItem['herbs']> } => !!c.herbs);
  const byName = new Map(named.map(c => [getDisplayName(c.herbs).toLowerCase().trim(), c]));
  const matchedKey = matchHerbName(targetName, named.map(c => getDisplayName(c.herbs).toLowerCase().trim()));
  return matchedKey ? byName.get(matchedKey) : undefined;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test -- --run src/hooks/useInventoryCheck.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: Regression-check the existing Bulk Out feature**

Run: `npm run test -- --run` (full suite) and `npx tsc --noEmit`
Expected: all pass — `findMatchingInventoryItem`'s callers in `InventorySection.tsx`/`TinctureRestockPanel.tsx` are unaffected since its signature and behavior didn't change.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useInventoryCheck.ts src/hooks/useInventoryCheck.test.ts
git commit -m "Extract shared herb-name matcher, add findHerbNameMatch"
```

---

### Task 4: `usePremadeTinctures.ts` — types, CRUD hooks, price lookup

**Files:**
- Create: `src/hooks/usePremadeTinctures.ts`
- Create: `src/hooks/usePremadeTinctures.test.ts`

**Interfaces:**
- Consumes: `findHerbNameMatch` from `./useInventoryCheck` (Task 3), `useAuth` from `./useAuth`, `supabase` from `@/integrations/supabase/client`.
- Produces: `BottleSizeMl`, `TincturePriceTier`, `TincturePriceHerb`, `PremadeTincture` types; `useTincturePriceTiers()`, `useTincturePriceHerbs()`, `usePremadeTinctures()`, `useAddPremadeTincture()`, `useUpdatePremadeTincture()`, `useDeletePremadeTincture()` hooks; pure `lookupTincturePrice(herbName, priceHerbs, tiers, sizeMl): number | null`. Task 5/6/7 depend on all of these.

- [ ] **Step 1: Write the failing test for `lookupTincturePrice`**

Create `src/hooks/usePremadeTinctures.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { lookupTincturePrice, TincturePriceTier, TincturePriceHerb } from './usePremadeTinctures';

const tiers: TincturePriceTier[] = [
  { id: 't1', tier_label: 'Tier 1', price_100ml: 19.95, price_250ml: 39.95, price_500ml: 64.95, price_1000ml: 117 },
  { id: 't2', tier_label: 'Tier 2', price_100ml: 23.95, price_250ml: 44.95, price_500ml: 69.95, price_1000ml: 125.95 },
];

const priceHerbs: TincturePriceHerb[] = [
  { id: 'h1', herb_name: 'Valerian', tier_id: 't2' },
  { id: 'h2', herb_name: 'Yarrow', tier_id: 't1' },
];

describe('lookupTincturePrice', () => {
  it('looks up the price for the matching herb and size', () => {
    expect(lookupTincturePrice('Valerian', priceHerbs, tiers, 500)).toBe(69.95);
    expect(lookupTincturePrice('valerian', priceHerbs, tiers, 100)).toBe(23.95);
  });

  it('uses fuzzy name matching like the rest of the app', () => {
    expect(lookupTincturePrice('Yarrow root', priceHerbs, tiers, 1000)).toBe(117);
  });

  it('returns null when the herb has no price entry', () => {
    expect(lookupTincturePrice('Ginseng', priceHerbs, tiers, 500)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- --run src/hooks/usePremadeTinctures.test.ts`
Expected: FAIL — `usePremadeTinctures.ts` doesn't exist yet.

- [ ] **Step 3: Implement the hook file**

Create `src/hooks/usePremadeTinctures.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { findHerbNameMatch } from '@/hooks/useInventoryCheck';

export type BottleSizeMl = 100 | 250 | 500 | 1000;

export interface TincturePriceTier {
  id: string;
  tier_label: string;
  price_100ml: number;
  price_250ml: number;
  price_500ml: number;
  price_1000ml: number;
}

export interface TincturePriceHerb {
  id: string;
  herb_name: string;
  tier_id: string;
}

export interface PremadeTincture {
  id: string;
  user_id: string;
  herb_name: string;
  notes: string | null;
  default_size_ml: BottleSizeMl | null;
  created_at: string;
}

export function useTincturePriceTiers() {
  return useQuery({
    queryKey: ['tincture_price_tiers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tincture_price_tiers').select('*').order('tier_label');
      if (error) throw error;
      return (data ?? []) as TincturePriceTier[];
    },
  });
}

export function useTincturePriceHerbs() {
  return useQuery({
    queryKey: ['tincture_price_herbs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tincture_price_herbs').select('*').order('herb_name');
      if (error) throw error;
      return (data ?? []) as TincturePriceHerb[];
    },
  });
}

export function usePremadeTinctures() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['premade_tinctures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premade_tinctures')
        .select('*')
        .eq('user_id', user!.id)
        .order('herb_name');
      if (error) throw error;
      return (data ?? []) as PremadeTincture[];
    },
    enabled: !!user,
  });
}

export function useAddPremadeTincture() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { herb_name: string; notes?: string; default_size_ml?: BottleSizeMl }) => {
      const { error } = await supabase.from('premade_tinctures').insert({ user_id: user!.id, ...values });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['premade_tinctures'] }),
  });
}

export function useUpdatePremadeTincture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; notes?: string | null; default_size_ml?: BottleSizeMl | null }) => {
      const { error } = await supabase.from('premade_tinctures').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['premade_tinctures'] }),
  });
}

export function useDeletePremadeTincture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('premade_tinctures').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['premade_tinctures'] }),
  });
}

const SIZE_KEYS: Record<BottleSizeMl, keyof TincturePriceTier> = {
  100: 'price_100ml',
  250: 'price_250ml',
  500: 'price_500ml',
  1000: 'price_1000ml',
};

// Pure lookup: find a herb's price for a given bottle size via its tier.
// Uses the same fuzzy name matching as the rest of the app.
export function lookupTincturePrice(
  herbName: string,
  priceHerbs: TincturePriceHerb[],
  tiers: TincturePriceTier[],
  sizeMl: BottleSizeMl
): number | null {
  const herbMatch = findHerbNameMatch(herbName, priceHerbs);
  if (!herbMatch) return null;
  const tier = tiers.find(t => t.id === herbMatch.tier_id);
  if (!tier) return null;
  return tier[SIZE_KEYS[sizeMl]] as number;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- --run src/hooks/usePremadeTinctures.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (this confirms Task 2's types.ts entries match what this file's `supabase.from(...)` calls expect).

- [ ] **Step 6: Commit**

```bash
git add src/hooks/usePremadeTinctures.ts src/hooks/usePremadeTinctures.test.ts
git commit -m "Add premade tincture CRUD hooks and price lookup"
```

---

### Task 5: "Premade" badge on clinic rows

**Files:**
- Modify: `src/components/InventorySection.tsx`

**Interfaces:**
- Consumes: `usePremadeTinctures` from `@/hooks/usePremadeTinctures`, `findHerbNameMatch` from `@/hooks/useInventoryCheck`, `getDisplayName` from `@/hooks/useInventory` (already imported).

No isolated unit test (JSX) — verified via `tsc`/`lint` plus the manual check in Task 8.

- [ ] **Step 1: Add the import and the premade-membership check**

In `src/components/InventorySection.tsx`, update the import line:
```ts
import { checkHerbAvailability, findMatchingInventoryItem, AvailabilityInfo } from '@/hooks/useInventoryCheck';
```
to:
```ts
import { checkHerbAvailability, findMatchingInventoryItem, findHerbNameMatch, AvailabilityInfo } from '@/hooks/useInventoryCheck';
```
and add this import:
```ts
import { usePremadeTinctures } from '@/hooks/usePremadeTinctures';
```

Then, directly below the existing `const { data: bulkInventory = [] } = useInventory('bulk');` line, add:
```ts
  const { data: premadeTinctures = [] } = usePremadeTinctures();
```

Below the existing `herbIsBulkOut` function, add:
```ts
  // Clinic only: is this herb on the "order premade, don't make" list?
  const herbIsPremade = (item: InventoryItem) => {
    if (!item.herbs) return false;
    return !!findHerbNameMatch(getDisplayName(item.herbs), premadeTinctures);
  };
```

- [ ] **Step 2: Pass the flag to `InventoryItemRow`**

Find this line (added by the Bulk Out feature):
```tsx
              isBulkOut={location === 'clinic' && herbIsBulkOut(item)}
```
Add directly after it:
```tsx
              isPremade={location === 'clinic' && herbIsPremade(item)}
```

- [ ] **Step 3: Add the prop to `InventoryItemRowProps` and the component signature**

Find:
```ts
  isBulkOut?: boolean;
  isEditing: boolean;
```
Change to:
```ts
  isBulkOut?: boolean;
  isPremade?: boolean;
  isEditing: boolean;
```

Find:
```ts
  isBulkOut = false,
  isEditing,
```
Change to:
```ts
  isBulkOut = false,
  isPremade = false,
  isEditing,
```

- [ ] **Step 4: Render the badge**

Find:
```tsx
              {isBulkOut && (
                <span className="rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap bg-red-500/20 text-red-700 dark:text-red-400">
                  Bulk OUT
                </span>
              )}
```
Add directly after it:
```tsx
              {isPremade && (
                <span className="rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap bg-purple-500/20 text-purple-700 dark:text-purple-400">
                  Premade
                </span>
              )}
```

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/InventorySection.tsx
git commit -m "Flag premade-ordered herbs on clinic rows"
```

---

### Task 6: "Premade" badge in the Clinic Needs panel

**Files:**
- Modify: `src/components/TinctureRestockPanel.tsx`

**Interfaces:**
- Consumes: `usePremadeTinctures` from `@/hooks/usePremadeTinctures`, `findHerbNameMatch` from `@/hooks/useInventoryCheck`.

- [ ] **Step 1: Add the import and data**

Update the import line:
```ts
import { findMatchingInventoryItem } from '@/hooks/useInventoryCheck';
```
to:
```ts
import { findMatchingInventoryItem, findHerbNameMatch } from '@/hooks/useInventoryCheck';
```
and add:
```ts
import { usePremadeTinctures } from '@/hooks/usePremadeTinctures';
```

Directly below `const { data: bulkInventory = [] } = useInventory('bulk');`, add:
```ts
  const { data: premadeTinctures = [] } = usePremadeTinctures();
```

Directly below the existing `isBulkOutForClinicItem` function, add:
```ts
  // Is this clinic herb on the "order premade, don't make" list?
  const isPremadeForClinicItem = (clinicItem: InventoryItem): boolean => {
    if (!clinicItem.herbs) return false;
    return !!findHerbNameMatch(getDisplayName(clinicItem.herbs), premadeTinctures);
  };
```

- [ ] **Step 2: Thread `premade` through `rows`**

Find:
```ts
    const bulkOut = isBulkOutForClinicItem(clinicItem);
    return { clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut };
  });
```
Change to:
```ts
    const bulkOut = isBulkOutForClinicItem(clinicItem);
    const premade = isPremadeForClinicItem(clinicItem);
    return { clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut, premade };
  });
```

- [ ] **Step 3: Pass it to `RestockRow`**

Find:
```tsx
          {rows.map(({ clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut }) => (
            <RestockRow
              key={clinicItem.id}
              clinicItem={clinicItem}
              tinctureItem={tinctureItem}
              batch={batch}
              hasBackstock={hasBackstock}
              needsAction={needsAction}
              bulkOut={bulkOut}
            />
          ))}
```
Change to:
```tsx
          {rows.map(({ clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut, premade }) => (
            <RestockRow
              key={clinicItem.id}
              clinicItem={clinicItem}
              tinctureItem={tinctureItem}
              batch={batch}
              hasBackstock={hasBackstock}
              needsAction={needsAction}
              bulkOut={bulkOut}
              premade={premade}
            />
          ))}
```

- [ ] **Step 4: Add the prop and render the badge in `RestockRow`**

Find:
```ts
interface RestockRowProps {
  clinicItem: InventoryItem;
  tinctureItem: InventoryItem | null;
  batch: TinctureBatch | null;
  hasBackstock: boolean;
  needsAction: boolean;
  bulkOut: boolean;
}

function RestockRow({ clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut }: RestockRowProps) {
```
Change to:
```ts
interface RestockRowProps {
  clinicItem: InventoryItem;
  tinctureItem: InventoryItem | null;
  batch: TinctureBatch | null;
  hasBackstock: boolean;
  needsAction: boolean;
  bulkOut: boolean;
  premade: boolean;
}

function RestockRow({ clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut, premade }: RestockRowProps) {
```

Find:
```tsx
      {bulkOut && (
        <span className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-red-500/20 text-red-700 dark:text-red-400">
          Bulk OUT
        </span>
      )}
```
Add directly after it:
```tsx
      {premade && (
        <span className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-purple-500/20 text-purple-700 dark:text-purple-400">
          Premade
        </span>
      )}
```

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/TinctureRestockPanel.tsx
git commit -m "Flag premade-ordered herbs in the Clinic Needs panel"
```

---

### Task 7: `PremadeOrderList` card + wire into Index.tsx

**Files:**
- Create: `src/components/PremadeOrderList.tsx`
- Modify: `src/pages/Index.tsx`

**Interfaces:**
- Consumes: everything from Task 4 (`usePremadeTinctures`, `useAddPremadeTincture`, `useUpdatePremadeTincture`, `useDeletePremadeTincture`, `useTincturePriceTiers`, `useTincturePriceHerbs`, `lookupTincturePrice`, `BottleSizeMl`), `findHerbNameMatch` (Task 3), `useInventory('clinic')` + `useHerbs` + `getDisplayName` (existing `useInventory.ts`).
- Produces: `<PremadeOrderList />` — no props, self-contained like `<TinctureRestockPanel />`.

- [ ] **Step 1: Write the component**

Create `src/components/PremadeOrderList.tsx`:
```tsx
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Package, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory, useHerbs, getDisplayName, InventoryItem } from '@/hooks/useInventory';
import { findHerbNameMatch } from '@/hooks/useInventoryCheck';
import {
  usePremadeTinctures,
  useAddPremadeTincture,
  useUpdatePremadeTincture,
  useDeletePremadeTincture,
  useTincturePriceTiers,
  useTincturePriceHerbs,
  lookupTincturePrice,
  BottleSizeMl,
  PremadeTincture,
} from '@/hooks/usePremadeTinctures';
import { toast } from 'sonner';

const SIZES: BottleSizeMl[] = [100, 250, 500, 1000];
const MINIMUM_STORAGE_KEY = 'premadeOrderMinimum';

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

export function PremadeOrderList() {
  const { data: clinicInventory = [] } = useInventory('clinic');
  const { data: herbs = [] } = useHerbs();
  const { data: premadeTinctures = [] } = usePremadeTinctures();
  const { data: priceTiers = [] } = useTincturePriceTiers();
  const { data: priceHerbs = [] } = useTincturePriceHerbs();
  const addPremade = useAddPremadeTincture();
  const updatePremade = useUpdatePremadeTincture();
  const deletePremade = useDeletePremadeTincture();

  const [sizeOverrides, setSizeOverrides] = useState<Record<string, BottleSizeMl>>({});
  const [showManage, setShowManage] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [addHerbValue, setAddHerbValue] = useState('');
  const [minimum, setMinimum] = useState<number>(() => {
    const stored = localStorage.getItem(MINIMUM_STORAGE_KEY);
    return stored ? parseFloat(stored) : 300;
  });

  const updateMinimum = (value: number) => {
    setMinimum(value);
    localStorage.setItem(MINIMUM_STORAGE_KEY, String(value));
  };

  // Clinic items keyed by their display name, for fuzzy herb-name lookups below
  const clinicByDisplayName = useMemo(() => {
    return clinicInventory
      .filter((c): c is InventoryItem & { herbs: NonNullable<InventoryItem['herbs']> } => !!c.herbs)
      .map(c => ({ herb_name: getDisplayName(c.herbs), item: c }));
  }, [clinicInventory]);

  // Premade herbs whose clinic status is low/out
  const needsOrder = useMemo(() => {
    return premadeTinctures
      .map(p => ({ premade: p, clinicItem: findHerbNameMatch(p.herb_name, clinicByDisplayName)?.item ?? null }))
      .filter((row): row is { premade: PremadeTincture; clinicItem: InventoryItem } =>
        !!row.clinicItem && (row.clinicItem.status === 'low' || row.clinicItem.status === 'out')
      );
  }, [premadeTinctures, clinicByDisplayName]);

  const rows = needsOrder.map(({ premade, clinicItem }) => {
    const size = sizeOverrides[premade.id] ?? premade.default_size_ml ?? 500;
    const price = lookupTincturePrice(premade.herb_name, priceHerbs, priceTiers, size);
    return { premade, clinicItem, size, price };
  });

  const total = rows.reduce((sum, r) => sum + (r.price ?? 0), 0);
  const readyToOrder = total >= minimum;

  const existingHerbNames = new Set(premadeTinctures.map(p => p.herb_name));
  const availableHerbs = herbs
    .map(h => getDisplayName(h))
    .filter(name => !existingHerbNames.has(name))
    .sort();

  const handleAdd = async (herbName: string) => {
    if (!herbName) return;
    try {
      await addPremade.mutateAsync({ herb_name: herbName });
      toast.success(`Added ${herbName} to premade list`);
      setAddHerbValue('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add herb');
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="h-4 w-4 text-purple-600" />
          Premade Order List
        </CardTitle>
        <p className="text-xs text-muted-foreground">Herbs ordered premade, not made in-house</p>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No premade herbs currently low/out.</p>
        ) : (
          <div className="space-y-2">
            {rows.map(({ premade, clinicItem, size, price }) => (
              <div key={premade.id} className="flex items-center gap-2 rounded-lg border p-2">
                <span className="flex-1 text-sm font-medium truncate">{premade.herb_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                  clinicItem.status === 'out' ? 'bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {clinicItem.status === 'out' ? 'Out' : 'Low'}
                </span>
                <Select
                  value={String(size)}
                  onValueChange={async (v) => {
                    const sizeMl = parseInt(v) as BottleSizeMl;
                    setSizeOverrides(prev => ({ ...prev, [premade.id]: sizeMl }));
                    await updatePremade.mutateAsync({ id: premade.id, default_size_ml: sizeMl });
                  }}
                >
                  <SelectTrigger className="h-8 w-24 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}ml</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="w-16 text-right text-sm font-semibold text-primary">
                  {price !== null ? fmt(price) : <span className="text-xs text-muted-foreground">no price</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Order minimum:</span>
            <Input
              type="number"
              step="1"
              value={minimum}
              onChange={(e) => updateMinimum(parseFloat(e.target.value) || 0)}
              className="h-8 w-24 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Total: {fmt(total)}</span>
            {readyToOrder ? (
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-green-500/20 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Ready to order
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">{fmt(minimum - total)} more to reach minimum</span>
            )}
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <button
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setShowManage(v => !v)}
          >
            Manage premade herbs
            {showManage ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {showManage && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <Select value={addHerbValue} onValueChange={handleAdd}>
                  <SelectTrigger className="h-8 w-52 text-sm">
                    <SelectValue placeholder="Add a herb…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {availableHerbs.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {premadeTinctures.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded border px-2 py-1.5">
                  <span className="text-sm">{p.herb_name}</span>
                  <Button
                    size="icon" variant="ghost" className="h-6 w-6 text-destructive/70 hover:text-destructive"
                    onClick={async () => {
                      await deletePremade.mutateAsync(p.id);
                      toast.success(`Removed ${p.herb_name} from premade list`);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 border-t pt-3">
          <button
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setShowReference(v => !v)}
          >
            Price reference
            {showReference ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {showReference && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="px-2 pb-1 font-medium">Herb</th>
                    <th className="px-2 pb-1 font-medium">Tier</th>
                    <th className="px-2 pb-1 font-medium text-right">100ml</th>
                    <th className="px-2 pb-1 font-medium text-right">250ml</th>
                    <th className="px-2 pb-1 font-medium text-right">500ml</th>
                    <th className="px-2 pb-1 font-medium text-right">1000ml</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHerbs.map(h => {
                    const tier = priceTiers.find(t => t.id === h.tier_id);
                    if (!tier) return null;
                    return (
                      <tr key={h.id} className="border-b last:border-0">
                        <td className="px-2 py-1">{h.herb_name}</td>
                        <td className="px-2 py-1 text-muted-foreground">{tier.tier_label}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_100ml)}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_250ml)}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_500ml)}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_1000ml)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Wire it into `Index.tsx`**

Add the import near the other component imports:
```ts
import { PremadeOrderList } from '@/components/PremadeOrderList';
```

Find:
```tsx
                <InventorySection
                  location="clinic"
                  title="Clinic Stock"
                  icon={<Stethoscope className="h-5 w-5 text-green-600" />}
                  description="Ready to use"
                  searchQuery={searchQuery}
                  showBatchInfo={batchTrackingMode}
                />
              </div>
            </section>
```
Change to:
```tsx
                <InventorySection
                  location="clinic"
                  title="Clinic Stock"
                  icon={<Stethoscope className="h-5 w-5 text-green-600" />}
                  description="Ready to use"
                  searchQuery={searchQuery}
                  showBatchInfo={batchTrackingMode}
                />
              </div>
              <PremadeOrderList />
            </section>
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PremadeOrderList.tsx src/pages/Index.tsx
git commit -m "Add Premade Order List card to the Tinctures tab"
```

---

### Task 8: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full automated suite**

```bash
npm run lint
npx tsc --noEmit
npm run test -- --run
```
Expected: lint shows no new errors beyond the pre-existing baseline (see the file list noted in the prior Bulk Out feature's lint run — `AddHerbDialog.tsx`, `DuplicateHerbsReview.tsx`, `VoiceHerbAdd.tsx`, `herbCorrection.ts`, `tailwind.config.ts`, and the two pre-existing `InventorySection.tsx` `any` warnings); `tsc` clean; all vitest tests pass.

- [ ] **Step 2: Manual walkthrough**

```bash
npm run dev
```
1. Apply the Task 1 migration to your Supabase project first if not already done.
2. Open the app, go to the Tinctures tab, scroll to "Premade Order List" → "Manage premade herbs," add 2-3 herbs that exist in your inventory (e.g. one that maps to "Valerian" or "Reishi" for an easy price check).
3. Set one of those herbs' clinic status to `out` (via the Clinic Stock column).
4. Confirm: the herb now appears in the Premade Order List with a price; the clinic row shows a purple "Premade" badge; the Clinic Needs panel at the top shows the same badge (alongside "Bulk OUT" if that herb's bulk is also out — confirm both render together, neither hides the other).
5. Change the bottle size dropdown on that row; confirm price/total update immediately.
6. Edit the "Order minimum" field down below the current total; confirm "Ready to order" appears/disappears at the threshold.
7. Expand "Price reference"; confirm it lists ~147 herbs with tier and 4 prices each.

- [ ] **Step 3: Commit if any fixes were needed**

If Step 1 or 2 surfaced anything to fix, fix it and commit normally per the conventions above.
