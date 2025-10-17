'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import GoogleMapsLink from '@/components/GoogleMapsLink';
// Removed edit/delete from dynamic route per request

interface CustomerDetailSidebarProps {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: Date | string;
    orderCount: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: Date | string | null;
    preferredPaymentMethod?: string | null;
    deliveryPreferences?: string | null;
    vipLevel?: number | null;
    addresses: Array<{
      id: string;
      label: string;
      district: string;
      street: string;
      buildingNumber: string;
      floor?: string | null;
      apartmentNumber?: string | null;
      landmark?: string | null;
      deliveryInstructions?: string | null;
      latitude?: string | null;
      longitude?: string | null;
      isDefault: boolean;
    }>;
  };
}

export default function CustomerDetailSidebar({ customer }: CustomerDetailSidebarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(amount || 0));
  };

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

  const defaultAddress = customer.addresses.find(addr => addr.isDefault) || customer.addresses[0];

  return (
    <div className='space-y-6'>
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Icon name="Zap" size="sm" className="w-4 h-4" />
            <span>إجراءات سريعة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {customer.phone && (
            <Button
              className='w-full flex items-center gap-2'
              onClick={() => window.open(`tel:${customer.phone}`, '_self')}
            >
              <Icon name="Phone" size="xs" className="w-3 h-3" />
              <span>اتصال</span>
            </Button>
          )}

          {customer.phone && (
            <Button
              variant="outline"
              className='w-full flex items-center gap-2'
              onClick={() => window.open(`https://wa.me/${customer.phone?.replace(/^0/, '966')}`, '_blank')}
            >
              <Icon name="MessageCircle" size="xs" className="w-3 h-3" />
              <span>واتساب</span>
            </Button>
          )}

          {customer.email && (
            <Button
              variant="outline"
              className='w-full flex items-center gap-2'
              onClick={() => window.open(`mailto:${customer.email}`, '_self')}
            >
              <Icon name="Mail" size="xs" className="w-3 h-3" />
              <span>إرسال بريد</span>
            </Button>
          )}

          {/* edit/delete removed */}
        </CardContent>
      </Card>

      {/* Customer Summary */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Icon name="BarChart3" size="sm" className="w-4 h-4" />
            <span>ملخص العميل</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>الحالة</span>
              <Badge
                variant={customer.orderCount > 0 ? "default" : "secondary"}
                className={customer.orderCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
              >
                {customer.orderCount > 0 ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>تاريخ الانضمام</span>
              <span className='text-sm font-medium'>{formatDate(customer.createdAt)}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>إجمالي الطلبات</span>
              <span className='text-sm font-medium'>{customer.orderCount}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>إجمالي الإنفاق</span>
              <span className='text-sm font-medium'>{formatCurrency(customer.totalSpent)}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>متوسط قيمة الطلب</span>
              <span className='text-sm font-medium'>{formatCurrency(customer.averageOrderValue)}</span>
            </div>

            {customer.lastOrderDate && (
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>آخر طلب</span>
                <span className='text-sm font-medium'>{formatDate(customer.lastOrderDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Default Address */}
      {defaultAddress && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Icon name="MapPin" size="sm" className="w-4 h-4" />
              <span>العنوان الافتراضي</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge variant="outline" className="text-xs">
                  {defaultAddress.label}
                </Badge>
                {defaultAddress.isDefault && (
                  <Badge variant="default" className="text-xs">
                    افتراضي
                  </Badge>
                )}
              </div>

              <p className='text-sm text-foreground'>
                {defaultAddress.district}, {defaultAddress.street}, مبنى {defaultAddress.buildingNumber}
                {defaultAddress.apartmentNumber && `، شقة ${defaultAddress.apartmentNumber}`}
                {defaultAddress.floor && `، طابق ${defaultAddress.floor}`}
                {defaultAddress.landmark && `، معلم: ${defaultAddress.landmark}`}
              </p>

              {defaultAddress.deliveryInstructions && (
                <p className='text-xs text-muted-foreground'>
                  تعليمات: {defaultAddress.deliveryInstructions}
                </p>
              )}

              {defaultAddress.latitude && defaultAddress.longitude && (
                <GoogleMapsLink
                  latitude={defaultAddress.latitude}
                  longitude={defaultAddress.longitude}
                  label="عرض على الخريطة"
                  variant="outline"
                  size="sm"
                  className="w-full"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      {(customer.preferredPaymentMethod || customer.deliveryPreferences) && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Icon name="Settings" size="sm" className="w-4 h-4" />
              <span>التفضيلات</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {customer.preferredPaymentMethod && (
              <div>
                <span className='text-sm text-muted-foreground'>طريقة الدفع المفضلة</span>
                <p className='text-sm font-medium text-foreground'>
                  {getPaymentMethodLabel(customer.preferredPaymentMethod)}
                </p>
              </div>
            )}

            {customer.deliveryPreferences && (
              <div>
                <span className='text-sm text-muted-foreground'>تفضيلات التوصيل</span>
                <p className='text-sm font-medium text-foreground'>
                  {customer.deliveryPreferences}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
