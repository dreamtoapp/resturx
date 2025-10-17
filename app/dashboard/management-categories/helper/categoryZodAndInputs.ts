// categoryFields.ts
import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

// 🧩 Zod schema for restaurant validation
export const RestaurantSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().nonempty('اسم المطعم مطلوب'),
  description: z.string().trim().optional(),
  countryId: z.string().trim().nonempty('يجب اختيار نوع المطبخ'),
  userId: z.string().trim().nonempty('يجب اختيار صاحب المطعم'),

  // Contact & Location
  phone: z.string().trim().optional(),
  email: z.string().trim().email('صيغة البريد غير صحيحة').optional().or(z.literal('')),
  address: z.string().trim().optional(),
  latitude: z.string().trim().optional(),
  longitude: z.string().trim().optional(),

  // Operational
  workingHours: z.string().trim().optional(),
  deliveryTime: z.string().trim().optional(),
  minOrder: z.coerce.number().optional(),
  deliveryFee: z.coerce.number().optional(),
  hasOwnDelivery: z.boolean().optional(),

  // Profile
  bio: z.string().trim().optional(),
  specialties: z.array(z.string()).optional(),
  cuisineTypes: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),

  // Status
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
  isVerified: z.boolean().optional(),
  isPopular: z.boolean().optional(),
});

// 🧩 Inferred type from schema
export type RestaurantFormData = z.infer<typeof RestaurantSchema>;

// Backward compatibility
export const CategorySchema = RestaurantSchema;
export type CategoryFormData = RestaurantFormData;

// 📦 Interface for individual form field
export interface Field {
  name: keyof CategoryFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
}

// 📦 Interface for a group of fields
export interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

// 🚀 Function to generate form field structure for restaurants
export const getRestaurantFields = (
  register: UseFormRegister<CategoryFormData>,
  errors: FieldErrors<CategoryFormData>
): FieldSection[] => [
    {
      section: 'معلومات أساسية',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'اسم المطعم *',
          register: register('name'),
          error: errors.name?.message,
          className: 'col-span-2',
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'وصف مختصر عن المطعم',
          register: register('description'),
          error: errors.description?.message,
          className: 'col-span-2',
        },
      ],
    },
    {
      section: 'معلومات الاتصال',
      hint: false,
      fields: [
        {
          name: 'phone',
          type: 'tel',
          placeholder: 'رقم الهاتف',
          register: register('phone'),
          error: errors.phone?.message,
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'البريد الإلكتروني',
          register: register('email'),
          error: errors.email?.message,
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'العنوان',
          register: register('address'),
          error: errors.address?.message,
          className: 'col-span-2',
        },
      ],
    },
    {
      section: 'معلومات التوصيل',
      hint: false,
      fields: [
        {
          name: 'deliveryTime',
          type: 'text',
          placeholder: 'وقت التوصيل (مثال: 30-45 دقيقة)',
          register: register('deliveryTime'),
          error: errors.deliveryTime?.message,
        },
        {
          name: 'minOrder',
          type: 'number',
          placeholder: 'الحد الأدنى للطلب (ريال)',
          register: register('minOrder'),
          error: errors.minOrder?.message,
        },
        {
          name: 'deliveryFee',
          type: 'number',
          placeholder: 'رسوم التوصيل (ريال)',
          register: register('deliveryFee'),
          error: errors.deliveryFee?.message,
        },
      ],
    },
  ];

// Backward compatibility
export const getCategoryFields = getRestaurantFields;
