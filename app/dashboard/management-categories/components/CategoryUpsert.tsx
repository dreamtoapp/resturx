'use client';

import {
  Edit,
  Plus,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { iconVariants } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { upsertCategory } from '../actions/upsertCategory';
import { getRestaurantFormData } from '../actions/getFormData';
import {
  CategoryFormData,
  CategorySchema,
} from '../helper/categoryZodAndInputs';

interface AddCategoryProps {
  mode: 'new' | 'update';
  defaultValues: Partial<CategoryFormData>;
  title?: string;
  description?: string;
}

export default function CategoryUpsert({
  mode,
  defaultValues,
  title,
  description,
}: AddCategoryProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState(defaultValues.countryId || '');
  const [selectedUserId, setSelectedUserId] = useState(defaultValues.userId || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    mode: 'onChange',
    defaultValues: {
      id: defaultValues.id,
      name: defaultValues.name || '',
      description: defaultValues.description || '',
      countryId: defaultValues.countryId || '',
      userId: defaultValues.userId || '',
      phone: defaultValues.phone || '',
      email: defaultValues.email || '',
      address: defaultValues.address || '',
      deliveryTime: defaultValues.deliveryTime || '',
      minOrder: defaultValues.minOrder || undefined,
      deliveryFee: defaultValues.deliveryFee || undefined,
      hasOwnDelivery: defaultValues.hasOwnDelivery || false,
    },
  });

  // Load countries and owners
  useEffect(() => {
    getRestaurantFormData().then((data) => {
      setCountries(data.countries);
      setOwners(data.restaurantOwners);
    });
  }, []);

  const onSubmit = async (formData: CategoryFormData) => {
    try {
      const result = await upsertCategory(formData, mode); // ✅ Call category action

      if (result.ok) {
        toast.success(result.msg || 'تم حفظ بيانات التصنيف بنجاح');
        reset();
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(result.msg || 'حدث خطأ يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      toast.error('فشل في إرسال البيانات، يرجى المحاولة لاحقاً');
      console.error('فشل في إرسال البيانات:', err);
    }
  };

  return (
    <AppDialog
      trigger={
        <Button
          variant={mode === 'new' ? 'default' : 'outline'}
          size="sm"
          className="flex items-center gap-2"
        >
          {mode === 'new' ? (
            <>
              <Plus className={iconVariants({ size: 'xs' })} />
              <span>إضافة</span>
            </>
          ) : (
            <>
              <Edit className={iconVariants({ size: 'xs' })} />
              <span>تعديل</span>
            </>
          )}
        </Button>
      }
      title={title}
      description={description}
      mode={mode}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Country Selector */}
        <div className="space-y-2">
          <Label htmlFor="countryId">نوع المطبخ *</Label>
          <Select
            value={selectedCountryId}
            onValueChange={(value) => {
              setSelectedCountryId(value);
              setValue('countryId', value, { shouldValidate: true });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع المطبخ" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormError message={errors.countryId?.message} />
        </div>

        {mode === 'new' && (
          <>
            {/* Owner Selector */}
            <div className="space-y-2">
              <Label htmlFor="userId">صاحب المطعم *</Label>
              <Select
                value={selectedUserId}
                onValueChange={(value) => {
                  setSelectedUserId(value);
                  setValue('userId', value, { shouldValidate: true });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر صاحب المطعم" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name || owner.email || owner.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormError message={errors.userId?.message} />
              {owners.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  لا يوجد أصحاب مطاعم. يرجى إنشاء مستخدم بصلاحية RESTAURANT_OWNER أولاً.
                </p>
              )}
            </div>
          </>
        )}

        {/* Basic Info */}
        <div className="space-y-2">
          <Label htmlFor="name">اسم المطعم *</Label>
          <Input {...register('name')} placeholder="مثال: مطعم تاج محل" disabled={isSubmitting} />
          <FormError message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">الوصف</Label>
          <Textarea {...register('description')} placeholder="وصف مختصر عن المطعم" disabled={isSubmitting} rows={3} />
          <FormError message={errors.description?.message} />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input {...register('phone')} type="tel" placeholder="+966..." disabled={isSubmitting} />
            <FormError message={errors.phone?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input {...register('email')} type="email" placeholder="email@example.com" disabled={isSubmitting} />
            <FormError message={errors.email?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">العنوان</Label>
          <Input {...register('address')} placeholder="العنوان الكامل" disabled={isSubmitting} />
          <FormError message={errors.address?.message} />
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryTime">وقت التوصيل</Label>
            <Input {...register('deliveryTime')} placeholder="30-45 دقيقة" disabled={isSubmitting} />
            <FormError message={errors.deliveryTime?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minOrder">الحد الأدنى</Label>
            <Input {...register('minOrder')} type="number" placeholder="50" disabled={isSubmitting} />
            <FormError message={errors.minOrder?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryFee">رسوم التوصيل</Label>
            <Input {...register('deliveryFee')} type="number" placeholder="10" disabled={isSubmitting} />
            <FormError message={errors.deliveryFee?.message} />
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="hasOwnDelivery"
            checked={defaultValues.hasOwnDelivery}
            onCheckedChange={(checked) => setValue('hasOwnDelivery', checked as boolean)}
          />
          <Label htmlFor="hasOwnDelivery" className="text-sm cursor-pointer">
            المطعم لديه خدمة توصيل خاصة
          </Label>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'جارٍ الحفظ...' : mode === 'new' ? 'إضافة المطعم' : 'حفظ التعديلات'}
        </Button>
      </form>
    </AppDialog>
  );
}
