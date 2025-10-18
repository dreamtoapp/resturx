import Image from 'next/image';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import AddToCart from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/AddToCart';

interface DishCardProps {
  dish: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    price: number;
    compareAtPrice?: number | null;
    rating?: number | null;
    outOfStock: boolean;
  };
}

export default function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/product/${dish.slug}`}>
        <div className="relative h-48 bg-muted">
          <Image
            src={dish.imageUrl || '/placeholder.svg'}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {dish.outOfStock && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              نفذ
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <div>
          <Link href={`/product/${dish.slug}`} className="hover:text-primary">
            <h3 className="font-semibold">{dish.name}</h3>
          </Link>
          {dish.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {dish.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{dish.price} ريال</span>
            {dish.compareAtPrice && dish.compareAtPrice > dish.price && (
              <span className="text-sm line-through text-muted-foreground mr-2">
                {dish.compareAtPrice} ريال
              </span>
            )}
          </div>
          {dish.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Icon name="Star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{dish.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {!dish.outOfStock && (
          <AddToCart
            product={{
              id: dish.id,
              name: dish.name,
              price: dish.price,
              imageUrl: dish.imageUrl || '',
            } as any}
          />
        )}
      </CardContent>
    </Card>
  );
}

