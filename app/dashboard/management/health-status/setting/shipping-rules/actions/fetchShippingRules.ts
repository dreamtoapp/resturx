'use server';

import { fetchCompany as baseFetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

type ShippingRulesSubset = {
  id?: string;
  workingHours?: string;
  shippingFee?: number;
  minShipping?: number;
};

export async function fetchShippingRules(): Promise<ShippingRulesSubset | null> {
  const data = await baseFetchCompany();
  if (!data) return null;

  const { id, workingHours, shippingFee, minShipping } = data as any;
  return {
    id,
    workingHours: workingHours || '',
    shippingFee: shippingFee || 0,
    minShipping: minShipping || 0,
  };
}




