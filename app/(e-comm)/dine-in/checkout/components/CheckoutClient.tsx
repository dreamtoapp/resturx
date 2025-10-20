'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createDineInOrderAction } from '@/app/actions/dineInOrders';
import { getAvailableTables } from '../actions/getAvailableTables';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';

interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [tableError, setTableError] = useState<string>('');
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(true);

  const items = useCartStore(state => state.items);
  const restaurantId = useCartStore(state => state.restaurantId);
  const restaurantName = useCartStore(state => state.restaurantName);
  const clearCart = useCartStore(state => state.clearCart);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const getTax = useCartStore(state => state.getTax);
  const getTotal = useCartStore(state => state.getTotal);

  // Fetch available tables and check for QR code table
  useEffect(() => {
    const fetchTables = async () => {
      if (!restaurantId) return;

      setIsLoadingTables(true);
      const availableTables = await getAvailableTables(restaurantId);
      setTables(availableTables);
      setIsLoadingTables(false);

      // Check for table number from QR code (URL param)
      const qrTable = searchParams?.get('table');
      if (qrTable) {
        setTableNumber(qrTable);
      }
    };

    fetchTables();
  }, [restaurantId, searchParams]);

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">السلة فارغة</p>
        <Button
          onClick={() => router.push('/')}
          className="mt-4"
        >
          العودة للصفحة الرئيسية
        </Button>
      </Card>
    );
  }

  if (!restaurantId) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">معلومات المطعم غير مكتملة</p>
        <Button
          onClick={() => router.push('/')}
          className="mt-4"
        >
          العودة للصفحة الرئيسية
        </Button>
      </Card>
    );
  }

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  const handleSubmit = async () => {
    // Validate table number
    if (!tableNumber || tableNumber.trim() === '') {
      setTableError('يرجى اختيار طاولة');
      return;
    }

    setTableError('');
    setIsSubmitting(true);

    try {
      const result = await createDineInOrderAction(restaurantId, tableNumber, items);
      if (result.success) {
        clearCart();
        router.push(`/orders/${result.orderId}`);
      } else {
        alert(result.message || 'حدث خطأ. يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      alert('حدث خطأ. يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">تأكيد الطلب</h2>

      <div className="mb-6 space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>المطعم:</strong> {restaurantName}
          </p>
        </div>

        {/* Table Selection */}
        <div className="space-y-2">
          <Label htmlFor="table-select" className="text-base font-semibold">
            اختر الطاولة <span className="text-destructive">*</span>
          </Label>
          {isLoadingTables ? (
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Icon name="Loader2" className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">جاري تحميل الطاولات...</span>
            </div>
          ) : tables.length === 0 ? (
            <div className="p-4 border rounded-md bg-muted">
              <p className="text-sm text-muted-foreground">
                لا توجد طاولات متاحة حالياً. يرجى المحاولة لاحقاً.
              </p>
            </div>
          ) : (
            <Select
              value={tableNumber}
              onValueChange={(value) => {
                setTableNumber(value);
                setTableError('');
              }}
            >
              <SelectTrigger id="table-select" className={tableError ? 'border-destructive' : ''}>
                <SelectValue placeholder="اختر طاولة متاحة" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.tableNumber}>
                    طاولة {table.tableNumber} ({table.capacity} مقاعد)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {tableError && (
            <p className="text-sm text-destructive">{tableError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            يمكنك مسح رمز QR الموجود على الطاولة للانتقال المباشر
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.dishId} className="flex justify-between border-b pb-2">
            <div>
              <p className="font-medium">{item.dishName}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity} × {item.price} ريال
              </p>
              {item.notes && (
                <p className="text-xs text-muted-foreground">ملاحظات: {item.notes}</p>
              )}
            </div>
            <p className="font-medium">{(item.quantity * item.price).toFixed(2)} ريال</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ريال</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>ضريبة القيمة المضافة (15%)</span>
          <span>{tax.toFixed(2)} ريال</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-2">
          <span>الإجمالي</span>
          <span className="text-primary">{total.toFixed(2)} ريال</span>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600"
        size="lg"
      >
        {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
      </Button>
    </Card>
  );
}

