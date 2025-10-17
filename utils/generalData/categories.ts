// utils/generalData/categories.ts
// General e-commerce categories with Arabic/English support

import { Slugify } from '../slug';

export interface GeneralCategory {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  productCount: number;
}

export const GENERAL_CATEGORIES: GeneralCategory[] = [
  // Electronics
  {
    name: 'إلكترونيات',
    nameEn: "Electronics",
    slug: Slugify('إلكترونيات'),
    description: 'أحدث الأجهزة الإلكترونية والهواتف الذكية والحواسيب',
    descriptionEn: 'Latest electronic devices, smartphones, and computers',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=1000&fit=crop',
    productCount: 5
  },

  // Home & Kitchen
  {
    name: 'المنزل والمطبخ',
    nameEn: "Home & Kitchen",
    slug: Slugify('المنزل والمطبخ'),
    description: 'أدوات المطبخ والأجهزة المنزلية والأثاث',
    descriptionEn: 'Kitchen tools, home appliances, and furniture',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop',
    productCount: 5
  },

  // Beauty & Personal Care
  {
    name: 'الجمال والعناية الشخصية',
    nameEn: "Beauty & Personal Care",
    slug: Slugify('الجمال والعناية الشخصية'),
    description: 'منتجات التجميل والعناية بالبشرة والشعر',
    descriptionEn: 'Cosmetics, skincare, and hair care products',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop',
    productCount: 5
  },

  // Sports & Outdoors
  {
    name: 'الرياضة والهواء الطلق',
    nameEn: "Sports & Outdoors",
    slug: Slugify('الرياضة والهواء الطلق'),
    description: 'معدات الرياضة والألعاب والأنشطة الخارجية',
    descriptionEn: 'Sports equipment, games, and outdoor activities',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop',
    productCount: 5
  },

  // Books & Stationery
  {
    name: 'الكتب والقرطاسية',
    nameEn: "Books & Stationery",
    slug: Slugify('الكتب والقرطاسية'),
    description: 'كتب متنوعة ولوازم مكتبية ومستلزمات تعليمية',
    descriptionEn: 'Various books, office supplies, and educational materials',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1000&fit=crop',
    productCount: 5
  }
];
