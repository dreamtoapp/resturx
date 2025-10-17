// prisma/generalSeedData.ts
// Enhanced General E-commerce Realistic Data Simulation
// Run with: pnpm tsx prisma/generalSeedData.ts

import { faker } from '@faker-js/faker/locale/ar';
import db from '../lib/prisma';
import { UserRole, OrderStatus } from '@prisma/client';
import type {
  User,
  Category,
  Shift,
  Address,
} from '@prisma/client';

type Supplier = any;
type Product = any;

import { Slugify } from '../utils/slug';

// Import general data
import { GENERAL_CATEGORIES } from '../utils/generalData/categories';
import { GENERAL_PRODUCT_TEMPLATES } from '../utils/generalData/products';
import { GENERAL_SUPPLIERS } from '../utils/generalData/suppliers';
import { GENERAL_OFFERS } from '../utils/generalData/offers';

// --- Logging Helpers (Enhanced) ---
function logBanner(msg: string) {
  console.log('\n' + '='.repeat(msg.length + 8));
  console.log(`=== ${msg} ===`);
  console.log('='.repeat(msg.length + 8));
}
function logStep(title: string) {
  console.log(`\n🔷 ${title}...`);
}
function logDone(title: string, count: number, ids?: string[]) {
  console.log(`✅ Done: ${title} (${count})${ids ? ' [' + ids.join(', ') + ']' : ''}`);
}
function logProgress(i: number, total: number, label: string, icon: string) {
  console.log(`${icon} ${label}: ${i + 1}/${total}`);
}
function logStockStatus(productName: string, inStock: boolean) {
  const status = inStock ? '✅ IN STOCK' : '❌ OUT OF STOCK';
  console.log(`📦 ${productName} - ${status}`);
}

// --- Utility: Clear all data (order matters for relations) ---
async function clearAllData() {
  logBanner('🧹 Clearing all data');
  await db.orderItem.deleteMany({});
  await db.activeTrip.deleteMany({});
  await db.orderRating.deleteMany({});
  await db.review.deleteMany({});
  await db.wishlistItem.deleteMany({});
  await db.userNotification.deleteMany({});
  await db.cartItem.deleteMany({});
  await db.cart.deleteMany({});
  await db.offerProduct.deleteMany({});
  await db.offer.deleteMany({});
  await db.categoryProduct.deleteMany({});
  await db.product.deleteMany({});
  await db.category.deleteMany({});
  await db.supplier.deleteMany({});
  await db.order.deleteMany({});
  await db.address.deleteMany({});
  await db.shift.deleteMany({});
  await db.user.deleteMany({});
  logBanner('✅ All data cleared');
}

// --- Enhanced Seeding Functions ---
async function seedShifts() {
  logStep('Seeding shifts');
  const shifts = await Promise.all([
    db.shift.create({ data: { name: 'Morning', startTime: '06:00', endTime: '14:00' } }),
    db.shift.create({ data: { name: 'Afternoon', startTime: '14:00', endTime: '22:00' } }),
    db.shift.create({ data: { name: 'Night', startTime: '22:00', endTime: '06:00' } }),
  ]);
  logDone('Shifts', shifts.length, shifts.map(s => s.id));
  return shifts;
}

async function seedUsers(count: number) {
  logStep('Seeding users');
  const users = [];
  for (let i = 0; i < count; i++) {
    let user;
    if (i === 0) {
      user = await db.user.create({ data: { name: 'Admin', phone: '0500000000', password: 'admin123', role: UserRole.ADMIN, email: 'admin@example.com' } });
    } else if (i === 1) {
      user = await db.user.create({ data: { name: 'Marketer', phone: '0500000001', password: 'marketer123', role: UserRole.MARKETER, email: 'marketer@example.com' } });
    } else if (i < 7) {
      user = await db.user.create({ data: { name: faker.person.fullName(), phone: `05000010${i - 2}`, password: 'driver123', role: UserRole.DRIVER } });
    } else {
      user = await db.user.create({ data: { name: faker.person.fullName(), phone: `05010010${i - 7}`, password: 'customer123', role: UserRole.CUSTOMER, email: `customer${i - 7}@example.com` } });
    }
    users.push(user);
    logProgress(i, count, 'Users', '👤');
  }
  logDone('Users', users.length);
  return users;
}

