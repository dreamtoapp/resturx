"use client";
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateAboutMission } from '../actions/updateAboutMission';

type MissionFormValues = {
  missionTitle: string;
  missionText: string;
};

export default function MissionTabClient({ aboutPage }: { aboutPage: any }) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<MissionFormValues>({
    defaultValues: {
      missionTitle: aboutPage?.missionTitle || '',
      missionText: aboutPage?.missionText || '',
    },
  });

  const onSubmit = async (values: MissionFormValues) => {
    try {
      const res = await updateAboutMission({
        missionTitle: values.missionTitle,
        missionText: values.missionText,
      });
      if (res?.success) {
        toast.success('تم حفظ الرسالة بنجاح');
      } else {
        const err = res?.error as any;
        const msg = typeof err === 'string'
          ? err
          : (Array.isArray(err?.formErrors) && err.formErrors.length)
            ? err.formErrors.join(' • ')
            : (err?.fieldErrors
              ? Object.values(err.fieldErrors as Record<string, string[]>)
                .flat()
                .join(' • ')
              : 'تعذر حفظ الرسالة');
        toast.error(msg);
      }
    } catch (err: any) {
      toast.error(err?.message || 'حدث خطأ غير متوقع');
    }
  };

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader className="text-right">
        <CardTitle>رسالتنا</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
          <div className="text-right">
            <Label htmlFor="missionTitle" className="text-sm font-medium text-right block">عنوان الرسالة</Label>
            <Input id="missionTitle" {...register('missionTitle', { required: true, minLength: 2 })} className="mt-1 text-right" dir="rtl" />
            {errors.missionTitle && (
              <p className="text-destructive text-sm mt-1 text-right">عنوان الرسالة مطلوب</p>
            )}
          </div>
          <div className="text-right">
            <Label htmlFor="missionText" className="text-sm font-medium text-right block">نص الرسالة</Label>
            <Textarea id="missionText" {...register('missionText', { required: true, minLength: 2 })} className="mt-1 min-h-[100px] text-right" dir="rtl" />
            {errors.missionText && (
              <p className="text-destructive text-sm mt-1 text-right">نص الرسالة مطلوب</p>
            )}
          </div>
          <div className="flex gap-4 pt-2 justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ الرسالة'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


