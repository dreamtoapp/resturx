import SettingsLayout from '../components/SettingsLayout';
import { Wrench } from 'lucide-react';
import { fetchCompany } from '../actions/fetchCompany';
import AdvancedSettingsClient from './components/AdvancedSettingsClient';

export default async function AdvancedSettingsPage() {
  const company = await fetchCompany();
  // Compute progress: count how many advanced fields are filled
  const fields: (keyof NonNullable<typeof company>)[] = [
    'cloudinaryCloudName', 'cloudinaryApiKey', 'cloudinaryApiSecret', 'cloudinaryUploadPreset', 'cloudinaryClientFolder',
    'whatsappPermanentToken', 'whatsappPhoneNumberId', 'whatsappApiVersion', 'whatsappBusinessAccountId', 'whatsappWebhookVerifyToken', 'whatsappAppSecret', 'whatsappNumber',
    'emailUser', 'emailPass', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFrom',
    'gtmContainerId', 'googleMapsApiKey',
    // Pusher & VAPID forms are hidden, exclude from progress calculation
    'authCallbackUrl'
  ];
  const total = fields.length;
  const current = fields.filter((f) => {
    const v = company?.[f as keyof typeof company];
    return typeof v === 'string' ? v.trim() !== '' : !!v;
  }).length;
  const isComplete = current === total;

  return (
    <SettingsLayout
      title="إعدادات متقدمة"
      description="إعدادات تكوين متقدمة للخدمات الخارجية"
      icon={Wrench}
      progress={{ current, total, isComplete }}
    >
      <AdvancedSettingsClient company={company || undefined} />
    </SettingsLayout>
  );
}


