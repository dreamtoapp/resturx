'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updateOrderStatusAction } from '@/app/actions/dineInOrders';
import { Icon } from '@/components/icons/Icon';
import { useTransition } from 'react';

const STATUS_MAP = {
  NEW: { label: 'جديد', color: 'bg-blue-500' },
  PREPARING: { label: 'قيد التحضير', color: 'bg-yellow-500' },
  READY: { label: 'جاهز', color: 'bg-green-500' },
  COMPLETED: { label: 'مكتمل', color: 'bg-gray-500' },
  CANCELLED: { label: 'ملغى', color: 'bg-red-500' }
};

export default function OrderCard({ order }: any) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatusAction(order.id, newStatus);
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg">طاولة {order.tableNumber}</p>
          <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
          <p className="text-xs text-muted-foreground">{formatTime(order.createdAt)}</p>
        </div>
        <Badge className={`${STATUS_MAP[order.status as keyof typeof STATUS_MAP].color} text-white`}>
          {STATUS_MAP[order.status as keyof typeof STATUS_MAP].label}
        </Badge>
      </div>

      {order.customer && (
        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>العميل: {order.customer.name || 'غير محدد'}</p>
          {order.customer.phone && <p>الجوال: {order.customer.phone}</p>}
        </div>
      )}

      <div className="space-y-1 border-t pt-2">
        {order.items.map((item: any) => (
          <div key={item.id} className="text-sm flex justify-between">
            <span>{item.quantity}× {item.dishName}</span>
            {item.notes && (
              <Icon
                name="FileText"
                className="h-4 w-4 text-muted-foreground cursor-help"
                title={item.notes}
              />
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-2 text-sm font-bold flex justify-between">
        <span>الإجمالي:</span>
        <span>{order.total.toFixed(2)} ريال</span>
      </div>

      <div className="flex gap-2 pt-2">
        {order.status === 'NEW' && (
          <Button
            size="sm"
            onClick={() => handleStatusChange('PREPARING')}
            className="flex-1"
            disabled={isPending}
          >
            بدء التحضير
          </Button>
        )}
        {order.status === 'PREPARING' && (
          <Button
            size="sm"
            onClick={() => handleStatusChange('READY')}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isPending}
          >
            جاهز
          </Button>
        )}
        {order.status === 'READY' && (
          <Button
            size="sm"
            onClick={() => handleStatusChange('COMPLETED')}
            className="flex-1 bg-gray-600 hover:bg-gray-700"
            disabled={isPending}
          >
            إكمال
          </Button>
        )}
        {order.status === 'COMPLETED' && (
          <div className="flex-1 text-center text-sm text-muted-foreground">
            تم إكمال الطلب
          </div>
        )}
      </div>
    </Card>
  );
}

