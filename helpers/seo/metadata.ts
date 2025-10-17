import type { Metadata } from 'next';
import db from '@/lib/prisma';
import { buildCanonical, getCanonicalBase } from './canonical';

type MetaInput = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string | null;
  robots?: string;
};

export async function buildMetadata({ title, description, canonicalPath, ogImage, robots }: MetaInput): Promise<Metadata> {
  const company = await db.company.findFirst({
    select: { fullName: true, logo: true, website: true, twitter: true }
  });
  const siteName = company?.fullName || 'Store';
  const base = await getCanonicalBase();
  const canonical = canonicalPath ? await buildCanonical(canonicalPath) : undefined;
  const image = ogImage || company?.logo || '/fallback/dreamToApp2-dark.png';
  const twitterSite = company?.twitter ? `@${company.twitter.replace(/^@/, '')}` : undefined;
  const fbAppId = process.env.NEXT_PUBLIC_FB_APP_ID || process.env.FB_APP_ID || undefined;

  const meta: Metadata = {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: title || siteName,
      description: description || undefined,
      url: canonical || base,
      siteName,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      locale: 'ar_SA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: image || undefined,
      site: twitterSite,
    },
    robots: robots || undefined,
    metadataBase: new URL(base),
    other: fbAppId ? { 'fb:app_id': fbAppId } : undefined,
  };

  return meta;
}


