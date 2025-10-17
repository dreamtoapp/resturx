'use server';

import { saveCompany as baseSaveCompany } from '@/app/dashboard/management/settings/actions/saveCompnay';
import { revalidatePath } from 'next/cache';

type ComplianceInput = {
  id?: string;
  taxNumber?: string;
  taxPercentage?: string | number;
  commercialRegistrationNumber?: string;
  saudiBusinessId?: string;
};

export async function saveCompliance(input: ComplianceInput) {
  const res = await baseSaveCompany(input);
  revalidatePath('/dashboard/management/health-status');
  revalidatePath('/dashboard/management/health-status/setting/compliance');
  return res;
}


