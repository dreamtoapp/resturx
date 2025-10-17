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

interface NotificationSettingsProps {
  formData: PlatformData;
  onChange: (field: keyof PlatformData, value: boolean) => void;
}

export function NotificationSettings({ formData, onChange }: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Bell" size="sm" />
          إعدادات الإشعارات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckboxField
          label="إشعارات البريد الإلكتروني"
          description="استلام إشعارات عبر البريد الإلكتروني"
          checked={formData.emailNotifications}
          onChange={(checked) => onChange('emailNotifications', checked)}
        />
      </CardContent>
    </Card>
  );
}




