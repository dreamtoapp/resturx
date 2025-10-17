import { Badge } from '@/components/ui/badge';

import { getRestaurants } from './actions/get-category';
import CategoryCard from './components/CategoryCard';
import CategoryUpsert from './components/CategoryUpsert';

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">إدارة المطاعم</h1>
          <Badge variant="outline">{restaurants.length}</Badge>
        </div>

        <CategoryUpsert
          mode="new"
          title="إضافة مطعم"
          description="يرجى إدخال بيانات المطعم"
          defaultValues={{
            name: '',
            description: '',
          }}
        />
      </header>

      {/* Restaurant list */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {restaurants.map((restaurant) => (
          <CategoryCard key={restaurant.id} category={restaurant} />
        ))}
      </div>
    </div>
  );
}
