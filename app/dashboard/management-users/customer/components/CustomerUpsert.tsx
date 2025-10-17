'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';


import AppDialog from '@/components/app-dialog';


import { Button } from '@/components/ui/button';

import { Icon } from '@/components/icons/Icon';
import CustomerField from './CustomerField';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { upsertCustomer } from '../actions/upsertCustomer';
import { getCustomerFields } from '../helpers/customerFields';
import {

    CustomerFormData,
    CustomerSchema,
} from '../helpers/customerSchema';

interface CustomerUpsertProps {
    mode: 'new' | 'update'
    defaultValues: CustomerFormData;
    title?: string;
    description?: string;
    userId?: string;
}

export default function CustomerUpsert({
    mode,
    defaultValues,
    title,
    description,
    userId
}: CustomerUpsertProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CustomerFormData>({
        resolver: zodResolver(CustomerSchema),
        mode: 'onChange',
        defaultValues: {
            name: defaultValues.name || '',
            phone: defaultValues.phone || '',

            password: defaultValues.password || '',


        },
    });

    const onSubmit = async (formData: CustomerFormData) => {
        try {
            const result = await upsertCustomer(formData, mode, userId);

            if (result.ok) {
                toast.success(result.msg || 'تم حفظ بيانات العميل بنجاح');
                reset();
                router.refresh();
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
            trigger={<Button variant={mode === "new" ? 'default' : 'outline'} size='sm' className='flex items-center gap-2'>
                {mode === 'new' ? (
                    <>
                        <Icon name="Plus" size="xs" /> <span>إضافة عميل</span>
                    </>
                ) : (
                    <>
                        <Icon name="Edit" size="xs" /> <span>تعديل</span>
                    </>
                )}
            </Button>}
            title={title || (mode === 'new' ? 'إضافة عميل جديد' : 'تعديل بيانات العميل')}
            description={description || 'يرجى إدخال بيانات العميل'}
            mode={mode}
            footer={
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                    form="customer-form"
                >
                    {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
                </Button>
            }
        >
            <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {getCustomerFields(register, errors)[0].fields.map((field) => (
                        <CustomerField
                            key={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            className={field.className}
                            register={field.register}
                            error={field.error}
                            isSubmitting={isSubmitting}
                            options={field.options}
                            mode={mode}
                        />
                    ))}
                </div>
            </form>
        </AppDialog>
    );
} 