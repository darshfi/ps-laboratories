'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import catalog from '@/data/catalog.json';
import type { CatalogProduct } from '@/types';
import AddToEnquiryButton from '@/components/AddToEnquiryButton';

const rawProducts = catalog as CatalogProduct[];
const PER_PAGE = 36;

// Deduplicate entries with the same ID+name (exact catalog duplicates).
// For entries that share an ID but have different names (like BTH201),
// we make them distinguishable by suffixing the ID.
const seen = new Set<string>();
const idCounts = new Map<string, number>();
const products: CatalogProduct[] = [];

for (const p of rawProducts) {
  const exactKey = p.id + '|' + p.name;
  if (seen.has(exactKey)) continue; // skip exact duplicate
  seen.add(exactKey);
  // Track how many times we've seen this ID (for non-exact dupes)
  idCounts.set(p.id, (idCounts.get(p.id) ?? 0) + 1);
  products.push(p);
}

const fuse = new Fuse(products, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'id', weight: 1.5 },
    { name: 'cas_no', weight: 1.5 },
    { name: 'synonyms_iupac', weight: 0.5 },
  ],
  threshold: 0.3,
  minMatchCharLength: 2,
});

// Build unique key for each product
function productKey(p: CatalogProduct, index: number): string {
  const count = idCounts.get(p.id) ?? 1;
  return count === 1 ? p.id : p.id + '-' + (p.cas_no || 'idx' + index);
}

/** Get the first letter of a product's name, or '#' for non-alpha starts */
function nameFirstLetter(p: CatalogProduct): string {
  const first = p.name.charAt(0);
  if (/[A-Za-z]/.test(first)) return first.toUpperCase();
  return '#';
}

// All letters present in the catalog
const availableLetters = Array.from(
  new Set(products.map(nameFirstLetter)),
).sort();

type SortKey = 'name-asc' | 'name-desc' | 'weight-asc' | 'weight-desc' | 'cas-asc';

