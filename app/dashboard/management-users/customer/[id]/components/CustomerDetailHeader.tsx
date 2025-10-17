'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Removed unused Button
import { Icon } from '@/components/icons/Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppDialog from '@/components/app-dialog';
import AddImage from '@/components/AddImage';

// Removed unused imports

interface CustomerDetailHeaderProps {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    image?: string | null;
    createdAt: Date | string;
    orderCount: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: Date | string | null;
    preferredPaymentMethod?: string | null;
    deliveryPreferences?: string | null;
    vipLevel?: number | null;
  };
}

export default function CustomerDetailHeader({ customer }: CustomerDetailHeaderProps) {
  const router = useRouter();
  const [imageVersion, setImageVersion] = useState(0);

  const formatNumber = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value || 0));

  const formatCurrency = (amount: number) => formatNumber(amount);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${day}/${month}/${year}`;
  };

  const getPaymentMethodLabel = (method: string | null) => {
    const methods = {
      'CASH': 'نقداً',
      'CARD': 'بطاقة ائتمان',
      'WALLET': 'محفظة إلكترونية'
    };
    return methods[method as keyof typeof methods] || 'غير محدد';
  };

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Customer Avatar and Basic Info */}
          <div className='flex flex-col lg:flex-row items-center lg:items-start gap-4'>
            <AppDialog
              trigger={
                <div className='w-20 h-20 cursor-pointer hover:scale-105 transition-transform duration-200 border-2 border-transparent hover:border-primary/20 rounded-full'>
                  <Avatar className="w-full h-full rounded-full overflow-hidden">
                    {customer.image ? (
                      <AvatarImage className="w-full h-full object-cover" src={`${customer.image}?v=${imageVersion}`} alt={customer.name} />
                    ) : null}
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {customer.name?.trim()?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              }
              title="تحديث صورة العميل"
              description={customer.name}
              mode="update"
              size="sm"
              footer={null}
            >
              <div className="p-4">
                <div className="w-[280px] h-[280px] aspect-square overflow-hidden mx-auto border border-border rounded-lg">
                  <AddImage
                    className="relative w-full h-full"
                    url={customer.image || undefined}
                    alt={`${customer.name}'s profile`}
                    recordId={customer.id}
                    table="user"
                    tableField='image'
                    onUploadComplete={() => {
                      toast.success('تم رفع الصورة بنجاح');
                      setImageVersion(v => v + 1);
                      router.refresh();
                    }}
                  />
                </div>
              </div>
            </AppDialog>

            <div className='text-center lg:text-right'>
              <div className='flex items-center justify-center lg:justify-start gap-2 mb-2'>
                <h2 className='text-2xl font-bold text-foreground'>{customer.name}</h2>
                {customer.vipLevel && customer.vipLevel > 0 && (
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                    VIP {customer.vipLevel}
                  </Badge>
                )}
              </div>

              <div className='space-y-1 text-sm text-muted-foreground'>
                <div className='flex items-center justify-center lg:justify-start gap-2'>
                  <Icon name="Phone" size="xs" className="w-3 h-3" />
                  {customer.phone ? (
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {customer.phone}
                    </a>
                  ) : (
                    <span>غير محدد</span>
                  )}
                </div>

                <div className='flex items-center justify-center lg:justify-start gap-2'>
                  <Icon name="Mail" size="xs" className="w-3 h-3" />
                  <span>{customer.email || 'غير محدد'}</span>
                </div>

                <div className='flex items-center justify-center lg:justify-start gap-2'>
                  <Icon name="Calendar" size="xs" className="w-3 h-3" />
                  <span>عضو منذ {formatDate(customer.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Statistics */}
          <div className='flex-1'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='text-center p-3 bg-blue-50 rounded-lg border border-blue-200'>
                <div className='text-xl leading-tight font-bold text-blue-700'>{formatNumber(customer.orderCount)}</div>
                <div className='text-xs text-blue-600'>إجمالي الطلبات</div>
              </div>

              <div className='text-center p-3 bg-green-50 rounded-lg border border-green-200'>
                <div className='text-xl leading-tight font-bold text-green-700'>{formatCurrency(customer.totalSpent)}</div>
                <div className='text-xs text-green-600'>إجمالي الإنفاق</div>
              </div>

              <div className='text-center p-3 bg-purple-50 rounded-lg border border-purple-200'>
                <div className='text-xl leading-tight font-bold text-purple-700'>{formatCurrency(customer.averageOrderValue)}</div>
                <div className='text-xs text-purple-600'>متوسط قيمة الطلب</div>
              </div>

              <div className='text-center p-3 bg-orange-50 rounded-lg border border-orange-200'>
                <div className='text-base leading-tight font-semibold text-orange-700'>
                  {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'لا يوجد'}
                </div>
                <div className='text-xs text-orange-600'>آخر طلب</div>
              </div>
            </div>
          </div>

          {/* Empty right column to allow stats to take more space (removed inline actions) */}
        </div>

        {/* Additional Info */}
        {(customer.preferredPaymentMethod || customer.deliveryPreferences) && (
          <div className='mt-6 pt-6 border-t border-border/30'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {customer.preferredPaymentMethod && (
                <div className='flex items-center gap-2'>
                  <Icon name="CreditCard" size="xs" className="text-muted-foreground w-3 h-3" />
                  <span className='text-sm text-muted-foreground'>طريقة الدفع المفضلة:</span>
                  <span className='text-sm font-medium text-foreground'>
                    {getPaymentMethodLabel(customer.preferredPaymentMethod)}
                  </span>
                </div>
              )}

              {customer.deliveryPreferences && (
                <div className='flex items-start gap-2'>
                  <Icon name="Truck" size="xs" className="text-muted-foreground w-3 h-3 mt-0.5" />
                  <div>
                    <span className='text-sm text-muted-foreground'>تفضيلات التوصيل:</span>
                    <p className='text-sm font-medium text-foreground mt-1'>
                      {customer.deliveryPreferences}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
