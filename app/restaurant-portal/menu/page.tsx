import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import db from '@/lib/prisma';

async function getRestaurantDishes(userId: string) {
  const restaurant = await db.restaurant.findFirst({
    where: { userId },
    include: {
      dishes: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return restaurant;
}

export default async function RestaurantMenuPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const restaurant = await getRestaurantDishes(session.user.id!);

  if (!restaurant) {
    return <div>لا يوجد مطعم</div>;
  }

  const { dishes } = restaurant;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة القائمة</h1>
          <p className="text-muted-foreground">أضف وعدل أطباقك</p>
        </div>
        <Button asChild>
          <Link href="/restaurant-portal/menu/add">
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            إضافة طبق جديد
          </Link>
        </Button>
      </div>

      {/* Dishes Grid */}
      {dishes && dishes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden">
              <div className="relative h-40 bg-muted">
                <Image
                  src={dish.imageUrl || '/placeholder.svg'}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {dish.published ? (
                    <Badge className="bg-green-500">منشور</Badge>
                  ) : (
                    <Badge variant="secondary">مخفي</Badge>
                  )}
                  {dish.outOfStock && (
                    <Badge variant="destructive">نفذ</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold">{dish.name}</h3>
                  {dish.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {dish.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{dish.price} ريال</span>
                  {dish.stockQuantity !== null && (
                    <Badge variant="outline">
                      المخزون: {dish.stockQuantity}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/restaurant-portal/menu/${dish.id}`}>
                      <Icon name="Edit" className="h-4 w-4 mr-1" />
                      تعديل
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Trash" className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Icon name="UtensilsCrossed" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد أطباق في القائمة</h3>
          <p className="text-muted-foreground mb-4">
            ابدأ بإضافة أطباقك المميزة للقائمة
          </p>
          <Button asChild>
            <Link href="/restaurant-portal/menu/add">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              إضافة أول طبق
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}







