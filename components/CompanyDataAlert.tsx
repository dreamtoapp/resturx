'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { CompanyDataStatus, getDataPriority } from '@/helpers/companyDataValidator';

interface CompanyDataAlertProps {
  status: CompanyDataStatus;
  className?: string;
}

// simplified alert UI; details moved to dedicated page

export default function CompanyDataAlert({ status, className = '' }: CompanyDataAlertProps) {
  const priority = getDataPriority(status);

  // If everything is complete, still show a compact success alert with a link to the full report
  if (status.isComplete) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">معلومات المتجر مكتملة</AlertTitle>
        <AlertDescription className="text-green-700">
          جميع المعلومات الأساسية للمتجر مكتملة.{' '}
          <Link href="/dashboard/management/health-status" className="underline font-medium">
            عرض تقرير الصحة
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  const getAlertIcon = () => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertTitle = () => {
    switch (priority) {
      case 'critical':
        return 'بيانات متجر حرجة مفقودة';
      case 'warning':
        return 'بيانات متجر غير مكتملة';
      default:
        return 'معلومات المتجر';
    }
  };

  const getAlertDescription = () => {
    if (priority === 'critical') {
      return 'بيانات حرجة مفقودة مطلوبة لتشغيل المتجر';
    }
    if (priority === 'warning') {
      return 'بيانات مهمة غير مكتملة لتحسين تجربة العملاء';
    }
    return 'جميع المعلومات الأساسية مكتملة';
  };

  const getAlertClassName = () => {
    switch (priority) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getTitleClassName = () => {
    switch (priority) {
      case 'critical':
        return 'text-red-800';
      case 'warning':
        return 'text-orange-800';
      default:
        return 'text-blue-800';
    }
  };

  const getDescriptionClassName = () => {
    switch (priority) {
      case 'critical':
        return 'text-red-700';
      case 'warning':
        return 'text-orange-700';
      default:
        return 'text-blue-700';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Alert className={`border-2 ${getAlertClassName()} shadow-sm`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${priority === 'critical'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : priority === 'warning'
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
              {getAlertIcon()}
            </span>
            <div className="space-y-0.5">
              <AlertTitle className={`${getTitleClassName()} font-semibold`}>{getAlertTitle()}</AlertTitle>
              <AlertDescription className={`${getDescriptionClassName()} flex items-center gap-3`}>
                <span>{getAlertDescription()}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${priority === 'critical'
                  ? 'border-red-300 text-red-800 bg-red-100'
                  : priority === 'warning'
                    ? 'border-orange-300 text-orange-800 bg-orange-100'
                    : 'border-blue-300 text-blue-800 bg-blue-100'
                  }`}>
                  اكتمال {status.completionPercentage}%
                </span>
                {/* Tiny inline progress */}
                <span className="inline-flex items-center">
                  <span className="block w-20 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                    <span
                      className={`${priority === 'critical' ? 'bg-red-600' : priority === 'warning' ? 'bg-orange-600' : 'bg-blue-600'} block h-full rounded-full`}
                      style={{ width: `${status.completionPercentage}%` }}
                    />
                  </span>
                </span>
              </AlertDescription>
            </div>
          </div>
          <Link
            href="/dashboard/management/health-status"
            className={`${priority === 'critical'
              ? 'inline-flex items-center rounded-md bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 text-xs'
              : priority === 'warning'
                ? 'inline-flex items-center rounded-md bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 text-xs'
                : 'inline-flex items-center rounded-md bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 text-xs'
              }`}
          >
            فتح تقرير الصحة
          </Link>
        </div>
      </Alert>
    </div>
  );
}
