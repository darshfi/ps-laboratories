'use client';

import { useEnquiry } from '@/context/EnquiryContext';
import type { CatalogProduct } from '@/types';

interface Props {
  product: CatalogProduct;
  className?: string;
  variant?: 'default' | 'small';
}

export default function AddToEnquiryButton({
  product,
  className = '',
  variant = 'default',
}: Props) {
  const { addItem, isInCart } = useEnquiry();
  const inCart = isInCart(product.id);

  const sizeClasses =
    variant === 'small'
      ? 'px-3 py-1.5 text-xs'
      : 'px-4 py-2 text-sm';

  return (
    <button
      onClick={() => addItem(product)}
      disabled={inCart}
      className={`${sizeClasses} font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D6006D]/40 disabled:opacity-60 disabled:cursor-not-allowed ${
        inCart
          ? 'bg-green-50 border-green-300 text-green-700'
          : 'border-[#D6006D] text-[#D6006D] hover:bg-[#D6006D] hover:text-white'
      } ${className}`}
      aria-label={inCart ? `${product.name} is already in enquiry` : `Add ${product.name} to enquiry`}
    >
      {inCart ? (
        <span className="flex items-center gap-1.5">
          <CheckIcon />
          Added
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <PlusIcon />
          Add to Enquiry
        </span>
      )}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
