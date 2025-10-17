'use server';

import { fetchShippingRules } from './fetchShippingRules';

export async function getProgress() {
  const data = await fetchShippingRules();
  const total = 3;
  const current = [
    data?.workingHours,
    data?.shippingFee,
    data?.minShipping,
  ].filter(Boolean).length;
  const percent = Math.round((current / Math.max(1, total)) * 100);
  return { current, total, percent };
}




