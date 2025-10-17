'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { updateCuisineArticle } from '../../../actions/update-cuisine-article';
import RichTextEditor from '@/components/RichTextEditor';

interface CuisineArticleEditorProps {
  cuisine: {
    id: string;
    name: string;
    slug: string;
    article: string | null;
    articleTitle: string | null;
    metaDescription: string | null;
    publishedAt: Date | null;
  };
}

export default function CuisineArticleEditor({ cuisine }: CuisineArticleEditorProps) {
  const router = useRouter();
  const [articleTitle, setArticleTitle] = useState(cuisine.articleTitle || '');
  const [metaDescription, setMetaDescription] = useState(cuisine.metaDescription || '');
  const [article, setArticle] = useState(cuisine.article || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Extract plain text from HTML to count words accurately
  const getPlainText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const plainText = article ? getPlainText(article) : '';
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;
  const metaDescLength = metaDescription.length;

  // Check if ready to publish
  const canPublish =
    article.trim().length > 0 &&
    articleTitle.trim().length > 0 &&
    wordCount >= 100 &&
    metaDescLength >= 100;

  const getPublishBlocker = () => {
    if (!article.trim()) return 'المقالة فارغة';
    if (!articleTitle.trim()) return 'عنوان المقالة مطلوب';
    if (wordCount < 100) return `يلزم ${100 - wordCount} كلمة إضافية (الحد الأدنى: 100)`;
    if (metaDescLength < 100) return `يلزم ${100 - metaDescLength} حرف إضافي للوصف`;
    return null;
  };

  // Get SEO quality level
  const getSEOQuality = () => {
    if (wordCount >= 1500) return { level: 'ممتاز', color: 'bg-green-600', icon: 'Award' };
    if (wordCount >= 1000) return { level: 'جيد جداً', color: 'bg-green-500', icon: 'CheckCircle2' };
    if (wordCount >= 500) return { level: 'جيد', color: 'bg-blue-500', icon: 'Check' };
    if (wordCount >= 300) return { level: 'مقبول', color: 'bg-yellow-500', icon: 'Info' };
    return { level: 'ضعيف', color: 'bg-orange-500', icon: 'AlertTriangle' };
  };

  const handleSave = async (publish: boolean) => {
    if (publish && !canPublish) {
      toast.error(getPublishBlocker() || 'المقالة غير جاهزة للنشر');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateCuisineArticle({
        cuisineId: cuisine.id,
        article,
        articleTitle,
        metaDescription,
        publish,
      });

      if (result.success) {
        toast.success(result.message);
        if (result.published) {
          toast.success('المقالة منشورة الآن!');
        }
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Icon name="BookOpen" className="h-8 w-8 text-primary" />
            تحرير مقالة {cuisine.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            اكتب مقالة شاملة لتحسين SEO وتثقيف الزوار
          </p>
        </div>
        {cuisine.publishedAt && (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            <Icon name="Check" className="h-3 w-3 ml-1" />
            منشورة
          </Badge>
        )}
      </div>

      {/* SEO Guidelines */}
      <Alert>
        <Icon name="Info" className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <div>
            <strong>معايير طول المحتوى:</strong>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-600">100-300</Badge>
              <span className="text-muted-foreground">ضعيف</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-yellow-600">300-500</Badge>
              <span className="text-muted-foreground">مقبول</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600">500-1000</Badge>
              <span className="text-muted-foreground">جيد</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600">1000+</Badge>
              <span className="font-semibold text-green-600">ممتاز ⭐</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            💡 <strong>نصيحة:</strong> استخدم عناوين H2 و H3، أضف روابط داخلية، واكتب بشكل طبيعي للقراء.
          </div>
        </AlertDescription>
      </Alert>

      {/* Article Title */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">عنوان المقالة (H1)</CardTitle>
          <CardDescription>
            عنوان رئيسي يظهر في الصفحة ومحركات البحث
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            placeholder={`مثال: دليل شامل عن ${cuisine.name}`}
            className="text-lg"
          />
        </CardContent>
      </Card>

      {/* Meta Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            الوصف التعريفي (Meta Description)
            <Badge
              className={metaDescLength >= 150 && metaDescLength <= 160 ? 'bg-green-500 text-white' : ''}
              variant={metaDescLength >= 150 && metaDescLength <= 160 ? 'default' : 'secondary'}
            >
              {metaDescLength}/160
            </Badge>
          </CardTitle>
          <CardDescription>
            وصف مختصر يظهر في نتائج البحث (150-160 حرف مثالي)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="اكتشف أشهر الأطباق والمطاعم والمعلومات الثقافية عن..."
            rows={3}
            maxLength={160}
          />
        </CardContent>
      </Card>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            محتوى المقالة
            <div className="flex items-center gap-3 text-sm">
              <Badge
                variant={wordCount >= 1000 ? 'default' : wordCount >= 500 ? 'secondary' : 'destructive'}
                className={wordCount >= 1000 ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Icon name="FileText" className="h-3 w-3 ml-1" />
                <strong>{wordCount.toLocaleString('ar')}</strong> كلمة
              </Badge>
              <Badge variant="outline" className="font-normal">
                {charCount.toLocaleString('ar')} حرف
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            استخدم شريط الأدوات أعلاه لتنسيق المقالة. اضغط H2 للعناوين الرئيسية، H3 للعناوين الفرعية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={article}
            onChange={setArticle}
            placeholder={`ابدأ بكتابة مقالة شاملة عن ${cuisine.name}...

نصيحة: استخدم العناوين (H2, H3) لتنظيم المحتوى وتحسين SEO.`}
            minHeight="500px"
          />
        </CardContent>
      </Card>

      {/* Preview Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="gap-2"
        >
          <Icon name={showPreview ? 'Eye' : 'EyeOff'} className="h-4 w-4" />
          {showPreview ? 'إخفاء المعاينة' : 'معاينة'}
        </Button>
      </div>

      {/* Preview */}
      {showPreview && article && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة المقالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              {articleTitle && <h1 className="text-3xl font-bold mb-4">{articleTitle}</h1>}
              <div dangerouslySetInnerHTML={{ __html: article }} className="space-y-4" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-4 sticky bottom-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
        <Button
          onClick={() => handleSave(false)}
          disabled={isSubmitting || !article}
          variant="outline"
          className="gap-2"
        >
          <Icon name="Save" className="h-4 w-4" />
          حفظ كمسودة
        </Button>

        <Button
          onClick={() => handleSave(true)}
          disabled={isSubmitting || !canPublish}
          className="gap-2"
          title={
            !canPublish
              ? getPublishBlocker() || ''
              : `نشر المقالة للعامة (جودة SEO: ${getSEOQuality().level})`
          }
        >
          <Icon name="Globe" className="h-4 w-4" />
          حفظ ونشر
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          إلغاء
        </Button>

        <div className="flex-1" />

        {/* Publish Status Indicator */}
        {!canPublish && article && (
          <Badge variant="destructive" className="gap-1">
            <Icon name="AlertCircle" className="h-3 w-3" />
            {getPublishBlocker()}
          </Badge>
        )}

        {canPublish && (
          <>
            <Badge
              variant="default"
              className={`${getSEOQuality().color} hover:opacity-90 gap-1 text-white`}
            >
              <Icon name={getSEOQuality().icon} className="h-3 w-3" />
              <span className="font-semibold">SEO: {getSEOQuality().level}</span>
            </Badge>

            {wordCount < 1000 && (
              <Badge variant="outline" className="text-muted-foreground gap-1 text-xs">
                💡 الأمثل: 1000+ كلمة (حالياً: {wordCount})
              </Badge>
            )}
          </>
        )}
      </div>
    </div>
  );
}

