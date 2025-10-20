import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';
import DishForm from '../components/DishForm';
import { getMasterDishCategories } from '@/app/dashboard/management-dish-categories/actions/getMasterDishCategories';
import { getDishData } from '../actions/getDishData';

export const metadata = {
  title: 'تعديل الطبق | بوابة المطعم',
  description: 'عدّل بيانات الطبق',
};

interface EditDishPageProps {
  params: Promise<{
    dishId: string;
  }>;
}

export default async function EditDishPage({ params }: EditDishPageProps) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  const { dishId } = await params;

  const [categories, dish] = await Promise.all([
    getMasterDishCategories(),
    getDishData(dishId)
  ]);

  if (!dish) {
    notFound();
  }

  const activeCategories = categories.filter(c => c.isActive);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">تعديل الطبق</h1>
        <p className="text-muted-foreground">عدّل بيانات الطبق &quot;{dish.name}&quot;</p>
      </div>
      <DishForm
        mode="update"
        categories={activeCategories}
        defaultValues={{
          id: dish.id,
          name: dish.name,
          description: dish.description || '',
          dishCategoryId: dish.dishCategoryId || '',
          price: dish.price,
          compareAtPrice: dish.compareAtPrice || undefined,
          published: dish.published,
          outOfStock: dish.outOfStock,
        }}
      />
    </div>
  );
}

