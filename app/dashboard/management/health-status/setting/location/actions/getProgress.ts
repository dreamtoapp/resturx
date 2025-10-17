'use server';

import { fetchLocation } from './fetchLocation';

export async function getProgress() {
  const company = await fetchLocation();
  const total = 3;
  const current = [company?.address, company?.latitude, company?.longitude].filter(Boolean).length;
  const percent = Math.round((current / Math.max(1, total)) * 100);
  return { current, total, percent };
}
















