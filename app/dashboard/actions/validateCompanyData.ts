'use server';

import { validateCompanyData, CompanyDataStatus } from '@/helpers/companyDataValidator';
import { fetchCompany } from '../management/settings/actions/fetchCompany';

/**
 * Server action to validate company data and return status
 */
export async function getCompanyDataStatus(): Promise<CompanyDataStatus> {
  try {
    const company = await fetchCompany();
    return validateCompanyData(company);
  } catch (error) {
    console.error('❌ Error validating company data:', error);

    // Return critical status if there's an error fetching company data
    return {
      isComplete: false,
      missingFields: ['fullName', 'email', 'phoneNumber', 'whatsappNumber', 'address'],
      criticalMissing: ['fullName', 'email', 'phoneNumber', 'whatsappNumber', 'address'],
      warnings: ['خطأ في تحميل بيانات الشركة'],
      completionPercentage: 0,
      criticalFieldsComplete: false,
      operationalFieldsComplete: false
    };
  }
}
