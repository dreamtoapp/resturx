import db from '@/lib/prisma'

export async function getOrderById(orderId: string) {
  try {
    const order: any = await db.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: { id: true, name: true, phone: true }
        },
        driver: {
          select: { id: true, name: true, phone: true }
        },
        // Do not include address directly to avoid prisma required relation inconsistency
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, imageUrl: true }
            }
          }
        }
      }
    } as any)

    if (!order) return null

    const items = (order.items || []).map((it: any) => ({
      ...it,
      product: { ...it.product, image: it.product?.imageUrl ?? null }
    }))

    const total = items.reduce((sum: number, it: any) => sum + (it.product?.price || 0) * it.quantity, 0)

    // Fetch address separately if available to avoid include errors when null
    let address = null as any
    if ((order as any).addressId) {
      try {
        address = await (db as any).address.findUnique({ where: { id: (order as any).addressId } })
      } catch { }
    }

    return {
      ...order,
      items,
      total,
      address,
    }
  } catch (error) {
    console.error('getOrderById error', error)
    return null
  }
}


