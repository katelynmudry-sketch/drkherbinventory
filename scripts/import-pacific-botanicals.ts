/**
 * One-time import script: Pacific Botanicals pricing → SQL
 *
 * Usage:
 *   npx tsx scripts/import-pacific-botanicals.ts
 *
 * Output:
 *   scripts/pb-import.sql  (review this, then run in Supabase SQL Editor)
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { HERB_LIST, HERB_METADATA } from '../src/lib/herbCorrection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XLSX_PATH = path.resolve(__dirname, '../Supplier info/Pacificbotanicals Master Pricing List 10-17-2025.xlsx');
const OUTPUT_PATH = path.resolve(__dirname, 'pb-import.sql');

const USER_ID = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4';
const SUPPLIER_NAME = 'Pacific Botanicals';
const SUPPLIER_URL = 'https://www.pacificbotanicals.com';

interface PBRow {
  itemCode: string;
  description: string;
  price1to4: number;
}

function readPBSheet(): PBRow[] {
  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets['Dry Herb Pricing'];
  if (!ws) throw new Error('Sheet "Dry Herb Pricing" not found');
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: '' });
  const result: PBRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const description = String(row[1] ?? '').trim();
    const price1to4 = Number(row[2]);
    if (!description || !price1to4 || price1to4 <= 0) continue;
    result.push({ itemCode: String(row[0]), description, price1to4 });
  }
  return result;
}

// Part synonyms: PB sometimes says "HERB" for leaf/aerial parts
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

/**
 * Build keyword groups for a herb name.
 * If the herb has explicit pbKeywords in HERB_METADATA, use those directly —
 * each keyword becomes its own single-word group (all must match).
 * Otherwise derive groups from the canonical name words + PART_MAP synonyms.
 */
function herbToKeywordGroups(herbName: string): string[][] {
  const meta = HERB_METADATA[herbName];
  if (meta?.pbKeywords && meta.pbKeywords.length > 0) {
    // Each explicit keyword is its own required group
    return meta.pbKeywords.map(kw => [kw.toUpperCase()]);
  }

  const words = herbName.toUpperCase().split(/\s+/).filter(w => !IGNORE_WORDS.has(w));
  return words.map(word => PART_MAP[word] ?? [word]);
}

/**
 * Returns true if the supplier description contains at least one synonym
 * from every keyword group, using whole-word matching.
 */
function descriptionMatchesHerb(desc: string, groups: string[][]): boolean {
  const upper = desc.toUpperCase();
  return groups.every(group =>
    group.some(syn => new RegExp(`\\b${syn}\\b`).test(upper))
  );
}

function main() {
  console.log('Reading Pacific Botanicals spreadsheet...');
  const rows = readPBSheet();
  console.log(`Found ${rows.length} rows`);

  const herbGroups = HERB_LIST.map(h => ({ name: h, groups: herbToKeywordGroups(h) }));

  const herbToBest: Map<string, PBRow> = new Map();

  for (const pbRow of rows) {
    for (const { name, groups } of herbGroups) {
      if (!descriptionMatchesHerb(pbRow.description, groups)) continue;
      const existing = herbToBest.get(name);
      if (!existing || pbRow.price1to4 < existing.price1to4) {
        herbToBest.set(name, pbRow);
      }
    }
  }

  console.log(`Matched ${herbToBest.size} herbs from HERB_LIST`);

  console.log('\nMatches:');
  for (const [herb, row] of Array.from(herbToBest.entries()).sort((a,b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${herb.padEnd(35)} ← ${row.description} ($${row.price1to4}/lb, #${row.itemCode})`);
  }

  const lines: string[] = [
    '-- Pacific Botanicals price import',
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
      `  VALUES ('${USER_ID}', '${escapedName}', v_supplier_id, ${row.price1to4.toFixed(4)}, '${row.itemCode}', '${escapedItemName}', CURRENT_DATE)`,
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