function sortProducts(list: CatalogProduct[], sortBy: SortKey): CatalogProduct[] {
  const sorted = [...list];
  switch (sortBy) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'weight-asc':
      sorted.sort((a, b) => (a.molecular_weight ?? 0) - (b.molecular_weight ?? 0));
      break;
    case 'weight-desc':
      sorted.sort((a, b) => (b.molecular_weight ?? 0) - (a.molecular_weight ?? 0));
      break;
    case 'cas-asc':
      sorted.sort((a, b) => a.cas_no.localeCompare(b.cas_no));
      break;
  }
  return sorted;
}

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [letter, setLetter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortKey>('name-asc');

  // Sync state from URL search params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setQuery(q);
    const p = params.get('page');
    if (p) {
      const n = parseInt(p, 10);
      if (n > 0) setPage(n);
    }
    const l = params.get('letter');
    if (l && l.length === 1) setLetter(l.toUpperCase());
    const s = params.get('sort') as SortKey | null;
    if (s && ['name-asc', 'name-desc', 'weight-asc', 'weight-desc', 'cas-asc'].includes(s)) {
      setSortBy(s);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (page > 1) params.set('page', String(page));
    if (letter) params.set('letter', letter);
    if (sortBy !== 'name-asc') params.set('sort', sortBy);
    const qs = params.toString();
    window.history.replaceState(null, '', '/products' + (qs ? '?' + qs : ''));
  }, [query, page, letter, sortBy]);

  // ── Filter pipeline ──

  // Step 1: search (if query is present)
  const searched = useMemo(() => {
    if (!query.trim()) return products;
    return fuse.search(query.trim()).map((r) => r.item);
  }, [query]);

  // Step 2: letter filter
  const letterFiltered = useMemo(() => {
    if (!letter) return searched;
    return searched.filter((p) => nameFirstLetter(p) === letter);
  }, [searched, letter]);

  // Step 3: sort
  const sorted = useMemo(() => sortProducts(letterFiltered, sortBy), [letterFiltered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));

  // Clamp page to valid range
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(
    () => sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE),
    [sorted, safePage],
  );

  const goToPage = useCallback(
    (p: number) => {
      setPage(Math.max(1, Math.min(p, totalPages)));
    },
    [totalPages],
  );

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setPage(1);
  }, [query, letter, sortBy]);

  // Keep page in valid range if results shrink
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Alphabet A–Z including all present letters
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Product Catalog
        </h1>
        <p className="text-gray-600 text-sm">
          Browse our range of {products.length.toLocaleString()} pharmaceutical
          reference standards, impurities, and research compounds.
        </p>
      </div>

      {/* Search & Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xl">
          <label htmlFor="product-search" className="sr-only">
            Search products by name, CAS number, or code
          </label>
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, CAS number, or product code..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D2B7A]/30 focus:border-[#3D2B7A] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sort-select" className="text-xs text-gray-500 font-medium">
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D2B7A]/30 focus:border-[#3D2B7A] transition-colors bg-white"
          >
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="weight-asc">Mol. Weight ↑</option>
            <option value="weight-desc">Mol. Weight ↓</option>
            <option value="cas-asc">CAS Number</option>
          </select>
        </div>
      </div>

      {/* Alphabetical A–Z filter strip */}
      <div
        className="flex flex-wrap gap-1 mb-6"
        role="group"
        aria-label="Filter by first letter"
      >
        <button
          onClick={() => setLetter('')}
          className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
            !letter
              ? 'bg-[#3D2B7A] text-white border-[#3D2B7A]'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
          aria-label="Show all products"
        >
          All
        </button>
        {allLetters.map((ch) => {
          const hasLetter = availableLetters.includes(ch);
          return (
            <button
              key={ch}
              onClick={() => setLetter(ch)}
              disabled={!hasLetter}
              className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                letter === ch
                  ? 'bg-[#3D2B7A] text-white border-[#3D2B7A]'
                  : hasLetter
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-100 text-gray-300 cursor-not-allowed'
              }`}
              aria-label={`Filter by names starting with ${ch}`}
              aria-pressed={letter === ch}
            >
              {ch}
            </button>
          );
        })}
        {/* # button for non-alpha-starting products */}
        {availableLetters.includes('#') && (
          <button
            onClick={() => setLetter('#')}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
              letter === '#'
                ? 'bg-[#3D2B7A] text-white border-[#3D2B7A]'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Filter products starting with numbers or symbols"
            aria-pressed={letter === '#'}
          >
            #️⃣
          </button>
        )}
      </div>

      {/* Results info */}
      <p className="text-xs text-gray-400 mb-4">
        {query.trim()
          ? `${sorted.length} product${sorted.length === 1 ? '' : 's'} found`
          : `${sorted.length.toLocaleString()} product${sorted.length === 1 ? '' : 's'}${letter ? ` starting with "${letter}"` : ''}`}
        {totalPages > 1 && ` · Page ${safePage} of ${totalPages}`}
      </p>

      {/* Product grid */}
      {paginated.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500 font-medium">
            No products found{query.trim() ? ` for "${query}"` : ''}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different search term, clear the letter filter, or browse the full catalog.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((product, index) => (
              <ProductRow key={productKey(product, index)} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-1.5 mt-8 flex-wrap"
              aria-label="Product pages"
            >
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage <= 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                aria-label="Previous page"
              >
                &larr; Prev
              </button>
              {getPageNumbers(safePage, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`e${i}`} className="px-2 text-gray-400 text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      p === safePage
                        ? 'bg-[#3D2B7A] text-white border-[#3D2B7A]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${p}`}
                    aria-current={p === safePage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage >= totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                aria-label="Next page"
              >
                Next &rarr;
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function ProductRow({ product }: { product: CatalogProduct }) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <Link href={`/products/${product.id}`} className="group flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 group-hover:text-[#D6006D] truncate transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          {product.cas_no && (
            <span className="font-mono">CAS: {product.cas_no}</span>
          )}
          <span className="font-mono text-gray-400">{product.id}</span>
        </div>
        {product.synonyms_iupac && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
            {product.synonyms_iupac}
          </p>
        )}
        {product.molecular_formula && (
          <p className="text-xs text-gray-400 mt-1 font-mono">
            {product.molecular_formula}
            {product.molecular_weight ? ` · ${product.molecular_weight} g/mol` : ''}
          </p>
        )}
      </Link>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <Link
          href={`/products/${product.id}`}
          className="text-xs font-medium text-[#3D2B7A] hover:underline"
        >
          View Details
        </Link>
        <span className="text-gray-300 text-xs">|</span>
        <AddToEnquiryButton product={product} variant="small" />
      </div>
    </div>
  );
}

function getPageNumbers(
  current: number,
  total: number,
): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
