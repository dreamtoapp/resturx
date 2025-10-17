import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface HealthStatusHeaderProps {
  overallHealth: 'critical' | 'warning' | 'healthy';
}

export default function HealthStatusHeader({ overallHealth }: HealthStatusHeaderProps) {
  const getHealthIcon = () => {
    switch (overallHealth) {
      case 'critical':
        return <AlertTriangle className="h-8 w-8 text-red-700" />;
      case 'warning':
        return <AlertCircle className="h-8 w-8 text-orange-700" />;
      default:
        return <CheckCircle className="h-8 w-8 text-green-700" />;
    }
  };

  const getHealthBadge = () => {
    switch (overallHealth) {
      case 'critical':
        return <Badge variant="destructive" className="text-sm px-3 py-1">حالة حرجة</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="text-sm px-3 py-1">يحتاج تحسين</Badge>;
      default:
        return <Badge variant="default" className="bg-green-600 text-white text-sm px-3 py-1">ممتاز</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Icon name="Activity" className="h-8 w-8" />
          تقرير صحة المتجر
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">تحليل شامل لحالة بيانات المتجر وتأثيرها على العمليات التجارية</p>
      </div>
      <div className="flex items-center gap-3">
        {getHealthIcon()}
        {getHealthBadge()}
      </div>
    </div>
  );
}



