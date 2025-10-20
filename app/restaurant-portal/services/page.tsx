import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { getAvailableServices } from './actions/getAvailableServices';
import ServiceSelector from './components/ServiceSelector';

export const metadata = {
  title: 'إدارة الخدمات | بوابة المطعم',
  description: 'اختر الخدمات المتوفرة في مطعمك',
};

export default async function RestaurantServicesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth/login?error=unauthorized');
  }

  const data = await getAvailableServices();

  if (!data) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على المطعم</h3>
            <p className="text-muted-foreground">
              لا يمكنك إدارة الخدمات بدون مطعم مسجل
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { masterServices, selectedServiceIds } = data;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة الخدمات</h1>
        <p className="text-muted-foreground">
          اختر الخدمات المتوفرة في مطعمك لتظهر للعملاء
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
                <li>• اختر الخدمات المتوفرة فعلياً في مطعمك</li>
                <li>• الخدمات المحددة ستظهر في صفحة مطعمك للعملاء</li>
                <li>• يمكنك تغيير اختياراتك في أي وقت</li>
                <li>• الخدمات تساعد العملاء على اتخاذ قرار الزيارة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Selector */}
      <Card>
        <CardHeader>
          <CardTitle>الخدمات المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceSelector
            masterServices={masterServices}
            initialSelected={selectedServiceIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}




