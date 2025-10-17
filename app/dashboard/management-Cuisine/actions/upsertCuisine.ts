'use server';

import db from '@/lib/prisma';
import { Slugify } from '../../../../utils/slug';
import { revalidateTag } from 'next/cache';

import {
  CuisineFormData,
  CuisineSchema,
} from '../helper/cuisineSchema';

// Type-safe validation
type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: CuisineFormData };

function validateFormData(formData: CuisineFormData): ValidationResult {
  const parsed = CuisineSchema.safeParse(formData);

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

// Create cuisine
async function createCuisine(data: CuisineFormData) {
  // Check for duplicate name
  const existing = await db.country.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug: Slugify(data.name) }
      ]
    },
  });

  if (existing) {
    return {
      ok: false,
      msg: 'هذا النوع من المطبخ موجود بالفعل',
      errors: {
        name: ['اسم نوع المطبخ موجود بالفعل'],
      },
    };
  }

  await db.country.create({
    data: {
      name: data.name,
      slug: Slugify(data.name),
      description: data.description || null,
    },
  });
  revalidateTag('countries');

  return {
    ok: true,
    msg: 'تم إضافة نوع المطبخ بنجاح',
  };
}

// Update cuisine
async function updateCuisine(data: CuisineFormData) {
  const cuisine = await db.country.findFirst({
    where: { id: data.id },
  });

  if (!cuisine) {
    return {
      ok: false,
      msg: 'نوع المطبخ غير موجود',
      errors: { name: ['لا يمكن العثور على نوع المطبخ'] },
    };
  }

  await db.country.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug: Slugify(data.name),
      description: data.description || null,
    },
  });
  revalidateTag('countries');

  return {
    ok: true,
    msg: 'تم تعديل بيانات نوع المطبخ بنجاح',
  };
}

// Main action
export async function upsertCuisine(
  formData: CuisineFormData,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createCuisine(data);
    }

    if (mode === 'update') {
      return await updateCuisine(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertCuisine error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}



