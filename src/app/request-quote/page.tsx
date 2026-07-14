'use client';

import { useState, type FormEvent } from 'react';
import companyInfo from '@/data/company-info.json';
import type { CompanyInfo } from '@/types';

const company = companyInfo as CompanyInfo;
const API_URL = '/api/enquiry';

export default function RequestQuotePage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    chemicalName: '',
    casNumber: '',
    quantity: '',
    description: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Please fill in your name and email.');
      return;
    }

    setSubmitting(true);
    try {
      const details = [
        form.chemicalName && `Chemical/IUPAC Name: ${form.chemicalName}`,
        form.casNumber && `CAS Number: ${form.casNumber}`,
        form.quantity && `Quantity: ${form.quantity}`,
        form.description && `Description: ${form.description}`,
      ]
        .filter(Boolean)
        .join('\n');

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          honeypot,
          subject: `Custom Quote Request from ${form.name} (${form.company || 'N/A'})`,
          products: details,
          productCount: 0,
          message: `Custom synthesis / quote request.\n\n${details}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Quote Request Submitted</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your enquiry. Our team will review your requirements and
          get back to you with a quotation within 1&ndash;2 business days.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          A confirmation has been sent to <strong>{form.email}</strong>.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/products" className="px-4 py-2 text-sm font-medium text-[#3D2B7A] border border-[#3D2B7A] rounded-lg hover:bg-[#3D2B7A]/5 transition-colors">
            Browse Products
          </a>
          <a href="/" className="px-4 py-2 text-sm font-medium bg-[#3D2B7A] text-white rounded-lg hover:bg-[#3D2B7A]/90 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
        Request a Quote
      </h1>
      <p className="text-gray-600 text-sm mb-8">
        Can&apos;t find what you need in our catalog? Submit a custom enquiry and
        our team will prepare a quotation.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-6 space-y-5"
        >
          {/* Honeypot */}
          <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
            <label htmlFor="website-qr">Website</label>
            <input id="website-qr" name="website" type="text" value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
            Your Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuoteField label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <QuoteField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
            <QuoteField label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <QuoteField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </div>

          <hr className="border-gray-200" />

          <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
            Your Requirements
          </h2>

          <QuoteField
            label="Chemical / IUPAC Name"
            value={form.chemicalName}
            onChange={(v) => setForm({ ...form, chemicalName: v })}
            placeholder="e.g., (2-Amino-1,9-dihydro-9-((2-hydroxyethoxy)methyl)-3H-purin-6-one)"
          />
          <QuoteField
            label="CAS Number (if known)"
            value={form.casNumber}
            onChange={(v) => setForm({ ...form, casNumber: v })}
            placeholder="e.g., 59277-89-3"
          />
          <QuoteField
            label="Quantity Required"
            value={form.quantity}
            onChange={(v) => setForm({ ...form, quantity: v })}
            placeholder="e.g., 100 mg, 1 g, 10 g"
          />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Additional Details
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D2B7A]/30 focus:border-[#3D2B7A] transition-colors resize-none"
              placeholder="Describe your requirements, purity standards, delivery timeline, etc."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 text-sm font-medium bg-[#3D2B7A] text-white rounded-lg hover:bg-[#3D2B7A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Quote Request'}
          </button>
        </form>

        {/* Sidebar */}
        <aside className="lg:col-span-2 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-3">
              How to Speed Up Your Quote
            </h3>
            <ul className="space-y-2">
              {company.enquiryChecklist.map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-3">
              Can&apos;t Identify the Compound?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              If you have a chemical structure but no name or CAS number, our team
              can help identify the standard you need. Send us the structure
              (drawing or reference) and we&apos;ll match it to our catalog.
            </p>
          </div>

          <div className="bg-[#3D2B7A]/5 border border-[#3D2B7A]/20 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-3">
              Prefer to Browse First?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Browse our catalog of 1,100+ products and add items to your enquiry cart.
            </p>
            <a
              href="/products"
              className="block text-center px-4 py-2 text-xs font-medium bg-[#3D2B7A] text-white rounded-lg hover:bg-[#3D2B7A]/90 transition-colors"
            >
              Browse Product Catalog
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function QuoteField({
  label,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D2B7A]/30 focus:border-[#3D2B7A] transition-colors"
      />
    </div>
  );
}
