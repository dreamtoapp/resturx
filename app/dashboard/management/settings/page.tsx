import SettingsLayout from './components/SettingsLayout';
import { Building2, MapPin, Share2, Palette, ShieldCheck, Settings, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'معلومات المتجر',
      description: 'البيانات الأساسية للمتجر ومعلومات الاتصال',
      icon: Building2,
      href: '/dashboard/management/settings/company-profile',
      color: 'bg-blue-500',
    },
    {
      title: 'الموقع والعنوان',
      description: 'إدارة عناوين المتجر وفروعها',
      icon: MapPin,
      href: '/dashboard/management/settings/location',
      color: 'bg-green-500',
    },
    {
      title: 'الروابط الاجتماعية',
      description: 'إدارة حسابات التواصل الاجتماعي',
      icon: Share2,
      href: '/dashboard/management/settings/social-media',
      color: 'bg-purple-500',
    },
    {
      title: 'الشعار والهوية',
      description: 'إدارة الهوية البصرية للمتجر',
      icon: Palette,
      href: '/dashboard/management/settings/branding',
      color: 'bg-pink-500',
    },
    {
      title: 'الامتثال',
      description: 'إدارة الضرائب والتراخيص',
      icon: ShieldCheck,
      href: '/dashboard/management/settings/compliance',
      color: 'bg-red-500',
    },
    {
      title: 'إعدادات المنصة',
      description: 'إعدادات النظام الأساسية',
      icon: Settings,
      href: '/dashboard/management/settings/platform',
      color: 'bg-orange-500',
    },
    {
      title: 'الإعدادات المتقدمة',
      description: 'إعدادات متقدمة للخدمات الخارجية',
      icon: Wrench,
      href: '/dashboard/management/settings/advanced',
      color: 'bg-gray-500',
    },
  ];

  return (
    <SettingsLayout
      title="الإعدادات"
      description="إدارة جميع إعدادات المتجر"
      icon={Settings}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group block rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className={`rounded-lg p-3 ${section.color} text-white`}>
                <section.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SettingsLayout>
  );
}
