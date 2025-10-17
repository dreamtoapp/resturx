'use server';

import { saveCompany as baseSaveCompany } from '@/app/dashboard/management/settings/actions/saveCompnay';
import { revalidatePath } from 'next/cache';

type ShippingRulesInput = {
  id?: string;
  workingHours?: string;
  shippingFee?: number;
  minShipping?: number;
};

export async function saveShippingRules(input: ShippingRulesInput) {
  const res = await baseSaveCompany(input);
  revalidatePath('/dashboard/management/health-status');
  revalidatePath('/dashboard/management/health-status/setting/shipping-rules');
  return res;
}




