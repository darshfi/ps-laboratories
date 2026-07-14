import Link from 'next/link';
import companyInfo from '@/data/company-info.json';
import type { CompanyInfo } from '@/types';

const company = companyInfo as CompanyInfo;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D6006D] to-[#3D2B7A] flex items-center justify-center text-white font-bold text-xs">
                PS
              </div>
              <span className="text-white font-bold text-base">
                PS Laboratories
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {company.tagline} — Specialized in custom synthesis of pharmacopeia
              and non-pharmacopeia reference standards, impurities, and APIs.
            </p>
            <div className="flex items-center gap-3">
              {company.contact.phones[0] && (
                <a
                  href={`https://wa.me/${company.contact.phones[0].replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Contact via WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm hover:text-white transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="text-sm hover:text-white transition-colors">
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${company.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {company.contact.email}
                </a>
              </li>
              {company.contact.phones.map((phone, i) => (
                <li key={i}>
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="text-gray-400 text-xs leading-relaxed mt-3">
                {company.address.line1}
                <br />
                {company.address.line2}
              </li>
            </ul>
          </div>

          {/* Registrations */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Registrations
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-gray-500">GSTIN:</span>{' '}
                <span className="text-gray-300">{company.registrations.gstin}</span>
              </li>
              <li>
                <span className="text-gray-500">Udyam:</span>{' '}
                <span className="text-gray-300">{company.registrations.udyamNumber}</span>
              </li>
              <li>
                <span className="text-gray-500">Category:</span>{' '}
                <span className="text-gray-300">{company.registrations.udyamCategory}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} PS Laboratories. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Manufacturer of pharmaceutical reference standards.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
