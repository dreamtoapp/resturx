'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  MasterFeatureFormData,
  MasterFeatureSchema,
} from '../helpers/featureSchema';

type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: MasterFeatureFormData };

function validateFormData(formData: MasterFeatureFormData): ValidationResult {
  const parsed = MasterFeatureSchema.safeParse(formData);

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

async function isDuplicateTitle(title: string, id?: string) {
  const existing = await db.masterFeature.findFirst({
    where: {
      title,
      ...(id ? { NOT: { id } } : {}),
    },
  });

  return !!existing;
}

async function createMasterFeature(data: MasterFeatureFormData) {
  const duplicate = await isDuplicateTitle(data.title);
  if (duplicate) {
    return {
      ok: false,
      msg: 'عنوان الميزة مستخدم مسبقاً',
      errors: {
        title: ['عنوان الميزة مستخدم مسبقاً'],
      },
    };
  }

  await db.masterFeature.create({
    data: {
      title: data.title,
      titleEn: data.titleEn || null,
      imageUrl: data.imageUrl || null,
      description: data.description,
      category: data.category || null,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath('/dashboard/management-features');

  return {
    ok: true,
    msg: 'تم إضافة الميزة بنجاح',
  };
}

async function updateMasterFeature(data: MasterFeatureFormData) {
  const feature = await db.masterFeature.findUnique({
    where: { id: data.id },
  });

  if (!feature) {
    return {
      ok: false,
      msg: 'الميزة غير موجودة',
      errors: { title: ['لا يمكن العثور على الميزة المحددة'] },
    };
  }

  const duplicate = await isDuplicateTitle(data.title, data.id);
  if (duplicate) {
    return {
      ok: false,
      msg: 'عنوان الميزة مستخدم مسبقاً',
      errors: {
        title: ['عنوان الميزة مستخدم مسبقاً'],
      },
    };
  }

  await db.masterFeature.update({
    where: { id: data.id },
    data: {
      title: data.title,
      titleEn: data.titleEn || null,
      imageUrl: data.imageUrl || null,
      description: data.description,
      category: data.category || null,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath('/dashboard/management-features');

  return {
    ok: true,
    msg: 'تم تعديل الميزة بنجاح',
  };
}

export async function upsertMasterFeature(
  formData: MasterFeatureFormData,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createMasterFeature(data);
    }

    if (mode === 'update') {
      return await updateMasterFeature(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertMasterFeature error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}




