'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/components/icons/Icon';
import { respondToReview } from '../actions/respondToReview';
import { toast } from 'sonner';

interface ResponseFormProps {
  reviewId: string;
  onCancel: () => void;
}

export default function ResponseForm({ reviewId, onCancel }: ResponseFormProps) {
  const router = useRouter();
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!response.trim()) {
      toast.error('الرجاء كتابة رد');
      return;
    }

    setIsSubmitting(true);

    const result = await respondToReview(reviewId, response);

    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setResponse('');
      router.refresh();
      onCancel();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-muted/30 rounded-lg border">
      <div className="space-y-2">
        <label className="text-sm font-medium">ردك على التقييم</label>
        <Textarea
          placeholder="اكتب ردك هنا..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={4}
          maxLength={500}
          required
        />
        <p className="text-xs text-muted-foreground text-left">
          {response.length}/500
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !response.trim()}
        >
          {isSubmitting ? (
            <>
              <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Icon name="Send" className="h-4 w-4 ml-2" />
              إرسال الرد
            </>
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}

