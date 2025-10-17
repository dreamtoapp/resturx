import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/prisma';
import RestaurantProfileForm from './components/RestaurantProfileForm';

async function getRestaurantForEdit(userId: string) {
  return await db.restaurant.findFirst({
    where: { userId },
    include: {
      country: true,
    }
  });
}

export default async function RestaurantProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const restaurant = await getRestaurantForEdit(session.user.id!);

  if (!restaurant) {
    return <div>لا يوجد مطعم</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تعديل بيانات المطعم</h1>
        <p className="text-muted-foreground">قم بتحديث معلومات مطعمك</p>
      </div>

      <RestaurantProfileForm restaurant={restaurant} />
    </div>
  );
}





