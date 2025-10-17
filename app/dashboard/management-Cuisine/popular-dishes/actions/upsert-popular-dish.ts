'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import {
  PopularDishFormData,
  PopularDishSchema,
} from '../helper/popularDishSchema';

// Type-safe validation
type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: PopularDishFormData };

function validateFormData(formData: PopularDishFormData): ValidationResult {
  const parsed = PopularDishSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      ok: false,
      msg: 'يرجى تصحيح الأخطاء في النموذج',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

// Create popular dish
async function createPopularDish(data: PopularDishFormData) {
  await db.popularDish.create({
    data: {
      name: data.name,
      description: data.description || null,
      countryId: data.countryId,
    },
  });

  revalidatePath(`/dashboard/management-Cuisine/popular-dishes/${data.countryId}`);

  return {
    ok: true,
    msg: 'تم إضافة الطبق المشهور بنجاح',
  };
}

// Update popular dish
async function updatePopularDish(data: PopularDishFormData) {
  const dish = await db.popularDish.findFirst({
    where: { id: data.id },
  });

  if (!dish) {
    return {
      ok: false,
      msg: 'الطبق غير موجود',
      errors: { name: ['لا يمكن العثور على الطبق'] },
    };
  }

  await db.popularDish.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description || null,
    },
  });

  revalidatePath(`/dashboard/management-Cuisine/popular-dishes/${data.countryId}`);

  return {
    ok: true,
    msg: 'تم تعديل بيانات الطبق بنجاح',
  };
}

// Main action
export async function upsertPopularDish(
  formData: PopularDishFormData,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createPopularDish(data);
    }

    if (mode === 'update') {
      return await updatePopularDish(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertPopularDish error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}

