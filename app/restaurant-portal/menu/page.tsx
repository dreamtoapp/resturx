import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import db from '@/lib/prisma';
import { getMasterDishCategories } from '@/app/dashboard/management-dish-categories/actions/getMasterDishCategories';
import CategoryFilter from './components/CategoryFilter';
import DishCard from './components/DishCard';

async function getRestaurantDishes(userId: string) {
  const restaurant = await db.restaurant.findFirst({
    where: { userId },
    include: {
      dishes: {
        include: {
          dishCategory: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return restaurant;
}

interface RestaurantMenuPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function RestaurantMenuPage({ searchParams }: RestaurantMenuPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const [restaurant, categories, params] = await Promise.all([
    getRestaurantDishes(session.user.id!),
    getMasterDishCategories(),
    searchParams
  ]);

  if (!restaurant) {
    return <div>لا يوجد مطعم</div>;
  }

  const { dishes } = restaurant;
  const activeCategories = categories.filter(c => c.isActive);

  // Filter dishes by category if selected
  const filteredDishes = params.category
    ? dishes.filter(d => d.dishCategoryId === params.category)
    : dishes;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة القائمة</h1>
          <p className="text-muted-foreground">أضف وعدل أطباقك</p>
        </div>
        <div className="flex gap-2">
          <CategoryFilter categories={activeCategories} />
          <Button asChild>
            <Link href="/restaurant-portal/menu/add">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              إضافة طبق جديد
            </Link>
          </Button>
        </div>
      </div>

      {/* Dishes Grid */}
      {filteredDishes && filteredDishes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
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










