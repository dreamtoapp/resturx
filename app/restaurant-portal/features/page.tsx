import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { getAvailableFeatures } from './actions/getAvailableFeatures';
import FeatureSelector from './components/FeatureSelector';

export const metadata = {
  title: 'إدارة المميزات | بوابة المطعم',
  description: 'اختر المميزات المتوفرة في مطعمك',
};

export default async function RestaurantFeaturesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth/login?error=unauthorized');
  }

  const data = await getAvailableFeatures();

  if (!data) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على المطعم</h3>
            <p className="text-muted-foreground">
              لا يمكنك إدارة المميزات بدون مطعم مسجل
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { masterFeatures, selectedFeatureIds } = data;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة المميزات</h1>
        <p className="text-muted-foreground">
          اختر المميزات التي تميز مطعمك لتظهر للعملاء
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">معلومات مهمة</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• اختر المميزات التي تجعل مطعمك فريداً</li>
                <li>• المميزات المحددة ستظهر في صفحة مطعمك للعملاء</li>
                <li>• يمكنك تغيير اختياراتك في أي وقت</li>
                <li>• المميزات تساعد في جذب العملاء المناسبين</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Selector */}
      <Card>
        <CardHeader>
          <CardTitle>المميزات المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <FeatureSelector
            masterFeatures={masterFeatures}
            initialSelected={selectedFeatureIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}




