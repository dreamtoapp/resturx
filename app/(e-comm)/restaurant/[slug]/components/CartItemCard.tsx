'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useState } from 'react';
import { useCartStore, CartItem } from '@/stores/cartStore';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(item.notes);

  const updateQuantity = useCartStore(state => state.updateQuantity);
  const updateNotes = useCartStore(state => state.updateNotes);
  const removeItem = useCartStore(state => state.removeItem);

  const handleSaveNotes = () => {
    updateNotes(item.dishId, notesValue);
    setShowNotes(false);
  };

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex gap-3">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
          {item.dishImage && (
            <Image src={item.dishImage} alt={item.dishName} fill className="object-cover" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{item.dishName}</h4>
          <p className="text-sm text-primary font-bold">{item.price} ريال</p>

          <div className="flex items-center gap-2 mt-2">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
            >
              <Icon name="Minus" className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
            >
              <Icon name="Plus" className="h-3 w-3" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive ml-auto"
              onClick={() => removeItem(item.dishId)}
            >
              <Icon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {!showNotes && !item.notes && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setShowNotes(true)}
        >
          <Icon name="Plus" className="h-3 w-3 ml-1" />
          إضافة ملاحظات
        </Button>
      )}

      {(showNotes || item.notes) && (
        <div className="space-y-2">
          <Textarea
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            placeholder="ملاحظات خاصة..."
            className="text-xs"
            rows={2}
          />
          {showNotes && (
            <Button size="sm" className="w-full" onClick={handleSaveNotes}>
              حفظ
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

