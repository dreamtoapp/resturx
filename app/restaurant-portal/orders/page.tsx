import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import OrdersBoard from './components/OrdersBoard';

export default async function RestaurantOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const restaurant = await prisma.restaurant.findFirst({
    where: { userId: session.user.id }
  });

  if (!restaurant) redirect('/restaurant-portal');

  const orders = await prisma.dineInOrder.findMany({
    where: { restaurantId: restaurant.id },
    include: {
      items: {
        include: { dish: true }
      },
      customer: {
        select: { name: true, phone: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">إدارة الطلبات</h1>
      <OrdersBoard orders={orders} />
    </div>
  );
}

