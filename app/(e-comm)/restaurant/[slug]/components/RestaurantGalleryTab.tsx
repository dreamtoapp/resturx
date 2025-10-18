import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface RestaurantGalleryTabProps {
  images: Array<{
    id: string;
    imageUrl: string;
    caption?: string | null;
  }>;
  restaurantName: string;
}

export default function RestaurantGalleryTab({ images, restaurantName }: RestaurantGalleryTabProps) {
  if (!images || images.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">لا توجد صور متاحة</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, idx) => (
        <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={image.imageUrl}
            alt={image.caption || `${restaurantName} image ${idx + 1}`}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
              <p className="text-xs text-center">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

