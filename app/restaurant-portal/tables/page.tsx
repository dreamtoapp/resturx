import { getRestaurantTables } from './actions/tableActions';
import TablesClient from './components/TablesClient';

export default async function TablesPage() {
  const result = await getRestaurantTables();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الطاولات</h1>
      </div>
      <TablesClient initialTables={result.tables || []} />
    </div>
  );
}

