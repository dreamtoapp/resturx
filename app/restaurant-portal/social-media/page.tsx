import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import SocialMediaForm from './components/SocialMediaForm';

export const metadata = {
  title: 'وسائل التواصل الاجتماعي | بوابة المطعم',
  description: 'إدارة روابط وسائل التواصل الاجتماعي',
};

export default async function SocialMediaPage() {
  // Check authentication
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth/login?error=unauthorized');
  }

  // Get restaurant for this owner
  const restaurant = await prisma.restaurant.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      facebook: true,
      instagram: true,
      snapchat: true,
      tiktok: true,
      twitter: true,
    }
  });

  if (!restaurant) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على المطعم</h3>
            <p className="text-muted-foreground">
              لا يمكنك إدارة وسائل التواصل بدون مطعم مسجل
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">وسائل التواصل الاجتماعي</h1>
        <p className="text-muted-foreground">
          أضف روابط حسابات وسائل التواصل الاجتماعي الخاصة بمطعمك
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900">معلومات مهمة</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• جميع الحقول اختيارية - أضف فقط الحسابات المتوفرة لديك</li>
                <li>• الروابط ستظهر في صفحة مطعمك للعملاء</li>
                <li>• تأكد من إدخال الرابط الكامل (يبدأ بـ https://)</li>
                <li>• يمكنك تعديل الروابط في أي وقت</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <SocialMediaForm initialData={restaurant} />
    </div>
  );
}

