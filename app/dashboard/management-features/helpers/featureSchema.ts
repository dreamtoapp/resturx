import { z } from 'zod';

export const MasterFeatureSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'يجب أن يكون عنوان الميزة حرفين على الأقل').max(100),
  titleEn: z.string().max(100).optional().or(z.literal('')),
  imageUrl: z.string().url('يجب إدخال رابط صحيح').optional().or(z.literal('')),
  description: z.string().min(5, 'يجب أن يكون الوصف 5 أحرف على الأقل').max(500),
  category: z.string().max(50).optional().or(z.literal('')),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type MasterFeatureFormData = z.infer<typeof MasterFeatureSchema>;

