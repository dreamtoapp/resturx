import db from '@/lib/prisma';
import { buildCanonical } from './canonical';

export type SitemapNode = { url: string; lastmod: string };

export async function buildSitemapNodes(): Promise<SitemapNode[]> {
  const nodes: SitemapNode[] = [];

  // Home
  nodes.push({ url: await buildCanonical('/'), lastmod: new Date().toISOString() });

  // Categories
  const categories = await db.category.findMany({ select: { slug: true, updatedAt: true } });
  for (const c of categories) {
    nodes.push({ url: await buildCanonical(`/categories/${c.slug}`), lastmod: c.updatedAt.toISOString() });
  }

  // Offers
  const offers = await db.offer.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });
  for (const o of offers) {
    nodes.push({ url: await buildCanonical(`/offers/${o.slug}`), lastmod: o.updatedAt.toISOString() });
  }

  // Products
  const products = await db.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  for (const p of products) {
    nodes.push({ url: await buildCanonical(`/product/${p.slug}`), lastmod: p.updatedAt.toISOString() });
  }

  // Enforce canonical-only URLs (no query/hash) and deduplicate
  const seen = new Set<string>();
  const cleaned: SitemapNode[] = [];
  for (const n of nodes) {
    const u = n.url.split('?')[0].split('#')[0].replace(/\/+$/, '');
    if (seen.has(u)) continue;
    seen.add(u);
    cleaned.push({ url: u, lastmod: n.lastmod });
  }

  return cleaned;
}


