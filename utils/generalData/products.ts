// utils/generalData/products.ts
// General e-commerce product templates with Arabic/English support

import { Slugify } from '../slug';

export interface GeneralProductTemplate {
  categorySlug: string;
  names: string[];
  namesEn: string[];
  priceRange: { min: number; max: number };
  compareAtPriceRange?: { min: number; max: number };
  features: string[];
  featuresEn: string[];
  materials: string[];
  colors: string[];
  sizes: string[];
  brands: string[];
  stockChance: number;
  imageUrls: string[];
  productCount: number;
}

export const GENERAL_PRODUCT_TEMPLATES: GeneralProductTemplate[] = [
  // Electronics - Smartphones
  {
    categorySlug: Slugify('إلكترونيات'),
    names: [
      'هاتف ذكي iPhone 14 Pro',
      'هاتف Samsung Galaxy S23',
      'هاتف Google Pixel 7',
      'هاتف OnePlus 11',
      'هاتف Xiaomi 13 Pro'
    ],
    namesEn: [
      'iPhone 14 Pro Smartphone',
      'Samsung Galaxy S23',
      'Google Pixel 7',
      'OnePlus 11',
      'Xiaomi 13 Pro'
    ],
    priceRange: { min: 800, max: 1500 },
    compareAtPriceRange: { min: 900, max: 1700 },
    features: [
      'كاميرا احترافية ثلاثية',
      'شاشة OLED عالية الدقة',
      'معالج سريع وأداء قوي',
      'بطارية طويلة الأمد',
      'مقاوم للماء والغبار'
    ],
    featuresEn: [
      'Professional triple camera',
      'High-resolution OLED display',
      'Fast processor and strong performance',
      'Long-lasting battery',
      'Water and dust resistant'
    ],
    materials: ['زجاج', 'ألومنيوم', 'سيليكون'],
    colors: ['أسود', 'أبيض', 'ذهبي', 'أزرق', 'بنفسجي'],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    brands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
    stockChance: 0.9,
    imageUrls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=1000&fit=crop&fm=webp&q=80'
    ],
    productCount: 5
  },

  // Home & Kitchen - Blenders
  {
    categorySlug: Slugify('المنزل والمطبخ'),
    names: [
      'خلاط Vitamix احترافي',
      'خلاط Ninja عالي الطاقة',
      'خلاط KitchenAid متعدد الاستخدامات',
      'خلاط Nutribullet صغير',
      'خلاط Hamilton Beach اقتصادي'
    ],
    namesEn: [
      'Vitamix Professional Blender',
      'Ninja High-Power Blender',
      'KitchenAid Multi-Use Blender',
      'Nutribullet Personal Blender',
      'Hamilton Beach Budget Blender'
    ],
    priceRange: { min: 50, max: 500 },
    compareAtPriceRange: { min: 70, max: 600 },
    features: [
      'قوة خلط عالية',
      'وعاء من البلاستيك الآمن',
      'سهل التنظيف',
      'متعدد السرعات',
      'ضمان طويل الأمد'
    ],
    featuresEn: [
      'High blending power',
      'Safe plastic container',
      'Easy to clean',
      'Multiple speeds',
      'Long warranty'
    ],
    materials: ['بلاستيك', 'معدن', 'زجاج'],
    colors: ['أبيض', 'أسود', 'أحمر', 'أزرق', 'فضي'],
    sizes: ['32 أوقية', '48 أوقية', '64 أوقية'],
    brands: ['Vitamix', 'Ninja', 'KitchenAid', 'Nutribullet', 'Hamilton Beach'],
    stockChance: 0.9,
    imageUrls: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=1000&fit=crop&fm=webp&q=80'
    ],
    productCount: 5
  },

  // Beauty - Skincare
  {
    categorySlug: Slugify('الجمال والعناية الشخصية'),
    names: [
      'كريم مرطب CeraVe للوجه',
      'سيروم فيتامين C للبشرة',
      'مقشر كيميائي The Ordinary',
      'مرطب La Roche-Posay',
      'كريم حماية من الشمس'
    ],
    namesEn: [
      'CeraVe Facial Moisturizer',
      'Vitamin C Serum for Skin',
      'The Ordinary Chemical Exfoliant',
      'La Roche-Posay Moisturizer',
      'Sunscreen Protection Cream'
    ],
    priceRange: { min: 15, max: 80 },
    compareAtPriceRange: { min: 20, max: 100 },
    features: [
      'مناسب لجميع أنواع البشرة',
      'خالي من العطور',
      'مقاوم للحساسية',
      'يحتوي على مكونات طبيعية',
      'نتائج سريعة ومرئية'
    ],
    featuresEn: [
      'Suitable for all skin types',
      'Fragrance-free',
      'Hypoallergenic',
      'Contains natural ingredients',
      'Fast and visible results'
    ],
    materials: ['مكونات طبيعية', 'ماء', 'زيوت نباتية'],
    colors: ['أبيض', 'شفاف', 'وردي فاتح'],
    sizes: ['30 مل', '50 مل', '100 مل'],
    brands: ['CeraVe', 'The Ordinary', 'La Roche-Posay', 'Neutrogena', 'Olay'],
    stockChance: 0.95,
    imageUrls: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=1000&fit=crop&fm=webp&q=80'
    ],
    productCount: 5
  },

  // Sports - Fitness Equipment
  {
    categorySlug: Slugify('الرياضة والهواء الطلق'),
    names: [
      'سجادة يوجا Manduka',
      'أوزان Bowflex قابلة للتعديل',
      'شريط مقاومة للتمارين',
      'دراجة ثابتة NordicTrack',
      'مشاية كهربائية ProForm'
    ],
    namesEn: [
      'Manduka Yoga Mat',
      'Bowflex Adjustable Weights',
      'Resistance Band for Exercise',
      'NordicTrack Stationary Bike',
      'ProForm Treadmill'
    ],
    priceRange: { min: 30, max: 2000 },
    compareAtPriceRange: { min: 40, max: 2500 },
    features: [
      'مقاوم للانزلاق',
      'مريح وآمن للاستخدام',
      'سهل التخزين',
      'متين وطويل الأمد',
      'مناسب للمبتدئين والمحترفين'
    ],
    featuresEn: [
      'Non-slip surface',
      'Comfortable and safe to use',
      'Easy to store',
      'Durable and long-lasting',
      'Suitable for beginners and professionals'
    ],
    materials: ['مطاط طبيعي', 'بوليستر', 'معدن', 'بلاستيك'],
    colors: ['أسود', 'أزرق', 'وردي', 'أخضر', 'بنفسجي'],
    sizes: ['صغير', 'متوسط', 'كبير'],
    brands: ['Manduka', 'Bowflex', 'NordicTrack', 'ProForm', 'Gaiam'],
    stockChance: 0.8,
    imageUrls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=1000&fit=crop&fm=webp&q=80'
    ],
    productCount: 5
  },

  // Books
  {
    categorySlug: Slugify('الكتب والقرطاسية'),
    names: [
      'كتاب "المكتبة في منتصف الليل"',
      'رواية "المعرفة المثقفة"',
      'كتاب "صديق الجائع" للأطفال',
      'دليل "فن التفكير"',
      'كتاب "تاريخ الإنسانية"'
    ],
    namesEn: [
      'Book "The Midnight Library"',
      'Novel "Educated"',
      'Children\'s Book "The Very Hungry Caterpillar"',
      'Guide "The Art of Thinking"',
      'Book "Sapiens: A Brief History of Humankind"'
    ],
    priceRange: { min: 10, max: 50 },
    compareAtPriceRange: { min: 15, max: 60 },
    features: [
      'غلاف فني عالي الجودة',
      'طباعة واضحة وسهلة القراءة',
      'مقاوم للتلف',
      'مناسب لجميع الأعمار',
      'محتوى مفيد وممتع'
    ],
    featuresEn: [
      'High-quality hardcover',
      'Clear and easy-to-read printing',
      'Tear-resistant',
      'Suitable for all ages',
      'Useful and entertaining content'
    ],
    materials: ['ورق عالي الجودة', 'غلاف فني'],
    colors: ['متعدد الألوان'],
    sizes: ['متوسط', 'كبير'],
    brands: ['مؤلفين مختلفين'],
    stockChance: 0.95,
    imageUrls: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&fm=webp&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=1000&fit=crop&fm=webp&q=80'
    ],
    productCount: 5
  }
];
