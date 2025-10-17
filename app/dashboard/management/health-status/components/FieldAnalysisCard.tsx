import { Badge } from '@/components/ui/badge';
import InfoTooltip from '@/components/InfoTooltip';

interface FieldAnalysisCardProps {
  field: string;
  displayName: string;
  businessImpact: string;
  userImpact: string;
  icon: any;
  isMissing: boolean;
  isCritical: boolean;
}

export default function FieldAnalysisCard({ field, displayName, businessImpact, userImpact, icon: IconComponent, isMissing, isCritical }: FieldAnalysisCardProps) {
  const tooltipContent = (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-sm">التأثير التجاري:</p>
        <p className="text-xs">{businessImpact}</p>
      </div>
      <div>
        <p className="font-medium text-sm">تأثير العملاء:</p>
        <p className="text-xs">{userImpact}</p>
      </div>
    </div>
  );

  return (
    <div className={`p-4 rounded-lg border-2 ${isMissing ? (isCritical ? 'border-red-600 bg-red-50 dark:bg-red-900 dark:border-red-600' : 'border-orange-600 bg-orange-50 dark:bg-orange-900 dark:border-orange-600') : 'border-green-600 bg-green-50 dark:bg-green-900 dark:border-green-600'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isMissing ? (isCritical ? 'bg-red-100 dark:bg-red-800' : 'bg-orange-100 dark:bg-orange-800') : 'bg-green-100 dark:bg-green-800'}`}>
          <IconComponent className={`h-5 w-5 ${isMissing ? (isCritical ? 'text-red-900 dark:text-red-100' : 'text-orange-900 dark:text-orange-100') : 'text-green-900 dark:text-green-100'}`} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-gray-900 bg-white p-1 border border-gray-300 rounded-md">{displayName}</h4>
            <InfoTooltip
              content={tooltipContent}
              side="top"
              delayDuration={200}
              sideOffset={8}
              ariaLabel={`معلومات عن ${displayName}`}
              iconSize={16}
              iconClassName="text-blue-600 hover:text-blue-700"
            />
            <Badge variant={isMissing ? (isCritical ? 'destructive' : 'secondary') : 'default'} className={`text-xs ${!isMissing ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}>
              {isMissing ? (isCritical ? 'حرج' : 'مهم') : 'مكتمل'}
            </Badge>
          </div>
          <div className="space-y-1 hidden md:block">
            <p className="text-xs text-gray-700"><span className="font-medium text-gray-900">التأثير التجاري:</span> {businessImpact}</p>
            <p className="text-xs text-gray-700"><span className="font-medium text-gray-900">تأثير العملاء:</span> {userImpact}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Badge variant="outline" className="text-[10px] bg-gray-100 text-gray-700 border-gray-300">{field}</Badge>
      </div>
    </div>
  );
}