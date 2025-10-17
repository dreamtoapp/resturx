"use client";

import { useRouter } from 'next/navigation';
import AppHealthIconServer from '@/components/AppHealthIconServer';
import { CheckCircle2 } from 'lucide-react';
import { CompanyDataStatus } from '@/helpers/companyDataValidator';

interface HeaderLinkProps {
  status: CompanyDataStatus;
}

export default function HeaderLink({ status }: HeaderLinkProps) {
  const router = useRouter();
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push('/dashboard/management/health-status')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push('/dashboard/management/health-status');
      }}
      className="mb-3 flex items-center justify-between gap-2 rounded-md border bg-background/60 px-3 py-2 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <AppHealthIconServer status={status} />
        <span className="text-sm text-muted-foreground">صحة المتجر</span>
      </div>
      <div className="relative inline-flex items-center justify-center" style={{ width: 28, height: 28 }} aria-label="overall progress">
        {status.completionPercentage >= 100 ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
        ) : (
          <>
            <svg width={28} height={28} className="-rotate-90">
              <circle cx={14} cy={14} r={10} className="text-muted" stroke="currentColor" strokeWidth="4" fill="transparent" />
              <circle cx={14} cy={14} r={10} className="text-primary" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 10} strokeDashoffset={(2 * Math.PI * 10) - ((status.completionPercentage / 100) * (2 * Math.PI * 10))} fill="transparent" />
            </svg>
            <span className="absolute text-[9px] font-medium text-foreground">{Math.round(status.completionPercentage)}%</span>
          </>
        )}
      </div>
    </div>
  );
}


