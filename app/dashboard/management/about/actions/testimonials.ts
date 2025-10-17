import db from '@/lib/prisma';
import { z } from 'zod';

const testimonialSchema = z.object({
  author: z.string().min(2, 'اسم العميل مطلوب'),
  text: z.string().min(10, 'نص رأي العميل مطلوب (10 أحرف على الأقل)'),
  rating: z.number().min(1).max(5, 'التقييم يجب أن يكون بين 1 و 5'),
  imageUrl: z.string().url('رابط الصورة غير صحيح').optional().or(z.literal('')),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export async function getTestimonials() {
  try {
    const testimonials = await db.testimonial.findMany();
    return { success: true, testimonials };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createTestimonial(data: TestimonialFormValues & { aboutPageId: string }) {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  try {
    const testimonial = await db.testimonial.create({
      data: {
        author: data.author,
        text: data.text,
        rating: data.rating,
        imageUrl: data.imageUrl || '',
        aboutPage: { connect: { id: data.aboutPageId } },
      },
    });
    return { success: true, testimonial };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateTestimonial(id: string, data: TestimonialFormValues) {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  try {
    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        author: data.author,
        text: data.text,
        rating: data.rating,
        imageUrl: data.imageUrl || '',
      }
    });
    return { success: true, testimonial };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await db.testimonial.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