async function seedAddresses(users: User[]): Promise<Address[]> {
  logStep('Seeding addresses');
  const addresses = [];
  const customers = users.filter(u => u.role === 'CUSTOMER');
  for (let i = 0; i < customers.length; i++) {
    const address = await db.address.create({
      data: {
        userId: customers[i].id,
        label: i === 0 ? 'المنزل' : faker.helpers.arrayElement(['المنزل', 'العمل', 'العائلة']),
        district: faker.location.city(),
        street: faker.location.streetAddress(),
        buildingNumber: faker.number.int({ min: 1, max: 9999 }).toString(),
        floor: faker.number.int({ min: 1, max: 10 }).toString(),
        apartmentNumber: faker.number.int({ min: 1, max: 50 }).toString(),
        landmark: faker.helpers.arrayElement(['بجانب المسجد', 'قريب من المدرسة', 'عند الإشارة', null]),
        deliveryInstructions: faker.helpers.arrayElement(['اتصل عند الوصول', 'اترك عند الباب', 'سلم للموظف', null]),
        latitude: faker.location.latitude({ min: 24.5, max: 25.0, precision: 6 }).toString(),
        longitude: faker.location.longitude({ min: 46.5, max: 47.0, precision: 6 }).toString(),
        isDefault: i === 0
      }
    });
    addresses.push(address);
    logProgress(i, customers.length, 'Addresses', '🏠');
  }
  logDone('Addresses', addresses.length);
  return addresses;
}

async function seedGeneralSuppliers() {
  logStep('Seeding general suppliers');
  const suppliers = [];
  for (const supplierData of GENERAL_SUPPLIERS) {
    const supplier = await db.supplier.create({
      data: {
        name: supplierData.name,
        slug: supplierData.slug,
        logo: supplierData.logo,
        description: supplierData.description || null,
        translations: {
          create: [
            {
              languageCode: 'en',
              name: supplierData.nameEn || supplierData.name,
              description: supplierData.descriptionEn || null,
            }
          ]
        }
      }
    });
    suppliers.push(supplier);
    logProgress(suppliers.length - 1, GENERAL_SUPPLIERS.length, 'Suppliers', '🏢');
  }
  logDone('Suppliers', suppliers.length);
  return suppliers;
}

async function seedGeneralCategories() {
  logStep('Seeding general categories');
  const categories = [];
  for (const categoryData of GENERAL_CATEGORIES) {
    const category = await db.category.create({
      data: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        imageUrl: categoryData.imageUrl,
        translations: {
          create: [
            {
              languageCode: 'en',
              name: categoryData.nameEn,
              description: categoryData.descriptionEn
            }
          ]
        }
      }
    });
    categories.push(category);
    logProgress(categories.length - 1, GENERAL_CATEGORIES.length, 'Categories', '📁');
  }
  logDone('Categories', categories.length);
  return categories;
}

