'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { savePlatform } from '../actions/savePlatform';
import { GeneralSettings } from './GeneralSettings';
import { CurrencySettings } from './CurrencySettings';
import { NotificationSettings } from './NotificationSettings';
import { SaveButton } from './SaveButton';

interface PlatformData {
    id?: string;
    showHeroImage: boolean;
    showStoreLocation: boolean;
    showCustomerCount: boolean;
    showProductCount: boolean;
    showVision2030: boolean;
    emailNotifications: boolean;
    defaultCurrency: string;
}

interface PlatformSettingsFormProps {
    initialData?: any;
}

export default function PlatformSettingsForm({ initialData }: PlatformSettingsFormProps) {
    // Debug: Log what the form receives
    console.log('🔍 Form component - initialData received:', {
        id: initialData?.id,
        showHeroImage: initialData?.showHeroImage,
        showStoreLocation: initialData?.showStoreLocation,
        showCustomerCount: initialData?.showCustomerCount,
        showProductCount: initialData?.showProductCount,
        showVision2030: initialData?.showVision2030,
        emailNotifications: initialData?.emailNotifications,
        defaultCurrency: initialData?.defaultCurrency,
    });

    const [formData, setFormData] = useState<PlatformData>({
        id: initialData?.id || '',
        showHeroImage: initialData?.showHeroImage ?? false,
        showStoreLocation: initialData?.showStoreLocation ?? false,
        showCustomerCount: initialData?.showCustomerCount ?? false,
        showProductCount: initialData?.showProductCount ?? false,
        showVision2030: initialData?.showVision2030 ?? false,
        emailNotifications: initialData?.emailNotifications ?? false,
        defaultCurrency: initialData?.defaultCurrency || 'SAR',
    });

    // Debug: Log the final form state
    console.log('🔍 Form component - final formData state:', formData);
    const [isSaving, setIsSaving] = useState(false);

    const handleCheckboxChange = (field: keyof PlatformData, value: boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field: keyof PlatformData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            console.log('💾 Saving platform settings:', formData);
            const result = await savePlatform(formData);
            console.log('✅ Save result:', result);
            toast.success('تم حفظ جميع الإعدادات بنجاح');
        } catch (error) {
            console.error('❌ Error saving settings:', error);
            toast.error('فشل في حفظ الإعدادات');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <GeneralSettings
                formData={formData}
                onChange={handleCheckboxChange}
            />

            <CurrencySettings
                formData={formData}
                onChange={handleSelectChange}
            />

            <NotificationSettings
                formData={formData}
                onChange={handleCheckboxChange}
            />

            <SaveButton isSaving={isSaving} />
        </form>
    );
}