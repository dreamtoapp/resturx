'use server';

import { getCompanyDataStatus } from '@/app/dashboard/actions/validateCompanyData';

/**
 * Server action to get company health status for layout components
 * Reuses existing validation logic for consistency
 */
export async function getCompanyHealthStatus() {
  return await getCompanyDataStatus();
}
