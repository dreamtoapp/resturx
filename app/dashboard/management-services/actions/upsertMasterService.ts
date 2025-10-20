'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  MasterServiceFormData,
  MasterServiceSchema,
} from '../helpers/serviceSchema';

type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: MasterServiceFormData };

function validateFormData(formData: MasterServiceFormData): ValidationResult {
  const parsed = MasterServiceSchema.safeParse(formData);

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
  const existing = await db.masterService.findFirst({
    where: {
      name,
      ...(id ? { NOT: { id } } : {}),
    },
  });

  return !!existing;
}

async function createMasterService(data: MasterServiceFormData) {
  const duplicate = await isDuplicateName(data.name);
  if (duplicate) {
    return {
      ok: false,
      msg: 'اسم الخدمة مستخدم مسبقاً',
      errors: {
        name: ['اسم الخدمة مستخدم مسبقاً'],
      },
    };
  }

  await db.masterService.create({
    data: {
      name: data.name,
      nameEn: data.nameEn || null,
      imageUrl: data.imageUrl || null,
      description: data.description || null,
      category: data.category || null,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath('/dashboard/management-services');

  return {
    ok: true,
    msg: 'تم إضافة الخدمة بنجاح',
  };
}

async function updateMasterService(data: MasterServiceFormData) {
  const service = await db.masterService.findUnique({
    where: { id: data.id },
  });

  if (!service) {
    return {
      ok: false,
      msg: 'الخدمة غير موجودة',
      errors: { name: ['لا يمكن العثور على الخدمة المحددة'] },
    };
  }

  const duplicate = await isDuplicateName(data.name, data.id);
  if (duplicate) {
    return {
      ok: false,
      msg: 'اسم الخدمة مستخدم مسبقاً',
      errors: {
        name: ['اسم الخدمة مستخدم مسبقاً'],
      },
    };
  }

  await db.masterService.update({
    where: { id: data.id },
    data: {
      name: data.name,
      nameEn: data.nameEn || null,
      imageUrl: data.imageUrl || null,
      description: data.description || null,
      category: data.category || null,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath('/dashboard/management-services');

  return {
    ok: true,
    msg: 'تم تعديل الخدمة بنجاح',
  };
}

export async function upsertMasterService(
  formData: MasterServiceFormData,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createMasterService(data);
    }

    if (mode === 'update') {
      return await updateMasterService(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertMasterService error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}




