import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import db from '@/lib/prisma';
import AppVersion from '../AppVersion';
import NewsletterClientWrapper from './NewsletterClientWrapper';
import BadgeDialog from './BadgeDialog';
import WhatsAppButton from '@/components/WhatsAppButton';
import Image from 'next/image';
import FacebookIcon from '@/components/icons/FacebookIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';
import SnapchatIcon from '@/components/icons/SnapchatIcon';

interface FooterProps {
  aboutus?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  address?: string;
  companyName?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  snapchat?: string;
  productCount?: number | string;
  clientCount?: number | string;
  userId?: string;
  workingHours?: string;
  showStoreLocation?: boolean;
  latitude?: string;
  longitude?: string;
  showProductCount?: boolean;
  showCustomerCount?: boolean;
  showVision2030?: boolean;
}

// Company Header Component
function CompanyHeader({ companyName }: { companyName?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
        <Icon name="Building2" className="h-6 w-6 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-100">
          {companyName || 'Dream To App'}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          فرعنا الالكتروني لتوفير المنتجات المميزة
        </p>
      </div>
    </div>
  );
}

// Company Description Component
function CompanyDescription({ aboutus }: { aboutus?: string }) {
  return (
    <p className="text-sm text-slate-400 leading-relaxed">
      {aboutus || 'نحن شركة متخصصة في تقديم أفضل المنتجات والخدمات لعملائنا الكرام.'}
    </p>
  );
}

// Trust Badges Component
function TrustBadges() {
  return (
    <div className="flex gap-2">
      <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-300 border-slate-700">
        <Icon name="Award" className="h-3 w-3 ml-1" />
        جودة مضمونة
      </Badge>
      <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-300 border-slate-700">
        <Icon name="Truck" className="h-3 w-3 ml-1" />
        توصيل سريع
      </Badge>
    </div>
  );
}

