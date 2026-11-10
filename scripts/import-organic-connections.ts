/**
 * One-time import script: Organic Connections bulk herb pricing (CAD) → SQL
 *
 * Usage:
 *   npx tsx scripts/import-organic-connections.ts
 *
 * Output:
 *   scripts/oc-import.sql  (review this, then run in Supabase SQL Editor)
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { HERB_LIST, HERB_METADATA } from '../src/lib/herbCorrection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XLSX_PATH = path.resolve(__dirname, '../Supplier info/Organic Connections CAD Pricelist (Oct 2026).xlsx');
const OUTPUT_PATH = path.resolve(__dirname, 'oc-import.sql');

const USER_ID = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4';
const SUPPLIER_NAME = 'Organic Connections';
const SUPPLIER_URL = 'https://www.organicconnections.ca';

// Price base: 1 lb = 455 g (per Katelyn). All prices are CAD.
const GRAMS_PER_LB = 455;

interface OCRow {
  itemCode: string;
  description: string;
  packageSizeG: number;
  packagePrice: number;
  pricePerLb: number;
}

function readOCSheet(): OCRow[] {
  const wb = XLSX.read(fs.readFileSync(XLSX_PATH));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, { header: 1, defval: null });
  const result: OCRow[] = [];
  const BULK = /^(Bulk Herbs & Spices|Bulk Herbs & Spices \(Consumer\)|Bulk Mushrooms)$/;
  let category = '';

  for (const row of rows.slice(1)) {
    if (row[1]) { category = String(row[1]).trim(); continue; }
    if (!BULK.test(category)) continue;
    const itemCode = String(row[2] ?? '').trim();
    const description = String(row[4] ?? '').trim();
    const size = String(row[6] ?? '').trim().toUpperCase();
    const price = Number(row[8]);
    if (!itemCode || !description || !price || price <= 0) continue;

    // Nominal pack size in lb (the Weight column includes packaging, so ignore it)
    const m = size.match(/^(\d+)\/(\d+)\s*LB$/) ?? size.match(/^(\d+)\s*LB$/);
    if (!m) continue;
    const lbs = m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1]);
    const packageSizeG = Math.round(lbs * GRAMS_PER_LB * 100) / 100;
    result.push({ itemCode, description, packageSizeG, packagePrice: price, pricePerLb: price / lbs });
  }
  return result;
}

// Part synonyms for Clef descriptions
const LEAF_SYNONYMS = ['LEAF', 'LEAVES', 'FEUILLE', 'HERB', 'AERIAL', 'OATSTRAW'];
const ROOT_SYNONYMS = ['ROOT', 'ROOTS', 'RHIZOME', 'RACINE'];
const BARK_SYNONYMS = ['BARK', 'ECORCE'];
const FLOWER_SYNONYMS = ['FLOWER', 'FLOWERS', 'FLEUR', 'BLOSSOM'];
const SEED_SYNONYMS = ['SEED', 'SEEDS', 'BERRY', 'BERRIES', 'GRAINE'];

const PART_MAP: Record<string, string[]> = {
  'LEAF': LEAF_SYNONYMS,
  'LEAVES': LEAF_SYNONYMS,
  'ROOT': ROOT_SYNONYMS,
  'ROOTS': ROOT_SYNONYMS,
  'BARK': BARK_SYNONYMS,
  'FLOWER': FLOWER_SYNONYMS,
  'FLOWERS': FLOWER_SYNONYMS,
  'SEED': SEED_SYNONYMS,
  'SEEDS': SEED_SYNONYMS,
};

const IGNORE_WORDS = new Set(['AND', 'OF', 'THE', 'DE', 'DES', 'DU', 'LA', 'LE']);

function herbToKeywordGroups(herbName: string): string[][] {
  const meta = HERB_METADATA[herbName];
  // Use clefKeywords if defined, else pbKeywords as fallback, else derive from name
  const explicit = meta?.pbKeywords;
  if (explicit && explicit.length > 0) {
    return explicit.map(kw => [kw.toUpperCase()]);
  }
  const words = herbName.toUpperCase().split(/\s+/).filter(w => !IGNORE_WORDS.has(w));
  return words.map(word => PART_MAP[word] ?? [word]);
}

function descriptionMatchesHerb(desc: string, groups: string[][]): boolean {
  const upper = desc.toUpperCase();
  return groups.every(group =>
    group.some(syn => new RegExp(`\\b${syn}\\b`).test(upper))
  );
}

function main() {
  console.log('Reading Organic Connections spreadsheet...');
  const rows = readOCSheet();
  console.log(`Found ${rows.length} bulk herb rows`);

  const herbGroups = HERB_LIST.map(h => ({ name: h, groups: herbToKeywordGroups(h) }));

  const herbToBest: Map<string, OCRow> = new Map();

  for (const ocRow of rows) {
    for (const { name, groups } of herbGroups) {
      if (!descriptionMatchesHerb(ocRow.description, groups)) continue;
      const existing = herbToBest.get(name);
      if (!existing || ocRow.pricePerLb < existing.pricePerLb) {
        herbToBest.set(name, ocRow);
      }
    }
  }

  console.log(`Matched ${herbToBest.size} herbs`);

  console.log('\nMatches:');
  for (const [herb, row] of Array.from(herbToBest.entries()).sort((a,b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${herb.padEnd(35)} ← ${row.description} ($${row.pricePerLb.toFixed(2)}/lb, ${row.packageSizeG}g @ $${row.packagePrice})`);
  }

  const lines: string[] = [
    '-- Clef des Champs bulk herb price import',
    `-- Generated: ${new Date().toISOString()}`,
    '-- Run this in your Supabase SQL Editor',
    '',
    '-- Step 1: Insert supplier',
    `INSERT INTO public.suppliers (user_id, name, url)`,
    `VALUES ('${USER_ID}', '${SUPPLIER_NAME}', '${SUPPLIER_URL}')`,
    `ON CONFLICT (user_id, name) DO NOTHING;`,
    '',
    '-- Step 2: Insert pricing rows',
    `DO $$`,
    `DECLARE v_supplier_id UUID;`,
    `BEGIN`,
    `  SELECT id INTO v_supplier_id FROM public.suppliers`,
    `  WHERE user_id = '${USER_ID}' AND name = '${SUPPLIER_NAME}';`,
    '',
  ];

  let count = 0;
  for (const [herbName, row] of Array.from(herbToBest.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    const escapedName = herbName.replace(/'/g, "''");
    const escapedItemName = row.description.replace(/'/g, "''");
    lines.push(
      `  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)`,
      `  VALUES ('${USER_ID}', '${escapedName}', v_supplier_id, ${row.pricePerLb.toFixed(4)}, ${row.packageSizeG}, ${row.packagePrice.toFixed(4)}, '${row.itemCode}', '${escapedItemName}', CURRENT_DATE)`,
      `  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;`,
      '',
    );
    count++;
  }

  lines.push(`END $$;`);
  lines.push('', `-- Done: ${count} pricing rows`);

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf8');
  console.log(`\nOutput written to: ${OUTPUT_PATH}`);

  console.log('\nUnmatched from HERB_LIST:');
  const matched = new Set(herbToBest.keys());
  HERB_LIST.filter(h => !matched.has(h)).forEach(h => console.log(`  - ${h}`));
}

main();
