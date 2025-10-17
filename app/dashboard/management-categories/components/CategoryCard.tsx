'use client';

import {
  BarChart2,
  Eye,
  UtensilsCrossed,
  MapPin,
  Star,
} from 'lucide-react';
import Link from '@/components/link';
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import CategoryUpsert from './CategoryUpsert';
import DeleteCategoryAlert from './DeleteCategoryAlert';

interface RestaurantCardProps {
  category: any; // Restaurant with relations
}

export default function RestaurantCard({ category: restaurant }: RestaurantCardProps) {
  const { id, name, description, imageUrl, _count, country, countryId, rating, status, address, phone } = restaurant;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      {/* Image Upload - square media */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted/20">
        <AddImage
          url={imageUrl ?? ''}
          alt={`صورة ${name}`}
          recordId={id}
          table="category"
          tableField="imageUrl"
          onUploadComplete={() => toast.success('تم رفع شعار المطعم بنجاح')}
        />
      </div>

      {/* Content - stable height */}
      <div className="flex flex-1 flex-col gap-2 p-4 min-h-[180px]">
        <div className='flex items-center justify-between'>
          <h3 className="text-lg font-semibold truncate" title={name}>
            {name}
          </h3>
          <Badge variant={status === 'ACTIVE' ? 'default' : status === 'SUSPENDED' ? 'destructive' : 'secondary'}>
            {status === 'ACTIVE' ? 'نشط' : status === 'SUSPENDED' ? 'معلق' : 'غير نشط'}
          </Badge>
        </div>

        {country && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {country.name}
            </Badge>
          </div>
        )}

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
          {_count && (
            <div className="flex items-center gap-1">
              <UtensilsCrossed className="h-3 w-3" />
              <span>{_count.dishes} طبق</span>
            </div>
          )}
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {(address || phone) && (
          <div className="text-xs text-muted-foreground space-y-1">
            {address && (
              <div className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <footer className="flex items-center justify-around border-t bg-muted px-4 py-2">
        <Link href={`/dashboard/management-categories/view/${id}`} aria-label="عرض المطعم">
          <Eye className="h-5 w-5" />
        </Link>

        <CategoryUpsert
          mode="update"
          title="تعديل مطعم"
          description="يرجى تعديل بيانات المطعم"
          defaultValues={{
            id,
            name,
            description: description ?? undefined,
            countryId: countryId,
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          aria-label="تحليلات"
          onClick={() => alert("قريباً")}
        >
          <BarChart2 className="h-5 w-5" />
        </Button>

        <DeleteCategoryAlert categoryId={id} />
      </footer>
    </div>
  );
}

// Export with old name for compatibility
export { RestaurantCard as CategoryCard };
