import Link from 'next/link';
import companyInfo from '@/data/company-info.json';
import catalog from '@/data/catalog.json';
import type { CatalogProduct, CompanyInfo } from '@/types';

const company = companyInfo as CompanyInfo;
const products = catalog as CatalogProduct[];

// Featured products: pick first ~8 as placeholder (client should customize)
const featuredProducts = products.slice(0, 8);

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#3D2B7A] to-[#D6006D] text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/80 mb-6">
              ISO 9001:2015 — Quality Management
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-4">
              {company.tagline}
            </h1>
            <p className="text-base lg:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              Custom synthesis of pharmacopeia and non-pharmacopeia reference
              standards, impurities, and APIs for the pharmaceutical industry.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-5 py-2.5 text-sm font-medium bg-white text-[#3D2B7A] rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href="/request-quote"
                className="px-5 py-2.5 text-sm font-medium border border-white/40 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <StatsStrip />

      {/* Expertise categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Our Expertise
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Specialized services supporting pharmaceutical R&D and quality
            control workflows.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {company.expertiseAreas.slice(0, 3).map((area, i) => (
            <Link
              key={i}
              href="/services"
              className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-[#3D2B7A]/30 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-[#D6006D] transition-colors mb-2">
                {area.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {area.description}
              </p>
            </Link>
          ))}
          <Link
            href="/services"
            className="flex items-center justify-center p-5 bg-gray-50 border border-dashed border-gray-300 rounded-xl hover:border-[#3D2B7A]/30 hover:bg-white hover:shadow-sm transition-all text-sm text-gray-500 hover:text-[#3D2B7A]"
          >
            View All Services &rarr;
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Featured Products
              </h2>
              <p className="text-sm text-gray-500">
                A selection from our catalog of{' '}
                {products.length.toLocaleString()} products.
                <span className="ml-1 text-xs text-yellow-600 italic">
                  (placeholder selection — customize as needed)
                </span>
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-[#D6006D] hover:underline hidden sm:block"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#D6006D]/30 hover:shadow-sm transition-all"
              >
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {product.id}
                </p>
                {product.cas_no && (
                  <p className="text-xs text-gray-400 mt-1">CAS: {product.cas_no}</p>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Link
              href="/products"
              className="text-sm font-medium text-[#D6006D] hover:underline"
            >
              View All Products &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* About blurb */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About PS Laboratories
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {company.about}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#D6006D] hover:underline"
            >
              Learn more about us &rarr;
            </Link>
          </div>

          {/* Registrations strip */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
              Registrations
            </h3>
            <div className="space-y-3">
              <RegBadge label="GSTIN" value={company.registrations.gstin} />
              <RegBadge
                label="Udyam"
                value={company.registrations.udyamNumber}
              />
              <RegBadge
                label="Category"
                value={company.registrations.udyamCategory}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Can&apos;t Find What You Need?
          </h2>
          <p className="text-gray-300 text-sm mb-8 max-w-lg mx-auto">
            If you need a specific compound that&apos;s not in our catalog, our
            R&D team can synthesize it for you. Custom synthesis from milligrams
            to kilograms.
          </p>
          <Link
            href="/request-quote"
            className="inline-block px-5 py-2.5 text-sm font-medium bg-[#D6006D] text-white rounded-lg hover:bg-[#D6006D]/90 transition-colors"
          >
            Request Custom Quote
          </Link>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-gradient-to-r from-[#3D2B7A] to-[#D6006D] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <span className="font-medium text-sm">
            Have questions? We&apos;re here to help.
          </span>
          <div className="flex items-center gap-4 text-sm">
            <a
              href={`tel:${company.contact.phones[0].replace(/[^0-9+]/g, '')}`}
              className="hover:underline"
            >
              {company.contact.phones[0]}
            </a>
            <a
              href={`mailto:${company.contact.email}`}
              className="hover:underline"
            >
              {company.contact.email}
            </a>
            <a
              href={`https://wa.me/${company.contact.phones[0].replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function StatsStrip() {
  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '1,140+', label: 'Products' },
    { value: 'Custom', label: 'Pack Sizes' },
    { value: 'In-House', label: 'R&D Team' },
  ];
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-xl lg:text-2xl font-bold text-[#D6006D]">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-xs font-medium text-gray-500 w-16 shrink-0">
        {label}
      </span>
      <span className="font-mono text-xs text-gray-900">{value}</span>
    </div>
  );
}
