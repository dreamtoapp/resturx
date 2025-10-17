import { Shield } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import { fetchCompliance } from './actions/fetchCompliance';
import ComplianceForm from './components/ComplianceForm';

export default async function CompliancePage() {
  const data = await fetchCompliance();
  const total = 4;
  const current = [
    data?.taxNumber,
    data?.taxPercentage,
    data?.commercialRegistrationNumber,
    data?.saudiBusinessId,
  ].filter(value => {
    // Special handling for taxPercentage: 0 is valid
    if (value === 0) return true;
    // For other fields, check if they have meaningful values
    if (typeof value === 'string') return value.trim() !== '';
    return Boolean(value);
  }).length;
  const progress = { current, total, isComplete: current === total };

  return (
    <HubSettingsLayout
      title="المعلومات القانونية"
      description="البيانات القانونية والضريبية"
      icon={Shield}
      progress={progress}
    >
      <ComplianceForm initialValues={data ?? {}} />
    </HubSettingsLayout>
  );
}


