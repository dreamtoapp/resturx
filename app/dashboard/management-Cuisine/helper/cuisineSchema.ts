import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

// Cuisine type validation schema
export const CuisineSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().nonempty('اسم نوع المطبخ مطلوب'),
  description: z.string().trim().optional(),
  type: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CuisineFormData = z.infer<typeof CuisineSchema>;

interface Field {
  name: keyof CuisineFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
  latitude?: string;
  longitude?: string;
  sharedLocationLink?: string;
}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

// Generate form fields based on cuisine data
export const getCuisineFields = (
  register: UseFormRegister<CuisineFormData>,
  errors: FieldErrors<CuisineFormData>
): FieldSection[] => [
    {
      section: 'بيانات نوع المطبخ',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'الاسم (مثال: مطبخ هندي، مطبخ مصري)',
          register: register('name'),
          error: errors.name?.message,
          className: 'col-span-2',
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'وصف مختصر عن نوع المطبخ (اختياري)',
          register: register('description'),
          error: errors.description?.message,
          className: 'col-span-2',
        },
      ],
    },
  ];


