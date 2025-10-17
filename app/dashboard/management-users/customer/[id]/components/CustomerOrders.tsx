'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Card, CardContent } from '@/components/ui/card';
// Using simple state-based collapsible for better compatibility
import Image from 'next/image';
import Link from 'next/link';

interface CustomerOrdersProps {
  orders: Array<{
    id: string;
    status: string;
    total: number;
    createdAt: Date | string;
    orderItems: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        image: string | null;
      };
    }>;
  }>;
}

export default function CustomerOrders({ orders }: CustomerOrdersProps) {
  const [openOrders, setOpenOrders] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(amount || 0));
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { label: 'في الانتظار', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'CONFIRMED': { label: 'مؤكد', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'PROCESSING': { label: 'قيد التحضير', variant: 'default' as const, className: 'bg-purple-100 text-purple-800' },
      'ASSIGNED': { label: 'مُسنَد', variant: 'default' as const, className: 'bg-sky-100 text-sky-800' },
      'SHIPPED': { label: 'تم الشحن', variant: 'default' as const, className: 'bg-indigo-100 text-indigo-800' },
      'DELIVERED': { label: 'تم التسليم', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'CANCELLED': { label: 'ملغي', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'REFUNDED': { label: 'مسترد', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: 'secondary' as const,
      className: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const toggleOrder = (orderId: string) => {
    setOpenOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (orders.length === 0) {
    return (
      <div className='text-center py-8'>
        <Icon name="ShoppingCart" size="lg" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className='text-lg font-medium text-foreground mb-2'>لا توجد طلبات</h3>
        <p className='text-sm text-muted-foreground'>لم يقم هذا العميل بأي طلبات بعد</p>
      </div>
    );
  }

  const OrderCard = ({ order }: { order: any }) => {
    const isOpen = openOrders.has(order.id);
    const itemCount = order.orderItems.length;
    const totalItems = order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

    return (
      <Card className='overflow-hidden'>
        <CardContent className='p-4'>
          {/* Order Summary */}
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => toggleOrder(order.id)}
                className='font-semibold text-foreground hover:text-primary transition-colors cursor-pointer'
              >
                طلب #{order.id.slice(-8)}
              </button>
              <div className='flex items-center gap-2'>
                {getStatusBadge(order.status)}
                {order.driver ? (
                  <span className='text-xs text-muted-foreground'>السائق: {order.driver.name || order.driver.phone || 'غير معروف'}</span>
                ) : (
                  <Badge variant={'destructive'} className='bg-red-100 text-red-800'>سائق غير معروف</Badge>
                )}
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button variant="outline" size="sm" className='flex items-center gap-1' asChild>
                <Link href={`/dashboard/management-orders/${order.id}`}>
                  <Icon name="Eye" size="xs" className="w-3 h-3" />
                  <span>عرض</span>
                </Link>
              </Button>
              <div className='text-right'>
                <div className='text-lg font-bold text-primary'>{formatCurrency(order.total)}</div>
                <div className='text-xs text-muted-foreground'>{formatDate(order.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Order Summary Info */}
          <div className='flex items-center justify-between mb-3 text-sm text-muted-foreground'>
            <div className='flex items-center gap-4'>
              <span>{itemCount} منتج</span>
              <span>{totalItems} قطعة</span>
            </div>
            <button
              onClick={() => toggleOrder(order.id)}
              className='flex items-center gap-2 hover:text-primary transition-colors cursor-pointer'
            >
              <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size="xs" className="w-3 h-3" />
              <span>{isOpen ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
            </button>
          </div>

          {/* Collapsible Order Details */}
          {isOpen && (
            <div className='space-y-2 pt-3 border-t border-border/20 animate-in slide-in-from-top-2 duration-200'>
              {order.orderItems.map((item: any) => (
                <div key={item.id} className='flex items-center gap-3 p-2 bg-muted/30 rounded-lg'>
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={40}
                      height={40}
                      className='rounded-md object-cover'
                    />
                  ) : (
                    <div className='w-10 h-10 bg-muted rounded-md flex items-center justify-center'>
                      <Icon name="Package" size="xs" className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}

                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {item.product.name}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <span>الكمية: {item.quantity}</span>
                      <span>•</span>
                      <span>{formatCurrency(item.product.price)}</span>
                    </div>
                  </div>

                  <div className='text-sm font-medium text-foreground'>
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}

        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-h-[600px] overflow-y-auto w-full">
      <div className='space-y-4 pr-4'>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
