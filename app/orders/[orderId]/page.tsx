import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';
import { PageProps } from '@/types/commonTypes';

const STATUS_MAP = {
  NEW: { label: 'جديد', color: 'bg-blue-500', icon: 'Clock' },
  PREPARING: { label: 'قيد التحضير', color: 'bg-yellow-500', icon: 'Clock' },
  READY: { label: 'جاهز', color: 'bg-green-500', icon: 'CheckCircle' },
  COMPLETED: { label: 'مكتمل', color: 'bg-gray-500', icon: 'Check' },
  CANCELLED: { label: 'ملغى', color: 'bg-red-500', icon: 'XCircle' }
};

export default async function OrderConfirmationPage({ params }: PageProps<{ orderId: string }>) {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const { orderId } = await params;

  const order = await prisma.dineInOrder.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      restaurant: {
        select: { name: true, phone: true, whatsapp: true }
      }
    }
  });

  if (!order) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-destructive mb-4">الطلب غير موجود</p>
        <Link href="/">
          <Button>العودة للصفحة الرئيسية</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status as keyof typeof STATUS_MAP];

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="p-6">
        <div className="text-center mb-6">
          <Icon name="CheckCircle2" className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">تم استلام طلبك بنجاح!</h1>
          <p className="text-muted-foreground">رقم الطلب: {order.orderNumber}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">الحالة</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon name={statusInfo.icon as any} className="h-4 w-4" />
                <Badge className={`${statusInfo.color} text-white`}>
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">رقم الطاولة</p>
              <p className="text-lg font-bold">{order.tableNumber}</p>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">المطعم</p>
            <p className="font-bold">{order.restaurant.name}</p>
            {order.restaurant.whatsapp && (
              <a
                href={`https://wa.me/${order.restaurant.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
              >
                <Icon name="MessageCircle" className="h-3 w-3" />
                تواصل عبر واتساب
              </a>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-bold mb-3">تفاصيل الطلب</h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.quantity}× {item.dishName}</span>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground">ملاحظات: {item.notes}</p>
                  )}
                </div>
                <span>{(item.quantity * item.price).toFixed(2)} ريال</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>المجموع الفرعي</span>
            <span>{order.subtotal.toFixed(2)} ريال</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>ضريبة القيمة المضافة ({(order.taxRate * 100)}%)</span>
            <span>{order.taxAmount.toFixed(2)} ريال</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2">
            <span>الإجمالي</span>
            <span className="text-primary">{order.total.toFixed(2)} ريال</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link href="/">
            <Button className="w-full" variant="outline">
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