async function seedGeneralProducts(suppliers: Supplier[], categories: Category[]) {
  logStep('Seeding general products');
  const products = [];

  for (const template of GENERAL_PRODUCT_TEMPLATES) {
    const category = categories.find(c => c.slug === template.categorySlug);
    if (!category) continue;

    const supplier = faker.helpers.arrayElement(suppliers);

    for (let i = 0; i < template.productCount; i++) {
      const name = faker.helpers.arrayElement(template.names);
      const nameEn = faker.helpers.arrayElement(template.namesEn);
      const slug = Slugify(name + '-' + i);

      const price = faker.number.float({ min: template.priceRange.min, max: template.priceRange.max, multipleOf: 0.01 });
      const compareAtPrice = template.compareAtPriceRange
        ? faker.number.float({ min: template.compareAtPriceRange.min, max: template.compareAtPriceRange.max, multipleOf: 0.01 })
        : null;

      const isInStock = Math.random() < template.stockChance;
      const stockQuantity = isInStock ? faker.number.int({ min: 5, max: 100 }) : 0;

      const product = await db.product.create({
        data: {
          name,
          slug,
          description: faker.lorem.paragraph(),
          price,
          compareAtPrice,
          imageUrl: faker.helpers.arrayElement(template.imageUrls),
          images: template.imageUrls,
          supplierId: supplier.id,
          published: true,
          outOfStock: !isInStock,
          manageInventory: true,
          stockQuantity,
          rating: faker.number.float({ min: 3.5, max: 5.0, multipleOf: 0.1 }),
          reviewCount: faker.number.int({ min: 5, max: 200 }),
          previewCount: faker.number.int({ min: 10, max: 1000 }),
          features: faker.helpers.arrayElements(template.features, { min: 2, max: 4 }),
          brand: faker.helpers.arrayElement(template.brands),
          color: faker.helpers.arrayElement(template.colors),
          size: faker.helpers.arrayElement(template.sizes),
          material: faker.helpers.arrayElement(template.materials),
          categorySlug: category.slug,
          categoryAssignments: {
            create: {
              categoryId: category.id
            }
          },
          translations: {
            create: [
              {
                languageCode: 'en',
                name: nameEn,
                details: faker.lorem.paragraph()
              }
            ]
          }
        }
      });

      products.push(product);
      logStockStatus(product.name, isInStock);
      logProgress(products.length - 1, GENERAL_PRODUCT_TEMPLATES.reduce((sum, t) => sum + t.productCount, 0), 'Products', '📦');
    }
  }

  logDone('Products', products.length);
  return products;
}

async function seedGeneralOffers(products: Product[]) {
  logStep('Seeding general offers');
  const offers = [];

  for (const offerData of GENERAL_OFFERS) {
    const offer = await db.offer.create({
      data: {
        name: offerData.name,
        slug: offerData.slug,
        description: offerData.description,
        bannerImage: offerData.bannerImage,
        isActive: offerData.isActive,
        displayOrder: offerData.displayOrder,
        hasDiscount: offerData.hasDiscount,
        discountPercentage: offerData.discountPercentage,
        header: offerData.header,
        subheader: offerData.subheader,
        productAssignments: {
          create: faker.helpers.arrayElements(products, { min: 5, max: 15 }).map(product => ({
            productId: product.id
          }))
        }
      }
    });
    offers.push(offer);
    logProgress(offers.length - 1, GENERAL_OFFERS.length, 'Offers', '🎯');
  }

  logDone('Offers', offers.length);
  return offers;
}

