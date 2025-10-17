import { Image as ImageIcon } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import BrandingForm from './components/BrandingForm';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export default async function BrandingPage() {
    const company = await fetchCompany();
    const total = 1; // Only logo for now
    const current = company?.logo ? 1 : 0;
    const progress = { current, total, isComplete: current === total };

    return (
        <HubSettingsLayout
            title="شعار المتجر"
            description="صورة الشعار"
            icon={ImageIcon}
            progress={progress}
        >
            <BrandingForm initialUrl={company?.logo} companyId={company?.id} />
        </HubSettingsLayout>
    );
}

// Removed legacy client implementation; server page above provides initial data and renders client form.