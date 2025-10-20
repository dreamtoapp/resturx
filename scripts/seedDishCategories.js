/**
 * Seed Dish Categories Script
 * 
 * This script populates the database with common dish categories
 * for restaurants to use when categorizing their menu items.
 * 
 * Usage:
 *   npm run seed:dish-categories           # Add new categories (skip existing)
 *   npm run seed:dish-categories --clear   # Clear all and reseed
 *   node scripts/seedDishCategories.js     # Direct execution
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dishCategories = [
  {
    name: 'مقبلات',
    nameEn: 'Appetizers',
    description: 'أطباق صغيرة تُقدم قبل الوجبة الرئيسية',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'شوربات',
    nameEn: 'Soups',
    description: 'أنواع مختلفة من الشوربات الساخنة',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'سلطات',
    nameEn: 'Salads',
    description: 'سلطات طازجة ومتنوعة',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'أطباق رئيسية',
    nameEn: 'Main Dishes',
    description: 'الأطباق الرئيسية والوجبات الدسمة',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'مشاوي',
    nameEn: 'Grills',
    description: 'أطباق اللحوم والدجاج المشوية',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'معجنات',
    nameEn: 'Pastries',
    description: 'معجنات محشية ومخبوزات',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'أرز وبرياني',
    nameEn: 'Rice & Biryani',
    description: 'أطباق الأرز والبرياني بأنواعها',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: 'معكرونة',
    nameEn: 'Pasta',
    description: 'أطباق المعكرونة الإيطالية والعربية',
    displayOrder: 8,
    isActive: true,
  },
  {
    name: 'بيتزا',
    nameEn: 'Pizza',
    description: 'بيتزا بأنواعها وأحجامها المختلفة',
    displayOrder: 9,
    isActive: true,
  },
  {
    name: 'برغر وساندويشات',
    nameEn: 'Burgers & Sandwiches',
    description: 'برغر وساندويشات متنوعة',
    displayOrder: 10,
    isActive: true,
  },
  {
    name: 'وجبات سريعة',
    nameEn: 'Fast Food',
    description: 'وجبات سريعة ومقرمشات',
    displayOrder: 11,
    isActive: true,
  },
  {
    name: 'حلويات',
    nameEn: 'Desserts',
    description: 'حلويات شرقية وغربية',
    displayOrder: 12,
    isActive: true,
  },
  {
    name: 'آيس كريم',
    nameEn: 'Ice Cream',
    description: 'آيس كريم ومثلجات بنكهات مختلفة',
    displayOrder: 13,
    isActive: true,
  },
  {
    name: 'مشروبات ساخنة',
    nameEn: 'Hot Beverages',
    description: 'قهوة، شاي، ومشروبات ساخنة',
    displayOrder: 14,
    isActive: true,
  },
  {
    name: 'مشروبات باردة',
    nameEn: 'Cold Beverages',
    description: 'عصائر طازجة ومشروبات باردة',
    displayOrder: 15,
    isActive: true,
  },
  {
    name: 'عصائر طبيعية',
    nameEn: 'Fresh Juices',
    description: 'عصائر فواكه طازجة ١٠٠٪',
    displayOrder: 16,
    isActive: true,
  },
  {
    name: 'مشروبات غازية',
    nameEn: 'Soft Drinks',
    description: 'مشروبات غازية ومعلبة',
    displayOrder: 17,
    isActive: true,
  },
  {
    name: 'مأكولات بحرية',
    nameEn: 'Seafood',
    description: 'أسماك وجمبري ومأكولات بحرية',
    displayOrder: 18,
    isActive: true,
  },
  {
    name: 'أطباق نباتية',
    nameEn: 'Vegetarian',
    description: 'أطباق نباتية خالية من اللحوم',
    displayOrder: 19,
    isActive: true,
  },
  {
    name: 'إضافات',
    nameEn: 'Extras',
    description: 'إضافات وصلصات جانبية',
    displayOrder: 20,
    isActive: true,
  },
];

async function seedDishCategories() {
  console.log('🌱 Starting dish categories seed...\n');

  try {
    // Check if categories already exist
    const existingCount = await prisma.masterDishCategory.count();
    
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing dish categories.`);
      console.log('Adding new categories only (avoiding duplicates)...\n');
    }

    let created = 0;
    let skipped = 0;

    for (const category of dishCategories) {
      const existing = await prisma.masterDishCategory.findFirst({
        where: { name: category.name }
      });

      if (existing) {
        console.log(`⏭️  Skipped: "${category.name}" (already exists)`);
        skipped++;
      } else {
        await prisma.masterDishCategory.create({
          data: category
        });
        console.log(`✅ Created: "${category.name}" (${category.nameEn})`);
        created++;
      }
    }

    console.log('\n📊 Seed Summary:');
    console.log(`   ✅ Created: ${created} categories`);
    console.log(`   ⏭️  Skipped: ${skipped} categories`);
    console.log(`   📦 Total in DB: ${await prisma.masterDishCategory.count()} categories`);
    console.log('\n✨ Dish categories seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding dish categories:', error);
    throw error;
  }
}

async function clearAndReseed() {
  console.log('🗑️  Clearing existing dish categories...');
  
  try {
    const deleted = await prisma.masterDishCategory.deleteMany({});
    console.log(`   Deleted ${deleted.count} categories\n`);
  } catch (error) {
    console.log('   No existing categories to delete\n');
  }
  
  await seedDishCategories();
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear') || args.includes('-c');

  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Dish Categories Seed Script              ║');
  console.log('╚════════════════════════════════════════════╝\n');

  if (shouldClear) {
    console.log('Mode: Clear and Reseed\n');
    await clearAndReseed();
  } else {
    console.log('Mode: Add New Categories Only\n');
    await seedDishCategories();
  }
}

main()
  .catch((e) => {
    console.error('\n❌ Fatal Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

