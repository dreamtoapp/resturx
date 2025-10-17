'use server';

import { fetchCompany as baseFetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export async function fetchCompany() {
  return await baseFetchCompany();
}
















