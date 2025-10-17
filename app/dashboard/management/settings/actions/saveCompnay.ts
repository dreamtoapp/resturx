'use server';

import { z } from 'zod';

import db from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

import { CompanySchema } from '../helper/companyZodAndInputs';

export async function saveCompany(rawData: unknown) {
  console.log('🔄 Saving company data:', rawData);

  try {
    // ✅ 1. Sanitize: convert empty strings to undefined; lightly coerce numeric strings
    const sanitize = (data: any) => {
      if (data == null || typeof data !== 'object') return data;
      const clone: any = Array.isArray(data) ? [] : {};
      for (const [key, value] of Object.entries<any>(data)) {
        if (value === null) {
          clone[key] = undefined;
        } else if (typeof value === 'string') {
          const v = value.trim();
          if (v === '') {
            clone[key] = undefined;
          } else if (['shippingFee', 'minShipping', 'taxPercentage'].includes(key)) {
            const num = Number(v);
            clone[key] = Number.isFinite(num) ? num : undefined;
          } else {
            clone[key] = v;
          }
        } else {
          clone[key] = value;
        }
      }
      return clone;
    };

    const sanitized = sanitize(rawData);

    // ✅ 2. Validate input using Zod
    const formData = CompanySchema.parse(sanitized);

    // ❌ 3. Remove `id` from the object passed to Prisma
    const { id, ...dataWithoutId } = formData;

    // 🔍 4. Find existing company (singleton)
    const existingCompany = await db.company.findFirst();

    let company;

    if (existingCompany) {
      // ♻️ Update existing company
      company = await db.company.update({
        where: { id: existingCompany.id },
        data: dataWithoutId,
      });
      revalidateTag('company');

      // 🚨 Optional cleanup (dev safety)
      await db.company.deleteMany({
        where: { id: { not: existingCompany.id } },
      });
      revalidateTag('company');

    } else {
      // 🆕 Create new singleton company
      company = await db.company.create({
        data: dataWithoutId,
      });
      revalidateTag('company');
      revalidatePath('/dashboard/management/settings');
      revalidatePath('/');
    }

    return { success: true, company };

  } catch (error) {
    console.error('❌ Failed to save company:', error);

    return {
      success: false,
      message:
        error instanceof z.ZodError
          ? 'بيانات غير صالحة. يرجى مراجعة الحقول.'
          : 'حدث خطأ أثناء حفظ بيانات المتجر.',
      details: error instanceof z.ZodError ? error.flatten() : null,
    };
  }
}
