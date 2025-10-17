'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface CustomerReviewsProps {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date | string;
    product: {
      id: string;
      name: string;
      image: string | null;
    };
  }>;
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size="xs"
        className={`w-3 h-3 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'ممتاز',
      2: 'جيد جداً',
      3: 'جيد',
      4: 'مقبول',
      5: 'ضعيف'
    };
    return labels[rating as keyof typeof labels] || 'غير محدد';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (reviews.length === 0) {
    return (
      <div className='text-center py-8'>
        <Icon name="Star" size="lg" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className='text-lg font-medium text-foreground mb-2'>لا توجد تقييمات</h3>
        <p className='text-sm text-muted-foreground'>لم يقم هذا العميل بتقييم أي منتجات بعد</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {reviews.map((review) => (
        <Card key={review.id} className='overflow-hidden'>
          <CardContent className='p-4'>
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* Product Info */}
              <div className='flex items-center gap-3 lg:w-48'>
                {review.product.image ? (
                  <Image
                    src={review.product.image}
                    alt={review.product.name}
                    width={60}
                    height={60}
                    className='rounded-md object-cover'
                  />
                ) : (
                  <div className='w-15 h-15 bg-muted rounded-md flex items-center justify-center'>
                    <Icon name="Package" size="sm" className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}

                <div className='min-w-0'>
                  <h3 className='font-medium text-foreground text-sm truncate'>
                    {review.product.name}
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='flex items-center gap-1'>
                    {renderStars(review.rating)}
                  </div>
                  <Badge className={`text-xs ${getRatingColor(review.rating)}`}>
                    {getRatingLabel(review.rating)}
                  </Badge>
                </div>

                {review.comment && (
                  <p className='text-sm text-foreground leading-relaxed'>
                    {review.comment}
                  </p>
                )}
              </div>

              {/* Review Actions */}
              <div className='flex flex-col gap-2 lg:w-32'>
                <Button
                  variant="outline"
                  size="sm"
                  className='flex items-center gap-1'
                  onClick={() => window.open(`/products/${review.product.id}`, '_blank')}
                >
                  <Icon name="Eye" size="xs" className="w-3 h-3" />
                  <span>عرض المنتج</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className='flex items-center gap-1'
                  onClick={() => {
                    // Handle review response or management
                    console.log('Manage review:', review.id);
                  }}
                >
                  <Icon name="MessageSquare" size="xs" className="w-3 h-3" />
                  <span>رد</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
