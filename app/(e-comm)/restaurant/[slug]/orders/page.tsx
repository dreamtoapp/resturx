import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { PageProps } from '@/types/commonTypes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';

const STATUS_MAP = {
  NEW: { label: 'جديد', color: 'bg-blue-500' },
  PREPARING: { label: 'قيد التحضير', color: 'bg-yellow-500' },
  READY: { label: 'جاهز', color: 'bg-green-500' },
  COMPLETED: { label: 'مكتمل', color: 'bg-gray-500' },
  CANCELLED: { label: 'ملغى', color: 'bg-red-500' }
};

export default async function RestaurantOrdersPage({ params }: PageProps<{ slug: string }>) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/restaurant/' + (await params).slug + '/orders');
  }

  const { slug } = await params;

  // Get restaurant
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: { id: true, name: true, imageUrl: true }
  });

  if (!restaurant) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-destructive mb-4">المطعم غير موجود</p>
        <Link href="/">
          <Button>العودة للصفحة الرئيسية</Button>
        </Link>
      </div>
    );
  }

  // Get user's orders for THIS restaurant only
  const orders = await prisma.dineInOrder.findMany({
    where: {
      restaurantId: restaurant.id,
      customerId: session.user.id
    },
    include: {
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/restaurant/${slug}`}>
          <Button variant="ghost" size="icon">
            <Icon name="ArrowRight" className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">طلباتي من {restaurant.name}</h1>
          <p className="text-sm text-muted-foreground">
            {orders.length} {orders.length === 1 ? 'طلب' : 'طلبات'}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="ClipboardList" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">لا توجد طلبات سابقة</h3>
          <p className="text-sm text-muted-foreground mb-4">
            لم تقم بأي طلبات من هذا المطعم بعد
          </p>
          <Link href={`/restaurant/${slug}`}>
            <Button>تصفح القائمة</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status as keyof typeof STATUS_MAP];
            return (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Badge className={`${statusInfo.color} text-white`}>
                    {statusInfo.label}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Hash" className="h-4 w-4 text-muted-foreground" />
                    <span>طاولة {order.tableNumber}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'عنصر' : 'عناصر'}
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">الإجمالي</p>
                    <p className="text-lg font-bold text-primary">{order.total.toFixed(2)} ريال</p>
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      التفاصيل
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

