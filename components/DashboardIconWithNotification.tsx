import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { CompanyDataStatus } from '@/helpers/companyDataValidator';

interface DashboardIconWithNotificationProps {
  companyStatus: CompanyDataStatus;
}

export default function DashboardIconWithNotification({ companyStatus }: DashboardIconWithNotificationProps) {
  const hasMissingData = !companyStatus.isComplete;
  const hasCriticalMissing = companyStatus.criticalMissing.length > 0;

  return (
    <Link href="/dashboard" className="flex items-center relative group">
      <Icon
        name="LayoutGrid"
        className={`h-5 w-5 transition-colors ${hasMissingData
          ? 'text-red-500'
          : 'text-primary-foreground'
          }`}
      />

      {/* Red pulsing notification dot */}
      {hasMissingData && (
        <div className="absolute -top-1 -right-1">
          <div className={`h-3 w-3 rounded-full ${hasCriticalMissing ? 'bg-red-500' : 'bg-orange-500'
            } animate-pulse`} />
          <div className={`absolute inset-0 h-3 w-3 rounded-full ${hasCriticalMissing ? 'bg-red-500' : 'bg-orange-500'
            } animate-ping opacity-75`} />
        </div>
      )}

    </Link>
  );
}
