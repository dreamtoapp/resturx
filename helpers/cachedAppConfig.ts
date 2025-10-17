import { unstable_cache } from 'next/cache';
import { getAppConfig } from './appConfig';

export const getCachedAppConfig = unstable_cache(
  async () => getAppConfig(),
  ['app-config'],
  {
    tags: ['company'],
    revalidate: 3600 // 1 hour
  }
);

