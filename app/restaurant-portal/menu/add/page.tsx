import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DishForm from '../components/DishForm';
import { getMasterDishCategories } from '@/app/dashboard/management-dish-categories/actions/getMasterDishCategories';

export const metadata = {
  title: 'إضافة طبق جديد | بوابة المطعم',
  description: 'أضف طبق جديد إلى قائمة مطعمك',
};

export default async function AddDishPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  const categories = await getMasterDishCategories();
  const activeCategories = categories.filter(c => c.isActive);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">إضافة طبق جديد</h1>
        <p className="text-muted-foreground">أضف طبق جديد إلى قائمة مطعمك</p>
      </div>
      <DishForm mode="create" categories={activeCategories} />
    </div>
  );
}

