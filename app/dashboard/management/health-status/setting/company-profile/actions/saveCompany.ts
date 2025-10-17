'use server';

import { saveCompany as baseSaveCompany } from '@/app/dashboard/management/settings/actions/saveCompnay';
import { revalidatePath } from 'next/cache';

export async function saveCompany(input: any) {
  const res = await baseSaveCompany(input);
  revalidatePath('/dashboard/management/health-status');
  return res;
}


