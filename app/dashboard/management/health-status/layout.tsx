import HeaderLink from './components/HeaderLink';
import SidebarNav from './components/SidebarNav';
import { getCompanyDataStatus } from './actions/getCompanyDataStatus';
import { getProgress as getCompanyProgress } from './setting/company-profile/actions/getProgress';
import { getProgress as getLocationProgress } from './setting/location/actions/getProgress';
import { getProgress as getSocialProgress } from './setting/social-media/actions/getProgress';
import { getProgress as getComplianceProgress } from './setting/compliance/actions/getProgress';
import { getProgress as getShippingProgress } from './setting/shipping-rules/actions/getProgress';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export default async function HealthStatusLayout({ children }: { children: React.ReactNode }) {
  const companyDataStatus = await getCompanyDataStatus();
  const company = await fetchCompany();
  const [companyProgress, location, social, compliance, shipping] = await Promise.all([
    getCompanyProgress(),
    getLocationProgress(),
    getSocialProgress(),
    getComplianceProgress(),
    getShippingProgress(),
  ]);
  const sectionProgress = {
    company: companyProgress.percent,
    branding: company?.logo ? 100 : 0,
    hero: company?.profilePicture ? 100 : 0,
    platform: 100, // Platform settings are boolean toggles, always consider complete
    location: location.percent,
    social: social.percent,
    compliance: compliance.percent,
    shipping: shipping.percent,
  } as const;

  return (
    <div className="px-6 pt-2 pb-6" dir="rtl">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-2">
            <HeaderLink status={companyDataStatus} />
            <SidebarNav sectionProgress={sectionProgress} />
          </div>
        </aside>
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}


