'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useEnquiry } from '@/context/EnquiryContext';
import companyInfo from '@/data/company-info.json';
import type { CompanyInfo } from '@/types';

const company = companyInfo as CompanyInfo;

// Web3Forms access key — Next.js inlines NEXT_PUBLIC_ vars at build time
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export default function EnquiryPage() {
  const { items, removeItem, updateQuantity, clearAll, itemCount } =
    useEnquiry();

  // Handle ?add=PRODUCT_ID from product page links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addId = params.get('add');
    if (addId) {
      // Could import catalog here, but we handle it via the AddToEnquiryButton flow
      // This is a fallback — the actual product detail page buttons handle adding
    }
  }, []);

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Honeypot check
    if (honeypot) return;
    setError('');

    // Basic validation
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please fill in your name and email.');
      return;
    }
    if (items.length === 0) {
      setError('Your enquiry cart is empty. Add at least one product.');
      return;
    }

    setSubmitting(true);
    try {
      const productList = items
        .map(
          (i) =>
            `${i.product.name} (${i.product.id}, CAS: ${i.product.cas_no})${
              i.quantity ? ` — Qty: ${i.quantity}` : ''
            }`,
        )
        .join('\n');

      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Product Enquiry from ${form.name} (${form.company || 'N/A'})`,
          from_name: 'PS Laboratories Website',
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone,
          message: `Products:\n${productList}\n\nMessage: ${form.message || 'N/A'}`,
          to_email: 'darshimp6911@gmail.com',
          bot_submit: 'false',
        }),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit enquiry');
      }

      setSubmitted(true);
      clearAll();
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
          <svg
            className="w-8 h-8 text-green-600"
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
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Enquiry Submitted
        </h1>
        <p className="text-gray-600 mb-2">
          Thank you for your enquiry. Our team will review your requirements and
          get back to you within 1&ndash;2 business days with a quotation.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          A confirmation has been sent to <strong>{form.email}</strong>.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/products"
            className="px-4 py-2 text-sm font-medium text-[#3D2B7A] border border-[#3D2B7A] rounded-lg hover:bg-[#3D2B7A]/5 transition-colors"
          >
            Continue Browsing
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium bg-[#3D2B7A] text-white rounded-lg hover:bg-[#3D2B7A]/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
        Product Enquiry
      </h1>
      <p className="text-gray-600 text-sm mb-8">
        Review your selected products and submit an enquiry to receive a quotation.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart table */}
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              <p className="text-gray-500 font-medium mb-1">
                Your enquiry cart is empty
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Browse our catalog and add products you&apos;re interested in.
              </p>
              <Link
                href="/products"
                className="inline-block px-4 py-2 text-sm font-medium bg-[#3D2B7A] text-white rounded-lg hover:bg-[#3D2B7A]/90 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-medium text-gray-600">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                        CAS No
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">
                        Quantity
                      </th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.product.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-medium text-gray-900 hover:text-[#D6006D] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">
                            {item.product.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">
                          {item.product.cas_no}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.product.id, e.target.value)
                            }
                            placeholder="e.g., 100mg"
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#3D2B7A]/30 focus:border-[#3D2B7A]"
                            aria-label={`Quantity for ${item.product.name}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label={`Remove ${item.product.name} from enquiry`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear All ({itemCount} items)
                </button>
              </div>
            </>
          )}
        </div>

        {/* Contact form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
              Your Details
            </h2>

            {/* Honeypot — hidden from users */}
            <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <Field
              label="Name *"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Field
              label="Company"
              value={form.company}
              onChange={(v) => setForm({ ...form, company: v })}
            />
            <Field
              label="Email *"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
            />
            <Field
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Message / Notes
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D2B7A]/30 focus:border-[#3D2B7A] transition-colors resize-none"
                placeholder="Any special requirements or questions..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="w-full px-4 py-2.5 text-sm font-medium bg-[#3D2B7A] text-white rounded-lg hover:bg-[#3D2B7A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              We&apos;ll respond within 1&ndash;2 business days.
            </p>
          </form>

          {/* Checklist */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-3">
              Include in Your Enquiry
            </h3>
            <ul className="space-y-2">
              {company.enquiryChecklist.map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D2B7A]/30 focus:border-[#3D2B7A] transition-colors"
      />
    </div>
  );
}
