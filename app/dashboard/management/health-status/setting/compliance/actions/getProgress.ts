'use server';

import { fetchCompliance } from './fetchCompliance';

export async function getProgress() {
  const data = await fetchCompliance();
  const total = 4;
  const current = [
    data?.taxNumber,
    data?.taxPercentage,
    data?.commercialRegistrationNumber,
    data?.saudiBusinessId,
  ].filter(value => {
    // Special handling for taxPercentage: 0 is valid
    if (value === 0) return true;
    // For other fields, check if they have meaningful values
    if (typeof value === 'string') return value.trim() !== '';
    return Boolean(value);
  }).length;
  const percent = Math.round((current / Math.max(1, total)) * 100);
  return { current, total, percent };
}