async function seedOrders(users: User[], addresses: Address[], shifts: Shift[], products: Product[], count: number) {
  logStep('Seeding orders');
  const orders = [];
  const customers = users.filter(u => u.role === 'CUSTOMER');

  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const address = addresses.find(a => a.userId === customer.id) || faker.helpers.arrayElement(addresses);
    const shift = faker.helpers.arrayElement(shifts);
    const orderProducts = faker.helpers.arrayElements(products, { min: 1, max: 5 });

    const amount = orderProducts.reduce((sum, product) => sum + product.price, 0);
    const orderNumber = `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        addressId: address.id,
        shiftId: shift.id,
        status: faker.helpers.arrayElement(Object.values(OrderStatus)),
        amount,
        paymentMethod: faker.helpers.arrayElement(['CASH', 'CARD', 'WALLET']),
        deliveredAt: faker.datatype.boolean({ probability: 0.3 }) ? faker.date.recent() : null,
        items: {
          create: orderProducts.map(product => ({
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 3 }),
            price: product.price
          }))
        }
      }
    });

    orders.push(order);
    logProgress(i, count, 'Orders', '📋');
  }

  logDone('Orders', orders.length);
  return orders;
}

async function seedReviews(users: User[], products: Product[], count: number) {
  logStep('Seeding reviews');
  const reviews = [];
  const customers = users.filter(u => u.role === 'CUSTOMER');

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(customers);
    const product = faker.helpers.arrayElement(products);

    const review = await db.review.create({
      data: {
        userId: user.id,
        productId: product.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentences({ min: 1, max: 3 }),
        isVerified: faker.datatype.boolean({ probability: 0.7 })
      }
    });

    reviews.push(review);
    logProgress(i, count, 'Reviews', '⭐');
  }

  logDone('Reviews', reviews.length);
  return reviews;
}

async function updateProductReviewCounts() {
  logStep('Updating product review counts');
  const products = await db.product.findMany({
    include: { reviews: true }
  });

  for (const product of products) {
    const reviewCount = product.reviews.length;
    const avgRating = reviewCount > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : null;

    await db.product.update({
      where: { id: product.id },
      data: {
        reviewCount,
        rating: avgRating
      }
    });
  }

  logDone('Product review counts updated', products.length);
}

async function seedWishlistItems(users: User[], products: Product[]) {
  logStep('Seeding wishlist items');
  const customers = users.filter(u => u.role === 'CUSTOMER');
  let count = 0;

  for (const customer of customers) {
    const wishlistProducts = faker.helpers.arrayElements(products, { min: 2, max: 8 });

    for (const product of wishlistProducts) {
      await db.wishlistItem.create({
        data: {
          userId: customer.id,
          productId: product.id
        }
      });
      count++;
      logProgress(count - 1, customers.length * 5, 'Wishlist items', '❤️');
    }
  }

  logDone('Wishlist items', count);
}

async function getSeedConfig() {
  return {
    categories: GENERAL_CATEGORIES,
    products: GENERAL_PRODUCT_TEMPLATES,
    offers: GENERAL_OFFERS,
    users: 20,
    suppliers: GENERAL_SUPPLIERS,
    orders: 50,
    reviews: 150
  };
}

// --- Main Seed Function ---
async function main() {
  const start = Date.now();
  logBanner('🌱 Starting Enhanced General E-commerce Database Seed');
  const config = await getSeedConfig();

  try {
    await clearAllData();
  } catch (e) {
    console.error('❌ Error clearing data:', e);
    throw e;
  }

  let shifts, users, addresses, suppliers, categories, products;

  try {
    shifts = await seedShifts();
  } catch (e) {
    console.error('❌ Error seeding shifts:', e);
    throw e;
  }

  try {
    users = await seedUsers(config.users);
  } catch (e) {
    console.error('❌ Error seeding users:', e);
    throw e;
  }

  try {
    addresses = await seedAddresses(users);
  } catch (e) {
    console.error('❌ Error seeding addresses:', e);
    throw e;
  }

  try {
    suppliers = await seedGeneralSuppliers();
  } catch (e) {
    console.error('❌ Error seeding suppliers:', e);
    throw e;
  }

  try {
    categories = await seedGeneralCategories();
  } catch (e) {
    console.error('❌ Error seeding categories:', e);
    throw e;
  }

  try {
    products = await seedGeneralProducts(suppliers, categories);
  } catch (e) {
    console.error('❌ Error seeding products:', e);
    throw e;
  }

  try {
    await seedGeneralOffers(products);
  } catch (e) {
    console.error('❌ Error seeding offers:', e);
    throw e;
  }

  try {
    await seedOrders(users, addresses, shifts, products, config.orders);
  } catch (e) {
    console.error('❌ Error seeding orders:', e);
    throw e;
  }

  try {
    await seedReviews(users, products, config.reviews);
  } catch (e) {
    console.error('❌ Error seeding reviews:', e);
    throw e;
  }

  try {
    await updateProductReviewCounts();
  } catch (e) {
    console.error('❌ Error updating product reviewCount:', e);
    throw e;
  }

  try {
    await seedWishlistItems(users, products);
  } catch (e) {
    console.error('❌ Error seeding wishlist items:', e);
    throw e;
  }

  logBanner('🎉 ENHANCED GENERAL E-COMMERCE SEED COMPLETE!');
  console.log(`⏱️  Total time: ${((Date.now() - start) / 1000).toFixed(1)}s`);
  console.log(`📊 Generated ${products.length} general products with realistic stock management`);
  console.log(`🏷️  Created ${categories.length} categories with HD images`);
  console.log(`🏢 Seeded ${suppliers.length} suppliers with proper branding`);
  console.log(`👥 Created ${users.length} users with different roles`);
  console.log(`📋 Generated ${config.orders} sample orders`);
  console.log(`⭐ Created ${config.reviews} product reviews`);
}

main().catch((e) => {
  console.error('❌ Enhanced general e-commerce seed failed:', e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});
