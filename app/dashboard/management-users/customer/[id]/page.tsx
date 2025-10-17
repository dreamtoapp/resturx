import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';

import { getCustomerById } from '../actions/getCustomerById';
import CustomerDetailHeader from './components/CustomerDetailHeader';
import CustomerDetailContent from './components/CustomerDetailContent';
import CustomerDetailSidebar from './components/CustomerDetailSidebar';
import BackButton from './components/BackButton';

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <div className='border-b border-border/30 bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <BackButton />
              <div>
                <h1 className='text-2xl font-bold text-foreground'>تفاصيل العميل</h1>
                <p className='text-sm text-muted-foreground'>معلومات شاملة عن العميل ونشاطه</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant="outline" className="border-primary/20 text-primary">
                {customer.orderCount} طلب
              </Badge>
              <Badge
                variant={customer.orderCount > 0 ? "default" : "secondary"}
                className={customer.orderCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
              >
                {customer.orderCount > 0 ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Allow nullable name to satisfy types */}
            <CustomerDetailHeader customer={{ ...customer, name: (customer as any).name || '' }} />
            <CustomerDetailContent customer={{ ...customer, name: (customer as any).name || '' }} />
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            <CustomerDetailSidebar customer={{ ...customer, name: (customer as any).name || '' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
