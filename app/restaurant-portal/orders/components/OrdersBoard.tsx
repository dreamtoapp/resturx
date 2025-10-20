'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderCard from './OrderCard';

export default function OrdersBoard({ orders }: any) {
  const [filter, setFilter] = useState('ALL');

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter((o: any) => o.status === filter);

  const statusCounts = {
    NEW: orders.filter((o: any) => o.status === 'NEW').length,
    PREPARING: orders.filter((o: any) => o.status === 'PREPARING').length,
    READY: orders.filter((o: any) => o.status === 'READY').length,
    COMPLETED: orders.filter((o: any) => o.status === 'COMPLETED').length
  };

  return (
    <Tabs value={filter} onValueChange={setFilter}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="ALL">
          الكل ({orders.length})
        </TabsTrigger>
        <TabsTrigger value="NEW">
          جديد ({statusCounts.NEW})
        </TabsTrigger>
        <TabsTrigger value="PREPARING">
          قيد التحضير ({statusCounts.PREPARING})
        </TabsTrigger>
        <TabsTrigger value="READY">
          جاهز ({statusCounts.READY})
        </TabsTrigger>
        <TabsTrigger value="COMPLETED">
          مكتمل ({statusCounts.COMPLETED})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={filter} className="mt-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد طلبات
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

