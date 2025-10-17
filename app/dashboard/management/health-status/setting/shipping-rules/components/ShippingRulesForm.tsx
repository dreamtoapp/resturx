"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Truck, DollarSign } from 'lucide-react';
import { saveShippingRules } from '../actions/saveShippingRules';
import { toast } from 'sonner';
import { useCurrency } from '@/store/currencyStore';
import { getCurrencySymbol } from '@/lib/formatCurrency';

interface ShippingRulesFormProps {
  initialValues: {
    id?: string;
    workingHours?: string;
    shippingFee?: number;
    minShipping?: number;
  };
}

export default function ShippingRulesForm({ initialValues }: ShippingRulesFormProps) {
  const { currency } = useCurrency();
  const currencySymbol = getCurrencySymbol(currency);

  const [values, setValues] = useState({
    workingHours: initialValues.workingHours ?? '',
    shippingFee: String(initialValues.shippingFee ?? ''),
    minShipping: String(initialValues.minShipping ?? ''),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveShippingRules({
        id: initialValues.id,
        ...values,
        shippingFee: Number(values.shippingFee) || 0,
        minShipping: Number(values.minShipping) || 0,
      });
      toast.success('تم حفظ قواعد الشحن والتوصيل بنجاح');
    } catch (_e) {
      toast.error('فشل حفظ قواعد الشحن والتوصيل');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Shipping Rules Hint */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-muted rounded-full">
            <Truck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">قواعد الشحن والتوصيل</h5>
            <p className="text-xs text-muted-foreground mb-3">
              حدد ساعات العمل وإعدادات التوصيل لمتجرك. هذه الإعدادات تؤثر على تجربة العملاء وتوقعات التوصيل.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                <span><strong>ساعات العمل:</strong> تظهر للعملاء متى يمكنهم الطلب ومتى سيتم التوصيل</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                <span><strong>رسوم التوصيل:</strong> المبلغ المطلوب للشحن (يمكن أن يكون صفر للتوصيل المجاني)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                <span><strong>حد التوصيل المجاني:</strong> الحد الأدنى للطلب للحصول على توصيل مجاني</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Business Hours */}
        <div className={`rounded-lg border p-4 transition-colors ${values.workingHours?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
          <label className="block text-sm font-medium text-foreground mb-2">ساعات العمل</label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <Input
              value={values.workingHours}
              onChange={(e) => setValues((p) => ({ ...p, workingHours: e.target.value }))}
              placeholder="مثال: من السبت إلى الخميس 9 صباحاً - 6 مساءً"
              className="text-right pr-12"
              dir="rtl"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Shipping Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Fee */}
          <div className={`rounded-lg border p-4 transition-colors ${values.shippingFee?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
            <label className="block text-sm font-medium text-foreground mb-2">رسوم التوصيل ({currencySymbol})</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <DollarSign className="w-5 h-5 text-foreground" />
              </div>
              <Input
                value={values.shippingFee}
                onChange={(e) => setValues((p) => ({ ...p, shippingFee: e.target.value }))}
                placeholder="مثال: 15"
                className="text-right pr-12"
                dir="rtl"
                disabled={isSubmitting}
                type="number"
              />
            </div>
          </div>

          {/* Free Shipping Threshold */}
          <div className={`rounded-lg border p-4 transition-colors ${values.minShipping?.trim() ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
            <label className="block text-sm font-medium text-foreground mb-2">حد التوصيل المجاني ({currencySymbol})</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <DollarSign className="w-5 h-5 text-foreground" />
              </div>
              <Input
                value={values.minShipping}
                onChange={(e) => setValues((p) => ({ ...p, minShipping: e.target.value }))}
                placeholder="مثال: 100"
                className="text-right pr-12"
                dir="rtl"
                disabled={isSubmitting}
                type="number"
              />
            </div>
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
            'حفظ الإعدادات'
          )}
        </Button>
      </div>
    </div>
  );
}




