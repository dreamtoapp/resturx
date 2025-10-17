"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateCompany } from '../../actions/updateCompany';

interface CompanyInfoSettingsFormProps {
  company: any;
}

export default function CompanyInfoSettingsForm({ company }: CompanyInfoSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const data = {
        fullName: formData.get('fullName') as string,
        website: formData.get('website') as string,
        email: formData.get('email') as string,
        phoneNumber: formData.get('phoneNumber') as string,
      };

      const result = await updateCompany(data);
      if (result.success) {
        toast.success('تم تحديث معلومات الشركة بنجاح');
      } else {
        toast.error('فشل في تحديث معلومات الشركة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث معلومات الشركة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الشركة</CardTitle>
        <CardDescription>
          اسم الشركة سيتم استخدامه كاسم المتجر في الرسائل الإلكترونية والعلامة التجارية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">اسم الشركة</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="اسم الشركة"
              defaultValue={company?.fullName || ''}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              سيتم استخدام هذا الاسم كاسم المتجر في الرسائل الإلكترونية والعلامة التجارية
            </p>
          </div>

          <div>
            <Label htmlFor="website">رابط الموقع</Label>
            <Input
              id="website"
              name="website"
              placeholder="https://example.com"
              defaultValue={company?.website || ''}
            />
            <p className="text-sm text-muted-foreground mt-1">
              سيتم استخدام هذا الرابط كالرابط الأساسي للروابط في الرسائل الإلكترونية
            </p>
          </div>

          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="info@example.com"
              defaultValue={company?.email || ''}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+966501234567"
              defaultValue={company?.phoneNumber || ''}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
