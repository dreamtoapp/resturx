'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';
import { upsertMasterService } from '../actions/upsertMasterService';
import {
  MasterServiceFormData,
  MasterServiceSchema,
} from '../helpers/serviceSchema';

interface MasterServiceUpsertProps {
  mode: 'new' | 'update';
  title: string;
  description: string;
  defaultValues: MasterServiceFormData;
}

export default function MasterServiceUpsert({
  mode,
  title,
  description,
  defaultValues,
}: MasterServiceUpsertProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(MasterServiceSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: MasterServiceFormData) => {
    setIsSubmitting(true);

    const result = await upsertMasterService(data, mode);

    setIsSubmitting(false);

    if (result.ok) {
      toast.success(result.msg);
      setOpen(false);
      form.reset(defaultValues);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'new' ? (
          <Button>
            <Icon name="Plus" className="h-4 w-4 ml-2" />
            {title}
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex-1">
            <Icon name="Edit" className="h-4 w-4 ml-1" />
            تعديل
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name (Arabic) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الخدمة (عربي) *</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: WiFi مجاني" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name (English) */}
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الخدمة (انجليزي)</FormLabel>
                  <FormControl>
                    <Input placeholder="Example: Free WiFi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الصورة/الأيقونة</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/icon.png"
                      {...field}
                      dir="ltr"
                    />
                  </FormControl>
                  <FormDescription>
                    رابط صورة أو أيقونة تمثل الخدمة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: وسائل الراحة" {...field} />
                  </FormControl>
                  <FormDescription>
                    فئة الخدمة للتنظيم والتصفية
                  </FormDescription>
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
                      placeholder="وصف الخدمة..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Order */}
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ترتيب العرض</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    الرقم الأصغر يظهر أولاً
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Active */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">نشط</FormLabel>
                    <FormDescription>
                      الخدمات النشطة فقط تظهر للمطاعم
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Icon name="Save" className="h-4 w-4 ml-2" />
                    حفظ
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

