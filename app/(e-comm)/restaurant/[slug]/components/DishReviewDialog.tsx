'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitDishReview } from '../actions/dishReviewActions';

interface DishReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dishId: string;
  dishName: string;
  existingRating?: number;
  existingComment?: string;
}

export default function DishReviewDialog({
  open,
  onOpenChange,
  dishId,
  dishName,
  existingRating,
  existingComment,
}: DishReviewDialogProps) {
  const [rating, setRating] = useState(existingRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingComment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when existing values change
  useEffect(() => {
    setRating(existingRating || 0);
    setComment(existingComment || '');
  }, [existingRating, existingComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('الرجاء اختيار التقييم');
      return;
    }

    if (!comment.trim() || comment.trim().length < 3) {
      toast.error('الرجاء كتابة تعليق (3 أحرف على الأقل)');
      return;
    }

    setIsSubmitting(true);

    const result = await submitDishReview(dishId, rating, comment.trim());

    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingRating ? 'تعديل تقييم الطبق' : 'تقييم الطبق'}
          </DialogTitle>
          <DialogDescription>{dishName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium">التقييم</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating} {rating === 1 ? 'نجمة' : rating === 2 ? 'نجمتان' : 'نجوم'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              التعليق
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شاركنا رأيك في الطبق..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {comment.trim().length} / 3 أحرف كحد أدنى
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإرسال...' : existingRating ? 'تحديث' : 'إرسال'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

