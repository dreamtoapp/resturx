'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';

interface RestaurantVideo {
  id: string;
  youtubeUrl: string;
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  order: number;
  createdAt: Date;
}

interface VideoFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (videoId: string, youtubeUrl: string, title: string, description?: string) => Promise<void> | void;
  video: RestaurantVideo | null;
  isPending: boolean;
}

export default function VideoFormModal({ open, onClose, onSubmit, video, isPending }: VideoFormModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (video) {
      setYoutubeUrl(video.youtubeUrl);
      setTitle(video.title);
      setDescription(video.description || '');
    } else {
      setYoutubeUrl('');
      setTitle('');
      setDescription('');
    }
  }, [video, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!youtubeUrl.trim() || !title.trim()) {
      return;
    }

    if (video) {
      onSubmit(video.id, youtubeUrl.trim(), title.trim(), description.trim() || undefined);
    } else {
      onSubmit('', youtubeUrl.trim(), title.trim(), description.trim() || undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{video ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</DialogTitle>
          <DialogDescription>
            أضف رابط YouTube مع عنوان ووصف للفيديو
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* YouTube URL */}
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">
              رابط YouTube <span className="text-destructive">*</span>
            </Label>
            <Input
              id="youtubeUrl"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
              disabled={isPending}
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">
              أمثلة: youtube.com/watch?v=VIDEO_ID أو youtu.be/VIDEO_ID
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              العنوان <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="مثال: جولة في مطعمنا"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/200 حرف
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Textarea
              id="description"
              placeholder="وصف مختصر للفيديو..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 حرف
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending || !youtubeUrl.trim() || !title.trim()}>
              {isPending ? (
                <>
                  <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Icon name="Save" className="h-4 w-4 ml-2" />
                  {video ? 'تحديث' : 'إضافة'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


