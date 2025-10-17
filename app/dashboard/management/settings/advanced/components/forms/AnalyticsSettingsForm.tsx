"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

import { updateCompany } from '../../actions/updateCompany';

const GoogleSettingsSchema = z.object({
  gtmContainerId: z.string().trim().optional(),
  googleMapsApiKey: z.string().trim().optional(),
});

type GoogleSettingsForm = z.infer<typeof GoogleSettingsSchema>;

export default function AnalyticsSettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<GoogleSettingsForm>({
    resolver: zodResolver(GoogleSettingsSchema),
    defaultValues: {
      gtmContainerId: company?.gtmContainerId || '',
      googleMapsApiKey: company?.googleMapsApiKey || '',
    },
  });

  const onSubmit = async (values: GoogleSettingsForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );
      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ إعدادات جوجل بنجاح' });
      } else {
        await Swal.fire({ icon: 'error', title: 'تعذر الحفظ', text: result?.message || 'فشل في حفظ الإعدادات' });
      }
    } catch {
      await Swal.fire({ icon: 'error', title: 'خطأ غير متوقع', text: 'حدث خطأ غير متوقع، حاول مرة أخرى' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>إعدادات جوجل</CardTitle>
        <p className="text-sm text-muted-foreground">
          إعدادات خدمات جوجل المختلفة مثل التحليلات والخرائط. للتفاصيل راجع
          {' '}
          <a href="https://tagmanager.google.com/" className="underline underline-offset-2" target="_blank" rel="noreferrer">Google Tag Manager</a>
          {' '}و
          {' '}
          <a href="https://developers.google.com/maps" className="underline underline-offset-2" target="_blank" rel="noreferrer">Google Maps Platform</a>.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
            <Input id="googleMapsApiKey" placeholder="AIza..." {...register('googleMapsApiKey')} />
            <p className="text-xs text-muted-foreground">
              مفتاح API للخرائط والخدمات الجغرافية من Google Cloud Console.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gtmContainerId">GTM Container ID</Label>
            <Input id="gtmContainerId" placeholder="GTM-XXXXXXX" {...register('gtmContainerId')} />
            <p className="text-xs text-muted-foreground">
              استخدم معرّف الحاوية بالشكل GTM-XXXXXXX من Google Tag Manager.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving}>{isSaving ? 'جاري الحفظ...' : 'حفظ'}</Button>
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSaving}>إعادة تعيين</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


