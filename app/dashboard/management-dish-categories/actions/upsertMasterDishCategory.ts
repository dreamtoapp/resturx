'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  MasterDishCategoryFormData,
  MasterDishCategorySchema,
} from '../helpers/dishCategorySchema';

type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: MasterDishCategoryFormData };

function validateFormData(formData: MasterDishCategoryFormData): ValidationResult {
  const parsed = MasterDishCategorySchema.safeParse(formData);

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

async function isDuplicateName(name: string, id?: string) {
  const existing = await db.masterDishCategory.findFirst({
    where: {
      name,
      ...(id ? { NOT: { id } } : {}),
    },
  });

  return !!existing;
}

async function createMasterDishCategory(data: MasterDishCategoryFormData) {
  const duplicate = await isDuplicateName(data.name);
  if (duplicate) {
    return {
      ok: false,
      msg: 'اسم الصنف مستخدم مسبقاً',
      errors: {
        name: ['اسم الصنف مستخدم مسبقاً'],
      },
    };
  }

  await db.masterDishCategory.create({
    data: {
      name: data.name,
      nameEn: data.nameEn || null,
      imageUrl: data.imageUrl || null,
      description: data.description || null,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath('/dashboard/management-dish-categories');

  return {
    ok: true,
    msg: 'تم إضافة الصنف بنجاح',
  };
}

async function updateMasterDishCategory(data: MasterDishCategoryFormData) {
  const category = await db.masterDishCategory.findUnique({
    where: { id: data.id },
  });

  if (!category) {
    return {
      ok: false,
      msg: 'الصنف غير موجود',
      errors: { name: ['لا يمكن العثور على الصنف المحدد'] },
    };
  }

  const duplicate = await isDuplicateName(data.name, data.id);
  if (duplicate) {
    return {
      ok: false,
      msg: 'اسم الصنف مستخدم مسبقاً',
      errors: {
        name: ['اسم الصنف مستخدم مسبقاً'],
      },
    };
  }

  await db.masterDishCategory.update({
    where: { id: data.id },
    data: {
      name: data.name,
      nameEn: data.nameEn || null,
      imageUrl: data.imageUrl || null,
      description: data.description || null,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath('/dashboard/management-dish-categories');

  return {
    ok: true,
    msg: 'تم تعديل الصنف بنجاح',
  };
}

export async function upsertMasterDishCategory(
  formData: MasterDishCategoryFormData,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createMasterDishCategory(data);
    }

    if (mode === 'update') {
      return await updateMasterDishCategory(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertMasterDishCategory error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}

