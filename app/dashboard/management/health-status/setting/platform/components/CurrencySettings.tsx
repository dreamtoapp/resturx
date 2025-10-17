import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';
import { SelectField } from './SelectField';

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

interface CurrencySettingsProps {
  formData: PlatformData;
  onChange: (field: keyof PlatformData, value: string) => void;
}

export function CurrencySettings({ formData, onChange }: CurrencySettingsProps) {
  const currencyOptions = [
    { value: 'SAR', label: 'ريال سعودي (SAR)' },
    { value: 'USD', label: 'دولار أمريكي (USD)' },
    { value: 'EGP', label: 'جنيه مصري (EGP)' },
    { value: 'AED', label: 'درهم إماراتي (AED)' },
  ];

  const getCurrencyDisplay = (currency: string) => {
    switch (currency) {
      case 'SAR': return 'ر.س 100';
      case 'USD': return '$100';
      case 'EGP': return 'ج.م 100';
      case 'AED': return 'د.إ 100';
      default: return 'ر.س 100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="DollarSign" size="sm" />
          العملة والإعدادات المحلية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SelectField
          label="العملة الافتراضية"
          description="العملة المستخدمة في المتجر"
          value={formData.defaultCurrency}
          onChange={(value) => onChange('defaultCurrency', value)}
          options={currencyOptions}
          placeholder="SAR"
        />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">تنسيق عرض العملة</Label>
            <p className="text-xs text-muted-foreground">كيفية عرض العملة في المنتجات</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {getCurrencyDisplay(formData.defaultCurrency)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




