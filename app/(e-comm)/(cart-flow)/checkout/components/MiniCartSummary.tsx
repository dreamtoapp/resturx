import { ShoppingCart, Tag, Truck, Receipt, Percent, Sparkles, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '../../../../../lib/formatCurrency';
import CartItemsToggle from './client/CartItemsToggle';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';
import { useCurrency } from '@/store/currencyStore';

interface PlatformSettings {
  taxPercentage: number;
  shippingFee: number;
  minShipping: number;
}

interface MiniCartSummaryProps {
  platformSettings: PlatformSettings;
}

export default function MiniCartSummary({ platformSettings }: MiniCartSummaryProps) {
  const { cart: zustandCart } = useCartStore();
  const { currency } = useCurrency();
  const items = Object.values(zustandCart);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = subtotal >= platformSettings.minShipping ? 0 : platformSettings.shippingFee;
  const taxAmount = subtotal * (platformSettings.taxPercentage / 100);
  const total = subtotal + deliveryFee + taxAmount;
  const totalItems = items.length;
  const isFreeDelivery = subtotal >= platformSettings.minShipping;

  if (!items.length) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <ShoppingCart className="h-6 w-6 text-orange-600" />
            ملخص الطلب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-orange-800 font-medium mb-2">السلة فارغة</p>
              <p className="text-sm text-orange-600">يجب إضافة منتجات للمتابعة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border border-slate-200 bg-white md:sticky md:top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg md:text-xl font-bold text-slate-900 mb-3">
          <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-blue-700" />
          ملخص الطلب
        </CardTitle>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Badge className="px-2 py-1 md:px-3 md:py-1.5 bg-blue-600 text-white rounded-full font-semibold text-sm md:text-base">
            {totalItems} منتج
          </Badge>
          {isFreeDelivery && (
            <Badge className="px-2 py-1 md:px-3 md:py-1.5 bg-emerald-600 text-white rounded-full font-semibold flex items-center gap-1 md:gap-1.5 text-sm md:text-base">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">توصيل مجاني!</span>
              <span className="sm:hidden">مجاني</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 md:space-y-4">
        {/* Pricing Breakdown */}
        <div className="space-y-2 md:space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-2 md:gap-3">
              <Tag className="h-3 w-3 md:h-4 md:w-4 text-blue-700 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-sm md:text-base">الإجمالي الفرعي</span>
            </div>
            <span className="font-bold text-slate-900 text-sm md:text-base">{formatCurrency(subtotal, currency)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <Truck className="h-3 w-3 md:h-4 md:w-4 text-green-700 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-sm md:text-base">رسوم التوصيل</span>
              {isFreeDelivery && (
                <Badge className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-emerald-600 text-white text-xs md:text-sm font-semibold rounded-full flex-shrink-0">
                  مجاني
                </Badge>
              )}
            </div>
            <span className={`font-bold text-sm md:text-base ${isFreeDelivery ? 'text-emerald-700' : 'text-slate-900'} flex-shrink-0`}>
              {isFreeDelivery ? (
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="line-through text-slate-500 text-xs md:text-sm">{formatCurrency(platformSettings.shippingFee, currency)}</span>
                  <span className="text-emerald-700">مجاني</span>
                </span>
              ) : (
                formatCurrency(deliveryFee, currency)
              )}
            </span>
          </div>

          {/* Free Delivery Progress */}
          {!isFreeDelivery && (
            <div className="p-3 md:p-4 bg-blue-100 border border-blue-300 rounded-xl">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <span className="font-semibold text-blue-900 text-sm md:text-base">التوصيل المجاني</span>
                <span className="text-blue-800 font-bold text-sm md:text-base">
                  {Math.round((subtotal / platformSettings.minShipping) * 100)}%
                </span>
              </div>

              <div className="mb-2 md:mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs md:text-sm text-blue-800 mb-2">
                  <span className="font-medium">أضف {formatCurrency(platformSettings.minShipping - subtotal, currency)}</span>
                  <Badge className="px-1.5 py-0.5 md:px-2 md:py-1 bg-blue-600 text-white text-xs md:text-sm font-semibold rounded-full self-start sm:self-auto">
                    {formatCurrency(platformSettings.minShipping, currency)} الحد الأدنى
                  </Badge>
                </div>
              </div>

              <div className="w-full bg-blue-300 h-2 md:h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 md:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / platformSettings.minShipping) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Tax */}
          <div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <Percent className="h-3 w-3 md:h-4 md:w-4 text-purple-700 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-sm md:text-base">ضريبة القيمة المضافة ({platformSettings.taxPercentage}%)</span>
            </div>
            <span className="font-bold text-slate-900 text-sm md:text-base flex-shrink-0">{formatCurrency(taxAmount, currency)}</span>
          </div>

          <Separator className="my-3 md:my-6" />

          {/* Total */}
          <div className="p-3 md:p-4 bg-blue-100 border border-blue-300 rounded-xl">
            <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3">
                <Receipt className="h-4 w-4 md:h-5 md:w-5 text-blue-700" />
                <span className="text-lg md:text-xl font-bold text-blue-900">الإجمالي النهائي</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-blue-900">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-3 md:my-6" />

        {/* Cart Items Toggle */}
        <CartItemsToggle items={items.map(item => ({ ...item, id: item.product.id }))} />

        {/* Security Notice */}
        <div className="p-3 md:p-4 bg-emerald-100 border border-emerald-300 rounded-xl">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <Shield className="h-3 w-3 md:h-4 md:w-4 text-emerald-700 flex-shrink-0" />
            <span className="font-semibold text-emerald-900 text-sm md:text-base">معاملة آمنة</span>
          </div>
          <p className="text-xs md:text-sm text-emerald-800 text-center">جميع بياناتك محمية ومشفرة</p>
        </div>
      </CardContent>
    </Card>
  );
}
