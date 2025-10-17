import db from '@/lib/prisma';

export async function getCustomerById(customerId: string) {
  try {
    const customer = await db.user.findUnique({
      where: {
        id: customerId,
        role: 'CUSTOMER'
      },
      include: {
        addresses: {
          orderBy: {
            isDefault: 'desc'
          }
        },
        customerOrders: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true
                  }
                }
              }
            },
            driver: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!customer) {
      return null;
    }

    // Calculate customer statistics
    const ordersRaw = customer.customerOrders || [];
    const orders = ordersRaw.map((o: any) => ({
      ...o,
      orderItems: (o.items || []).map((it: any) => ({
        ...it,
        product: {
          ...it.product,
          image: it.product?.imageUrl ?? null,
        },
      })),
    })) as Array<any>;
    const reviews: Array<any> = [];

    const totalSpent = orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((itemSum: number, item: any) => {
        return itemSum + (item.product.price * item.quantity);
      }, 0);
    }, 0);

    const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    return {
      ...customer,
      orders,
      reviews,
      totalSpent,
      averageOrderValue,
      lastOrderDate,
      orderCount: orders.length,
      reviewCount: reviews.length
    };
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return null;
  }
}
