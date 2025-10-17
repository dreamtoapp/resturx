import db from '@/lib/prisma';

export interface AppConfig {
  appName: string;
  appUrl: string;
}

export async function getAppConfig(): Promise<AppConfig> {
  const company = await db.company.findFirst({
    select: {
      fullName: true,    // → APP_NAME
      website: true      // → APP_URL
    }
  });

  return {
    appName: company?.fullName || process.env.APP_NAME || 'My Shop',
    appUrl: company?.website || process.env.APP_URL || 'http://localhost:3000'
  };
}

export async function getAppName(): Promise<string> {
  const config = await getAppConfig();
  return config.appName;
}

export async function getAppUrl(): Promise<string> {
  const config = await getAppConfig();
  return config.appUrl;
}

