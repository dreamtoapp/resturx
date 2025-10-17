import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AddImage from '@/components/AddImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';

// About tab collects only hero fields; other fields live in separate tabs
const aboutSchema = z.object({
    heroTitle: z.string().min(2, 'العنوان الرئيسي مطلوب'),
    heroSubtitle: z.string().min(2, 'الوصف الرئيسي مطلوب'),
    // Allow initial save without image; accept empty string or valid URL
    heroImageUrl: z.union([z.string().url('رابط الصورة غير صالح'), z.literal('')]).optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export type AboutFormDefaultValues = Partial<AboutFormValues> & { id?: string };

export default function AboutForm({ defaultValues, onSubmit, onCancel }: {
    defaultValues?: AboutFormDefaultValues;
    onSubmit: (values: AboutFormValues) => void;
    onCancel?: () => void;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
            {/* Hero Image Standalone Card (moved to top) */}
            <Card dir="rtl">
                <CardHeader className="text-right">
                    <CardTitle>صورة الهيرو</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                    <div className="flex flex-wrap items-start gap-4">
                        <div className="relative mt-1 w-full aspect-[2/1] border rounded-md overflow-hidden">
                            <AddImage
                                url={watch('heroImageUrl')}
                                alt="صورة الهيرو"
                                recordId={defaultValues?.id || ''}
                                table="aboutPageContent"
                                tableField="heroImageUrl"
                                onUploadComplete={url => setValue('heroImageUrl', url, { shouldValidate: true })}
                                imageFit="contain"
                            />
                            {!defaultValues?.id && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4">
                                    <div role="note" aria-live="polite" className="max-w-md w-full rounded-md border border-amber-200 bg-amber-50/80 text-amber-800 px-5 py-4 text-center">
                                        <div className="inline-flex items-center justify-center gap-2 mb-2">
                                            <Icon name="AlertCircle" className="h-5 w-5 text-amber-700" />
                                            <span className="sr-only">تنبيه</span>
                                        </div>
                                        <p className="text-base font-medium mb-0">احفظ البيانات أولًا، ثم ارفع صورة الهيرو.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="min-w-[240px] max-w-full text-sm">
                            {!defaultValues?.id && (
                                <p className="text-yellow-700 mb-2 text-right">تنبيه: احفظ البيانات أولًا، ثم ارفع صورة الهيرو.</p>
                            )}

                        </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground text-right">
                        الأنواع المسموحة: JPEG, PNG, WEBP, AVIF — الأبعاد الموصى بها: 1200×600 بكسل (2:1) — الحد الأقصى للحجم: 5MB
                    </p>
                    {errors.heroImageUrl && (
                        <p className="text-destructive text-sm mt-2 text-right">{errors.heroImageUrl.message}</p>
                    )}
                </CardContent>
            </Card>

            {/* Hero Section Card */}
            <Card dir="rtl">
                <CardHeader className="text-right">
                    <CardTitle>معلومات المتجر الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-right">
                    <div className="text-right">
                        <Label htmlFor="heroTitle" className="text-sm font-medium text-right block">العنوان الرئيسي</Label>
                        <Input
                            id="heroTitle"
                            {...register('heroTitle')}
                            className="mt-1 text-right"
                            placeholder="أدخل العنوان الرئيسي"
                            dir="rtl"
                        />
                        {errors.heroTitle && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.heroTitle.message}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Label htmlFor="heroSubtitle" className="text-sm font-medium text-right block">الوصف الرئيسي</Label>
                        <Textarea
                            id="heroSubtitle"
                            {...register('heroSubtitle')}
                            className="mt-1 min-h-[100px] text-right"
                            placeholder="أدخل الوصف الرئيسي"
                            dir="rtl"
                        />
                        {errors.heroSubtitle && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.heroSubtitle.message}</p>
                        )}
                    </div>

                    {/* Hero image moved to its own standalone card below */}
                </CardContent>
            </Card>



            {/* Mission moved to "رسالتنا" tab */}

            {/* CTA moved to تبويب قسم الدعوة للعمل */}

            {/* Form Actions */}
            <div id="about-form-actions" className="flex gap-4 pt-6 border-t justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                            <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                            جاري الحفظ...
                        </span>
                    ) : (
                        'حفظ التغييرات'
                    )}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        إلغاء
                    </Button>
                )}
            </div>
        </form>
    );
} 