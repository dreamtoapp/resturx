import { NextResponse } from 'next/server';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';
import { getCachedAppConfig } from '@/helpers/cachedAppConfig';

export async function GET() {
  try {
    const companyData = await fetchCompany();
    const { appName, appUrl } = await getCachedAppConfig();

    if (!companyData) {
      return NextResponse.json(
        { error: 'Platform settings not found' },
        { status: 404 }
      );
    }

    const platformSettings = {
      taxPercentage: companyData.taxPercentage || 15,
      shippingFee: companyData.shippingFee || 0,
      minShipping: companyData.minShipping || 0,
      appName,        // From database (fullName)
      appUrl,         // From database (website)
    };

    return NextResponse.json(platformSettings);
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform settings' },
      { status: 500 }
    );
  }
} 