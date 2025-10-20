'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import AddImage from '@/components/AddImage';
import DeleteDishButton from './DeleteDishButton';

interface DishCardProps {
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    published: boolean;
    outOfStock: boolean;
    stockQuantity?: number | null;
    dishCategory?: {
      name: string;
    } | null;
  };
}

export default function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-40 bg-muted flex-shrink-0">
        <AddImage
          url={dish.imageUrl || undefined}
          alt={dish.name}
          recordId={dish.id}
          table="dishes"
          tableField="imageUrl"
          autoUpload={true}
          folder="dishes"
          className="w-full h-full"
        />
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap z-10 pointer-events-none">
          {dish.dishCategory && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {dish.dishCategory.name}
            </Badge>
          )}
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

      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex-1 space-y-3">
          <div className="min-h-[4rem]">
            <h3 className="font-semibold line-clamp-1">{dish.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {dish.description || 'لا يوجد وصف'}
            </p>
          </div>

          <div className="flex items-center justify-between min-h-[2rem]">
            <span className="text-lg font-bold text-primary">{dish.price} ريال</span>
            <div className="h-6 flex items-center">
              {dish.stockQuantity !== null && (
                <Badge variant="outline">
                  المخزون: {dish.stockQuantity}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/restaurant-portal/menu/${dish.id}`}>
              <Icon name="Edit" className="h-4 w-4 mr-1" />
              تعديل
            </Link>
          </Button>
          <DeleteDishButton dishId={dish.id} dishName={dish.name} />
        </div>
      </CardContent>
    </Card>
  );
}

