'use server';
import db from '@/lib/prisma';

export async function getCompliance() {
  const company = await db.company.findFirst({
    select: {
      taxNumber: true,
      taxPercentage: true,
      commercialRegistrationNumber: true,
      saudiBusinessId: true,
    },
  });
  return company ?? null;
}


