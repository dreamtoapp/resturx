import { Badge } from '@/components/ui/badge';
import { getMasterFeatures } from './actions/getMasterFeatures';
import MasterFeatureCard from './components/MasterFeatureCard';
import MasterFeatureUpsert from './components/MasterFeatureUpsert';

export default async function MasterFeaturesPage() {
  const features = await getMasterFeatures();

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">إدارة المميزات</h1>
          <Badge variant="outline">{features.length}</Badge>
        </div>

        <MasterFeatureUpsert
          mode="new"
          title="إضافة ميزة"
          description="إضافة ميزة جديدة للقائمة الرئيسية"
          defaultValues={{
            title: '',
            titleEn: '',
            imageUrl: '',
            description: '',
            category: '',
            displayOrder: 0,
            isActive: true,
          }}
        />
      </header>

      {/* Features Grid */}
      {features.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {features.map((feature) => (
            <MasterFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">لا توجد مميزات حالياً</p>
          <MasterFeatureUpsert
            mode="new"
            title="إضافة ميزة"
            description="إضافة ميزة جديدة للقائمة الرئيسية"
            defaultValues={{
              title: '',
              titleEn: '',
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




