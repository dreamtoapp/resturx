import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

interface BusinessImpactMetricsProps {
  criticalMissing: string[];
  missingFields: string[];
}

export default function BusinessImpactMetrics({ criticalMissing, missingFields }: BusinessImpactMetricsProps) {
  const importantMissing = missingFields.filter((field) => !criticalMissing.includes(field));
  const completedFields = missingFields.length === 0 ? 13 : 13 - missingFields.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-red-600 bg-red-50 dark:bg-red-900 dark:border-red-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100">بيانات حرجة مفقودة</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">{criticalMissing.length}</p>
              <p className="text-xs text-red-800 dark:text-red-200 mt-1">تؤثر على العمليات</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-700 dark:text-red-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-600 bg-orange-50 dark:bg-orange-900 dark:border-orange-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">بيانات مهمة مفقودة</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{importantMissing.length}</p>
              <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">تحتاج تحسين</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-700 dark:text-orange-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-600 bg-green-50 dark:bg-green-900 dark:border-green-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">بيانات مكتملة</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{completedFields}</p>
              <p className="text-xs text-green-800 dark:text-green-200 mt-1">جاهزة للاستخدام</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-700 dark:text-green-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">إجمالي الحقول</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">13</p>
              <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">جميع البيانات</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-700 dark:text-blue-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



