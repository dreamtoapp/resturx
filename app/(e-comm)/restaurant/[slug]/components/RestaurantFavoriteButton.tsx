'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  addRestaurantToFavorite,
  removeRestaurantFromFavorite,
  isRestaurantInFavorites,
} from '../actions/restaurantFavoriteActions';

interface RestaurantFavoriteButtonProps {
  restaurantId: string;
  restaurantName: string;
}

export default function RestaurantFavoriteButton({
  restaurantId,
}: RestaurantFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Check favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      setIsCheckingFavorite(true);
      const inFavorites = await isRestaurantInFavorites(restaurantId);
      setIsFavorite(inFavorites);
      setIsCheckingFavorite(false);
    };
    checkFavorite();
  }, [restaurantId]);

  const handleFavoriteClick = async () => {
    setIsTogglingFavorite(true);

    const result = isFavorite
      ? await removeRestaurantFromFavorite(restaurantId)
      : await addRestaurantToFavorite(restaurantId);

    setIsTogglingFavorite(false);

    if (result.success) {
      setIsFavorite(!isFavorite);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <button
      onClick={handleFavoriteClick}
      disabled={isCheckingFavorite || isTogglingFavorite}
      className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-muted hover:border-primary/50 transition-all group disabled:opacity-50"
      title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
    >
      {isTogglingFavorite ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={`h-5 w-5 transition-colors ${isFavorite
            ? 'fill-red-500 text-red-500'
            : 'group-hover:text-primary'
            }`}
        />
      )}
    </button>
  );
}

