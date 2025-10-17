"use client";

import AddImage from '@/components/AddImage';

export default function BrandingForm({ initialUrl, companyId }: { initialUrl?: string; companyId?: string }) {
  return (
    <div className="space-y-8" dir="rtl">
      {/* Logo Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">الشعار</h3>
          <p className="text-sm text-muted-foreground">الشعار يمثل هوية متجرك ويظهر في جميع أنحاء المنصة</p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Logo Upload Area */}
          <div className="w-full max-w-sm">
            <div className="relative aspect-square w-full rounded-xl border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/5 hover:border-muted-foreground/40 transition-colors">
              <AddImage
                url={initialUrl}
                alt="شعار المتجر"
                className="w-full h-full object-contain"
                recordId={companyId || ''}
                table="company"
                tableField="logo"
                autoUpload={true}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="flex-1 space-y-4 min-w-[280px]">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">مواصفات الشعار المثلى</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>الأنواع المسموحة: PNG, JPG, WEBP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>الأبعاد الموصى بها: 200×200 بكسل (مربع)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>الحد الأقصى للحجم: 2MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>خلفية شفافة (PNG) للحصول على أفضل نتيجة</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-muted rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-1">نصائح للشعار المثالي</h5>
                  <p className="text-xs text-muted-foreground">استخدم شعارًا بسيطًا وواضحًا يمكن قراءته حتى في الأحجام الصغيرة. تجنب النصوص المعقدة والتفاصيل الدقيقة.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