// Company Statistics Component
function CompanyStats({
  productCount,
  clientCount,
  workingHours,
  showProductCount,
  showCustomerCount
}: {
  productCount?: number | string;
  clientCount?: number | string;
  workingHours?: string;
  showProductCount?: boolean;
  showCustomerCount?: boolean;
}) {
  // Calculate grid columns based on what's visible
  const visibleItems = [
    showProductCount,
    showCustomerCount,
    true // working hours always visible
  ].filter(Boolean).length;

  return (
    <div className={`grid gap-4 pt-4 border-t border-slate-700 ${visibleItems === 1 ? 'grid-cols-1' : visibleItems === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {showProductCount && (
        <div className="text-center">
          <div className="text-lg font-bold text-slate-100">
            {productCount ?? '...'}
          </div>
          <div className="text-xs text-slate-400">منتج</div>
        </div>
      )}
      {showCustomerCount && (
        <div className="text-center">
          <div className="text-lg font-bold text-slate-100">
            {clientCount ?? '...'}
          </div>
          <div className="text-xs text-slate-400">عميل راضي</div>
        </div>
      )}
      {/* Working hours always visible */}
      <div className="text-center">
        <div className="text-lg font-bold text-slate-100">{workingHours ?? '24/7'}</div>
        <div className="text-xs text-slate-400">م.التوصيل</div>
      </div>
    </div>
  );
}

// Social Media Section Component
function SocialMediaSection({
  facebook,
  instagram,
  twitter,
  linkedin,
  tiktok,
  snapchat
}: {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  snapchat?: string;
}) {
  // Force recompilation for desktop cache fix
  return (
    <div className="pt-4 border-t border-slate-700">
      <h4 className="text-sm font-medium text-slate-200 mb-3">تابعنا على</h4>
      <div className="flex gap-3 flex-wrap">
        {facebook && (
          <Link
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center hover:bg-blue-600/20 transition-colors"
            aria-label="Facebook"
          >
            <FacebookIcon size={20} className="text-blue-600" />
          </Link>
        )}
        {instagram && (
          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center hover:bg-pink-500/20 transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon size={20} className="text-pink-500" />
          </Link>
        )}
        {twitter && (
          <Link
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-blue-400/10 flex items-center justify-center hover:bg-blue-400/20 transition-colors"
            aria-label="Twitter"
          >
            <TwitterIcon size={20} className="text-blue-400" />
          </Link>
        )}
        {linkedin && (
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-blue-700/10 flex items-center justify-center hover:bg-blue-700/20 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={20} className="text-blue-700" />
          </Link>
        )}
        {tiktok && (
          <Link
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
            aria-label="TikTok"
          >
            <TikTokIcon size={20} className="text-foreground" />
          </Link>
        )}
        {snapchat && (
          <Link
            href={snapchat}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center hover:bg-yellow-500/20 transition-colors"
            aria-label="Snapchat"
          >
            <SnapchatIcon size={20} className="text-yellow-500" />
          </Link>
        )}
      </div>
    </div>
  );
}

// Main Company Info Component
function CompanyInfo({
  aboutus,
  companyName,
  productCount,
  clientCount,
  workingHours,
  facebook,
  instagram,
  twitter,
  linkedin,
  tiktok,
  snapchat,
  showProductCount,
  showCustomerCount
}: {
  aboutus?: string;
  companyName?: string;
  productCount?: number | string;
  clientCount?: number | string;
  workingHours?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  snapchat?: string;
  showProductCount?: boolean;
  showCustomerCount?: boolean;
}) {
  return (
    <div className="space-y-6">
      <CompanyHeader companyName={companyName} />
      <CompanyDescription aboutus={aboutus} />
      <TrustBadges />
      <CompanyStats
        productCount={productCount}
        clientCount={clientCount}
        workingHours={workingHours}
        showProductCount={showProductCount}
        showCustomerCount={showCustomerCount}
      />
      <SocialMediaSection
        facebook={facebook}
        instagram={instagram}
        twitter={twitter}
        linkedin={linkedin}
        tiktok={tiktok}
        snapchat={snapchat}
      />
    </div>
  );
}

// Service Link Component
function ServiceLink({ service }: { service: { name: string; href: string; iconName: string } }) {
  return (
    <li>
      <Link
        href={service.href}
        className="flex items-center gap-3 text-sm text-slate-400 hover:text-slate-100 transition-colors duration-200 py-1"
        aria-label={`${service.name} - ${service.href}`}
      >
        <Icon name={service.iconName} className="h-4 w-4 text-blue-400 flex-shrink-0" />
        {service.name}
      </Link>
    </li>
  );
}

// Main Services List Component
function MainServicesList({ userId }: { userId?: string }) {
  const services = [
    { name: 'المتجر الإلكتروني', href: '/', iconName: 'ShoppingBag' },
    { name: 'من نحن', href: '/about', iconName: 'Users' },
    { name: 'تواصل معنا', href: '/contact', iconName: 'Phone' },
    { name: 'الدعم الفني', href: '/contact', iconName: 'Headset' },
    { name: 'المفضلة', href: userId ? `/user/wishlist/${userId}` : '/auth/login?redirect=/user/wishlist', iconName: 'Heart' },
    { name: 'التقييمات', href: '/user/ratings', iconName: 'Star' },
    { name: 'الطلبات', href: '/user/purchase-history', iconName: 'Package' },
  ];

  return (
    <ul className="space-y-3">
      {services.map((service) => (
        <ServiceLink key={service.name} service={service} />
      ))}
    </ul>
  );
}

// Main Services Section Component
async function ServicesSection({ userId }: { userId?: string }) {
  return (
    <div className="space-y-6">
      <MainServicesList userId={userId} />
    </div>
  );
}

function ContactSection({
  email,
  phone,
  whatsappNumber,
  address,
  showStoreLocation,
  latitude,
  longitude
}: {
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  address?: string;
  showStoreLocation?: boolean;
  latitude?: string;
  longitude?: string;
}) {
  return (
    <div className="space-y-4">
      {email && (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Icon name="Mail" className="h-4 w-4 text-blue-400" />
          </div>
          <a
            href={`mailto:${email}`}
            className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            {email}
          </a>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Icon name="Phone" className="h-4 w-4 text-blue-400" />
          </div>
          <a
            href={`tel:${phone}`}
            className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            {phone}
          </a>
        </div>
      )}
      {whatsappNumber && (
        <WhatsAppButton
          phone={whatsappNumber}
          buttonVariant="footer"
        />
      )}
      {showStoreLocation && address && (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5">
              <Icon name="MapPin" className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400 leading-relaxed">
              {address}
            </span>
          </div>
          {latitude && longitude && (
            <div className="mr-11">
              <Link
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Icon name="MapPin" className="h-3 w-3" />
                عرض على الخريطة
                <Icon name="ExternalLink" className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Footer Main Content Component
function FooterMainContent({
  aboutus,
  email,
  phone,
  whatsappNumber,
  address,
  facebook,
  instagram,
  twitter,
  linkedin,
  tiktok,
  snapchat,
  companyName,
  productCount,
  clientCount,
  userId,
  workingHours,
  showStoreLocation,
  latitude,
  longitude,
  showProductCount,
  showCustomerCount
}: FooterProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <section aria-labelledby="company-heading" className="space-y-6">
          <h3 id="company-heading" className="sr-only">Company Information</h3>
          <CompanyInfo
            aboutus={aboutus}
            companyName={companyName}
            productCount={productCount}
            clientCount={clientCount}
            workingHours={workingHours}
            facebook={facebook}
            instagram={instagram}
            twitter={twitter}
            linkedin={linkedin}
            tiktok={tiktok}
            snapchat={snapchat}
            showProductCount={showProductCount}
            showCustomerCount={showCustomerCount}
          />
        </section>

        <nav aria-labelledby="services-heading" className="space-y-6">
          <h3 id="services-heading" className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Icon name="Globe" className="h-5 w-5 text-blue-400" />
            خدماتنا
          </h3>
          <ServicesSection userId={userId} />
        </nav>

        <section aria-labelledby="contact-heading" className="space-y-6">
          <h3 id="contact-heading" className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Icon name="MapPin" className="h-5 w-5 text-blue-400" />
            تواصل معنا
          </h3>
          <ContactSection
            email={email}
            phone={phone}
            whatsappNumber={whatsappNumber}
            address={address}
            showStoreLocation={showStoreLocation}
            latitude={latitude}
            longitude={longitude}
          />
          <NewsletterClientWrapper />
        </section>
      </div>
    </div>
  );
}

// Footer Copyright Component
function FooterCopyright() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <AppVersion />
        <div className="text-sm text-slate-400 mt-2">
          © 2024{' '}
          <Link
            href="https://dreamto.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors"
          >
            Dream To App
          </Link>
          . جميع الحقوق محفوظة.
        </div>
      </div>
      <div className="text-sm text-slate-400 text-center sm:text-right">
        صُنع بـ ❤️ في المملكة العربية السعودية
      </div>
    </div>
  );
}

// Footer Compliance Badges Component
function FooterComplianceBadges({ compliance, showVision2030 }: { compliance: any; showVision2030?: boolean }) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
        {compliance?.saudiBusinessId && (
          <BadgeDialog
            src="/assets/sa_busnees.avif"
            alt="Saudi Business"
            width={96}
            height={36}
            title="المركز السعودي للاعمال"
            qrPayload={compliance.saudiBusinessId}
          />
        )}
        {compliance?.commercialRegistrationNumber && (
          <BadgeDialog
            src="/assets/cr.avif"
            alt="Commercial Registration"
            width={96}
            height={36}
            title="السجل التجاري"
            qrPayload={compliance.commercialRegistrationNumber}
          />
        )}
        {compliance?.taxNumber && (
          <BadgeDialog
            src="/assets/Vat.svg"
            alt="VAT"
            width={80}
            height={36}
            title="الرقم الضريبي"
            qrPayload={compliance.taxNumber}
          />
        )}
        {showVision2030 && (
          <Link
            href="https://www.vision2030.gov.sa/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/assets/visionlogo.svg"
              alt="Saudi Vision 2030"
              width={108}
              height={36}
              className="h-7 w-auto"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

// Footer Bottom Section Component
function FooterBottomSection({ compliance, showVision2030 }: { compliance: any; showVision2030?: boolean }) {
  return (
    <div className="bg-slate-800/50 py-6">
      <div className="container mx-auto px-4">
        <FooterCopyright />
        <FooterComplianceBadges compliance={compliance} showVision2030={showVision2030} />
      </div>
    </div>
  );
}

// JSON-LD Structured Data Component
function FooterStructuredData({
  companyName,
  aboutus,
  phone,
  facebook,
  instagram,
  twitter,
  linkedin
}: {
  companyName?: string;
  aboutus?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": companyName || "Dream To App",
          "description": aboutus || "نحن شركة متخصصة في تقديم أفضل المنتجات والخدمات لعملائنا الكرام.",
          "url": "https://dreamto.app",
          "logo": "https://dreamto.app/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": phone,
            "contactType": "customer service",
            "availableLanguage": "Arabic"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "SA",
            "addressLocality": "المملكة العربية السعودية"
          },
          "sameAs": [
            facebook && `https://facebook.com/${facebook}`,
            instagram && `https://instagram.com/${instagram}`,
            twitter && `https://twitter.com/${twitter}`,
            linkedin && `https://linkedin.com/company/${linkedin}`
          ].filter(Boolean)
        })
      }}
    />
  );
}

