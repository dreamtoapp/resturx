'use server';

import { saveCompany as baseSaveCompany } from '@/app/dashboard/management/settings/actions/saveCompnay';
import { revalidatePath } from 'next/cache';

type LocationInput = {
  id?: string;
  address: string;
  latitude: string;
  longitude: string;
};

export async function saveLocation(input: LocationInput) {
  const res = await baseSaveCompany(input);
  revalidatePath('/dashboard/management/health-status');
  return res;
}


