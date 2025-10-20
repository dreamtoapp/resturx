'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';
import { upsertDish } from '../actions/upsertDish';

const DishFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'اسم الطبق مطلوب'),
  description: z.string().optional(),
  dishCategoryId: z.string().optional(),
  price: z.coerce.number().min(0, 'السعر يجب أن يكون صفر أو أكثر'),
  compareAtPrice: z.coerce.number().optional(),
  published: z.boolean(),
  outOfStock: z.boolean(),
});

type DishFormData = z.infer<typeof DishFormSchema>;

interface DishFormProps {
  mode: 'create' | 'update';
  categories: Array<{
    id: string;
    name: string;
    nameEn?: string | null;
  }>;
  defaultValues?: Partial<DishFormData>;
}

export default function DishForm({ mode, categories, defaultValues }: DishFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<DishFormData>({
    resolver: zodResolver(DishFormSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      dishCategoryId: defaultValues?.dishCategoryId || '',
      price: defaultValues?.price || 0,
      compareAtPrice: defaultValues?.compareAtPrice || undefined,
      published: defaultValues?.published ?? true,
      outOfStock: defaultValues?.outOfStock ?? false,
      id: defaultValues?.id,
    },
  });

  const onSubmit = async (data: DishFormData) => {
    setIsSubmitting(true);
    const result = await upsertDish(data, mode);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(result.msg);
      router.push('/restaurant-portal/menu');
      router.refresh();
    } else {
      toast.error(result.msg);
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          const errorMessages = (result.errors as Record<string, string[]>)[key];
          if (errorMessages && errorMessages.length > 0) {
            form.setError(key as any, {
              message: errorMessages[0],
            });
          }
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الطبق الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dish Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الطبق *</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: برياني حيدرابادي" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="وصف الطبق ومكوناته..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    وصف موجز للطبق يساعد العملاء على معرفة المكونات والطعم
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="dishCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>صنف الطبق</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الصنف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">بدون تصنيف</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                          {category.nameEn && ` (${category.nameEn})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    اختر صنف الطبق (مثل: حلويات، مقبلات، مشروبات)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التسعير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر (ريال) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Compare At Price */}
            <FormField
              control={form.control}
              name="compareAtPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر قبل الخصم (اختياري)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="30.00"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    السعر الأصلي قبل الخصم (يظهر مشطوباً بجانب السعر الحالي)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حالة الطبق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Published */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">منشور</FormLabel>
                    <FormDescription>
                      الطبق ظاهر للعملاء في قائمة المطعم
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Out of Stock */}
            <FormField
              control={form.control}
              name="outOfStock"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">غير متوفر</FormLabel>
                    <FormDescription>
                      الطبق غير متوفر حالياً (نفذ من المطبخ)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/restaurant-portal/menu')}
            disabled={isSubmitting}
          >
            <Icon name="X" className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Icon name="Save" className="h-4 w-4 ml-2" />
                {mode === 'create' ? 'إضافة الطبق' : 'حفظ التعديلات'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

