/**
 * Data cleaning script for PS Laboratories catalog.
 *
 * Reads catalog.json, performs:
 * 1. Flags entries where synonyms_iupac may contain a leaked product name from
 *    another entry (heuristic: last word matches another product's `name` field).
 * 2. Groups products by parent compound prefix for "related products" display.
 *
 * Output:
 * - Logs warnings to scripts/data-warnings.log for manual review
 * - Prints grouped families to console for verification
 *
 * Usage:
 *   npx tsx scripts/clean-catalog.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { CatalogProduct } from '../src/types';

const CATALOG_PATH = path.resolve(__dirname, '../src/data/catalog.json');
const WARNINGS_PATH = path.resolve(__dirname, 'data-warnings.log');

function main() {
  const raw = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const products: CatalogProduct[] = JSON.parse(raw);

  const warnings: string[] = [];
  const nameSet = new Set(products.map((p) => p.name));

  // ── Task 1: Flag potential product-name leaks in synonyms_iupac ──
  for (const product of products) {
    const syn = (product.synonyms_iupac || '').trim();
    if (!syn) continue;

    // Get the last word that looks like a proper chemical/product name
    const words = syn.split(/[\s;,.()]+/).filter(Boolean);
    const lastWord = words[words.length - 1];

    // Check: does the last word (case-insensitive) match another product name?
    if (
      lastWord &&
      lastWord.length >= 4 &&
      nameSet.has(lastWord) &&
      lastWord !== product.name
    ) {
      warnings.push(
        `[LEAK?] ${product.id} ("${product.name}") — synonyms_iupac ends with "${lastWord}" which is a separate product entry`,
      );
    }

    // Also flag entries containing "Page1", "Page2", etc. (PDF extraction artifacts)
    if (/Page\d/i.test(syn)) {
      warnings.push(
        `[PDF-ARTIFACT] ${product.id} ("${product.name}") — synonyms_iupac contains "PageN" marker: "${syn.slice(-60)}"`,
      );
    }

    // Flag entries where the name itself looks suspiciously long
    if (product.name.length > 60) {
      warnings.push(
        `[LONG-NAME] ${product.id} — name is ${product.name.length} chars, may contain overflow: "${product.name.slice(0, 80)}..."`,
      );
    }
  }

  // Flag entries sharing the same ID but with different names (data conflict)
  const idGroups = new Map<string, string[]>();
  for (const p of products) {
    if (!idGroups.has(p.id)) idGroups.set(p.id, []);
    idGroups.get(p.id)!.push(p.name);
  }
  for (const [id, names] of idGroups) {
    const unique = [...new Set(names)];
    if (unique.length > 1) {
      warnings.push(
        `[ID-CONFLICT] ${id} — ${unique.length} different products share this ID: ${unique.join(', ')}`,
      );
    }
  }

  // ── Task 2: Group products by parent-compound prefix ──
  const prefixGroups = new Map<string, CatalogProduct[]>();

  for (const product of products) {
    // Extract the prefix: e.g., "Albendazole" from "AlbendazoleEPImpurityA"
    // This matches the leading capitalized word (or hyphenated compound)
    const match = product.name.match(/^([A-Za-z][A-Za-z-]+)/);
    const prefix = match ? match[1].toLowerCase() : product.name.toLowerCase();

    if (!prefixGroups.has(prefix)) {
      prefixGroups.set(prefix, []);
    }
    prefixGroups.get(prefix)!.push(product);
  }

  // Filter out single-product groups (only keep families of 2+)
  const families = Array.from(prefixGroups.entries())
    .filter(([, group]) => group.length >= 2)
    .sort((a, b) => b[1].length - a[1].length);

  // ── Write warnings file ──
  const warningLines = [
    `PS Laboratories Catalog Data Cleaning Report`,
    `Generated: ${new Date().toISOString()}`,
    `Total products analyzed: ${products.length}`,
    `Warnings found: ${warnings.length}`,
    `Product families identified: ${families.length}`,
    ``,
    `=== DATA QUALITY WARNINGS (manual review recommended) ===`,
    ``,
    ...warnings.map((w) => `[WARNING] ${w}`),
    ``,
    ``,
    `=== PRODUCT FAMILIES ===`,
    ``,
    ...families.map(
      ([prefix, group]) =>
        `Family "${prefix}": ${group.length} products — ${group.map((p) => p.id).join(', ')}`,
    ),
    ``,
    `=== SUMMARY ===`,
    `Warnings requiring manual review: ${warnings.filter((w) => w.startsWith('[WARNING] [LEAK?]')).length}`,
    `PDF artifact markers: ${warnings.filter((w) => w.includes('[PDF-ARTIFACT]')).length}`,
    `Suspiciously long names: ${warnings.filter((w) => w.includes('[LONG-NAME]')).length}`,
    `Product families with 2+ members: ${families.length}`,
    `Largest family: "${families[0]?.[0] || 'N/A'}" with ${families[0]?.[1]?.length || 0} products`,
  ].join('\n');

  fs.writeFileSync(WARNINGS_PATH, warningLines, 'utf-8');

  // ── Console summary ──
  console.log(`\n✅ Catalog cleaning complete.`);
  console.log(`   Products analyzed: ${products.length}`);
  console.log(`   Warnings logged: ${warnings.length}`);
  console.log(`   Families found: ${families.length}`);
  console.log(`   Details written to: scripts/data-warnings.log`);

  // Show top families
  console.log(`\n📋 Top 10 largest families:`);
  families.slice(0, 10).forEach(([prefix, group]) => {
    console.log(`   "${prefix}": ${group.length} products`);
  });

  if (warnings.length > 0) {
    console.log(`\n⚠️  Sample warnings (first 10):`);
    warnings.slice(0, 10).forEach((w) => {
      console.log(`   ${w}`);
    });
    if (warnings.length > 10) {
      console.log(`   ... and ${warnings.length - 10} more`);
    }
  }
}

main();
