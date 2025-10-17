import SettingsLayout from '../../components/SettingsLayout';
import { Eye } from 'lucide-react';
import { fetchCompany } from '../../actions/fetchCompany';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RefreshButton from './components/RefreshButton';

export default async function ConfigurationOverviewPage() {
  const company = await fetchCompany();

  const configurationFields = {
    company: {
      title: 'Company Information',
      fields: [
        { key: 'fullName', required: true, type: 'string' as const },
        { key: 'website', required: false, type: 'string' as const },
        { key: 'email', required: false, type: 'string' as const },
        { key: 'phoneNumber', required: false, type: 'string' as const }
      ]
    },
    media: {
      title: 'Media Services',
      fields: [
        { key: 'cloudinaryCloudName', required: true, type: 'string' as const },
        { key: 'cloudinaryApiKey', required: true, type: 'string' as const },
        { key: 'cloudinaryApiSecret', required: true, type: 'string' as const },
        { key: 'cloudinaryClientFolder', required: false, type: 'string' as const }
      ]
    },
    whatsapp: {
      title: 'WhatsApp',
      fields: [
        { key: 'whatsappPermanentToken', required: true, type: 'string' as const },
        { key: 'whatsappPhoneNumberId', required: true, type: 'string' as const },
        { key: 'whatsappApiVersion', required: false, type: 'string' as const },
        { key: 'whatsappBusinessAccountId', required: false, type: 'string' as const },
        { key: 'whatsappWebhookVerifyToken', required: false, type: 'string' as const },
        { key: 'whatsappAppSecret', required: false, type: 'string' as const },
        { key: 'whatsappEnvironment', required: false, type: 'string' as const },
        { key: 'requireWhatsappOtp', required: false, type: 'boolean' as const }
      ]
    },
    email: {
      title: 'Email',
      fields: [
        { key: 'emailUser', required: false, type: 'string' as const },
        { key: 'emailPass', required: false, type: 'string' as const },
        { key: 'smtpHost', required: false, type: 'string' as const },
        { key: 'smtpPort', required: false, type: 'string' as const },
        { key: 'smtpUser', required: false, type: 'string' as const },
        { key: 'smtpPass', required: false, type: 'string' as const },
        { key: 'smtpFrom', required: false, type: 'string' as const }
      ]
    },
    realtime: {
      title: 'Real-time Services',
      fields: [
        { key: 'pusherAppId', required: false, type: 'string' as const },
        { key: 'pusherKey', required: false, type: 'string' as const },
        { key: 'pusherSecret', required: false, type: 'string' as const },
        { key: 'pusherCluster', required: false, type: 'string' as const }
      ]
    },
    analytics: {
      title: 'Analytics',
      fields: [
        { key: 'gtmContainerId', required: false, type: 'string' as const }
      ]
    },
    auth: {
      title: 'Authentication',
      fields: [
        { key: 'authCallbackUrl', required: false, type: 'string' as const }
      ]
    }
  };

  const getFieldStatus = (field: any) => {
    const value = company?.[field.key as keyof typeof company];

    if (field.type === 'boolean') {
      return value !== undefined && value !== null ? 'CONFIGURED' : 'NOT_SET';
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return 'CONFIGURED';
    }

    if (field.required) {
      return 'MISSING';
    }

    return 'NOT_SET';
  };

  return (
    <SettingsLayout
      title="Configuration Overview"
      description="Technical status of system configuration"
      icon={Eye}
    >
      <div className="space-y-4">
        {/* Technical Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-mono">CONFIG_STATUS</h2>
            <p className="text-sm text-muted-foreground font-mono">Last updated: {new Date().toISOString()}</p>
          </div>
          <RefreshButton />
        </div>

        {/* Configuration Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(configurationFields).map(([categoryKey, category]) => (
            <Card key={categoryKey} className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-wide">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {category.fields.map((field) => {
                    const status = getFieldStatus(field);
                    return (
                      <div key={field.key} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-muted-foreground">{field.key}</span>
                        <div className="flex items-center space-x-2">
                          {field.required && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">REQ</Badge>
                          )}
                          <Badge
                            variant={
                              status === 'CONFIGURED' ? 'default' :
                                status === 'MISSING' ? 'destructive' :
                                  'secondary'
                            }
                            className="text-xs px-2 py-0"
                          >
                            {status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-mono uppercase tracking-wide mb-2">SUMMARY</h3>
          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-muted-foreground">TOTAL_FIELDS:</span>
              <span className="ml-2">{Object.values(configurationFields).reduce((acc, cat) => acc + cat.fields.length, 0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">REQUIRED_FIELDS:</span>
              <span className="ml-2">{Object.values(configurationFields).reduce((acc, cat) => acc + cat.fields.filter(f => f.required).length, 0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">STATUS:</span>
              <span className="ml-2">READY</span>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
