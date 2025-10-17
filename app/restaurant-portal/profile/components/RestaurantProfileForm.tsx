'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateRestaurantProfile } from '../actions/updateProfile';

const profileSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('صيغة البريد غير صحيحة').optional().or(z.literal('')),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  deliveryTime: z.string().optional(),
  minOrder: z.coerce.number().optional(),
  deliveryFee: z.coerce.number().optional(),
  hasOwnDelivery: z.boolean().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function RestaurantProfileForm({ restaurant }: { restaurant: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: restaurant.name || '',
      description: restaurant.description || '',
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      address: restaurant.address || '',
      workingHours: restaurant.workingHours || '',
      deliveryTime: restaurant.deliveryTime || '',
      minOrder: restaurant.minOrder || undefined,
      deliveryFee: restaurant.deliveryFee || undefined,
      hasOwnDelivery: restaurant.hasOwnDelivery || false,
      bio: restaurant.bio || '',
    },
  });

  const hasOwnDelivery = watch('hasOwnDelivery');

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateRestaurantProfile(restaurant.id, data);

      if (result.success) {
        toast.success('تم تحديث بيانات المطعم بنجاح');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(result.message || 'حدث خطأ أثناء التحديث');
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">معلومات أساسية</TabsTrigger>
          <TabsTrigger value="contact">الاتصال والموقع</TabsTrigger>
          <TabsTrigger value="operations">التشغيل</TabsTrigger>
          <TabsTrigger value="about">عن المطعم</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المطعم *</Label>
                <Input {...register('name')} placeholder="مطعم تاج محل" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف مختصر</Label>
                <Textarea {...register('description')} placeholder="وصف مختصر عن المطعم" rows={3} />
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>نوع المطبخ:</strong> {restaurant.country?.name || 'غير محدد'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  لتغيير نوع المطبخ، يرجى التواصل مع الإدارة
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الاتصال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input {...register('phone')} type="tel" placeholder="+966..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input {...register('email')} type="email" placeholder="info@restaurant.com" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان الكامل</Label>
                <Textarea {...register('address')} placeholder="شارع الأمير محمد بن عبدالعزيز..." rows={2} />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 لتحديد موقعك على الخريطة، يرجى التواصل مع الإدارة
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ساعات العمل والتوصيل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workingHours">ساعات العمل</Label>
                <Textarea
                  {...register('workingHours')}
                  placeholder="مثال:
السبت - الخميس: 9:00 AM - 11:00 PM
الجمعة: 12:00 PM - 11:00 PM"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">وقت التوصيل</Label>
                  <Input {...register('deliveryTime')} placeholder="30-45 دقيقة" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minOrder">الحد الأدنى (ريال)</Label>
                  <Input {...register('minOrder')} type="number" placeholder="50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">رسوم التوصيل (ريال)</Label>
                  <Input {...register('deliveryFee')} type="number" placeholder="10" />
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg">
                <Checkbox
                  id="hasOwnDelivery"
                  checked={hasOwnDelivery}
                  onCheckedChange={(checked) => setValue('hasOwnDelivery', checked as boolean)}
                />
                <Label htmlFor="hasOwnDelivery" className="cursor-pointer">
                  المطعم لديه خدمة توصيل خاصة (بدون منصات خارجية)
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>عن المطعم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">قصة المطعم</Label>
                <Textarea
                  {...register('bio')}
                  placeholder="اكتب قصة مطعمك، تاريخه، ما يميزه..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  هذا النص سيظهر للعملاء في صفحة المطعم
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}





