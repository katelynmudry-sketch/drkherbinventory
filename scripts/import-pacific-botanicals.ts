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
import { HERB_LIST, findBestHerbMatch } from '../src/lib/herbCorrection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XLSX_PATH = path.resolve(__dirname, '../Supplier info/Pacificbotanicals Master Pricing List 10-17-2025.xlsx');
const OUTPUT_PATH = path.resolve(__dirname, 'pb-import.sql');

// Your Supabase user ID — must match what's in the DB
const USER_ID = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4';

const SUPPLIER_NAME = 'Pacific Botanicals';
const SUPPLIER_URL = 'https://www.pacificbotanicals.com';

// Levenshtein threshold for fuzzy matching
const MATCH_THRESHOLD = 0.55;

interface PBRow {
  itemCode: string | number;
  description: string;
  price1to4: number; // $/lb for 1-4 lb tier
}

function readPBSheet(): PBRow[] {
  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets['Dry Herb Pricing'];
  if (!ws) throw new Error('Sheet "Dry Herb Pricing" not found');

  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: '' });

  const result: PBRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const itemCode = row[0];
    const description = String(row[1] ?? '').trim();
    const price1to4 = Number(row[2]);

    if (!description || !price1to4 || price1to4 <= 0) continue;

    result.push({ itemCode: String(itemCode), description, price1to4 });
  }
  return result;
}

function stripSuffixes(name: string): string {
  // Remove quality/form suffixes PB appends: OG, ROC, OU, CUT, POWDER, WHOLE, etc.
  return name
    .replace(/\b(OG|ROC|OU|CUT|POWDER|POWDERED|WHOLE|SEED|BERRY|BERRIES|ROOT|ROOTS|LEAF|LEAVES|HERB|FLOWER|FLOWERS|BARK|FRESH|DRIED|ORGANIC|WILD|GROUND|GRANULATED|JUICE|EXTRACT)\b/gi, '')
    .replace(/[-X]+$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function main() {
  console.log('Reading Pacific Botanicals spreadsheet...');
  const rows = readPBSheet();
  console.log(`Found ${rows.length} rows`);

  // For each HERB_LIST herb, find the best (cheapest) PB match
  const herbToBestPB: Map<string, { row: PBRow; score: number }> = new Map();

  for (const row of rows) {
    const stripped = stripSuffixes(row.description);
    const matched = findBestHerbMatch(stripped, MATCH_THRESHOLD);
    if (!matched) continue;

    const existing = herbToBestPB.get(matched);
    if (!existing || row.price1to4 < existing.row.price1to4) {
      herbToBestPB.set(matched, { row, score: 1 });
    }
  }

  console.log(`Matched ${herbToBestPB.size} herbs from HERB_LIST`);

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
  for (const [herbName, { row }] of Array.from(herbToBestPB.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    const escapedName = herbName.replace(/'/g, "''");
    const escapedItemName = row.description.replace(/'/g, "''");
    const pricePerLb = row.price1to4.toFixed(4);

    lines.push(
      `  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)`,
      `  VALUES ('${USER_ID}', '${escapedName}', v_supplier_id, ${pricePerLb}, '${row.itemCode}', '${escapedItemName}', CURRENT_DATE)`,
      `  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;`,
      '',
    );
    count++;
  }

  lines.push(`END $$;`);
  lines.push('', `-- Done: ${count} pricing rows`);

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf8');
  console.log(`\nOutput written to: ${OUTPUT_PATH}`);
  console.log(`Matched herbs: ${count}`);
  console.log('\nUnmatched from your HERB_LIST:');
  const matched = new Set(herbToBestPB.keys());
  HERB_LIST.filter(h => !matched.has(h)).forEach(h => console.log(`  - ${h}`));
}

main();
