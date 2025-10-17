import db from '@/lib/prisma';

let cachedBaseUrl: string | null = null;

async function getBaseUrl(): Promise<string> {
  if (cachedBaseUrl) return cachedBaseUrl;
  const company = await db.company.findFirst({ select: { website: true } });
  const base = (company?.website || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  cachedBaseUrl = base;
  return base;
}

export async function buildCanonical(path: string): Promise<string> {
  const base = await getBaseUrl();
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleaned}`;
}

export async function getCanonicalBase(): Promise<string> {
  return getBaseUrl();
}


// Build a canonical URL including only whitelisted query params (e.g., page),
// excluding filters/tracking params like utm_*, sort, brand, etc.
export async function buildCanonicalWithParams(
  path: string,
  searchParams: Record<string, string | string[] | undefined>,
  whitelist: string[] = []
): Promise<string> {
  const params = new URLSearchParams();
  for (const key of whitelist) {
    const value = searchParams?.[key];
    if (typeof value === 'string' && value) params.set(key, value);
  }
  const query = params.toString();
  const fullPath = query ? `${path}?${query}` : path;
  return buildCanonical(fullPath);
}


