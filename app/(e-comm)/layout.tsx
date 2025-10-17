import Footer from './homepage/component/Fotter/Fotter';
import HeaderUnified from './homepage/component/Header/HeaderUnified.server';
import CustomMobileBottomNav from './homepage/component/Header/CustomMobileBottomNav';
import { fetchEcommLayoutData } from './helpers/layoutData';
import FilterAlert from '@/components/FilterAlert';
import RealtimeNotificationListener from './(adminPage)/user/notifications/components/RealtimeNotificationListener';
import { CurrencyInitializer } from '@/components/CurrencyInitializer';
// import NotificationTest from '@/app/components/NotificationTest';

// SEO helpers
import { buildMetadata } from '@/helpers/seo/metadata';
import { buildOrganizationJsonLd } from '@/helpers/seo/jsonld/organization';
import { buildWebsiteJsonLd } from '@/helpers/seo/jsonld/website';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildMetadata({});
  return meta;
}

export default async function EcommerceLayout({ children }: { children: React.ReactNode }) {
  try {
    const {
      companyData,
      session,

      userSummary,
      notificationCount,
      alerts,

      productCount,
      clientCount,
    } = await fetchEcommLayoutData();
    const typedCompanyData = companyData as any;

    // JSON-LD (Organization & WebSite)
    const orgJsonLd = await buildOrganizationJsonLd();
    const siteJsonLd = await buildWebsiteJsonLd();

    return (
      <div className="flex flex-col min-h-screen">
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <HeaderUnified
          user={userSummary}
          unreadCount={notificationCount}
          defaultAlerts={alerts}
          logo={typedCompanyData?.logo || ''}
          logoAlt={typedCompanyData?.fullName || 'Dream to app'}
          isLoggedIn={!!session}
          whatsappNumber={typedCompanyData?.whatsappNumber}
        />
        <FilterAlert />
        <CustomMobileBottomNav whatsappNumber={typedCompanyData?.whatsappNumber} />
        {/* Currency initializer - initialize currency store with company default */}
        <CurrencyInitializer currency={typedCompanyData?.defaultCurrency || 'SAR'} />
        {/* Real-time notification listener - only for logged-in users */}
        {session && <RealtimeNotificationListener />}
        {/* Test component for notifications - DEVELOPMENT ONLY */}
        {/* {process.env.NODE_ENV === 'development' && <NotificationTest />} */}
        <main className='flex-grow'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-18 md:pt-20 pb-8'>
            {children}
          </div>
        </main>
        <Footer
          companyName={typedCompanyData?.fullName}
          aboutus={typedCompanyData?.bio}
          email={typedCompanyData?.email}
          phone={typedCompanyData?.phoneNumber}
          whatsappNumber={typedCompanyData?.whatsappNumber}
          address={typedCompanyData?.address}
          facebook={typedCompanyData?.facebook}
          instagram={typedCompanyData?.instagram}
          twitter={typedCompanyData?.twitter}
          linkedin={typedCompanyData?.linkedin}
          tiktok={typedCompanyData?.tiktok}
          snapchat={typedCompanyData?.snapchat}
          productCount={productCount}
          clientCount={clientCount}
          userId={userSummary?.id}
          workingHours={typedCompanyData?.workingHours}
          showStoreLocation={typedCompanyData?.showStoreLocation}
          latitude={typedCompanyData?.latitude}
          longitude={typedCompanyData?.longitude}
          showProductCount={typedCompanyData?.showProductCount}
          showCustomerCount={typedCompanyData?.showCustomerCount}
          showVision2030={typedCompanyData?.showVision2030}
        />
      </div>
    );
  } catch (e) {
    return <div>حدث خطأ أثناء تحميل الصفحة. الرجاء المحاولة لاحقًا.</div>;
  }
}
