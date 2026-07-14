import { Metadata } from 'next';
import Link from 'next/link';
import companyInfo from '@/data/company-info.json';
import type { CompanyInfo } from '@/types';

const company = companyInfo as CompanyInfo;

export const metadata: Metadata = {
  title: 'About Us | PS Laboratories',
  description:
    'Learn about PS Laboratories, an ISO 9001:2015 certified manufacturer of pharmaceutical reference standards, impurities, and APIs based in Gujarat, India.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Hero section */}
      <div className="mb-12">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          About PS Laboratories
        </h1>
        <p className="text-gray-600 leading-relaxed">{company.about}</p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-[#3D2B7A]/5 to-[#3D2B7A]/10 border border-[#3D2B7A]/20 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {company.mission}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#D6006D]/5 to-[#D6006D]/10 border border-[#D6006D]/20 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Our Vision</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {company.vision}
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Why Choose PS Laboratories?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {company.whyChooseUs.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D6006D] to-[#3D2B7A] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Registrations */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Registrations &amp; Certifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RegistrationCard
            label="GSTIN"
            value={company.registrations.gstin}
            note="Registered under GST"
          />
          <RegistrationCard
            label="Udyam Registration"
            value={company.registrations.udyamNumber}
            note={company.registrations.udyamCategory}
          />
        </div>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                ISO 9001:2015
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Certificate No: {company.registrations.isoCertificate.certNo} —
                Certification renewal in progress. Contact us for the current
                certificate status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#3D2B7A] to-[#D6006D] rounded-xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-3">Ready to Work With Us?</h2>
        <p className="text-sm text-white/80 mb-6 max-w-lg mx-auto">
          Whether you need a specific reference standard, impurity, or custom
          synthesis, our team is ready to help.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-5 py-2.5 text-sm font-medium bg-white text-[#3D2B7A] rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/request-quote"
            className="px-5 py-2.5 text-sm font-medium border border-white text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}

function RegistrationCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-mono text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{note}</p>
    </div>
  );
}
