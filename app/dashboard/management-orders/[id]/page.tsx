// Do not import React in Next.js 13+ server components
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/icons/Icon'
import { getOrderById } from '../actions/getOrderById'

interface OrderDetailPageProps { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const order: any = await getOrderById(id)

  if (!order) {
    return (
      <div className='container mx-auto px-4 py-10 text-center'>
        <p className='text-sm text-muted-foreground'>لم يتم العثور على الطلب</p>
      </div>
    )
  }

  const formatNumber = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(n || 0))
  const formatDateTime = (date: Date | string) => {
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      {/* Header */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between gap-4'>
          <div>
            <CardTitle className='text-2xl'>طلب #{id.slice(-8)}</CardTitle>
            <div className='mt-1 text-sm text-muted-foreground'>التاريخ: {formatDateTime(order.createdAt)}</div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge className='bg-blue-100 text-blue-800'>{order.status || 'غير معروف'}</Badge>
            {order?.driver ? (
              <Badge className='bg-sky-100 text-sky-800'>السائق: {order.driver?.name || order.driver?.phone}</Badge>
            ) : (
              <Badge variant={'destructive'} className='bg-red-100 text-red-800'>سائق غير معروف</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>العميل</div>
            <div className='text-sm font-medium'>{order?.customer?.name || 'غير معروف'}</div>
            {order?.customer?.phone && (
              <Link href={`tel:${order.customer?.phone}`} className='text-xs text-primary'>
                {order.customer?.phone}
              </Link>
            )}
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>العنوان</div>
            <div className='text-sm'>{order.address?.district || ''} {order.address?.street ? `- ${order.address.street}` : ''}</div>
          </div>
          <div className='text-right'>
            <div className='text-xs text-muted-foreground'>الإجمالي</div>
            <div className='text-xl font-bold text-primary'>{formatNumber(order.total)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>عناصر الطلب</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {order.items.map((item: any) => (
            <div key={item.id} className='flex items-center gap-3 p-3 rounded-lg border border-border/30'>
              {item.product?.image ? (
                <Image src={item.product.image} alt={item.product.name} width={56} height={56} className='rounded-md object-cover' />
              ) : (
                <div className='w-14 h-14 bg-muted rounded-md flex items-center justify-center'>
                  <Icon name='Package' size='sm' className='w-5 h-5 text-muted-foreground' />
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium truncate'>{item.product?.name}</div>
                <div className='text-xs text-muted-foreground mt-0.5'>الكمية: {item.quantity}</div>
              </div>
              <div className='text-sm font-medium'>{formatNumber((item.product?.price || 0) * item.quantity)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}



