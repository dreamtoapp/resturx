import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Icon } from '@/components/icons/Icon';
import db from '@/lib/prisma';
import RestaurantPortalHeader from './components/RestaurantPortalHeader';
import RestaurantPortalSidebar from './components/RestaurantPortalSidebar';

export const metadata = {
  title: 'بوابة المطعم',
  description: 'إدارة مطعمك',
};

export default async function RestaurantPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await auth();

  if (!session || session.user.role !== 'RESTAURANT_OWNER') {
    redirect('/auth/login?error=unauthorized');
  }

  // Get restaurant for this owner
  const restaurant = await db.restaurant.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      status: true,
      rating: true,
    }
  });

  if (!restaurant) {
    redirect('/auth/login?error=unauthorized');
  }

  // Get today's date for filtering today's orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get real counts for sidebar badges
  const [dishesCount, servicesCount, featuresCount, imagesCount, videosCount, pendingOrdersCount, reviewsCount, todayOrdersCount] = await Promise.all([
    // Count ALL dishes (using supplierId which maps to restaurant)
    db.dish.count({
      where: {
        supplierId: restaurant.id
      }
    }),

    // Count active services
    db.restaurantService.count({
      where: {
        restaurantId: restaurant.id,
        isActive: true
      }
    }),

    // Count active features
    db.restaurantFeature.count({
      where: {
        restaurantId: restaurant.id,
        isActive: true
      }
    }),

    // Count gallery images
    db.restaurantImage.count({
      where: {
        restaurantId: restaurant.id
      }
    }),

    // Count videos
    db.restaurantVideo.count({
      where: {
        restaurantId: restaurant.id
      }
    }),

    // Count pending orders (orders containing this restaurant's dishes)
    db.orderItem.findMany({
      where: {
        product: {
          supplierId: restaurant.id
        },
        order: {
          status: { in: ['PENDING', 'ASSIGNED', 'IN_TRANSIT'] }
        }
      },
      select: { orderId: true },
      distinct: ['orderId']
    }).then(items => items.length),

    // Count all reviews
    db.restaurantReview.count({
      where: {
        restaurantId: restaurant.id
      }
    }),

    // Count today's orders (orders containing this restaurant's dishes created today)
    db.order.count({
      where: {
        createdAt: { gte: today },
        items: {
          some: {
            product: {
              supplierId: restaurant.id
            }
          }
        }
      }
    })
  ]);

  if (restaurant.status === 'SUSPENDED') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <Icon name="AlertTriangle" className="h-16 w-16 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">المطعم معلق</h1>
          <p className="text-muted-foreground">
            تم تعليق مطعمك مؤقتاً. يرجى التواصل مع الإدارة لمزيد من المعلومات.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Enhanced Header */}
      <RestaurantPortalHeader
        restaurant={restaurant}
        user={session.user}
      />

      <div className="flex">
        {/* Enhanced Sidebar */}
        <RestaurantPortalSidebar
          restaurant={restaurant}
          dishesCount={dishesCount}
          servicesCount={servicesCount}
          featuresCount={featuresCount}
          imagesCount={imagesCount}
          videosCount={videosCount}
          pendingOrdersCount={pendingOrdersCount}
          reviewsCount={reviewsCount}
          todayOrdersCount={todayOrdersCount}
          rating={restaurant.rating || 0}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}







