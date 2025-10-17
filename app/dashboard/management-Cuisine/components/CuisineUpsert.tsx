'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/icons/Icon';

import {
  CuisineFormData,
  CuisineSchema,
  getCuisineFields,
} from '../helper/cuisineSchema';
import { upsertCuisine } from '../actions/upsertCuisine';

interface CuisineUpsertProps {
  mode: 'new' | 'update';
  defaultValues: CuisineFormData;
  title?: string;
  description?: string;
  iconOnly?: boolean;
}

export default function CuisineUpsert({
  mode,
  defaultValues,
  title,
  description,
  iconOnly = false,
}: CuisineUpsertProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CuisineFormData>({
    resolver: zodResolver(CuisineSchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? {},
  });

  const onSubmit = async (formData: CuisineFormData) => {
    try {
      const result = await upsertCuisine(formData, mode);

      if (result.ok) {
        toast.success(result.msg || 'تم حفظ البيانات بنجاح');
        reset();
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(result.msg || 'حدث خطأ يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      toast.error('فشل في إرسال البيانات، يرجى المحاولة لاحقاً');
      console.error('Failed to submit data:', err);
    }
  };

  return (
    <AppDialog
      trigger={
        <Button
          variant={mode === 'new' ? 'default' : 'ghost'}
          size={iconOnly ? 'sm' : 'sm'}
          className={iconOnly ? 'h-8 w-8 p-0' : 'flex items-center gap-2'}
          aria-label={mode === 'new' ? 'إضافة' : 'تعديل'}
        >
          {mode === 'new' ? (
            <>
              <Icon name="Plus" size="xs" />
              {!iconOnly && <span>إضافة</span>}
            </>
          ) : (
            <>
              <Icon name="Edit" size="xs" />
              {!iconOnly && <span>تعديل</span>}
            </>
          )}
        </Button>
      }
      title={title}
      description={description}
      mode={mode}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {getCuisineFields(register, errors).map((section) => (
          <div key={section.section} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {section.section}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.name} className={field.className}>
                  <label className="block text-sm font-medium mb-1" htmlFor={`cuisine-${String(field.name)}`}>
                    {field.placeholder}
                    {field.name === 'email' && <span className="text-muted-foreground text-xs"> (اختياري)</span>}
                  </label>
                  <Input
                    id={`cuisine-${String(field.name)}`}
                    {...field.register}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={isSubmitting}
                    maxLength={field.maxLength}
                  />
                  <FormError message={field.error} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
        </Button>
      </form>
    </AppDialog>
  );
}
