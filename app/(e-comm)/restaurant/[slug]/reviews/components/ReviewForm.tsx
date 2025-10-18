'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/components/icons/Icon';
import { submitReview } from '../actions/submitReview';
import { toast } from 'sonner';

interface ReviewFormProps {
  restaurantSlug: string;
}

export default function ReviewForm({ restaurantSlug }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('الرجاء اختيار التقييم');
      return;
    }

    if (!comment.trim()) {
      toast.error('الرجاء كتابة تعليق');
      return;
    }

    setIsSubmitting(true);

    const result = await submitReview({
      restaurantSlug,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim()
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="MessageSquare" className="h-5 w-5" />
          اكتب تقييمك
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">التقييم *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Icon
                    name="Star"
                    className={`h-8 w-8 ${star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                      }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground mr-2">
                  ({rating} نجوم)
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">عنوان التقييم (اختياري)</label>
            <Input
              placeholder="مثال: تجربة رائعة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">تعليقك *</label>
            <Textarea
              placeholder="اكتب تجربتك مع هذا المطعم..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground text-left">
              {comment.length}/1000
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Icon name="Send" className="h-4 w-4 ml-2" />
                إرسال التقييم
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            سيتم مراجعة تقييمك قبل نشره
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

