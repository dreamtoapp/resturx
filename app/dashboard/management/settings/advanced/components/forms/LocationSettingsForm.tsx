"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateCompany } from '../../actions/updateCompany';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LocationSettingsFormProps {
  company?: {
    requireLocation?: boolean;
  };
}

export default function LocationSettingsForm({ company }: LocationSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [requireLocation, setRequireLocation] = useState<boolean>(company?.requireLocation ?? true);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const result = await updateCompany({ requireLocation });
      if (result?.success) toast.success('تم حفظ إعدادات الموقع');
      else toast.error(result?.message || 'فشل في حفظ الإعدادات');
    } catch (err) {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-2 p-3 border rounded-lg bg-card/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="requireLocation" className="text-base font-medium">إلزام تحديد الموقع بدقة</Label>
            <p className="text-sm text-muted-foreground">عند التفعيل: يتطلب إحداثيات العنوان (خط الطول/العرض) في إتمام الشراء.</p>
          </div>
          <Switch id="requireLocation" checked={requireLocation} onCheckedChange={setRequireLocation} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => setRequireLocation(company?.requireLocation ?? true)} disabled={isSaving}>
          إعادة تعيين
        </Button>
        <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90">
          {isSaving ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> جاري الحفظ...</>) : 'حفظ'}
        </Button>
      </div>
    </form>
  );
}


