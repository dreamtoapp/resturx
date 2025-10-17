// Quick script to verify seed data structure
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function verifyData() {
  console.log('\n📊 Verifying Seed Data...\n');
  console.log('━'.repeat(50));

  // 1. Check Countries
  const countries = await db.country.findMany({
    include: {
      _count: {
        select: { restaurants: true }
      }
    },
    orderBy: { name: 'asc' }
  });
  
  console.log('\n🌍 COUNTRIES (Cuisines):');
  countries.forEach(c => {
    console.log(`   ✓ ${c.name} - ${c._count.restaurants} restaurants - slug: ${c.slug}`);
  });

  // 2. Check Restaurants grouped by Country
  console.log('\n\n🏪 RESTAURANTS by Cuisine:');
  for (const country of countries) {
    const restaurants = await db.restaurant.findMany({
      where: { countryId: country.id, status: 'ACTIVE' },
      include: {
        _count: {
          select: { dishes: true }
        }
      }
    });
    
    console.log(`\n   ${country.name}:`);
    restaurants.forEach(r => {
      console.log(`      → ${r.name} (${r._count.dishes} dishes) - slug: ${r.slug}`);
    });
  }

  // 3. Sample Dishes from first restaurant
  const firstRestaurant = await db.restaurant.findFirst({
    include: {
      dishes: {
        take: 5,
        where: { published: true }
      }
    }
  });

  if (firstRestaurant) {
    console.log(`\n\n🍽️  SAMPLE DISHES from "${firstRestaurant.name}":`);
    firstRestaurant.dishes.forEach(d => {
      console.log(`      → ${d.name} - ${d.price} ريال - ${d.published ? '✅ Published' : '❌ Hidden'}`);
    });
  }

  // 4. Summary Stats
  const stats = await db.$transaction([
    db.country.count(),
    db.restaurant.count(),
    db.dish.count(),
    db.user.count({ where: { role: 'RESTAURANT_OWNER' } }),
    db.restaurantService.count(),
    db.restaurantFeature.count(),
    db.restaurantImage.count(),
  ]);

  console.log('\n\n📈 SUMMARY:');
  console.log('━'.repeat(50));
  console.log(`   Countries:           ${stats[0]}`);
  console.log(`   Restaurants:         ${stats[1]}`);
  console.log(`   Dishes:              ${stats[2]}`);
  console.log(`   Restaurant Owners:   ${stats[3]}`);
  console.log(`   Services:            ${stats[4]}`);
  console.log(`   Features:            ${stats[5]}`);
  console.log(`   Gallery Images:      ${stats[6]}`);
  console.log('━'.repeat(50));

  // 5. Test Flow URLs
  const sampleCountry = countries[0];
  const sampleRestaurant = await db.restaurant.findFirst({
    where: { countryId: sampleCountry.id }
  });

  console.log('\n\n🔗 TEST URLS:');
  console.log('━'.repeat(50));
  console.log(`   Homepage:            http://localhost:3000`);
  console.log(`   All Cuisines:        http://localhost:3000/categories`);
  console.log(`   Sample Cuisine:      http://localhost:3000/categories/${sampleCountry.slug}`);
  if (sampleRestaurant) {
    console.log(`   Sample Restaurant:   http://localhost:3000/restaurant/${sampleRestaurant.slug}`);
    console.log(`   Restaurant Menu:     http://localhost:3000/restaurant/${sampleRestaurant.slug}/menu`);
  }
  console.log('━'.repeat(50));

  console.log('\n✅ Seed data verification complete!\n');
}

verifyData()
  .catch(console.error)
  .finally(() => db.$disconnect());




