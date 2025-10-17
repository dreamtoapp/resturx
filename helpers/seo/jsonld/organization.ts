import db from '@/lib/prisma';

export async function buildOrganizationJsonLd() {
  const company = await db.company.findFirst({ select: { fullName: true, logo: true, website: true } });
  const name = company?.fullName || 'Store';
  const logo = company?.logo || '/fallback/dreamToApp2-dark.png';
  const url = company?.website || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
  };
}


