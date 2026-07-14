'use client';

import Link from 'next/link';
import { useEnquiry } from '@/context/EnquiryContext';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D6006D] to-[#3D2B7A] flex items-center justify-center text-white font-bold text-sm leading-tight group-hover:shadow-md transition-shadow">
              PS
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold text-gray-900 leading-tight">
                PS Laboratories
              </div>
              <div className="text-[11px] text-gray-500 leading-tight">
                Science with Service
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#D6006D] transition-colors">
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-[#D6006D] transition-colors"
            >
              Products
            </Link>
            <Link
              href="/services"
              className="hover:text-[#D6006D] transition-colors"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="hover:text-[#D6006D] transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#D6006D] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/enquiry"
              className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#D6006D] hover:bg-[#D6006D]/5 rounded-lg transition-colors"
            >
              <CartIcon />
              <span className="hidden sm:inline">Enquiry</span>
              <CartCount />
            </Link>

            {/* Mobile menu trigger */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
      />
    </svg>
  );
}

function CartCount() {
  const { itemCount } = useEnquiry();
  if (itemCount === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D6006D] text-white text-[10px] font-bold flex items-center justify-center">
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  );
}

function MobileMenu() {
  return (
    <details className="md:hidden group relative">
      <summary className="list-none p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors">
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </summary>
      <nav className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
        <MobileLink href="/">Home</MobileLink>
        <MobileLink href="/products">Products</MobileLink>
        <MobileLink href="/services">Services</MobileLink>
        <MobileLink href="/about">About Us</MobileLink>
        <MobileLink href="/contact">Contact</MobileLink>
        <MobileLink href="/request-quote">Request a Quote</MobileLink>
        <hr className="my-1 border-gray-100" />
        <MobileLink href="/legal/privacy">Privacy Policy</MobileLink>
      </nav>
    </details>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D6006D] transition-colors"
    >
      {children}
    </Link>
  );
}
