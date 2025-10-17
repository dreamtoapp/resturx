import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { CompanyDataStatus } from '@/helpers/companyDataValidator';
import HealthTooltip from './HealthTooltip';

interface AppHealthIconServerProps {
  status: CompanyDataStatus;
}

export default function AppHealthIconServer({ status }: AppHealthIconServerProps) {
  const getHealthStatus = () => {
    if (status.criticalMissing.length > 0) return 'critical';
    if (status.missingFields.length > 0) return 'warning';
    return 'healthy';
  };

  const healthStatus = getHealthStatus();

  const getIconProps = () => {
    switch (healthStatus) {
      case 'critical':
        return {
          name: 'AlertTriangle' as const,
          className: 'h-5 w-5 text-red-500 animate-pulse',
          title: 'بيانات حرجة مفقودة'
        };
      case 'warning':
        return {
          name: 'AlertCircle' as const,
          className: 'h-5 w-5 text-orange-500',
          title: 'بيانات مهمة مفقودة'
        };
      default:
        return {
          name: 'CheckCircle' as const,
          className: 'h-5 w-5 text-green-500',
          title: 'المتجر بحالة جيدة'
        };
    }
  };

  const iconProps = getIconProps();

  return (
    <Link
      href="/dashboard/management/health-status"
      className="flex items-center relative group"
    >
      <Icon name={iconProps.name} className={iconProps.className} />
      <HealthTooltip status={status} title={iconProps.title} />
    </Link>
  );
}
