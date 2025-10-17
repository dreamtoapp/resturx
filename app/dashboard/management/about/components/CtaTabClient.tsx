"use client";
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateAboutPageContent } from '../actions/updateAboutPageContent';

type CtaFormValues = {
  ctaTitle: string;
  ctaText: string;
  ctaButtonText: string;
  ctaButtonLink?: string;
  contactLink?: string;
};

export default function CtaTabClient({ aboutPage }: { aboutPage: any }) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<CtaFormValues>({
    defaultValues: {
      ctaTitle: aboutPage?.ctaTitle || '',
      ctaText: aboutPage?.ctaText || '',
      ctaButtonText: aboutPage?.ctaButtonText || '',
      ctaButtonLink: aboutPage?.ctaButtonLink || '',
      contactLink: aboutPage?.contactLink || '',
    },
  });

  const onSubmit = async (values: CtaFormValues) => {
    try {
      const payload = {
        heroTitle: aboutPage?.heroTitle || '',
        heroSubtitle: aboutPage?.heroSubtitle || '',
        heroImageUrl: aboutPage?.heroImageUrl || '',
        missionTitle: aboutPage?.missionTitle || '',
        missionText: aboutPage?.missionText || '',
        ctaTitle: values.ctaTitle,
        ctaText: values.ctaText,
        ctaButtonText: values.ctaButtonText,
        ctaButtonLink: values.ctaButtonLink || '',
        contactLink: values.contactLink || '',
        brandId: aboutPage?.brandId || '',
      };
      const res = await updateAboutPageContent(payload as any);
      if (res?.success) {
        toast.success('تم حفظ قسم الدعوة للعمل بنجاح');
      } else {
        toast.error(typeof res?.error === 'string' ? res.error : 'تعذر حفظ قسم الدعوة للعمل');
      }
    } catch (err: any) {
      toast.error(err?.message || 'حدث خطأ غير متوقع');
    }
  };

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader className="text-right">
        <CardTitle>قسم الدعوة للعمل</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
          <div className="text-right">
            <Label htmlFor="ctaTitle" className="text-sm font-medium text-right block">عنوان الدعوة</Label>
            <Input id="ctaTitle" {...register('ctaTitle', { required: true, minLength: 2 })} className="mt-1 text-right" dir="rtl" />
            {errors.ctaTitle && (
              <p className="text-destructive text-sm mt-1 text-right">عنوان الدعوة مطلوب</p>
            )}
          </div>
          <div className="text-right">
            <Label htmlFor="ctaText" className="text-sm font-medium text-right block">نص الدعوة</Label>
            <Textarea id="ctaText" {...register('ctaText', { required: true, minLength: 2 })} className="mt-1 min-h-[100px] text-right" dir="rtl" />
            {errors.ctaText && (
              <p className="text-destructive text-sm mt-1 text-right">نص الدعوة مطلوب</p>
            )}
          </div>
          <div className="text-right">
            <Label htmlFor="ctaButtonText" className="text-sm font-medium text-right block">نص زر الدعوة</Label>
            <Input id="ctaButtonText" {...register('ctaButtonText', { required: true, minLength: 2 })} className="mt-1 text-right" dir="rtl" />
            {errors.ctaButtonText && (
              <p className="text-destructive text-sm mt-1 text-right">نص زر الدعوة مطلوب</p>
            )}
          </div>
          <div className="text-right">
            <Label htmlFor="ctaButtonLink" className="text-sm font-medium text-right block">رابط الزر (اختياري)</Label>
            <Input id="ctaButtonLink" {...register('ctaButtonLink')} className="mt-1 text-right" dir="rtl" />
          </div>
          <div className="text-right">
            <Label htmlFor="contactLink" className="text-sm font-medium text-right block">رابط التواصل (اختياري)</Label>
            <Input id="contactLink" {...register('contactLink')} className="mt-1 text-right" dir="rtl" />
          </div>
          <div className="flex gap-4 pt-2 justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ قسم الدعوة للعمل'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


