import { z } from 'zod';

export const MasterDishCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'اسم الصنف مطلوب'),
  nameEn: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type MasterDishCategoryFormData = z.infer<typeof MasterDishCategorySchema>;

