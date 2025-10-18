'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';
import { upsertBlog } from '../actions/upsertBlog';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';

interface BlogEditorProps {
  existingPost?: {
    title: string;
    content: string;
    excerpt?: string | null;
    imageUrl?: string | null;
    isPublished: boolean;
  } | null;
}

export default function BlogEditor({ existingPost }: BlogEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [isPublished, setIsPublished] = useState(existingPost?.isPublished || false);
  const [savingAction, setSavingAction] = useState<'draft' | 'publish' | null>(null);

  const handleSubmit = async (e: React.FormEvent, publishStatus?: boolean) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('الرجاء إدخال عنوان المدونة');
      return;
    }

    if (!content.trim()) {
      toast.error('الرجاء إدخال محتوى المدونة');
      return;
    }

    const finalPublishStatus = publishStatus !== undefined ? publishStatus : isPublished;
    setSavingAction(finalPublishStatus ? 'publish' : 'draft');

    const result = await upsertBlog({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      imageUrl: existingPost?.imageUrl || undefined, // Keep existing image
      isPublished: finalPublishStatus
    });

    setSavingAction(null);

    if (result.success) {
      toast.success(result.message);
      setIsPublished(finalPublishStatus); // Update state after successful save
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingPost ? 'تعديل المدونة' : 'إنشاء مدونة جديدة'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* SEO Benefits Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Rocket" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                🎯 نصائح لتحسين ظهور مدونتك في محركات البحث (SEO)
              </h3>
              <div className="grid md:grid-cols-3 gap-3 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle2" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>العنوان:</strong> 50-60 حرف (يظهر كاملاً في جوجل)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle2" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>الملخص:</strong> 150-160 حرف (وصف مختصر ومشوق)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle2" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>المحتوى:</strong> اكتب محتوى غني ومفيد لعملائك</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Label htmlFor="title">عنوان المدونة *</Label>
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                <Icon name="TrendingUp" className="h-3 w-3" />
                <span>يظهر في نتائج البحث</span>
              </div>
            </div>
            <Input
              id="title"
              placeholder="مثال: قصة نجاح مطعمنا"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              required
            />
            <div className="flex items-center justify-between text-xs">
              <p className="text-muted-foreground flex items-center gap-1">
                <Icon name="Lightbulb" className="h-3 w-3 text-yellow-500" />
                هذا العنوان سيظهر في جوجل (الحد الأقصى 60 حرف)
              </p>
              <span className={`${title.length > 60 ? 'text-destructive font-semibold' : title.length > 50 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                {title.length}/60
              </span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Label htmlFor="excerpt">ملخص قصير (اختياري)</Label>
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                <Icon name="Share2" className="h-3 w-3" />
                <span>للمشاركة الاجتماعية</span>
              </div>
            </div>
            <Textarea
              id="excerpt"
              placeholder="مثال: اكتشف رحلتنا من مطعم صغير إلى وجهة طعام محبوبة في قلب المدينة..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={160}
            />
            <div className="flex items-center justify-between text-xs">
              <p className="text-muted-foreground flex items-center gap-1">
                <Icon name="Search" className="h-3 w-3 text-blue-500" />
                يظهر في نتائج جوجل (الحد الأقصى 160 حرف)
              </p>
              <span className={`${excerpt.length > 160 ? 'text-destructive font-semibold' : excerpt.length > 150 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                {excerpt.length}/160
              </span>
            </div>
          </div>

          {/* Content - Using reusable RichTextEditor */}
          <div className="space-y-2">
            <Label htmlFor="content">المحتوى *</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="اكتب محتوى المدونة هنا... استخدم شريط الأدوات للتنسيق"
              minHeight="500px"
            />
            <p className="text-xs text-muted-foreground">
              استخدم شريط الأدوات أعلاه لتنسيق النص (عريض، مائل، قوائم، روابط، عناوين)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={savingAction !== null}
                onClick={(e) => handleSubmit(e, false)}
              >
                {savingAction === 'draft' ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Icon name="FileText" className="h-4 w-4 ml-2" />
                    حفظ كمسودة
                  </>
                )}
              </Button>

              <Button
                type="button"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={savingAction !== null}
                onClick={(e) => handleSubmit(e, true)}
              >
                {savingAction === 'publish' ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                    جاري النشر...
                  </>
                ) : (
                  <>
                    <Icon name="Globe" className="h-4 w-4 ml-2" />
                    نشر المدونة
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground bg-muted/50 p-2 rounded">
              💡 <strong>مسودة:</strong> غير مرئية للعملاء | <strong>منشورة:</strong> مرئية للجميع
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {existingPost
              ? 'التعديلات ستحل محل المدونة الحالية'
              : 'يمكنك إنشاء مدونة واحدة فقط لمطعمك'}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

