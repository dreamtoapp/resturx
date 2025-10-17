'use server';

import { getCompanyDataStatus as getCompanyDataStatusBase } from '@/app/dashboard/actions/validateCompanyData';

export async function getCompanyDataStatus() {
  return await getCompanyDataStatusBase();
}


