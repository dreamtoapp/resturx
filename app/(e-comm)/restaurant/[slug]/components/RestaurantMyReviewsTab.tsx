'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';
import Image from 'next/image';
import DishActionButtons from './DishActionButtons';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    dishCategoryId: string | null;
    dishCategory: {
      id: string;
      name: string;
    } | null;
  };
}

interface RestaurantMyReviewsTabProps {
  reviews: Review[];
  isLoggedIn: boolean;
}

export default function RestaurantMyReviewsTab({
  reviews,
  isLoggedIn,
}: RestaurantMyReviewsTabProps) {
  if (!isLoggedIn) {
    return (
      <Card className="p-12 text-center">
        <Icon name="Lock" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">يرجى تسجيل الدخول</h3>
        <p className="text-sm text-muted-foreground mb-4">
          قم بتسجيل الدخول لعرض تقييماتك
        </p>
        <Link href="/auth/signin">
          <Button>تسجيل الدخول</Button>
        </Link>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="Star" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">لا توجد تقييمات</h3>
        <p className="text-sm text-muted-foreground mb-4">
          لم تقم بتقييم أي أطباق من هذا المطعم بعد
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
        تقييماتي ({reviews.length})
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => {
          const dish = review.product;
          return (
            <Card key={review.id} className="overflow-hidden flex flex-col h-full">
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

                {/* My Rating */}
                <div className="flex items-center gap-2 mb-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">تقييمي:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({review.rating} {review.rating === 1 ? 'نجمة' : review.rating === 2 ? 'نجمتان' : 'نجوم'})
                  </span>
                </div>

                {/* My Comment */}
                {review.comment && (
                  <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1 font-medium">تعليقي:</p>
                    <p className="text-sm line-clamp-3">{review.comment}</p>
                  </div>
                )}

                {/* Review Date */}
                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(review.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mt-auto mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">
                      {dish.price}
                    </span>
                    <span className="text-sm text-muted-foreground">ر.س</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-4 border-t">
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

