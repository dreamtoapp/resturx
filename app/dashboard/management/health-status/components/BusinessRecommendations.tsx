import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface BusinessRecommendationsProps {
  criticalMissing: string[];
  missingFields: string[];
  isComplete: boolean;
  fieldBusinessImpact: Record<string, { businessImpact: string }>;
}

export default function BusinessRecommendations({ criticalMissing, missingFields, isComplete, fieldBusinessImpact }: BusinessRecommendationsProps) {
  const importantMissing = missingFields.filter((field) => !criticalMissing.includes(field));

  return (
    <Card className="border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Zap className="h-6 w-6" />
          توصيات لتحسين الأداء التجاري
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalMissing.length > 0 && (
          <div className="p-4 bg-red-100 dark:bg-red-800 border border-red-600 dark:border-red-600 rounded-lg">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">🚨 أولوية عالية - بيانات حرجة</h4>
            <p className="text-sm text-red-900 dark:text-red-100 mb-2 hidden md:block">هذه البيانات مطلوبة لبدء العمليات التجارية بشكل قانوني وفعال:</p>
            <ul className="text-sm text-red-900 dark:text-red-100 space-y-1 hidden md:block">
              {criticalMissing.map((field) => (
                <li key={field}>• {fieldBusinessImpact[field]?.businessImpact}</li>
              ))}
            </ul>
          </div>
        )}

        {importantMissing.length > 0 && (
          <div className="p-4 bg-orange-100 dark:bg-orange-800 border border-orange-600 dark:border-orange-600 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">⚠️ أولوية متوسطة - بيانات مهمة</h4>
            <p className="text-sm text-orange-900 dark:text-orange-100 mb-2 hidden md:block">هذه البيانات ستحسن من تجربة العملاء وكفاءة العمليات:</p>
            <ul className="text-sm text-orange-900 dark:text-orange-100 space-y-1 hidden md:block">
              {importantMissing.map((field) => (
                <li key={field}>• {fieldBusinessImpact[field]?.businessImpact}</li>
              ))}
            </ul>
          </div>
        )}

        {isComplete && (
          <div className="p-4 bg-green-100 dark:bg-green-800 border border-green-600 dark:border-green-600 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ ممتاز - جميع البيانات مكتملة</h4>
            <p className="text-sm text-green-900 dark:text-green-100 hidden md:block">متجرك جاهز للعمل بكفاءة عالية! جميع البيانات الأساسية والمهمة مكتملة.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



