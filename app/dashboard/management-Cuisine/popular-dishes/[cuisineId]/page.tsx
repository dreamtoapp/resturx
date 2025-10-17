import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';

import {
  getPopularDishesByCuisine,
  getCuisineById,
} from '../actions/get-popular-dishes';
import PopularDishCard from '../components/PopularDishCard';
import PopularDishUpsert from '../components/PopularDishUpsert';

interface PopularDishesPageProps {
  params: Promise<{
    cuisineId: string;
  }>;
}

export default async function PopularDishesPage({
  params,
}: PopularDishesPageProps) {
  const { cuisineId } = await params;
  const [cuisine, popularDishes] = await Promise.all([
    getCuisineById(cuisineId),
    getPopularDishesByCuisine(cuisineId),
  ]);

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/dashboard/management-Cuisine"
              className="flex items-center gap-2"
            >
              <Icon name="ArrowRight" className="h-4 w-4" />
              <span>العودة إلى المطابخ</span>
            </Link>
          </Button>
        </div>

        {/* Title & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {cuisine.logo && (
                <img
                  src={cuisine.logo}
                  alt={cuisine.name}
                  className="h-12 w-12 rounded-lg object-contain bg-muted p-1"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  الأطباق المشهورة - {cuisine.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  إدارة الأطباق المشهورة المرتبطة بهذا المطبخ
                </p>
              </div>
            </div>
            <Badge variant="outline">{popularDishes.length}</Badge>
          </div>

          <PopularDishUpsert
            mode="new"
            cuisineId={cuisineId}
            title="إضافة طبق مشهور"
            description="يرجى إدخال بيانات الطبق المشهور"
            defaultValues={{
              name: '',
              description: '',
              countryId: cuisineId,
            }}
          />
        </div>
      </header>

      {/* Popular Dishes Grid */}
      {popularDishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Icon name="UtensilsCrossed" className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">لا توجد أطباق مشهورة</h3>
          <p className="text-muted-foreground mb-6">
            ابدأ بإضافة الأطباق المشهورة لهذا المطبخ
          </p>
          <PopularDishUpsert
            mode="new"
            cuisineId={cuisineId}
            title="إضافة طبق مشهور"
            description="يرجى إدخال بيانات الطبق المشهور"
            defaultValues={{
              name: '',
              description: '',
              countryId: cuisineId,
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {popularDishes.map((dish) => (
            <PopularDishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}

