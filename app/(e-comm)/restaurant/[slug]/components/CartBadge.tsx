'use client';

import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { useState, useEffect } from 'react';

export default function CartBadge({ restaurantId }: { restaurantId: string }) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore(state => state.items);
  const cartRestaurantId = useCartStore(state => state.restaurantId);

  // Wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isCurrentRestaurant = cartRestaurantId === restaurantId;
  const itemCount = isCurrentRestaurant ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  if (itemCount === 0) return null;

  return (
    <Badge variant="secondary" className="ml-2">
      {itemCount}
    </Badge>
  );
}

