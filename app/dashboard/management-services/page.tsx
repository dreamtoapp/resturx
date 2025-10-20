import { Badge } from '@/components/ui/badge';
import { getMasterServices } from './actions/getMasterServices';
import MasterServiceCard from './components/MasterServiceCard';
import MasterServiceUpsert from './components/MasterServiceUpsert';

export default async function MasterServicesPage() {
  const services = await getMasterServices();

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">إدارة الخدمات</h1>
          <Badge variant="outline">{services.length}</Badge>
        </div>

        <MasterServiceUpsert
          mode="new"
          title="إضافة خدمة"
          description="إضافة خدمة جديدة للقائمة الرئيسية"
          defaultValues={{
            name: '',
            nameEn: '',
            imageUrl: '',
            description: '',
            category: '',
            displayOrder: 0,
            isActive: true,
          }}
        />
      </header>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {services.map((service) => (
            <MasterServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">لا توجد خدمات حالياً</p>
          <MasterServiceUpsert
            mode="new"
            title="إضافة خدمة"
            description="إضافة خدمة جديدة للقائمة الرئيسية"
            defaultValues={{
              name: '',
              nameEn: '',
              imageUrl: '',
              description: '',
              category: '',
              displayOrder: 0,
              isActive: true,
            }}
          />
        </div>
      )}
    </div>
  );
}




