'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Card, CardContent } from '@/components/ui/card';
import GoogleMapsLink from '@/components/GoogleMapsLink';
import AppDialog from '@/components/app-dialog';

interface CustomerAddressesProps {
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
  customerId: string;
}

export default function CustomerAddresses({ addresses }: CustomerAddressesProps) {
  const [editingAddress, setEditingAddress] = useState<any>(null);

  if (addresses.length === 0) {
    return (
      <div className='text-center py-8'>
        <Icon name="MapPin" size="lg" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className='text-lg font-medium text-foreground mb-2'>لا توجد عناوين</h3>
        <p className='text-sm text-muted-foreground'>لم يقم هذا العميل بإضافة أي عناوين بعد</p>
      </div>
    );
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنوان؟')) return;

    try {
      const response = await fetch(`/api/admin/customer-addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Address delete error:', errorData);
        toast.error('فشل في حذف العنوان');
        return;
      }

      toast.success('تم حذف العنوان بنجاح');
      window.location.reload();
    } catch (error) {
      console.error('Address delete error:', error);
      toast.error('فشل في حذف العنوان');
    }
  };

  return (
    <div className='space-y-4'>
      {addresses.map((address) => (
        <Card key={address.id} className='overflow-hidden'>
          <CardContent className='p-4'>
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* Address Info */}
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-3'>
                  <Icon name="MapPin" size="sm" className="w-4 h-4 text-primary" />
                  <h3 className='font-semibold text-foreground'>{address.label}</h3>
                  {address.isDefault && (
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      افتراضي
                    </Badge>
                  )}
                </div>

                <div className='space-y-2 text-sm'>
                  <p className='text-foreground'>
                    {address.district}, {address.street}, مبنى {address.buildingNumber}
                    {address.apartmentNumber && `، شقة ${address.apartmentNumber}`}
                    {address.floor && `، طابق ${address.floor}`}
                  </p>

                  {address.landmark && (
                    <p className='text-muted-foreground'>
                      <span className='font-medium'>معلم قريب:</span> {address.landmark}
                    </p>
                  )}

                  {address.deliveryInstructions && (
                    <p className='text-muted-foreground'>
                      <span className='font-medium'>تعليمات التوصيل:</span> {address.deliveryInstructions}
                    </p>
                  )}
                </div>

                {/* Google Maps Link */}
                {address.latitude && address.longitude && (
                  <div className='mt-3'>
                    <GoogleMapsLink
                      latitude={address.latitude}
                      longitude={address.longitude}
                      label="عرض على الخريطة"
                      variant="outline"
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Address Actions */}
              <div className='flex flex-col gap-2 lg:w-32'>
                <Button
                  variant="outline"
                  size="sm"
                  className='flex items-center gap-1'
                  onClick={() => setEditingAddress(address)}
                >
                  <Icon name="Edit" size="xs" className="w-3 h-3" />
                  <span>تعديل</span>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className='flex items-center gap-1'
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Icon name="Trash2" size="xs" className="w-3 h-3" />
                  <span>حذف</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Address Dialog */}
      {editingAddress && (
        <AppDialog
          mode="update"
          open={!!editingAddress}
          onOpenChange={() => setEditingAddress(null)}
          title="تعديل العنوان"
          description="يرجى تحديث بيانات العنوان"
          footer={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingAddress(null)}
              >
                إلغاء
              </Button>
              <Button
                onClick={() => {
                  // Handle address update
                  toast.success('تم تحديث العنوان بنجاح');
                  setEditingAddress(null);
                  window.location.reload();
                }}
              >
                حفظ التغييرات
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="text-center py-4">
              <Icon name="Edit" size="lg" className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                سيتم إضافة نموذج تعديل العنوان هنا
              </p>
            </div>
          </div>
        </AppDialog>
      )}
    </div>
  );
}
