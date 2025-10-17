'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';
import { useCurrency } from '@/store/currencyStore';
import { getCurrencySymbol } from '@/lib/formatCurrency';

interface ShippingPolicy {
  id?: string;
  title: string;
  content: string;
  isActive: boolean;
  isPublished: boolean;
  version: number;
}

export default function ShippingPolicyPage() {
  const { currency } = useCurrency();
  const currencySymbol = getCurrencySymbol(currency);

  const getDefaultTemplate = useCallback(() => {
    const currentDate = new Date().toLocaleDateString('ar-SA');
    return `سياسة الشحن والتوصيل

مرحباً بكم في [اسم المتجر]. نحن نلتزم بتوفير خدمة شحن سريعة وموثوقة لجميع عملائنا في المملكة العربية السعودية. تشرح هذه السياسة تفاصيل خدمات الشحن والتوصيل التي نقدمها.

1. مقدمة
   نحن [اسم المتجر]، شركة مسجلة في المملكة العربية السعودية برقم السجل التجاري [رقم السجل التجاري]، ومقرها الرئيسي في [العنوان]. نتعاون مع أفضل شركات الشحن لتوفير خدمة توصيل ممتازة.

2. مناطق التوصيل
   نوفر خدمة التوصيل في:
   • جميع مدن المملكة العربية السعودية
   • المناطق الحضرية والريفية
   • الجزر والمناطق النائية (رسوم إضافية)
   • المناطق الصناعية والتجارية
   • الجامعات والمستشفيات والمراكز الحكومية

3. طرق الشحن المتاحة
   نوفر عدة خيارات للشحن:
   • التوصيل السريع (1-2 يوم عمل): 50 ${currencySymbol}
   • التوصيل العادي (3-5 أيام عمل): 25 ${currencySymbol}
   • التوصيل الاقتصادي (5-7 أيام عمل): 15 ${currencySymbol}
   • التوصيل المجاني: للطلبات فوق 200 ${currencySymbol}
   • التوصيل في نفس اليوم: 100 ${currencySymbol} (في المدن الرئيسية)

4. شركات الشحن المعتمدة
   نتعاون مع شركات شحن موثوقة:
   • البريد السعودي (Saudi Post)
   • أرامكس (Aramex)
   • دي إتش إل (DHL)
   • فيديكس (FedEx)
   • يو بي إس (UPS)
   • شركات الشحن المحلية المعتمدة

5. وقت المعالجة
   • الطلبات العادية: 1-2 يوم عمل
   • الطلبات المخصصة: 3-5 أيام عمل
   • الطلبات الموسمية: قد تستغرق وقتاً أطول

6. رسوم الشحن الإضافية
   قد تطبق رسوم إضافية في الحالات التالية:
   • المناطق النائية: 30 ${currencySymbol} إضافي
   • الشحن في العطل الرسمية: 50 ${currencySymbol}
   • الشحن السريع خارج المدن الرئيسية: 75 ${currencySymbol}
   • إعادة المحاولة: 15 ${currencySymbol}
   • تغيير العنوان: 20 ${currencySymbol}

7. الشحن الدولي
   نقدم خدمة الشحن الدولي إلى الدول المجاورة:
   • دول الخليج العربي
   • دول الشرق الأوسط
   • دول شمال أفريقيا
   رسوم الشحن الدولي تبدأ من 150 ${currencySymbol} حسب الوجهة.

8. تتبع الشحن
   يمكنك تتبع طلبك من خلال:
   • رقم التتبع المرسل عبر الرسائل النصية
   • الموقع الإلكتروني
   • تطبيق الهاتف المحمول
   • خدمة العملاء

9. سياسة الإرجاع والاستبدال
   • يمكن إرجاع المنتجات خلال 14 يوم من تاريخ الاستلام
   • يجب أن تكون المنتجات في حالتها الأصلية
   • رسوم الإرجاع: 25 ${currencySymbol}
   • الاستبدال مجاني خلال 7 أيام

10. التأخير في التوصيل
    في حالة التأخير في التوصيل:
    • محاولة ثانية مجانية
    • إشعار فوري للعميل
    • تعويض مناسب حسب الحالة
    • محاولة ثالثة برسوم 15 ${currencySymbol}

11. الشحن المجاني
    • للطلبات التي تزيد عن 200 ${currencySymbol}
    • لا يشمل الطلبات المخصصة
    • لا يشمل الشحن الدولي
    • لا يشمل الشحن السريع في بعض المناطق

12. خدمة العملاء
    فريق خدمة العملاء متاح:
    • من السبت إلى الخميس: 8:00 ص - 10:00 م
    • الجمعة: 2:00 م - 10:00 م
    • عبر الهاتف والواتساب والبريد الإلكتروني

13. التحديثات
    نحتفظ بالحق في تحديث سياسة الشحن في أي وقت. سيتم إشعار العملاء بالتغييرات المهمة.

14. التواصل معنا
    للاستفسارات حول الشحن:
    • الهاتف: +966 XX XXX XXXX
    • البريد الإلكتروني: shipping@company.com
    • الواتساب: +966 XX XXX XXXX

15. ملاحظات مهمة
    • يرجى التأكد من صحة العنوان قبل تأكيد الطلب
    • في حالة عدم وجود المستلم، سيتم إعادة المحاولة
    • الطلبات المدفوعة مقدماً تحظى بالأولوية
    • استطلاعات رضا العملاء

آخر تحديث: ${currentDate}`;
  }, [currencySymbol]);

  const [policy, setPolicy] = useState<ShippingPolicy>({
    title: 'سياسة الشحن',
    content: '',
    isActive: true,
    isPublished: false,
    version: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadPolicy = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/policies/shipping');
      if (response.ok) {
        const data = await response.json();
        setPolicy(data);
      } else {
        // If no policy exists, use default template
        setPolicy(prev => ({ ...prev, content: getDefaultTemplate() }));
      }
    } catch (error) {
      console.error('Error loading policy:', error);
      toast.error('حدث خطأ في تحميل السياسة');
    } finally {
      setIsLoading(false);
    }
  }, [getDefaultTemplate]);

  useEffect(() => {
    loadPolicy();
  }, [loadPolicy]);

  const savePolicy = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/policies/shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policy),
      });

      if (response.ok) {
        toast.success('تم حفظ السياسة بنجاح');
      } else {
        throw new Error('Failed to save policy');
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      toast.error('حدث خطأ في حفظ السياسة');
    } finally {
      setIsSaving(false);
    }
  };

  const publishPolicy = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/policies/shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...policy, isPublished: true }),
      });

      if (response.ok) {
        setPolicy(prev => ({ ...prev, isPublished: true }));
        toast.success('تم نشر السياسة بنجاح');
      } else {
        throw new Error('Failed to publish policy');
      }
    } catch (error) {
      console.error('Error publishing policy:', error);
      toast.error('حدث خطأ في نشر السياسة');
    } finally {
      setIsSaving(false);
    }
  };

  const loadTemplate = () => {
    setPolicy(prev => ({ ...prev, content: getDefaultTemplate() }));
    toast.success('تم تحميل القالب الافتراضي');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon name="Loader2" className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">سياسة الشحن</h1>
        <p className="text-muted-foreground">
          إدارة سياسة الشحن والتوصيل للمتجر
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="Truck" className="h-5 w-5" />
              سياسة الشحن والتوصيل
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={policy.isPublished ? 'default' : 'secondary'}>
                {policy.isPublished ? 'منشورة' : 'مسودة'}
              </Badge>
              <Badge variant={policy.isActive ? 'default' : 'destructive'}>
                {policy.isActive ? 'نشطة' : 'غير نشطة'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              عنوان السياسة
            </label>
            <input
              type="text"
              value={policy.title}
              onChange={(e) => setPolicy(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-md"
              placeholder="عنوان السياسة"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              محتوى السياسة
            </label>
            <Textarea
              value={policy.content}
              onChange={(e) => setPolicy(prev => ({ ...prev, content: e.target.value }))}
              placeholder="اكتب محتوى سياسة الشحن هنا..."
              className="min-h-[400px]"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={policy.isActive}
                onChange={(e) => setPolicy(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">تفعيل السياسة</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={loadTemplate} variant="outline">
              <Icon name="FileText" className="h-4 w-4 mr-2" />
              تحميل القالب الافتراضي
            </Button>
            <Button onClick={savePolicy} disabled={isSaving}>
              <Icon name="Save" className="h-4 w-4 mr-2" />
              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
            <Button onClick={publishPolicy} disabled={isSaving || policy.isPublished} variant="default">
              <Icon name="Send" className="h-4 w-4 mr-2" />
              {isSaving ? 'جاري النشر...' : 'نشر'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
