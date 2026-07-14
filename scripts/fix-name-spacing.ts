/**
 * Fix name spacing in catalog.json
 *
 * Inserts spaces at camelCase boundaries while keeping known abbreviation
 * clusters (EP, USP, BP, IP, HCl, HBr, etc.) intact.
 *
 * Algorithm:
 *   1. Split at camelCase boundaries (lower→upper, upper→upper+lower, letter→digit)
 *   2. Re-merge any abbreviation clusters that were split apart ("H Cl" → "HCl")
 *   3. Log every change for spot-checking
 *
 * Only modifies the `name` field — synonyms_iupac are left untouched.
 *
 * Usage:
 *   npx tsx scripts/fix-name-spacing.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { CatalogProduct } from '../src/types';

const CATALOG_PATH = path.resolve(__dirname, '../src/data/catalog.json');
const ROOT_CATALOG_PATH = path.resolve(__dirname, '../catalog.json');
const LOG_PATH = path.resolve(__dirname, 'name-spacing-changes.log');

/**
 * Abbreviation clusters that must NOT be split.
 */
const ABBREVIATIONS = [
  'HCl', 'HBr',
  'USP', 'EP', 'BP', 'IP',
  'RCA', 'RCB', 'RCC', 'RC',
  'NA',
] as const;

function fixNameSpacing(name: string): string {
  let result = name;

  // ── Step 1: Insert spaces at camelCase boundaries ──
  // Lowercase letter followed by uppercase letter
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Uppercase letter followed by uppercase+lowercase (handles "EPImpurity")
  result = result.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  // Letter followed by digit (handles "Impurity1")
  result = result.replace(/([a-zA-Z])(\d)/g, '$1 $2');

  // ── Step 2: Re-merge abbreviation clusters that got split ──
  for (const abbr of ABBREVIATIONS) {
    const spaced = abbr.split('').join('\\s?');
    result = result.replace(new RegExp(spaced, 'g'), abbr);
  }

  // ── Step 3: Clean up whitespace ──
  return result.replace(/\s{2,}/g, ' ').trim();
}

function main() {
  // Clear previous log
  fs.writeFileSync(LOG_PATH, '', 'utf-8');

  for (const catPath of [CATALOG_PATH, ROOT_CATALOG_PATH]) {
    if (!fs.existsSync(catPath)) {
      console.log(`Skipping ${path.relative(__dirname, catPath)} — not found`);
      continue;
    }

    const raw = fs.readFileSync(catPath, 'utf-8');
    const products: CatalogProduct[] = JSON.parse(raw);

    const changes: string[] = [];
    let changedCount = 0;

    for (const product of products) {
      const original = product.name;
      const fixed = fixNameSpacing(original);
      if (fixed !== original) {
        changes.push(`[CHANGED] ${product.id}: "${original}" → "${fixed}"`);
        product.name = fixed;
        changedCount++;
      }
    }

    // Write updated catalog
    fs.writeFileSync(catPath, JSON.stringify(products, null, 2) + '\n', 'utf-8');

    // Write log
    const logLines = [
      `PS Laboratories Name Spacing Fix — ${new Date().toISOString()}`,
      `File: ${path.relative(__dirname, catPath)}`,
      `Total products: ${products.length}`,
      `Names changed: ${changedCount}`,
      ``,
      `=== CHANGES ===`,
      ``,
      ...changes,
    ].join('\n');

    fs.appendFileSync(LOG_PATH, logLines + '\n', 'utf-8');

    console.log(`\n✅ ${path.basename(catPath)} — ${changedCount} names changed`);
    if (changedCount > 0) {
      console.log(`   Sample changes:`);
      changes.slice(0, 15).forEach((c) => console.log(`   ${c}`));
      if (changedCount > 15) {
        console.log(`   ... and ${changedCount - 15} more`);
      }
    }
  }

  console.log(`\n📝 Full log written to scripts/name-spacing-changes.log`);
}

main();
