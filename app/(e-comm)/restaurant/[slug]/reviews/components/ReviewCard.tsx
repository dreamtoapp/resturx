import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string | null;
    comment: string;
    images?: string[];
    createdAt: Date;
    ownerResponse?: string | null;
    respondedAt?: Date | null;
    customer: {
      name?: string | null;
      image?: string | null;
    };
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Customer Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
              {review.customer.image ? (
                <Image
                  src={review.customer.image}
                  alt={review.customer.name || 'عميل'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="User" className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{review.customer.name || 'عميل'}</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: ar })}
              </p>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="Star"
                className={`h-5 w-5 ${star <= review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Review Title */}
        {review.title && (
          <h4 className="font-semibold text-lg">{review.title}</h4>
        )}

        {/* Review Comment */}
        <p className="text-muted-foreground">{review.comment}</p>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {review.images.map((image, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`صورة تقييم ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Owner Response */}
        {review.ownerResponse && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border-r-4 border-primary">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Store" className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">رد صاحب المطعم</span>
              {review.respondedAt && (
                <span className="text-xs text-muted-foreground">
                  • {format(new Date(review.respondedAt), 'dd MMM yyyy', { locale: ar })}
                </span>
              )}
            </div>
            <p className="text-sm">{review.ownerResponse}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