// Main Footer Component
const Footer = async ({
  aboutus,
  email,
  phone,
  whatsappNumber,
  address,
  facebook,
  instagram,
  twitter,
  linkedin,
  tiktok,
  snapchat,
  companyName,
  productCount,
  clientCount,
  userId,
  workingHours,
  showStoreLocation,
  latitude,
  longitude,
  showProductCount,
  showCustomerCount,
  showVision2030
}: FooterProps) => {

  const compliance = await db.company.findFirst({
    select: { taxNumber: true, commercialRegistrationNumber: true, saudiBusinessId: true }
  });

  return (
    <footer role="contentinfo" aria-label="Site footer" className="bg-slate-900 text-slate-100 border-t border-slate-700 pb-20 sm:pb-0">
      <FooterMainContent
        aboutus={aboutus}
        email={email}
        phone={phone}
        whatsappNumber={whatsappNumber}
        address={address}
        facebook={facebook}
        instagram={instagram}
        twitter={twitter}
        linkedin={linkedin}
        tiktok={tiktok}
        snapchat={snapchat}
        companyName={companyName}
        productCount={productCount}
        clientCount={clientCount}
        userId={userId}
        workingHours={workingHours}
        showStoreLocation={showStoreLocation}
        latitude={latitude}
        longitude={longitude}
        showProductCount={showProductCount}
        showCustomerCount={showCustomerCount}
      />

      <Separator className="border-slate-700" />

      <FooterBottomSection compliance={compliance} showVision2030={showVision2030} />

      <FooterStructuredData
        companyName={companyName}
        aboutus={aboutus}
        phone={phone}
        facebook={facebook}
        instagram={instagram}
        twitter={twitter}
        linkedin={linkedin}
      />
    </footer>
  );
};

export default Footer;
