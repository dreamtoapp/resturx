import { getCompanyDataStatus } from './actions/getCompanyDataStatus';
import { Target } from 'lucide-react';
import HealthStatusHeader from './components/HealthStatusHeader';
import OverallHealthStatus from './components/OverallHealthStatus';
import BusinessImpactMetrics from './components/BusinessImpactMetrics';
import FieldCategorySection from './components/FieldCategorySection';
import BusinessRecommendations from './components/BusinessRecommendations';
import { FIELD_BUSINESS_IMPACT } from '@/app/dashboard/management/health-status/helpers/health-status';

// FIELD_BUSINESS_IMPACT moved to helpers per folder rule

export default async function HealthStatusPage() {
  const companyDataStatus = await getCompanyDataStatus();

  const getOverallHealth = () => {
    if (companyDataStatus.criticalMissing.length > 0) return 'critical';
    if (companyDataStatus.missingFields.length > 0) return 'warning';
    return 'healthy';
  };

  const overallHealth = getOverallHealth();

  const getHealthMessage = () => {
    switch (overallHealth) {
      case 'critical':
        return 'المتجر يحتاج بيانات حرجة لبدء العمليات التجارية';
      case 'warning':
        return 'المتجر يعمل ولكن يحتاج تحسينات لتحقيق أفضل أداء';
      default:
        return 'المتجر في حالة ممتازة وجاهز للعمل بكفاءة عالية';
    }
  };

  // Group fields by category
  // Merge tax compliance and legal compliance into one combined category card
  type FieldConfig = (typeof FIELD_BUSINESS_IMPACT)[keyof typeof FIELD_BUSINESS_IMPACT];
  type FieldEntry = {
    field: string;
    category: string;
    priority: string;
    businessImpact: string;
    userImpact: string;
    icon: any;
    color: string;
  };
  const fieldsByCategory = Object.entries(FIELD_BUSINESS_IMPACT).reduce((acc, [field, config]) => {
    const originalCategory = (config as FieldConfig).category;
    const mergedCategory = (originalCategory === 'الامتثال الضريبي' || originalCategory === 'الامتثال القانوني')
      ? 'الامتثال القانوني والضريبي'
      : originalCategory;

    if (!acc[mergedCategory]) {
      acc[mergedCategory] = [] as FieldEntry[];
    }
    const { category: _omit, ...rest } = config as FieldConfig;
    (acc[mergedCategory] as FieldEntry[]).push({ field, ...(rest as Omit<FieldConfig, 'category'>), category: mergedCategory as string });
    return acc;
  }, {} as Record<string, FieldEntry[]>);

  return (
    <>
      {/* Header */}
      <HealthStatusHeader overallHealth={overallHealth} />

      {/* Overall Health Status */}
      <OverallHealthStatus
        overallHealth={overallHealth}
        completionPercentage={companyDataStatus.completionPercentage}
        healthMessage={getHealthMessage()}
      />

      {/* Business Impact Metrics */}
      <BusinessImpactMetrics
        criticalMissing={companyDataStatus.criticalMissing}
        missingFields={companyDataStatus.missingFields}
      />

      {/* Detailed Field Analysis by Category */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="h-6 w-6" />
          تحليل مفصل للحقول حسب الأهمية التجارية
        </h2>

        {Object.entries(fieldsByCategory).map(([category, fields]) => (
          <FieldCategorySection
            key={category}
            category={category}
            fields={fields}
            missingFields={companyDataStatus.missingFields}
            criticalMissing={companyDataStatus.criticalMissing}
          />
        ))}
      </div>

      {/* Business Recommendations */}
      <BusinessRecommendations
        criticalMissing={companyDataStatus.criticalMissing}
        missingFields={companyDataStatus.missingFields}
        isComplete={companyDataStatus.isComplete}
        fieldBusinessImpact={FIELD_BUSINESS_IMPACT}
      />
    </>
  );
}


