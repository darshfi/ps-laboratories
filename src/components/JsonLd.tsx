'use client';

import { useEffect, useId } from 'react';

/**
 * JSON-LD Structured Data component.
 * Adds schema.org structured data to the document <head> for SEO.
 * Uses DOM APIs directly to avoid `dangerouslySetInnerHTML`.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const id = useId();

  useEffect(() => {
    // Avoid duplicates
    const existing = document.getElementById(`jsonld-${id}`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = `jsonld-${id}`;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
    // Only re-run if data reference changes (it won't in SSG)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
