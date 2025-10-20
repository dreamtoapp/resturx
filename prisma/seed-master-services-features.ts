import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMasterServices() {
  console.log('🌱 Seeding Master Services...');

  const services = [
    {
      name: 'WiFi مجاني',
      nameEn: 'Free WiFi',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/93/93158.png',
      description: 'إنترنت لاسلكي مجاني للعملاء',
      category: 'وسائل الراحة',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'موقف سيارات',
      nameEn: 'Parking',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
      description: 'موقف سيارات خاص أو متاح',
      category: 'وسائل الراحة',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'توصيل منزلي',
      nameEn: 'Home Delivery',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
      description: 'خدمة توصيل للمنازل',
      category: 'خدمات',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'طلبات سفري',
      nameEn: 'Takeaway',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2907/2907762.png',
      description: 'يمكن طلب الطعام سفري',
      category: 'خدمات',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'دفع بالبطاقة',
      nameEn: 'Card Payment',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/633/633611.png',
      description: 'قبول الدفع بالبطاقات الائتمانية',
      category: 'طرق الدفع',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'دفع كاش',
      nameEn: 'Cash Payment',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      description: 'قبول الدفع النقدي',
      category: 'طرق الدفع',
      displayOrder: 6,
      isActive: true,
    },
    {
      name: 'جلسات خارجية',
      nameEn: 'Outdoor Seating',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
      description: 'جلسات خارجية متاحة',
      category: 'وسائل الراحة',
      displayOrder: 7,
      isActive: true,
    },
    {
      name: 'مناسب للعائلات',
      nameEn: 'Family Friendly',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
      description: 'بيئة مناسبة للعائلات والأطفال',
      category: 'وسائل الراحة',
      displayOrder: 8,
      isActive: true,
    },
    {
      name: 'حجز طاولات',
      nameEn: 'Table Reservation',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3179/3179068.png',
      description: 'إمكانية حجز الطاولات مسبقاً',
      category: 'خدمات',
      displayOrder: 9,
      isActive: true,
    },
    {
      name: 'مكيف هواء',
      nameEn: 'Air Conditioning',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2884/2884856.png',
      description: 'مكيف هواء بارد في الصيف',
      category: 'وسائل الراحة',
      displayOrder: 10,
      isActive: true,
    },
  ];

  for (const service of services) {
    await prisma.masterService.upsert({
      where: { name: service.name },
      update: service,
      create: service,
    });
  }

  console.log(`✅ Created/Updated ${services.length} master services`);
}

async function seedMasterFeatures() {
  console.log('🌱 Seeding Master Features...');

  const features = [
    {
      title: 'طاهي حائز على جوائز',
      titleEn: 'Award-Winning Chef',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3585/3585627.png',
      description: 'طاهي محترف حاصل على جوائز عالمية',
      category: 'الجودة',
      displayOrder: 1,
      isActive: true,
    },
    {
      title: 'مكونات طازجة يومياً',
      titleEn: 'Fresh Daily Ingredients',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png',
      description: 'نستخدم مكونات طازجة يتم شراؤها يومياً',
      category: 'الجودة',
      displayOrder: 2,
      isActive: true,
    },
    {
      title: 'وصفات أصلية',
      titleEn: 'Authentic Recipes',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      description: 'وصفات تقليدية أصلية محفوظة عبر الأجيال',
      category: 'الأصالة',
      displayOrder: 3,
      isActive: true,
    },
    {
      title: 'صديق للبيئة',
      titleEn: 'Eco-Friendly',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3304/3304520.png',
      description: 'نستخدم مواد قابلة لإعادة التدوير ونحافظ على البيئة',
      category: 'الاستدامة',
      displayOrder: 4,
      isActive: true,
    },
    {
      title: 'خيارات نباتية',
      titleEn: 'Vegetarian Options',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/135/135620.png',
      description: 'نقدم خيارات متنوعة للنباتيين',
      category: 'تنوع القائمة',
      displayOrder: 5,
      isActive: true,
    },
    {
      title: 'خيارات صحية',
      titleEn: 'Healthy Options',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2771/2771432.png',
      description: 'خيارات صحية قليلة السعرات والدهون',
      category: 'تنوع القائمة',
      displayOrder: 6,
      isActive: true,
    },
    {
      title: 'تجربة فريدة',
      titleEn: 'Unique Experience',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3179/3179068.png',
      description: 'تجربة طعام فريدة لا تُنسى',
      category: 'التجربة',
      displayOrder: 7,
      isActive: true,
    },
    {
      title: 'موسيقى حية',
      titleEn: 'Live Music',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2995/2995620.png',
      description: 'عروض موسيقية حية في أيام محددة',
      category: 'الترفيه',
      displayOrder: 8,
      isActive: true,
    },
    {
      title: 'إطلالة مميزة',
      titleEn: 'Scenic View',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3179/3179231.png',
      description: 'إطلالة رائعة على المدينة أو البحر',
      category: 'الموقع',
      displayOrder: 9,
      isActive: true,
    },
    {
      title: 'خدمة سريعة',
      titleEn: 'Fast Service',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2278/2278992.png',
      description: 'خدمة سريعة وفعالة',
      category: 'الخدمة',
      displayOrder: 10,
      isActive: true,
    },
  ];

  for (const feature of features) {
    await prisma.masterFeature.upsert({
      where: { title: feature.title },
      update: feature,
      create: feature,
    });
  }

  console.log(`✅ Created/Updated ${features.length} master features`);
}

async function main() {
  console.log('🚀 Starting seed for Master Services and Features...');

  await seedMasterServices();
  await seedMasterFeatures();

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




