'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import AddImage from '@/components/AddImage';

import DeleteCuisineAlert from './DeleteCuisineAlert';
import CuisineUpsert from './CuisineUpsert';

interface CuisineCardProps {
  cuisine: any; // Cuisine/Country type with restaurantCount
}

export default function CuisineCard({ cuisine }: CuisineCardProps) {
  const { id, name, logo, restaurantCount, popularDishesCount } = cuisine;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:border-primary/20">

      {/* Flag Image - Editable with AddImage */}
      <div className="relative h-32 w-full bg-gradient-to-br from-muted/30 to-muted/10">
        <AddImage
          url={logo || ''}
          alt={`${name} flag`}
          recordId={id}
          table="suppliers"
          tableField="logo"
          onUploadComplete={() => toast.success('تم تحديث علم المطبخ بنجاح')}
          className="object-contain"
          autoUpload={true}
        />
      </div>

      {/* Content - Minimal & Business Focused */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-foreground line-clamp-1" title={name}>
          {name}
        </h3>

        {/* Key Metrics */}
        <div className="flex items-center justify-between text-sm gap-2">
          <div className="flex items-center gap-3">
            {/* Restaurants Count */}
            <div className="flex items-center gap-1.5">
              <Icon name="Store" className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground font-medium">{restaurantCount || 0}</span>
            </div>

            {/* Popular Dishes Count */}
            <div className="flex items-center gap-1.5">
              <Icon name="UtensilsCrossed" className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground font-medium">{popularDishesCount || 0}</span>
            </div>
          </div>

          {/* Article Status */}
          {cuisine.article ? (
            <Badge className="text-xs gap-1 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20">
              <Icon name="CheckCircle" className="h-3 w-3" />
              مقالة
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs text-muted-foreground">
              بدون مقالة
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          {/* View/Navigate Actions Group */}
          <div className="flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="عرض المطاعم"
            >
              <Link href={`/dashboard/management-Cuisine/view/${id}`}>
                <Icon name="Store" className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="إدارة الأكلات المشهورة"
            >
              <Link href={`/dashboard/management-Cuisine/popular-dishes/${id}`}>
                <Icon name="UtensilsCrossed" className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="تحرير المقالة"
            >
              <Link href={`/dashboard/management-Cuisine/edit-article/${id}`}>
                <Icon name="BookOpen" className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Edit/Delete Actions Group */}
          <div className="flex items-center gap-1">
            <CuisineUpsert
              mode='update'
              iconOnly
              title="تعديل نوع المطبخ"
              description="يرجى تعديل بيانات نوع المطبخ"
              defaultValues={{
                id,
                type: '',
                name,
                email: '',
                phone: '',
                address: '',
                description: cuisine.description || '',
              }}
            />

            <DeleteCuisineAlert cuisineId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

