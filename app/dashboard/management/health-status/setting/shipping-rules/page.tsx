import { Truck } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import { fetchShippingRules } from './actions/fetchShippingRules';
import ShippingRulesForm from './components/ShippingRulesForm';

export default async function ShippingRulesPage() {
  const data = await fetchShippingRules();

  const total = 3;
  const current = [
    data?.workingHours,
    data?.shippingFee,
    data?.minShipping,
  ].filter(Boolean).length;

  const progress = { current, total, isComplete: current === total };

  return (
    <HubSettingsLayout
      title="قواعد الشحن والتوصيل"
      description="ساعات العمل وإعدادات التوصيل"
      icon={Truck}
      progress={progress}
    >
      <ShippingRulesForm initialValues={data ?? {}} />
    </HubSettingsLayout>
  );
}
