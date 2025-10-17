'use server';

import { fetchCompany as baseFetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

type ComplianceSubset = {
  id?: string;
  taxNumber?: string;
  taxPercentage?: string | number;
  commercialRegistrationNumber?: string;
  saudiBusinessId?: string;
};

export async function fetchCompliance(): Promise<ComplianceSubset | null> {
  const data = await baseFetchCompany();
  if (!data) return null;
  const { id, taxNumber, taxPercentage, commercialRegistrationNumber, saudiBusinessId } = data as any;
  return {
    id,
    taxNumber,
    taxPercentage,
    commercialRegistrationNumber: commercialRegistrationNumber || '',
    saudiBusinessId: saudiBusinessId || ''
  };
}


