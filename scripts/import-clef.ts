/**
 * One-time import script: Clef des Champs bulk herb pricing → SQL
 *
 * Usage:
 *   npx tsx scripts/import-clef.ts
 *
 * Output:
 *   scripts/clef-import.sql  (review this, then run in Supabase SQL Editor)
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { findBestHerbMatch, HERB_LIST } from '../src/lib/herbCorrection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XLSX_PATH = path.resolve(__dirname, '../Supplier info/MUDRY, KATELYN_2025 CLEF_Order Form_dec 12.xlsx');
const OUTPUT_PATH = path.resolve(__dirname, 'clef-import.sql');

const USER_ID = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4';
const SUPPLIER_NAME = 'Clef des Champs';
const SUPPLIER_URL = 'https://clefdeschamps.net';
const MATCH_THRESHOLD = 0.5;

// Grams per lb
const GRAMS_PER_LB = 453.592;

interface ClefRow {
  itemCode: string;
  description: string;
  packageSizeG: number;   // 250 or 500
  packagePrice: number;   // $ per package
  pricePerLb: number;     // normalized
}

function readClefSheet(): ClefRow[] {
  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets['COMMANDE'];
  if (!ws) throw new Error('Sheet "COMMANDE" not found');

  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, { header: 1, defval: null });

  const result: ClefRow[] = [];

  for (const row of rows) {
    const itemCode = String(row[0] ?? '').trim();
    const description = String(row[2] ?? '').trim();
    const sizeStr = String(row[4] ?? '').trim().toUpperCase();
    const unitStr = String(row[5] ?? '').trim().toUpperCase();
    const unitPrice = Number(row[6]);

    // Only bulk loose herb packages: codes like "401V-500", "417V-250"
    // Skip: tinctures (codes ending in F/S with ML size), caps, teas in retail sizes, blends
    if (!itemCode.match(/^\d+V-\d+$/)) continue;
    if (!sizeStr.includes('GR')) continue;
    if (unitStr !== 'UNIT') continue;
    if (!unitPrice || unitPrice <= 0) continue;

    // Extract gram size (250 or 500)
    const grMatch = sizeStr.match(/(\d+)\s*GR/);
    if (!grMatch) continue;
    const packageSizeG = parseInt(grMatch[1]);
    if (packageSizeG !== 250 && packageSizeG !== 500) continue;

    // Skip obvious non-herb items (spice blends, kelp, etc.)
    if (/COUSCOUS|CURRY|GRILLING|SPAGHETTI|GARAM|HERBES PROVENCE|KELP|PSYLLIUM BARK/i.test(description)) continue;

    const pricePerLb = unitPrice / (packageSizeG / GRAMS_PER_LB);

    result.push({
      itemCode,
      description,
      packageSizeG,
      packagePrice: unitPrice,
      pricePerLb,
    });
  }

  return result;
}

function stripClefSuffixes(name: string): string {
  return name
    .replace(/\b(organic|pwdr|powder|leaf|leaves|root|roots|seed|seeds|berry|berries|herb|flower|flowers|bark|whole|cut|grd|ground|sliced|granulated)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function main() {
  console.log('Reading Clef des Champs spreadsheet...');
  const rows = readClefSheet();
  console.log(`Found ${rows.length} bulk herb rows`);

  // For each herb, find best (cheapest $/lb) Clef entry
  const herbToBestClef: Map<string, ClefRow> = new Map();

  for (const row of rows) {
    const stripped = stripClefSuffixes(row.description);
    const matched = findBestHerbMatch(stripped, MATCH_THRESHOLD);
    if (!matched) {
      console.log(`  No match: "${row.description}" (stripped: "${stripped}")`);
      continue;
    }

    const existing = herbToBestClef.get(matched);
    if (!existing || row.pricePerLb < existing.pricePerLb) {
      herbToBestClef.set(matched, row);
    }
  }

  console.log(`Matched ${herbToBestClef.size} herbs`);

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
  for (const [herbName, row] of Array.from(herbToBestClef.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    const escapedName = herbName.replace(/'/g, "''");
    const escapedItemName = row.description.replace(/'/g, "''");
    const pricePerLb = row.pricePerLb.toFixed(4);
    const packagePrice = row.packagePrice.toFixed(4);

    lines.push(
      `  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)`,
      `  VALUES ('${USER_ID}', '${escapedName}', v_supplier_id, ${pricePerLb}, ${row.packageSizeG}, ${packagePrice}, '${row.itemCode}', '${escapedItemName}', CURRENT_DATE)`,
      `  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;`,
      '',
    );
    count++;
  }

  lines.push(`END $$;`);
  lines.push('', `-- Done: ${count} pricing rows`);

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf8');
  console.log(`\nOutput written to: ${OUTPUT_PATH}`);
  console.log(`\nUnmatched from HERB_LIST:`);
  const matched = new Set(herbToBestClef.keys());
  HERB_LIST.filter(h => !matched.has(h)).forEach(h => console.log(`  - ${h}`));
}

main();
