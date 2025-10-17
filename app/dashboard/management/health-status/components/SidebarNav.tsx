"use client";

import Link from '@/components/link';
import { usePathname } from 'next/navigation';
import { Building2, MapPin, Share2, Palette, Scale, Settings, Check, X, Images, Truck } from 'lucide-react';

const links = [
  // Identity first
  { href: '/dashboard/management/health-status/setting/company-profile', label: 'معلومات المتجر', Icon: Building2 },
  { href: '/dashboard/management/health-status/setting/branding', label: 'صورة الشعار', Icon: Palette },
  { href: '/dashboard/management/health-status/setting/hero-image', label: 'صور الهيرو (Slider)', Icon: Images },
  { href: '/dashboard/management/health-status/setting/social-media', label: 'الروابط الاجتماعية', Icon: Share2 },
  // Platform configuration
  { href: '/dashboard/management/health-status/setting/shipping-rules', label: ' الشحن والتوصيل', Icon: Truck },

  // Operational details
  { href: '/dashboard/management/health-status/setting/location', label: 'الموقع والعنوان', Icon: MapPin },

  // Compliance last
  { href: '/dashboard/management/health-status/setting/compliance', label: 'معلومات  قانونية', Icon: Scale },
  { href: '/dashboard/management/health-status/setting/platform', label: 'إعدادات المتجر', Icon: Settings },
];

interface SidebarNavProps {
  sectionProgress?: {
    company: number;
    branding: number;
    hero: number;
    platform: number;
    location: number;
    social: number;
    compliance: number;
    shipping: number;
  };
}

const SidebarNav: React.FC<SidebarNavProps> = ({ sectionProgress }) => {
  const pathname = usePathname();

  return (
    <aside>
      <nav className="rounded-md border bg-secondary/20 p-2">
        <ul className="space-y-1">
          {links.map((item) => {
            const isActive = pathname === item.href;
            const className = isActive
              ? 'flex items-center rounded-md px-3 py-2 min-h-[44px] bg-muted text-foreground border-s-2 border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
              : 'flex items-center rounded-md px-3 py-2 min-h-[44px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
            const key = item.href.split('/').pop();
            const percent =
              key === 'company-profile' ? sectionProgress?.company :
                key === 'branding' ? sectionProgress?.branding :
                  key === 'hero-image' ? sectionProgress?.hero :
                    key === 'platform' ? sectionProgress?.platform :
                      key === 'location' ? sectionProgress?.location :
                        key === 'social-media' ? sectionProgress?.social :
                          key === 'compliance' ? sectionProgress?.compliance :
                            key === 'shipping-rules' ? sectionProgress?.shipping : undefined;
            return (
              <li key={item.href}>
                <Link href={item.href} className={className} aria-current={isActive ? 'page' : undefined} aria-label={item.label}>
                  <span className="inline-flex items-center w-full justify-between">
                    <span className="inline-flex items-center">
                      <item.Icon className="me-2 h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </span>
                    {typeof percent === 'number' && (
                      <span className="ms-2 inline-flex items-center">
                        {percent >= 100 ? (
                          <Check className="h-4 w-4 text-green-600" aria-label="مكتمل" />
                        ) : percent === 0 ? (
                          <X className="h-4 w-4 text-red-600" aria-label="غير مكتمل" />
                        ) : (
                          <span className="text-xs text-muted-foreground">{percent}%</span>
                        )}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarNav;

