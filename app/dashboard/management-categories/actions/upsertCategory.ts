'use server';

import db from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

import {
  RestaurantFormData,
  RestaurantSchema,
} from '../helper/categoryZodAndInputs';
import { Slugify } from '@/utils/slug';

// -------------------- ✅ Type-safe validation --------------------
type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: RestaurantFormData };

function validateFormData(formData: RestaurantFormData): ValidationResult {
  const parsed = RestaurantSchema.safeParse(formData);

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

// -------------------- ✅ Slug uniqueness check --------------------
async function isDuplicateSlug(slug: string, id?: string) {
  const existingRestaurant = await db.restaurant.findFirst({
    where: {
      slug,
      ...(id ? { NOT: { id } } : {}),
    },
  });

  return !!existingRestaurant;
}

// -------------------- ✅ Create restaurant --------------------
async function createRestaurant(data: RestaurantFormData) {
  const slug = Slugify(data.name);

  const duplicate = await isDuplicateSlug(slug);
  if (duplicate) {
    return {
      ok: false,
      msg: 'اسم المطعم مستخدم مسبقاً',
      errors: {
        name: ['اسم المطعم مستخدم مسبقاً'],
      },
    };
  }

  await db.restaurant.create({
    data: {
      name: data.name,
      slug: slug,
      description: data.description || null,
      countryId: data.countryId,
      userId: data.userId,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      workingHours: data.workingHours || null,
      deliveryTime: data.deliveryTime || null,
      minOrder: data.minOrder || null,
      deliveryFee: data.deliveryFee || null,
      hasOwnDelivery: data.hasOwnDelivery || false,
      bio: data.bio || null,
      status: (data.status as any) || 'ACTIVE',
      isVerified: data.isVerified || false,
      isPopular: data.isPopular || false,
    },
  });
  revalidateTag('restaurants');

  return {
    ok: true,
    msg: 'تم إضافة المطعم بنجاح',
  };
}

// -------------------- ✅ Update restaurant --------------------
async function updateRestaurant(data: RestaurantFormData) {
  const restaurant = await db.restaurant.findUnique({
    where: { id: data.id },
  });

  if (!restaurant) {
    return {
      ok: false,
      msg: 'المطعم غير موجود',
      errors: { name: ['لا يمكن العثور على المطعم المحدد'] },
    };
  }

  const slug = Slugify(data.name);
  const duplicate = await isDuplicateSlug(slug, data.id);
  if (duplicate) {
    return {
      ok: false,
      msg: 'اسم المطعم مستخدم مسبقاً',
      errors: {
        name: ['اسم المطعم مستخدم مسبقاً'],
      },
    };
  }

  await db.restaurant.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug: slug,
      description: data.description || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      workingHours: data.workingHours || null,
      deliveryTime: data.deliveryTime || null,
      minOrder: data.minOrder || null,
      deliveryFee: data.deliveryFee || null,
      hasOwnDelivery: data.hasOwnDelivery || false,
      bio: data.bio || null,
      // Don't update countryId and userId on edit to prevent accidental changes
    },
  });
  revalidateTag('restaurants');

  return {
    ok: true,
    msg: 'تم تعديل بيانات المطعم بنجاح',
  };
}

// -------------------- ✅ Main action --------------------
export async function upsertRestaurant(
  formData: RestaurantFormData,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createRestaurant(data);
    }

    if (mode === 'update') {
      return await updateRestaurant(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertRestaurant error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}

// Backward compatibility
export async function upsertCategory(
  formData: RestaurantFormData,
  mode: 'new' | 'update'
) {
  return upsertRestaurant(formData, mode);
}
