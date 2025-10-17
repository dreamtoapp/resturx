'use client';

import { CompanyDataStatus } from '@/helpers/companyDataValidator';

interface HealthTooltipProps {
  status: CompanyDataStatus;
  title: string;
}

export default function HealthTooltip({ status, title }: HealthTooltipProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-[9999]">
      {title} {status.completionPercentage}%
    </div>
  );
}
