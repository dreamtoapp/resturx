import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { CheckboxField } from './CheckboxField';

interface PlatformData {
  id?: string;
  showHeroImage: boolean;
  showStoreLocation: boolean;
  showCustomerCount: boolean;
  showProductCount: boolean;
  showVision2030: boolean;
  emailNotifications: boolean;
  defaultCurrency: string;
}

interface GeneralSettingsProps {
  formData: PlatformData;
  onChange: (field: keyof PlatformData, value: boolean) => void;
}

export function GeneralSettings({ formData, onChange }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Image" size="sm" />
          اعدادات عامة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckboxField
          label="عرض صورة الهيرو"
          description="إظهار عارض صور الهيرو (Slider) في الصفحة الرئيسية"
          checked={formData.showHeroImage}
          onChange={(checked) => onChange('showHeroImage', checked)}
        />
        <CheckboxField
          label="عرض موقع المتجر"
          description="إظهار موقع المتجر في الهيدر"
          checked={formData.showStoreLocation}
          onChange={(checked) => onChange('showStoreLocation', checked)}
        />
        <CheckboxField
          label="عرض عدد العملاء"
          description="إظهار عدد العملاء المسجلين في الموقع"
          checked={formData.showCustomerCount}
          onChange={(checked) => onChange('showCustomerCount', checked)}
        />
        <CheckboxField
          label="عرض عدد المنتجات"
          description="إظهار عدد المنتجات المتاحة في المتجر"
          checked={formData.showProductCount}
          onChange={(checked) => onChange('showProductCount', checked)}
        />
        <CheckboxField
          label="عرض رؤية 2030"
          description="إظهار شعار رؤية 2030 في الموقع والفواتير"
          checked={formData.showVision2030}
          onChange={(checked) => onChange('showVision2030', checked)}
        />
      </CardContent>
    </Card>
  );
}




