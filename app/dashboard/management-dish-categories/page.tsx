import { Badge } from '@/components/ui/badge';
import { getMasterDishCategories } from './actions/getMasterDishCategories';
import MasterDishCategoryCard from './components/MasterDishCategoryCard';
import MasterDishCategoryUpsert from './components/MasterDishCategoryUpsert';

export default async function MasterDishCategoriesPage() {
  const categories = await getMasterDishCategories();

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">إدارة أصناف الأطباق</h1>
          <Badge variant="outline">{categories.length}</Badge>
        </div>

        <MasterDishCategoryUpsert
          mode="new"
          title="إضافة صنف"
          description="إضافة صنف جديد للأطباق"
          defaultValues={{
            name: '',
            nameEn: '',
            imageUrl: '',
            description: '',
            displayOrder: 0,
            isActive: true,
          }}
        />
      </header>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((category) => (
            <MasterDishCategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">لا توجد أصناف حالياً</p>
        </div>
      )}
    </div>
  );
}

