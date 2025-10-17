import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface OverallHealthStatusProps {
  overallHealth: 'critical' | 'warning' | 'healthy';
  completionPercentage: number;
  healthMessage: string;
}

export default function OverallHealthStatus({ overallHealth, completionPercentage, healthMessage }: OverallHealthStatusProps) {
  const getHealthColor = () => {
    switch (overallHealth) {
      case 'critical':
        return 'border-red-600 bg-red-50 dark:bg-red-900 dark:border-red-600';
      case 'warning':
        return 'border-orange-600 bg-orange-50 dark:bg-orange-900 dark:border-orange-600';
      default:
        return 'border-green-600 bg-green-50 dark:bg-green-900 dark:border-green-600';
    }
  };

  return (
    <Card className={`border-2 ${getHealthColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
          <TrendingUp className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          الحالة العامة للمتجر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{healthMessage}</p>
            <p className="text-gray-700 dark:text-gray-300">
              نسبة اكتمال البيانات: <span className="font-semibold text-gray-900 dark:text-gray-100">{completionPercentage}%</span>
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">{completionPercentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">مكتمل</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>تقدم إكتمال البيانات</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
}



