import db from '@/lib/prisma';

export async function buildWebsiteJsonLd() {
  const company = await db.company.findFirst({ select: { fullName: true, website: true } });
  const name = company?.fullName || 'Store';
  const url = company?.website || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}


