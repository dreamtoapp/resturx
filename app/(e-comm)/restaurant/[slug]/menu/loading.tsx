import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantMenuLoading() {
  return (
    <div className="container mx-auto py-8">
      {/* Restaurant Header Skeleton (Compact) */}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b">
        {/* Logo */}
        <Skeleton className="w-16 h-16 rounded-lg" />

        {/* Restaurant Info */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      {/* Title */}
      <Skeleton className="h-7 w-40 mb-6" />

      {/* Dishes Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="overflow-hidden">
            {/* Image Skeleton */}
            <Skeleton className="h-48 w-full" />

            <CardContent className="p-4 space-y-3">
              {/* Name */}
              <Skeleton className="h-5 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>

              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Add to Cart Button */}
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

