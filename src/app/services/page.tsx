import { Metadata } from 'next';
import Link from 'next/link';
import companyInfo from '@/data/company-info.json';
import type { CompanyInfo } from '@/types';

const company = companyInfo as CompanyInfo;

export const metadata: Metadata = {
  title: 'Services & Expertise | PS Laboratories',
  description:
    'PS Laboratories offers custom synthesis, impurity isolation, HPLC purification, structure elucidation, and process R&D services for the pharmaceutical industry.',
  alternates: { canonical: '/services' },
};

const serviceIcons: Record<string, string> = {
  'Custom Synthesis / Bulk Chemicals': '🔬',
  'Custom Research': '🧪',
  Impurities: '⚗️',
  'In-house R&D product range': '🧬',
  Services: '📋',
};

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
          Our Services &amp; Expertise
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          PS Laboratories provides a comprehensive range of services supporting
          pharmaceutical R&D, quality control, and regulatory compliance
          workflows.
        </p>
      </div>

      {/* Expertise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {company.expertiseAreas.map((area, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-3" aria-hidden="true">
              {serviceIcons[area.title] || '📦'}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {area.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {area.description}
            </p>
          </div>
        ))}
      </div>

      {/* Two-column info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Process */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Our Approach
          </h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Every project begins with understanding your exact requirements.
              Our R&D team evaluates the feasibility, designs the synthetic
              route, and provides a timeline and cost estimate.
            </p>
            <p>
              We work from milligram to kilogram scale, with strict quality
              control at every stage. All products are characterized using
              appropriate analytical techniques (HPLC, NMR, MS, etc.) and
              delivered with a Certificate of Analysis.
            </p>
            <p>
              For impurity standards, we follow ICH guidelines and can provide
              the relevant regulatory documentation to support your filings.
            </p>
          </div>
        </div>

        {/* Quality */}
        <div className="bg-gradient-to-br from-[#3D2B7A]/5 to-[#D6006D]/5 border border-[#3D2B7A]/20 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quality Commitment
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {[
              'Strict in-process quality checks at every stage of synthesis',
              'Comprehensive characterization using modern analytical instruments',
              'Certificate of Analysis with every shipment',
              'Stability-tested packaging for sensitive compounds',
              'Confidentiality agreements available for proprietary work',
              'Timely communication and project updates',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-green-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-gray-900 rounded-xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-3">
          Have a Custom Synthesis Project?
        </h2>
        <p className="text-sm text-gray-300 mb-6 max-w-lg mx-auto">
          If you can draw the structure, we can make it. Share your requirements
          and our R&D team will respond with a proposal.
        </p>
        <Link
          href="/request-quote"
          className="inline-block px-5 py-2.5 text-sm font-medium bg-[#D6006D] text-white rounded-lg hover:bg-[#D6006D]/90 transition-colors"
        >
          Start Your Project
        </Link>
      </section>
    </div>
  );
}
