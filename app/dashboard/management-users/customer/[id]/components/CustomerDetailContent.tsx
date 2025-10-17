'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// removed unused Badge, Button
import { Icon } from '@/components/icons/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CustomerOrders from './CustomerOrders';
import CustomerAddresses from './CustomerAddresses';
import CustomerReviews from './CustomerReviews';

interface CustomerDetailContentProps {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: Date | string;
    orderCount: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: Date | string | null;
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
    addresses: Array<{
      id: string;
      label: string;
      district: string;
      street: string;
      buildingNumber: string;
      floor?: string | null;
      apartmentNumber?: string | null;
      landmark?: string | null;
      deliveryInstructions?: string | null;
      latitude?: string | null;
      longitude?: string | null;
      isDefault: boolean;
    }>;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string | null;
      createdAt: Date | string;
      product: {
        id: string;
        name: string;
        image: string | null;
      };
    }>;
  };
}

export default function CustomerDetailContent({ customer }: CustomerDetailContentProps) {
  // removed unused formatCurrency

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Icon name="User" size="sm" className="w-4 h-4" />
          <span>نشاط العميل</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className='flex items-center gap-2'>
              <Icon name="ShoppingCart" size="xs" className="w-3 h-3" />
              <span>الطلبات ({customer.orderCount})</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className='flex items-center gap-2'>
              <Icon name="MapPin" size="xs" className="w-3 h-3" />
              <span>العناوين ({customer.addresses.length})</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className='flex items-center gap-2'>
              <Icon name="Star" size="xs" className="w-3 h-3" />
              <span>التقييمات ({customer.reviews.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <CustomerOrders orders={customer.orders} />
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <CustomerAddresses
              addresses={customer.addresses}
              customerId={customer.id}
            />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <CustomerReviews reviews={customer.reviews} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
