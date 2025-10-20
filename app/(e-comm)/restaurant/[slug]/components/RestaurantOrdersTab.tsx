'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';
import { useState } from 'react';
import DishActionButtons from './DishActionButtons';

const STATUS_MAP = {
  NEW: { label: 'جديد', color: 'bg-blue-500' },
  PREPARING: { label: 'قيد التحضير', color: 'bg-yellow-500' },
  READY: { label: 'جاهز', color: 'bg-green-500' },
  COMPLETED: { label: 'مكتمل', color: 'bg-gray-500' },
  CANCELLED: { label: 'ملغى', color: 'bg-red-500' }
};

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  tableNumber: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    dishId: string;
    dishName: string;
    dishImage?: string;
    quantity: number;
    price: number;
    notes?: string;
  }[];
}

interface RestaurantOrdersTabProps {
  orders: Order[];
  isLoggedIn: boolean;
}

export default function RestaurantOrdersTab({
  orders,
  isLoggedIn
}: RestaurantOrdersTabProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <Card className="p-12 text-center">
        <Icon name="Lock" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">يرجى تسجيل الدخول</h3>
        <p className="text-sm text-muted-foreground mb-4">
          قم بتسجيل الدخول لعرض طلباتك السابقة
        </p>
        <Link href="/auth/signin">
          <Button>تسجيل الدخول</Button>
        </Link>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="ClipboardList" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">لا توجد طلبات سابقة</h3>
        <p className="text-sm text-muted-foreground mb-4">
          لم تقم بأي طلبات من هذا المطعم بعد
        </p>
        <Button
          onClick={() => {
            const menuTab = document.querySelector('[value="menu"]') as HTMLElement;
            menuTab?.click();
          }}
          variant="outline"
        >
          تصفح القائمة
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        طلباتي ({orders.length})
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const statusInfo = STATUS_MAP[order.status as keyof typeof STATUS_MAP];
          const isExpanded = expandedOrderId === order.id;

          return (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge className={`${statusInfo.color} text-white`}>
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Hash" className="h-4 w-4 text-muted-foreground" />
                  <span>طاولة {order.tableNumber}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.items.length} {order.items.length === 1 ? 'عنصر' : 'عناصر'}
                </div>
              </div>

              {/* Expandable Items */}
              {isExpanded && (
                <div className="mb-3 space-y-3 border-t pt-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>{item.quantity}× {item.dishName}</span>
                        <span className="text-muted-foreground">
                          {(item.quantity * item.price).toFixed(2)} ريال
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground">ملاحظات: {item.notes}</p>
                      )}
                      {/* Dish Action Buttons */}
                      <DishActionButtons
                        dishId={item.dishId}
                        dishName={item.dishName}
                      />
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>المجموع الفرعي</span>
                      <span>{order.subtotal.toFixed(2)} ريال</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>الضريبة</span>
                      <span>{order.taxAmount.toFixed(2)} ريال</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">الإجمالي</p>
                  <p className="text-lg font-bold text-primary">{order.total.toFixed(2)} ريال</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                >
                  {isExpanded ? (
                    <>
                      <Icon name="ChevronUp" className="h-4 w-4 ml-1" />
                      إخفاء
                    </>
                  ) : (
                    <>
                      <Icon name="ChevronDown" className="h-4 w-4 ml-1" />
                      التفاصيل
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

