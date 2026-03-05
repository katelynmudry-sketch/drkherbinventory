/**
 * One-time import script: Mountain Rose Herbs wholesale pricing → SQL
 *
 * Usage:
 *   npx tsx scripts/import-mountain-rose.ts
 *
 * Output:
 *   scripts/mrh-import.sql  (review this, then run in Supabase SQL Editor)
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { HERB_LIST, HERB_METADATA } from '../src/lib/herbCorrection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XLSX_PATH = path.resolve(__dirname, '../Supplier info/Mountain Rose Wholesale Price List.xlsx');
const OUTPUT_PATH = path.resolve(__dirname, 'mrh-import.sql');

const USER_ID = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4';
const SUPPLIER_NAME = 'Mountain Rose Herbs';
const SUPPLIER_URL = 'https://www.mountainroseherbs.com';

interface MRHRow {
  sku: string;
  description: string;
  pricePerLb: number;
}

function readMRHSheet(): MRHRow[] {
  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets['Herbs & Spices'];
  if (!ws) throw new Error('Sheet "Herbs & Spices" not found');
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: '' });
  const result: MRHRow[] = [];

  for (const row of rows) {
    const sku = String(row[1] ?? '').trim();
    const description = String(row[2] ?? '').trim();
    const size = String(row[3] ?? '').trim();
    const wholesale = Number(row[5]);

    // Only 1lb SKUs (suffix -17) with a valid wholesale price
    if (!sku.endsWith('-17')) continue;
    if (!description || !wholesale || wholesale <= 0) continue;
    if (size !== '1lb') continue;

    result.push({ sku, description, pricePerLb: wholesale });
  }
  return result;
}

// Part synonyms for MRH descriptions
const LEAF_SYNONYMS = ['LEAF', 'LEAVES', 'HERB', 'AERIAL'];
const ROOT_SYNONYMS = ['ROOT', 'ROOTS', 'RHIZOME'];
const BARK_SYNONYMS = ['BARK'];
const FLOWER_SYNONYMS = ['FLOWER', 'FLOWERS', 'BLOSSOM'];
const SEED_SYNONYMS = ['SEED', 'SEEDS', 'BERRY', 'BERRIES'];

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
  // Use mrhKeywords if defined, else pbKeywords as fallback, else derive from name
  const explicit = meta?.mrhKeywords ?? meta?.pbKeywords;
  if (explicit && explicit.length > 0) {
    return explicit.map((kw: string) => [kw.toUpperCase()]);
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
  console.log('Reading Mountain Rose Herbs spreadsheet...');
  const rows = readMRHSheet();
  console.log(`Found ${rows.length} 1lb pricing rows`);

  const herbGroups = HERB_LIST.map(h => ({ name: h, groups: herbToKeywordGroups(h) }));

  const herbToBest: Map<string, MRHRow> = new Map();

  for (const mrhRow of rows) {
    for (const { name, groups } of herbGroups) {
      if (!descriptionMatchesHerb(mrhRow.description, groups)) continue;
      const existing = herbToBest.get(name);
      if (!existing || mrhRow.pricePerLb < existing.pricePerLb) {
        herbToBest.set(name, mrhRow);
      }
    }
  }

  console.log(`Matched ${herbToBest.size} herbs from HERB_LIST`);

  console.log('\nMatches:');
  for (const [herb, row] of Array.from(herbToBest.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${herb.padEnd(35)} ← ${row.description} ($${row.pricePerLb.toFixed(2)}/lb, ${row.sku})`);
  }

  const lines: string[] = [
    '-- Mountain Rose Herbs price import',
    `-- Generated: ${new Date().toISOString()}`,
    '-- Run this in your Supabase SQL Editor',
    '',
    '-- Step 1: Insert supplier (skip if exists)',
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
      `  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)`,
      `  VALUES ('${USER_ID}', '${escapedName}', v_supplier_id, ${row.pricePerLb.toFixed(4)}, '${row.sku}', '${escapedItemName}', CURRENT_DATE)`,
      `  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;`,
      '',
    );
    count++;
  }

  lines.push(`END $$;`);
  lines.push('', `-- Done: ${count} pricing rows`);

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf8');
  console.log(`\nOutput written to: ${OUTPUT_PATH}`);

  console.log('\nUnmatched from your HERB_LIST:');
  const matched = new Set(herbToBest.keys());
  HERB_LIST.filter(h => !matched.has(h)).forEach(h => console.log(`  - ${h}`));
}

main();
