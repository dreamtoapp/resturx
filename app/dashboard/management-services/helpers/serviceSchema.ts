import { z } from 'zod';

export const MasterServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'يجب أن يكون اسم الخدمة حرفين على الأقل').max(100),
  nameEn: z.string().max(100).optional().or(z.literal('')),
  imageUrl: z.string().url('يجب إدخال رابط صحيح').optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
  category: z.string().max(50).optional().or(z.literal('')),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type MasterServiceFormData = z.infer<typeof MasterServiceSchema>;

