import { Settings } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import PlatformSettingsForm from './components/PlatformSettingsForm';
import { fetchPlatform } from './actions/fetchPlatform';

export default async function PlatformPage() {
    // Fetch initial data on the server
    const initialData = await fetchPlatform();

    return (
        <HubSettingsLayout
            title="إعدادات المتجر"
            description="إدارة الإعدادات العامة للمتجر "
            icon={Settings}
        >
            <PlatformSettingsForm initialData={initialData} />
        </HubSettingsLayout>
    );
}