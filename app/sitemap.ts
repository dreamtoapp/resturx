import { MetadataRoute } from 'next';

import { buildSitemapNodes } from '@/helpers/seo/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nodes = await buildSitemapNodes();
  return nodes.map((n) => ({
    url: n.url,
    lastModified: new Date(n.lastmod),
  }));
}
