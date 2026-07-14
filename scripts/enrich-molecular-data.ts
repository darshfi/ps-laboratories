/**
 * Enrich catalog data with molecular formula & weight from PubChem.
 *
 * For each product with a valid CAS number, queries PubChem's PUG REST API:
 *   https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{CAS}/property/...
 *
 * On a match, writes `molecular_formula` and `molecular_weight` into the
 * catalog entry. On no match, leaves those fields absent.
 *
 * Also captures the PubChem CID (for Task 3 — structure images) and writes
 * a CID lookup table to scripts/pubchem-cids.json.
 *
 * Respects PubChem rate limits (~5 req/s) with a 250ms delay between calls.
 *
 * Usage:
 *   npx tsx scripts/enrich-molecular-data.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { CatalogProduct } from '../src/types';

const CATALOG_PATH = path.resolve(__dirname, '../src/data/catalog.json');
const MISSES_PATH = path.resolve(__dirname, 'pubchem-misses.log');
const CIDS_PATH = path.resolve(__dirname, 'pubchem-cids.json');

const REQUEST_DELAY_MS = 250; // ~4 req/s — well within PubChem's 5/s limit

interface PubChemPropertyResponse {
  PropertyTable?: {
    Properties: Array<{
      CID: number;
      MolecularFormula: string;
      MolecularWeight: number;
    }>;
  };
  Fault?: {
    Code: string;
    Message: string;
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Query PubChem for a CAS number. Returns CID, formula, and weight, or null.
 */
async function queryPubChem(
  casNo: string,
): Promise<{ cid: number; formula: string; weight: number } | null> {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(casNo)}/property/MolecularFormula,MolecularWeight/JSON`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      // 404 means not found; any other error is worth noting
      if (res.status === 404) return null;
      console.warn(`   ⚠ HTTP ${res.status} for CAS ${casNo}`);
      return null;
    }

    const data = (await res.json()) as PubChemPropertyResponse;

    if (data.Fault) {
      console.warn(`   ⚠ PubChem fault for CAS ${casNo}: ${data.Fault.Message}`);
      return null;
    }

    const props = data.PropertyTable?.Properties?.[0];
    if (!props) return null;

    return {
      cid: props.CID,
      formula: props.MolecularFormula,
      weight: props.MolecularWeight,
    };
  } catch (err) {
    console.warn(`   ⚠ Network error for CAS ${casNo}: ${err}`);
    return null;
  }
}

/**
 * Check if a CAS number looks valid (not empty, not "NA", has digits).
 */
function isValidCas(cas: string): boolean {
  const trimmed = cas.trim().toUpperCase();
  if (!trimmed || trimmed === 'NA' || trimmed === 'N/A') return false;
  // CAS numbers follow the pattern: xx..xx-x-x
  return /^\d{2,7}-\d{2}-\d$/.test(trimmed);
}

async function main() {
  console.log('🔬 Enriching catalog with molecular data from PubChem...\n');

  const raw = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const products: CatalogProduct[] = JSON.parse(raw);

  const misses: string[] = [];
  const cidMap: Record<string, number> = {}; // product ID → PubChem CID
  let foundCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let total = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    // Skip products without a valid CAS number
    if (!isValidCas(p.cas_no)) {
      skipCount++;
      continue;
    }

    total++;

    if (total % 50 === 0) {
      console.log(`   Progress: ${total} CAS numbers queried...`);
    }

    const result = await queryPubChem(p.cas_no);

    if (result) {
      (p as any).molecular_formula = result.formula;
      (p as any).molecular_weight = Number(result.weight);
      cidMap[p.id] = result.cid;
      foundCount++;
    } else {
      misses.push(`${p.id} | ${p.cas_no} | ${p.name}`);
      errorCount++;
    }

    // Rate limiting delay
    await sleep(REQUEST_DELAY_MS);
  }

  // ── Write updated catalog ──
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(products, null, 2) + '\n', 'utf-8');

  // ── Write misses log ──
  const missLines = [
    `PS Laboratories PubChem Lookup — Missed CAS Numbers`,
    `Generated: ${new Date().toISOString()}`,
    `Total products in catalog: ${products.length}`,
    `Products with valid CAS: ${total}`,
    `Found in PubChem: ${foundCount}`,
    `Not found: ${errorCount}`,
    `Skipped (no/NA CAS): ${skipCount}`,
    ``,
    `=== MISSED CAS NUMBERS (not found in PubChem) ===`,
    ``,
    ...misses.map((m) => `[MISS] ${m}`),
  ].join('\n');
  fs.writeFileSync(MISSES_PATH, missLines, 'utf-8');

  // ── Write CID map (for Task 3) ──
  fs.writeFileSync(CIDS_PATH, JSON.stringify(cidMap, null, 2) + '\n', 'utf-8');

  console.log(`\n✅ Enrichment complete.`);
  console.log(`   Products in catalog: ${products.length}`);
  console.log(`   Valid CAS numbers:   ${total}`);
  console.log(`   Found in PubChem:    ${foundCount}`);
  console.log(`   Not found (misses):  ${errorCount}`);
  console.log(`   Skipped (no/NA CAS): ${skipCount}`);
  console.log(`\n📝 Misses logged to: scripts/pubchem-misses.log`);
  console.log(`📝 CID map saved to: scripts/pubchem-cids.json`);
}

main();
