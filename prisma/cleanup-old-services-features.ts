import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Starting cleanup of old RestaurantService and RestaurantFeature records...');

  // Delete all existing RestaurantService records
  const deletedServices = await prisma.restaurantService.deleteMany({});
  console.log(`✅ Deleted ${deletedServices.count} old RestaurantService records`);

  // Delete all existing RestaurantFeature records
  const deletedFeatures = await prisma.restaurantFeature.deleteMany({});
  console.log(`✅ Deleted ${deletedFeatures.count} old RestaurantFeature records`);

  console.log('✨ Cleanup completed successfully!');
  console.log('ℹ️  Restaurants can now select services and features from the master lists');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




