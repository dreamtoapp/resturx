'use server';

import { fetchCompany as baseFetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

type LocationSubset = {
  id?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
};

export async function fetchLocation(): Promise<LocationSubset | null> {
  const data = await baseFetchCompany();
  if (!data) return null;
  const { id, address, latitude, longitude } = data as any;
  return { id, address, latitude, longitude };
}
















