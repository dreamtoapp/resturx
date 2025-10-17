'use server';

import { fetchCompany } from './fetchCompany';

export async function getProgress() {
  const company = await fetchCompany();
  const total = 3;
  const current = [company?.fullName, company?.email, company?.phoneNumber].filter(Boolean).length;
  const percent = Math.round((current / Math.max(1, total)) * 100);
  return { current, total, percent };
}
















