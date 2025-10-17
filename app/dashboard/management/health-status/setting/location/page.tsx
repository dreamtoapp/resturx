import { MapPin } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import LocationForm from './components/LocationForm';
import { fetchLocation } from './actions/fetchLocation';

export default async function LocationPage() {
    const company = await fetchLocation();
    const total = 3;
    const current = [company?.address, company?.latitude, company?.longitude].filter(Boolean).length;
    const progress = { current, total, isComplete: current === total };

    return (
        <HubSettingsLayout
            title="الموقع والعنوان"
            description="العنوان الفعلي وإحداثيات الموقع"
            icon={MapPin}
            progress={progress}
        >
            <LocationForm company={company || undefined} />
        </HubSettingsLayout>
    );
}