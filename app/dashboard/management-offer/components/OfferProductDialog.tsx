'use client';

import { useState, useTransition } from 'react';
import { Loader2, Plus } from 'lucide-react';
import AppDialog from '@/components/app-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createOfferProduct } from '../actions/create-offer-product';
import { toast } from 'sonner';

interface OfferProductDialogProps {
  offerId: string;
  supplierId: string; // Minimal requirement to satisfy Product.supplierId
  onCreated?: (productId: string) => void;
  trigger?: React.ReactNode;
}

export default function OfferProductDialog({ offerId, supplierId, onCreated, trigger }: OfferProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [details, setDetails] = useState('');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name || !price || !details) return;
    startTransition(async () => {
      const res = await createOfferProduct({
        offerId,
        name,
        price: Number(price),
        details,
        supplierId,
        imageUrl: null,
      });
      if (res.success) {
        toast.success('تم إنشاء المنتج بنجاح');
        setOpen(false);
        setName('');
        setPrice('');
        setDetails('');
        setMessage(null);
        onCreated?.(res.productId!);
      } else {
        setMessage(res.message || 'خطأ غير متوقع');
      }
    });
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || (
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة منتج للعرض
        </Button>
      )}
      title="منتج جديد للعرض"
      description="سيتم إنشاء المنتج كـ عرض فقط وربطه مباشرة بهذا العرض"
      mode="new"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم المنتج</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسم المنتج" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">السعر</Label>
          <Input id="price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="details">وصف المنتج *</Label>
          <Input id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="أدخل وصف المنتج" />
        </div>

        {message && <p className="text-sm text-destructive">{message}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => {
            setOpen(false);
            setName('');
            setPrice('');
            setDetails('');
            setMessage(null);
          }}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={isPending || !name || price === '' || !details}>
            {isPending ? (<><Loader2 className="h-4 w-4 animate-spin" /> جاري الحفظ...</>) : 'حفظ وإضافة'}
          </Button>
        </div>
      </div>
    </AppDialog>
  );
}


