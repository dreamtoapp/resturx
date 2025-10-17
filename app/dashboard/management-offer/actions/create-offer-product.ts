'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';
import { Slugify } from '@/utils/slug';
import { addProductsToOffer } from './manage-products';

export interface CreateOfferProductInput {
  offerId: string;
  name: string;
  price: number;
  details: string;
  supplierId: string; // required because Product.supplierId is non-nullable
  categoryId?: string | null;
  imageUrl?: string | null;
}

export async function createOfferProduct(data: CreateOfferProductInput) {
  try {
    if (!data.offerId || !data.name || !data.price || !data.supplierId || !data.details) {
      return { success: false, message: 'بيانات غير مكتملة' };
    }

    const offer = await db.offer.findUnique({ where: { id: data.offerId } });
    if (!offer) return { success: false, message: 'العرض غير موجود' };

    const baseSlug = Slugify(data.name);
    const existing = await db.product.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    });
    let uniqueSlug = baseSlug;
    if (existing.length > 0) {
      let n = 1;
      const set = new Set(existing.map(p => p.slug));
      while (set.has(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${n++}`;
      }
    }

    const newProduct = await db.product.create({
      data: {
        name: data.name,
        slug: uniqueSlug,
        price: data.price,
        details: data.details,
        supplierId: data.supplierId,
        type: 'offer-only',
        published: true,
        images: data.imageUrl ? [data.imageUrl] : [],
      },
      select: { id: true },
    });

    if (data.categoryId) {
      await db.categoryProduct.create({
        data: { productId: newProduct.id, categoryId: data.categoryId },
      });
    }

    await addProductsToOffer(data.offerId, [newProduct.id]);

    revalidatePath('/dashboard/management-offer');
    revalidatePath(`/dashboard/management-offer/manage/${data.offerId}`);

    return { success: true, message: 'تم إنشاء المنتج وربطه بالعرض', productId: newProduct.id };
  } catch (error) {
    console.error('createOfferProduct error:', error);
    return { success: false, message: 'فشل إنشاء منتج العرض' };
  }
}


