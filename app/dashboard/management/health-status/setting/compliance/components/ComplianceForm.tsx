"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Receipt, Percent, Building2, Hash } from 'lucide-react';
import { saveCompliance } from '../actions/saveCompliance';
import { toast } from 'sonner';

interface ComplianceFormProps {
  initialValues: {
    id?: string;
    taxNumber?: string;
    taxPercentage?: string | number;
    commercialRegistrationNumber?: string;
    saudiBusinessId?: string;
  };
}

export default function ComplianceForm({ initialValues }: ComplianceFormProps) {
  const [values, setValues] = useState({
    taxNumber: initialValues.taxNumber ?? '',
    taxPercentage: String(initialValues.taxPercentage ?? ''),
    commercialRegistrationNumber: initialValues.commercialRegistrationNumber ?? '',
    saudiBusinessId: initialValues.saudiBusinessId ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveCompliance({ id: initialValues.id, ...values });
      toast.success('تم حفظ بيانات الامتثال بنجاح');
    } catch (_e) {
      toast.error('فشل حفظ بيانات الامتثال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Legal Information Hint */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-muted rounded-full">
            <Receipt className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">المعلومات القانونية والضريبية</h5>
            <p className="text-xs text-muted-foreground mb-3">
              أدخل البيانات القانونية والضريبية المطلوبة لمتجرك. هذه المعلومات ضرورية للامتثال للقوانين المحلية والضريبية.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                <span><strong>الرقم الضريبي:</strong> مطلوب للامتثال لنظام ضريبة القيمة المضافة (VAT) وتجنب الغرامات</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                <span><strong>نسبة الضريبة:</strong> ضع 0 إذا كنت لا تحتاج لحساب الضريبة في الطلبات، أو أدخل النسبة المطلوبة (مثال: 15)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                <span><strong>رقم السجل التجاري:</strong> يثبت شرعية النشاط التجاري ويمنح الثقة للعملاء</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                <span><strong>منصة الأعمال السعودية:</strong> تمكن من الاستفادة من الخدمات الحكومية وتحسين الكفاءة التشغيلية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Tax Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tax Number */}
          <div className={`rounded-lg border p-4 transition-colors ${values.taxNumber?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
            <label className="block text-sm font-medium text-foreground mb-2">الرقم الضريبي</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Receipt className="w-5 h-5 text-foreground" />
              </div>
              <Input
                value={values.taxNumber}
                onChange={(e) => setValues((p) => ({ ...p, taxNumber: e.target.value }))}
                placeholder="أدخل الرقم الضريبي"
                className="text-right pr-12"
                dir="rtl"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">مطلوب للامتثال لنظام ضريبة القيمة المضافة (VAT) وتجنب الغرامات</p>
          </div>

          {/* Tax Percentage */}
          <div className={`rounded-lg border p-4 transition-colors ${values.taxPercentage?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
            <label className="block text-sm font-medium text-foreground mb-2">نسبة الضريبة (%)</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Percent className="w-5 h-5 text-foreground" />
              </div>
              <Input
                value={values.taxPercentage}
                onChange={(e) => setValues((p) => ({ ...p, taxPercentage: e.target.value }))}
                placeholder="0 (لا ضريبة) أو 15 (15%)"
                className="text-right pr-12"
                dir="rtl"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">ضع 0 إذا كنت لا تحتاج لحساب الضريبة في الطلبات، أو أدخل النسبة المطلوبة</p>
          </div>
        </div>

        {/* Business Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commercial Registration */}
          <div className={`rounded-lg border p-4 transition-colors ${values.commercialRegistrationNumber?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
            <label className="block text-sm font-medium text-foreground mb-2">رقم السجل التجاري</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Building2 className="w-5 h-5 text-foreground" />
              </div>
              <Input
                value={values.commercialRegistrationNumber}
                onChange={(e) => setValues((p) => ({ ...p, commercialRegistrationNumber: e.target.value }))}
                placeholder="رقم السجل التجاري"
                className="text-right pr-12"
                dir="rtl"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">يثبت شرعية النشاط التجاري ويمنح الثقة للعملاء</p>
          </div>

          {/* Saudi Business ID */}
          <div className={`rounded-lg border p-4 transition-colors ${values.saudiBusinessId?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
            <label className="block text-sm font-medium text-foreground mb-2">منصة الأعمال السعودية</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Hash className="w-5 h-5 text-foreground" />
              </div>
              <Input
                value={values.saudiBusinessId}
                onChange={(e) => setValues((p) => ({ ...p, saudiBusinessId: e.target.value }))}
                placeholder="رقم منصة الاعمال السعودية"
                className="text-right pr-12"
                dir="rtl"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">تمكن من الاستفادة من الخدمات الحكومية وتحسين الكفاءة التشغيلية</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            'حفظ البيانات'
          )}
        </Button>
      </div>
    </div>
  );
}
