import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CatalogProduct } from '@/types';
import AddToEnquiryButton from '@/components/AddToEnquiryButton';
import JsonLd from '@/components/JsonLd';

type Props = { params: Promise<{ id: string }> };

// Import catalog data at build time
import catalog from '@/data/catalog.json';
// Deduplicate — keep the first occurrence of each product ID.
const rawProducts = catalog as CatalogProduct[];
const catalogMap = new Map<string, CatalogProduct>();
for (const p of rawProducts) {
  if (!catalogMap.has(p.id)) catalogMap.set(p.id, p);
}
const products = Array.from(catalogMap.values());

// Build related-product family index
const familyIndex = buildFamilyIndex(products);

function buildFamilyIndex(products: CatalogProduct[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const p of products) {
    const match = p.name.match(/^([A-Za-z]+)/);
    const prefix = match ? match[1].toLowerCase() : p.name.toLowerCase();
    if (!map.has(prefix)) map.set(prefix, []);
    map.get(prefix)!.push(p.id);
  }
  return map;
}

function getRelatedProducts(product: CatalogProduct, max = 6): CatalogProduct[] {
  const match = product.name.match(/^([A-Za-z]+)/);
  const prefix = match ? match[1].toLowerCase() : '';
  const siblings = prefix ? familyIndex.get(prefix) ?? [] : [];
  const related = siblings
    .filter((id) => id !== product.id)
    .map((id) => catalogMap.get(id)!)
    .filter(Boolean);
  return related.slice(0, max);
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = catalogMap.get(id);
  if (!product) return { title: 'Product Not Found | PS Laboratories' };
  return {
    title: `${product.name} (${product.id}) | PS Laboratories`,
    description: `${product.name} — CAS ${product.cas_no}. Pharmaceutical reference standard and impurity. Request a quote from PS Laboratories.`,
    alternates: { canonical: `/products/${product.id}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = catalogMap.get(id);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    identifier: product.id,
    category: 'Pharmaceutical Reference Standard',
    description: `${product.synonyms_iupac ? product.synonyms_iupac + '. ' : ''}CAS Number: ${product.cas_no}. Manufactured by PS Laboratories.`,
    manufacturer: {
      '@type': 'Organization',
      name: 'PS Laboratories',
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      description: 'Contact for pricing — request a quote.',
    },
  };

  return (
    <>
      <JsonLd data={jsonLd as Record<string, unknown>} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#3D2B7A] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-[#3D2B7A] transition-colors">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 mb-6 font-mono">Code: {product.id}</p>

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
              {/* CAS Number */}
              <DetailRow label="CAS Number" value={product.cas_no} mono />

              {/* Synonyms / IUPAC */}
              {product.synonyms_iupac && (
                <DetailRow
                  label="Synonyms / IUPAC Name"
                  value={product.synonyms_iupac}
                />
              )}

              {/* Molecular Formula — TBD */}
              <DetailRow
                label="Molecular Formula"
                value="—"
                note="Data not yet available"
              />

              {/* Molecular Weight — TBD */}
              <DetailRow
                label="Molecular Weight (g/mol)"
                value="—"
                note="Data not yet available"
              />
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <AddToEnquiryButton product={product} />
              <Link
                href={`/enquiry?add=${product.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-[#3D2B7A] text-[#3D2B7A] rounded-lg hover:bg-[#3D2B7A]/5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Request Quote
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Our team can help
                with custom synthesis and specific impurity requirements.
              </p>
              <Link
                href="/request-quote"
                className="block text-center px-4 py-2.5 text-sm font-medium bg-[#3D2B7A] text-white rounded-lg hover:bg-[#3D2B7A]/90 transition-colors"
              >
                Submit Custom Enquiry
              </Link>
            </div>
          </aside>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-12 lg:mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-[#D6006D]/30 hover:shadow-sm transition-all"
                >
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {rp.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 font-mono">
                    {rp.id}
                  </div>
                  {rp.cas_no && (
                    <div className="text-xs text-gray-400 mt-1">
                      CAS: {rp.cas_no}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  note,
  mono,
}: {
  label: string;
  value: string;
  note?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className={`text-sm ${mono ? 'font-mono' : ''} text-gray-900`}>
        {value || '—'}
        {note && (
          <span className="ml-2 text-xs text-yellow-600 italic">({note})</span>
        )}
      </dd>
    </div>
  );
}
