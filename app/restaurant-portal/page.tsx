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

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.amount, 0);

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

  return {
    restaurant,
    todayOrdersCount: todayOrders.length,
    todayRevenue,
    totalDishes: restaurant._count.dishes,
    rating: restaurant.rating || 0,
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

  const { restaurant, todayOrdersCount, todayRevenue, totalDishes, rating, recentOrders } = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">مرحباً، {session.user.name || 'صاحب المطعم'}! 👋</h1>
        <p className="text-muted-foreground">إليك نظرة سريعة على مطعمك اليوم</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات اليوم</CardTitle>
            <Icon name="Package" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayOrdersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأطباق</CardTitle>
            <Icon name="UtensilsCrossed" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDishes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التقييم</CardTitle>
            <Icon name="Star" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {rating.toFixed(1)} ⭐
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إيرادات اليوم</CardTitle>
            <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRevenue.toFixed(2)} ريال</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الطلبات الأخيرة</CardTitle>
            <Link href="/restaurant-portal/orders">
              <button className="text-sm text-primary hover:underline">
                عرض الكل →
              </button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => {
                const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{order.orderNumber}</Badge>
                      <span className="font-medium">{order.customer?.name || 'عميل'}</span>
                      <span className="text-sm text-muted-foreground">{itemsCount} عنصر</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{order.amount} ريال</span>
                      <Badge variant={
                        order.status === 'DELIVERED' ? 'default' :
                          order.status === 'PENDING' ? 'secondary' :
                            order.status === 'IN_TRANSIT' ? 'outline' : 'destructive'
                      }>
                        {order.status === 'DELIVERED' ? 'تم التوصيل' :
                          order.status === 'PENDING' ? 'قيد الانتظار' :
                            order.status === 'IN_TRANSIT' ? 'قيد التوصيل' :
                              order.status === 'ASSIGNED' ? 'تم التعيين' : 'ملغي'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">لا توجد طلبات حالياً</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Link href="/restaurant-portal/menu">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Icon name="Plus" className="h-4 w-4" />
              إضافة طبق جديد
            </button>
          </Link>
          <Link href="/restaurant-portal/profile">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
              <Icon name="Edit" className="h-4 w-4" />
              تعديل البيانات
            </button>
          </Link>
          <Link href={`/restaurant/${restaurant.slug}`} target="_blank">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
              <Icon name="Eye" className="h-4 w-4" />
              عرض الصفحة العامة
            </button>
          </Link>
        </CardContent>
      </Card>

      {/* Restaurant Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">حالة المطعم:</span>
            <Badge variant={restaurant.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-sm">
              {restaurant.status === 'ACTIVE' ? '🟢 نشط' : restaurant.status === 'INACTIVE' ? '⚫ غير نشط' : '🟡 معلق'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






