import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

// Popular dish validation schema
export const PopularDishSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().nonempty('اسم الطبق مطلوب'),
  description: z.string().trim().optional(),
  countryId: z.string().trim().nonempty('معرف المطبخ مطلوب'),
});

export type PopularDishFormData = z.infer<typeof PopularDishSchema>;

interface Field {
  name: keyof PopularDishFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

// Generate form fields based on popular dish data
export const getPopularDishFields = (
  register: UseFormRegister<PopularDishFormData>,
  errors: FieldErrors<PopularDishFormData>
): FieldSection[] => [
    {
      section: 'بيانات الطبق المشهور',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'اسم الطبق (مثال: برياني دجاج، مسالا تكا)',
          register: register('name'),
          error: errors.name?.message,
          className: 'col-span-2',
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'وصف الطبق (اختياري)',
          register: register('description'),
          error: errors.description?.message,
          className: 'col-span-2',
        },
      ],
    },
  ];

