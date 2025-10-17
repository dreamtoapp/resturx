// utils/generalData/suppliers.ts
// General e-commerce suppliers with realistic data

import { Slugify } from '../slug';

export interface GeneralSupplier {
  name: string;
  nameEn?: string;
  slug: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  type?: string;
  taxNumber?: string;
  description?: string;
  descriptionEn?: string;
}

export const GENERAL_SUPPLIERS: GeneralSupplier[] = [
  {
    name: 'أمازون السعودية',
    nameEn: 'Amazon Saudi Arabia',
    slug: Slugify('أمازون السعودية'),
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
    email: 'orders@amazon.sa',
    phone: '+966-11-123-4567',
    address: 'الرياض، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300123456789003'
  },
  {
    name: 'متجر إلكترونيات',
    nameEn: 'Electronics Store',
    slug: Slugify('متجر إلكترونيات'),
    logo: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop',
    email: 'sales@electronics-store.sa',
    phone: '+966-13-234-5678',
    address: 'الدمام، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300234567890004'
  },
  {
    name: 'بيت الجمال',
    nameEn: 'Beauty House',
    slug: Slugify('بيت الجمال'),
    logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
    email: 'info@beauty-house.sa',
    phone: '+966-12-345-6789',
    address: 'جدة، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300345678901005'
  },
  {
    name: 'الرياضة واللياقة',
    nameEn: 'Sports & Fitness',
    slug: Slugify('الرياضة واللياقة'),
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    email: 'support@sports-fitness.sa',
    phone: '+966-11-456-7890',
    address: 'الرياض، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300456789012006'
  },
  {
    name: 'مكتبة المعرفة',
    nameEn: 'Knowledge Library',
    slug: Slugify('مكتبة المعرفة'),
    logo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop',
    email: 'books@knowledge-library.sa',
    phone: '+966-14-567-8901',
    address: 'الخبر، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300567890123007'
  },
  {
    name: 'ألعاب الأطفال',
    nameEn: 'Kids Toys',
    slug: Slugify('ألعاب الأطفال'),
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    email: 'toys@kids-toys.sa',
    phone: '+966-11-678-9012',
    address: 'الرياض، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300678901234008'
  },
  {
    name: 'الصحة والعافية',
    nameEn: 'Health & Wellness',
    slug: Slugify('الصحة والعافية'),
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
    email: 'health@wellness.sa',
    phone: '+966-13-789-0123',
    address: 'الدمام، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300789012345009'
  },
  {
    name: 'إكسسوارات السيارات',
    nameEn: 'Car Accessories',
    slug: Slugify('إكسسوارات السيارات'),
    logo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop',
    email: 'cars@accessories.sa',
    phone: '+966-12-890-1234',
    address: 'جدة، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300890123456010'
  },
  {
    name: 'مستلزمات الحيوانات',
    nameEn: 'Pet Supplies',
    slug: Slugify('مستلزمات الحيوانات'),
    logo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop',
    email: 'pets@supplies.sa',
    phone: '+966-11-901-2345',
    address: 'الرياض، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '300901234567011'
  },
  {
    name: 'المجوهرات الفاخرة',
    nameEn: 'Luxury Jewelry',
    slug: Slugify('المجوهرات الفاخرة'),
    logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
    email: 'jewelry@luxury.sa',
    phone: '+966-14-012-3456',
    address: 'الخبر، المملكة العربية السعودية',
    type: 'company',
    taxNumber: '301012345678012'
  }
];


