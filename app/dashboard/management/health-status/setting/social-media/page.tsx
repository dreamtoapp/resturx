import { Share2 } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import SocialMediaForm from './components/SocialMediaForm';
import { getSocialMedia } from './actions/getSocialMedia';

export default async function SocialMediaPage() {
    const result = await getSocialMedia();
    const initialValues = result.ok ? (result.data as any) : {};
    const total = 7;
    const completed = Object.values(initialValues).filter((v: any) => (v?.trim?.() ?? '') !== '').length;

    return (
        <HubSettingsLayout
            title="الروابط الاجتماعية"
            description="روابط وسائل التواصل الاجتماعي للشركة"
            icon={Share2}
            progress={{ current: completed, total, isComplete: completed === total && total > 0 }}
        >
            <SocialMediaForm initialValues={initialValues} />
        </HubSettingsLayout>
    );
}