import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import GalleryManager from './components/GalleryManager';

export const metadata = {
  title: 'معرض الصور | بوابة المطعم',
  description: 'إدارة صور مطعمك',
};

async function getRestaurantGallery(userId: string) {
  try {
    // Get restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId },
      select: {
        id: true,
        name: true,
        slug: true,
        images: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            order: true,
            createdAt: true,
          }
        }
      }
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant gallery:', error);
    return null;
  }
}

export default async function RestaurantGalleryPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth/login?error=unauthorized');
  }

  const restaurant = await getRestaurantGallery(session.user.id!);

  if (!restaurant) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على المطعم</h3>
            <p className="text-muted-foreground">
              لا يمكنك إدارة معرض الصور بدون مطعم مسجل
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">معرض الصور</h1>
        <p className="text-muted-foreground">
          أضف وأدر صور مطعمك التي تظهر للعملاء
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">نصائح لمعرض صور ناجح</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• استخدم صور واضحة وعالية الجودة للأطباق والمطعم</li>
                <li>• أضف تعليقات وصفية لكل صورة لجذب العملاء</li>
                <li>• يمكنك إعادة ترتيب الصور بالسحب والإفلات</li>
                <li>• الحد الأقصى: 20 صورة في المعرض</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Manager */}
      <GalleryManager
        restaurantId={restaurant.id}
        images={restaurant.images}
      />
    </div>
  );
}


