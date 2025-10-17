import type { Product } from '@/types/databaseTypes';
import db from '@/lib/prisma';
import { buildCanonical } from '@/helpers/seo/canonical';

export async function buildProductJsonLd(product: Product) {
  const company = await db.company.findFirst({ select: { defaultCurrency: true } });
  const currency = (company?.defaultCurrency || 'SAR') as 'SAR' | 'USD' | 'EGP' | 'AED';
  const productUrl = await buildCanonical(`/product/${product.slug}`);

  const offers = {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: currency,
    availability: product.outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    url: productUrl,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.details || undefined,
    image: product.imageUrl || undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers,
    aggregateRating: typeof product.rating === 'number' && product.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 0,
    } : undefined,
  };
}


