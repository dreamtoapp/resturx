'use client';

import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CartItemCard from './CartItemCard';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';

interface RestaurantCartTabProps {
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
}

export default function RestaurantCartTab({ restaurantId }: RestaurantCartTabProps) {
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const cartRestaurantId = useCartStore(state => state.restaurantId);
  const clearCart = useCartStore(state => state.clearCart);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const getTax = useCartStore(state => state.getTax);
  const getTotal = useCartStore(state => state.getTotal);

  // Filter items for THIS restaurant only
  const isCurrentRestaurant = cartRestaurantId === restaurantId;
  const restaurantItems = isCurrentRestaurant ? items : [];

  if (restaurantItems.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="ShoppingCart" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">السلة فارغة</h3>
        <p className="text-sm text-muted-foreground mb-4">
          أضف أطباق من قائمة الطعام لتظهر هنا
        </p>
        <Button
          onClick={() => {
            // Switch to menu tab
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

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Cart Items - Left Side */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">عناصر السلة ({restaurantItems.length})</h3>
          <Button
            onClick={clearCart}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Icon name="Trash" className="h-4 w-4 ml-2" />
            مسح السلة
          </Button>
        </div>

        {restaurantItems.map(item => (
          <CartItemCard key={item.dishId} item={item} />
        ))}
      </div>

      {/* Summary - Right Side (Sticky) */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span className="font-medium">{subtotal.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
              <span className="font-medium">{tax.toFixed(2)} ريال</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>الإجمالي</span>
              <span className="text-primary">{total.toFixed(2)} ريال</span>
            </div>
          </div>

          <Button
            onClick={() => router.push('/dine-in/checkout')}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            size="lg"
          >
            <Icon name="CheckCircle" className="h-5 w-5 ml-2" />
            اعتماد الطلب
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-3">
            شاهد طلباتك السابقة في تبويب &quot;طلباتي&quot;
          </p>
        </Card>
      </div>
    </div>
  );
}

