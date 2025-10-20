'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';
import Image from 'next/image';
import DishActionButtons from './DishActionButtons';

interface FavoriteDish {
  id: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    rating: number | null;
    dishCategoryId: string | null;
    dishCategory: {
      id: string;
      name: string;
    } | null;
  };
}

interface RestaurantFavoriteDishesTabProps {
  favorites: FavoriteDish[];
  isLoggedIn: boolean;
}

export default function RestaurantFavoriteDishesTab({
  favorites,
  isLoggedIn,
}: RestaurantFavoriteDishesTabProps) {
  if (!isLoggedIn) {
    return (
      <Card className="p-12 text-center">
        <Icon name="Lock" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">يرجى تسجيل الدخول</h3>
        <p className="text-sm text-muted-foreground mb-4">
          قم بتسجيل الدخول لعرض أطباقك المفضلة
        </p>
        <Link href="/auth/signin">
          <Button>تسجيل الدخول</Button>
        </Link>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="Heart" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">لا توجد أطباق مفضلة</h3>
        <p className="text-sm text-muted-foreground mb-4">
          لم تقم بإضافة أي أطباق من هذا المطعم إلى المفضلة بعد
        </p>
        <Button
          onClick={() => {
            const menuTab = document.querySelector('[value="menu"]') as HTMLElement;
            menuTab?.click();
          }}
          variant="outline"
        >
          تصفح القائمة
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        أطباقي المفضلة ({favorites.length})
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => {
          const dish = favorite.product;
          return (
            <Card key={favorite.id} className="overflow-hidden flex flex-col h-full">
              {/* Dish Image */}
              <div className="relative h-48 w-full bg-muted">
                {dish.imageUrl ? (
                  <Image
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Icon name="ImageOff" className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {dish.dishCategory && (
                  <Badge className="absolute top-2 right-2 bg-primary/90 text-white">
                    {dish.dishCategory.name}
                  </Badge>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                {/* Dish Name */}
                <h4 className="font-semibold text-lg mb-2 line-clamp-1">{dish.name}</h4>

                {/* Description */}
                {dish.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                    {dish.description}
                  </p>
                )}

                {/* Rating */}
                {dish.rating && dish.rating > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        className={`h-4 w-4 ${i < dish.rating!
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground mr-1">
                      ({dish.rating.toFixed(1)})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">
                      {dish.price}
                    </span>
                    <span className="text-sm text-muted-foreground">ر.س</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t">
                  <DishActionButtons
                    dishId={dish.id}
                    dishName={dish.name}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

