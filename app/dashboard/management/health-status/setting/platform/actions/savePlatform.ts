'use server';

import { saveCompany as baseSaveCompany } from '@/app/dashboard/management/settings/actions/saveCompnay';
import { revalidatePath } from 'next/cache';

type PlatformInput = {
  id?: string;
  // Platform Display Settings
  showHeroImage?: boolean;
  showStoreLocation?: boolean;
  showCustomerCount?: boolean;
  showProductCount?: boolean;
  showVision2030?: boolean;

  // Notification Settings
  emailNotifications?: boolean;

  // Currency Settings
  defaultCurrency?: string;
};

export async function savePlatform(input: PlatformInput) {
  const res = await baseSaveCompany(input);
  revalidatePath('/dashboard/management/health-status');
  revalidatePath('/dashboard/management/health-status/setting/platform');
  return res;
}
