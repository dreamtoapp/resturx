import { Image as ImageIcon } from 'lucide-react';
import HubSettingsLayout from '../../components/HubSettingsLayout';
import HeroImageForm from './components/HeroImageForm';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export default async function HeroImagePage() {
  const company = await fetchCompany();
  const total = 1;
  const current = company?.profilePicture ? 1 : 0;
  const progress = { current, total, isComplete: current === total };
  const initialSlides = (Array.isArray((company as any)?.heroSlides) && (company as any).heroSlides.length > 0)
    ? (company as any).heroSlides as Array<{ url: string; publicId?: string }>
    : (Array.isArray((company as any)?.heroImages) ? (company as any).heroImages.map((url: string) => ({ url })) : []);

  return (
    <HubSettingsLayout
      title="صورة الهيرو"
      description="إدارة صورة الهيرو الرئيسية للمتجر"
      icon={ImageIcon}
      progress={progress}
    >
      <HeroImageForm initialUrl={company?.profilePicture} companyId={company?.id} initialSlides={initialSlides} />
      {/* Slider preview will appear on homepage when showHeroImage/useHeroSlider are enabled in platform settings */}
    </HubSettingsLayout>
  );
}


