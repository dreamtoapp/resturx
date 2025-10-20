import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import db from '@/lib/prisma';
import Link from '@/components/link';

async function getRestaurantStats(userId: string) {
  const restaurant = await db.restaurant.findFirst({
    where: { userId },
    include: {
      dishes: {
        where: { published: true },
        select: { id: true }
      },
      _count: {
        select: {
          dishes: true,
        }
      }
    }
  });

  if (!restaurant) return null;

  // Get today's orders (orders that include dishes from this restaurant)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await db.order.findMany({
    where: {
      createdAt: { gte: today },
      items: {
        some: {
          productId: { in: restaurant.dishes.map(d => d.id) }
        }
      }
    },
    select: {
      id: true,
      amount: true,
    }
  });

  // Get recent orders
  const recentOrders = await db.order.findMany({
    where: {
      items: {
        some: {
          productId: { in: restaurant.dishes.map(d => d.id) }
        }
      }
    },
    include: {
      customer: {
        select: {
          name: true,
        }
      },
      items: {
        select: {
          quantity: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Get review statistics
  const allReviews = await db.restaurantReview.findMany({
    where: { restaurantId: restaurant.id },
    select: {
      ownerResponse: true,
    }
  });

  const totalReviewsCount = allReviews.length;
  const unrepliedReviewsCount = allReviews.filter(r => !r.ownerResponse).length;

  return {
    restaurant,
    todayOrdersCount: todayOrders.length,
    totalDishes: restaurant._count.dishes,
    rating: restaurant.rating || 0,
    totalReviewsCount,
    unrepliedReviewsCount,
    recentOrders,
  };
}

export default async function RestaurantDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const stats = await getRestaurantStats(session.user.id!);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const { restaurant, todayOrdersCount, totalDishes, rating, totalReviewsCount, unrepliedReviewsCount, recentOrders } = stats;

  // Dummy visitor count (to be replaced with real tracking later)
  const visitorsCount = 0;

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          مرحباً، {session.user.name || 'صاحب المطعم'}! 👋
        </h1>
        <p className="text-muted-foreground text-base lg:text-lg">
          إليك نظرة سريعة على أداء مطعمك اليوم
        </p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 lg:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Today's Orders */}
        <Card className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">طلبات اليوم</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Icon name="Package" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todayOrdersCount}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Icon name="TrendingUp" className="h-3 w-3 text-green-500" />
              <span>نشط الآن</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Dishes */}
        <Card className="overflow-hidden border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي الأطباق</CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
              <Icon name="UtensilsCrossed" className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{totalDishes}</div>
            <p className="text-xs text-muted-foreground mt-2">في القائمة</p>
          </CardContent>
        </Card>

        {/* Rating & Reviews */}
        <Link href="/restaurant-portal/reviews" className="block">
          <Card className="overflow-hidden border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">التقييمات</CardTitle>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
                <Icon name="Star" className="h-5 w-5 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{rating.toFixed(1)}</span>
                  <span className="text-xl">⭐</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Icon name="MessageSquare" className="h-3 w-3" />
                    {totalReviewsCount} تقييم
                  </span>
                  {unrepliedReviewsCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-2 py-0">
                      {unrepliedReviewsCount} بانتظار الرد
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Site Visitors */}
        <Link href="/restaurant-portal/analytics" className="block">
          <Card className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">زوار الموقع</CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Icon name="Users" className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {visitorsCount}
              </div>
              <p className="text-xs text-muted-foreground mt-2">زائر اليوم</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Clock" className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">الطلبات الأخيرة</CardTitle>
            </div>
            <Link href="/restaurant-portal/orders">
              <button className="text-sm text-primary hover:underline flex items-center gap-1 font-semibold hover:gap-2 transition-all">
                عرض الكل
                <Icon name="ArrowLeft" className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length > 0 ? (
            <div className="divide-y">
              {recentOrders.slice(0, 5).map((order) => {
                const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon name="Package" className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-mono">#{order.orderNumber}</Badge>
                          <span className="font-semibold truncate">{order.customer?.name || 'عميل'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="UtensilsCrossed" className="h-3 w-3" />
                          {itemsCount} عنصر
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-left">
                        <p className="font-bold text-lg">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">ريال</p>
                      </div>
                      <Badge variant={
                        order.status === 'DELIVERED' ? 'default' :
                          order.status === 'PENDING' ? 'secondary' :
                            order.status === 'IN_TRANSIT' ? 'outline' : 'destructive'
                      } className="text-xs whitespace-nowrap">
                        {order.status === 'DELIVERED' ? '✓ تم التوصيل' :
                          order.status === 'PENDING' ? '⏱ قيد الانتظار' :
                            order.status === 'IN_TRANSIT' ? '🚚 قيد التوصيل' :
                              order.status === 'ASSIGNED' ? '📋 تم التعيين' : '✕ ملغي'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Package" className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">لا توجد طلبات حالياً</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/restaurant-portal/menu" className="group">
          <Card className="border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Plus" className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">إضافة طبق جديد</h3>
                <p className="text-xs text-muted-foreground">أضف منتج جديد لقائمتك</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/restaurant-portal/profile" className="group">
          <Card className="border-2 border-dashed hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Edit" className="h-7 w-7 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">تعديل البيانات</h3>
                <p className="text-xs text-muted-foreground">حدّث معلومات مطعمك</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/restaurant/${restaurant.slug}`} target="_blank" className="group">
          <Card className="border-2 border-dashed hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Eye" className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">عرض الصفحة العامة</h3>
                <p className="text-xs text-muted-foreground">شاهد كيف يراك العملاء</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}






