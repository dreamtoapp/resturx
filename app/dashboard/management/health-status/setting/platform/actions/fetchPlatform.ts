'use server';

import { fetchCompany as baseFetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export async function fetchPlatform() {
  // Return full company object for now; client form will pick required fields
  const data = await baseFetchCompany();

  // Debug: Log the actual database values
  console.log('🔍 Database values from fetchPlatform:', {
    id: data?.id,
    showHeroImage: data?.showHeroImage,
    showStoreLocation: data?.showStoreLocation,
    showCustomerCount: data?.showCustomerCount,
    showProductCount: data?.showProductCount,
    showVision2030: data?.showVision2030,
    emailNotifications: data?.emailNotifications,
    defaultCurrency: data?.defaultCurrency,
  });

  return data;
}


