import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import { Building2 } from 'lucide-react';
import CompanyProfileForm from './components/CompanyProfileForm';
import { fetchCompany } from './actions/fetchCompany';

export default async function CompanyProfilePage() {
    const company = await fetchCompany();
    const total = 3;
    const current = [company?.fullName, company?.email, company?.phoneNumber].filter(Boolean).length;
    const progress = { current, total, isComplete: current === total };

    return (
        <HubSettingsLayout
            title="معلومات المتجر"
            description="إدارة المعلومات الأساسية للمتجر"
            icon={Building2}
            progress={progress}
        >
            <CompanyProfileForm company={company || undefined} />
        </HubSettingsLayout>
    );
}