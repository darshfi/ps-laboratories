import { MetadataRoute } from 'next';
import catalog from '@/data/catalog.json';
import type { CatalogProduct } from '@/types';

const products = catalog as CatalogProduct[];

const staticPages = [
  { url: 'https://pslaboratories.in', priority: 1.0 },
  { url: 'https://pslaboratories.in/products', priority: 0.9 },
  { url: 'https://pslaboratories.in/services', priority: 0.7 },
  { url: 'https://pslaboratories.in/about', priority: 0.7 },
  { url: 'https://pslaboratories.in/contact', priority: 0.6 },
  { url: 'https://pslaboratories.in/enquiry', priority: 0.4 },
  { url: 'https://pslaboratories.in/request-quote', priority: 0.6 },
  { url: 'https://pslaboratories.in/legal/privacy', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productPages = products.map((product) => ({
    url: `https://pslaboratories.in/products/${product.id}`,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
  ];
}
