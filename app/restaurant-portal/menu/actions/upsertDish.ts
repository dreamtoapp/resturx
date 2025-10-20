'use server';

import { auth } from '@/auth';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const DishSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'اسم الطبق مطلوب'),
  description: z.string().optional(),
  dishCategoryId: z.string().optional(),
  price: z.number().min(0, 'السعر يجب أن يكون صفر أو أكثر'),
  compareAtPrice: z.number().optional(),
  published: z.boolean().default(true),
  outOfStock: z.boolean().default(false),
});

type DishFormData = z.infer<typeof DishSchema>;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u0600-\u06FF]/g, '')
    .substring(0, 50) + '-' + Date.now();
}

export async function upsertDish(formData: DishFormData, mode: 'create' | 'update') {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        ok: false,
        msg: 'يجب تسجيل الدخول أولاً',
      };
    }

    // Get restaurant
    const restaurant = await db.restaurant.findFirst({
      where: { userId: session.user.id }
    });

    if (!restaurant) {
      return {
        ok: false,
        msg: 'لا يوجد مطعم مسجل لهذا الحساب',
      };
    }

    // Validate
    const parsed = DishSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        ok: false,
        msg: 'يرجى تصحيح الأخطاء في النموذج',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    if (mode === 'create') {
      await db.dish.create({
        data: {
          name: data.name,
          description: data.description || '',
          slug: generateSlug(data.name),
          price: data.price,
          compareAtPrice: data.compareAtPrice || null,
          published: data.published,
          outOfStock: data.outOfStock,
          supplierId: restaurant.id,
          dishCategoryId: data.dishCategoryId || null,
          type: 'dish',
        }
      });

      revalidatePath('/restaurant-portal/menu');
      revalidatePath('/restaurant-portal');
      return {
        ok: true,
        msg: 'تم إضافة الطبق بنجاح',
      };
    }

    if (mode === 'update') {
      if (!data.id) {
        return {
          ok: false,
          msg: 'معرف الطبق مطلوب للتحديث',
        };
      }

      // Verify ownership
      const existingDish = await db.dish.findFirst({
        where: {
          id: data.id,
          supplierId: restaurant.id
        }
      });

      if (!existingDish) {
        return {
          ok: false,
          msg: 'الطبق غير موجود أو ليس لديك صلاحية لتعديله',
        };
      }

      await db.dish.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description || '',
          price: data.price,
          compareAtPrice: data.compareAtPrice || null,
          published: data.published,
          outOfStock: data.outOfStock,
          dishCategoryId: data.dishCategoryId || null,
        }
      });

      revalidatePath('/restaurant-portal/menu');
      revalidatePath(`/restaurant-portal/menu/${data.id}`);
      revalidatePath('/restaurant-portal');
      return {
        ok: true,
        msg: 'تم تعديل الطبق بنجاح',
      };
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
    };
  } catch (error) {
    console.error('upsertDish error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
    };
  }
}

