'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import AddImage from '@/components/AddImage';

import DeletePopularDishAlert from './DeletePopularDishAlert';
import PopularDishUpsert from './PopularDishUpsert';

interface PopularDishCardProps {
  dish: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    countryId: string;
  };
}

export default function PopularDishCard({ dish }: PopularDishCardProps) {
  const { id, name, description, imageUrl, countryId } = dish;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:border-primary/20">
      {/* Dish Image - Editable with AddImage */}
      <div className="relative h-48 w-full bg-gradient-to-br from-muted/30 to-muted/10">
        <AddImage
          url={imageUrl || ''}
          alt={`${name} image`}
          recordId={id}
          table="populardishes"
          tableField="imageUrl"
          onUploadComplete={() => toast.success('تم تحديث صورة الطبق بنجاح')}
          className="object-cover"
          autoUpload={true}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-foreground line-clamp-1" title={name}>
          {name}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2" title={description}>
            {description}
          </p>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-1 pt-2 border-t">
          <PopularDishUpsert
            mode="update"
            iconOnly
            cuisineId={countryId}
            title="تعديل الطبق المشهور"
            description="يرجى تعديل بيانات الطبق"
            defaultValues={{
              id,
              name,
              description: description || '',
              countryId,
            }}
          />

          <DeletePopularDishAlert dishId={id} cuisineId={countryId} />
        </div>
      </div>
    </div>
  );
}

