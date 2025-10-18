export const revalidate = 60;
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { getRestaurantMenu } from './actions/getRestaurantMenu';
import RestaurantMenuHeader from './components/RestaurantMenuHeader';
import DishCard from './components/DishCard';

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantMenu(slug);

  if (!restaurant) {
    return {
      title: 'Restaurant Not Found',
    };
  }

  return {
    title: `قائمة ${restaurant.name}`,
    description: `تصفح قائمة طعام ${restaurant.name} واطلب أشهى الأطباق`,
  };
}

export default async function RestaurantMenuPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const restaurant = await getRestaurantMenu(slug);

  if (!restaurant || restaurant.status !== 'ACTIVE') {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      {/* Restaurant Header (Compact) */}
      <RestaurantMenuHeader restaurant={restaurant} />

      <h2 className="text-xl font-semibold mb-6">القائمة الكاملة</h2>

      {/* Dishes Grid */}
      {restaurant.dishes && restaurant.dishes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurant.dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Icon name="UtensilsCrossed" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد أطباق متاحة</h3>
          <p className="text-muted-foreground">
            القائمة قيد التحديث. تحقق مرة أخرى قريباً!
          </p>
        </Card>
      )}
    </div>
  );
}
