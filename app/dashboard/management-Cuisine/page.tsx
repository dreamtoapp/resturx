
import { Badge } from '@/components/ui/badge';
import { getCuisines } from './actions/get-cuisines';
import CuisineCard from './components/CuisineCard';
import CuisineUpsert from './components/CuisineUpsert';

export default async function CuisinesPage() {
  const cuisines = await getCuisines();

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className='flex items-center gap-4'>
          <h1 className="text-2xl font-bold text-foreground">إدارة أنواع المطابخ</h1>
          <Badge variant="outline">{cuisines.length}</Badge>
        </div>

        <CuisineUpsert
          mode='new'
          title={"إضافة نوع مطبخ"}
          description={"يرجى إدخال بيانات نوع المطبخ"}
          defaultValues={{
            type: '',
            name: '',
            email: '',
            phone: '',
            address: '',
          }} />
      </header>

      {/* Cuisines list */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cuisines.map((cuisine) => (
          <CuisineCard key={cuisine.id} cuisine={cuisine} />
        ))}
      </div>
    </div>
  );
}
