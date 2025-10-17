// utils/generalData/offers.ts
// General e-commerce promotional offers

import { Slugify } from '../slug';

export interface GeneralOffer {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  bannerImage: string;
  isActive: boolean;
  displayOrder: number;
  hasDiscount: boolean;
  discountPercentage?: number;
  header: string;
  subheader: string;
}

export const GENERAL_OFFERS: GeneralOffer[] = [
  {
    name: 'عروض الصيف الكبرى',
    nameEn: 'Summer Mega Sale',
    slug: Slugify('عروض الصيف الكبرى'),
    description: 'خصومات تصل إلى 50% على جميع المنتجات',
    descriptionEn: 'Up to 50% off on all products',
    bannerImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop',
    isActive: true,
    displayOrder: 1,
    hasDiscount: true,
    discountPercentage: 50,
    header: 'عروض الصيف الكبرى',
    subheader: 'خصومات تصل إلى 50%'
  },
  {
    name: 'منتجات جديدة',
    nameEn: 'New Arrivals',
    slug: Slugify('منتجات جديدة'),
    description: 'أحدث المنتجات والأجهزة التقنية',
    descriptionEn: 'Latest products and tech devices',
    bannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    isActive: true,
    displayOrder: 2,
    hasDiscount: false,
    header: 'منتجات جديدة',
    subheader: 'اكتشف أحدث الابتكارات'
  },
  {
    name: 'عروض الإلكترونيات',
    nameEn: 'Electronics Deals',
    slug: Slugify('عروض الإلكترونيات'),
    description: 'أفضل الأسعار على الهواتف والأجهزة',
    descriptionEn: 'Best prices on phones and devices',
    bannerImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
    isActive: true,
    displayOrder: 3,
    hasDiscount: true,
    discountPercentage: 30,
    header: 'عروض الإلكترونيات',
    subheader: 'خصم 30% على جميع الأجهزة'
  },
  {
    name: 'أسبوع الجمال',
    nameEn: 'Beauty Week',
    slug: Slugify('أسبوع الجمال'),
    description: 'خصومات خاصة على منتجات التجميل والعناية',
    descriptionEn: 'Special discounts on cosmetics and care products',
    bannerImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop',
    isActive: true,
    displayOrder: 4,
    hasDiscount: true,
    discountPercentage: 25,
    header: 'أسبوع الجمال',
    subheader: 'خصم 25% على منتجات الجمال'
  },
  {
    name: 'تخفيضات التصفية',
    nameEn: 'Clearance Sale',
    slug: Slugify('تخفيضات التصفية'),
    description: 'أسعار منخفضة على المنتجات المتبقية',
    descriptionEn: 'Low prices on remaining products',
    bannerImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop',
    isActive: true,
    displayOrder: 5,
    hasDiscount: true,
    discountPercentage: 70,
    header: 'تخفيضات التصفية',
    subheader: 'خصم يصل إلى 70%'
  }
];


