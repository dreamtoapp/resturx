'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/icons/Icon';
import { useCartStore } from '@/stores/cartStore';

interface DishCategory {
  id: string;
  name: string;
  nameEn?: string | null;
}

interface RestaurantMenuTabProps {
  dishes: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    price: number;
    outOfStock: boolean;
    dishCategory?: DishCategory | null;
  }>;
  categories: DishCategory[];
  restaurantSlug: string;
  restaurantId: string;
  restaurantName: string;
}

export default function RestaurantMenuTab({ dishes, categories, restaurantSlug, restaurantId, restaurantName }: RestaurantMenuTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [pendingDish, setPendingDish] = useState<any>(null);

  const addItem = useCartStore(state => state.addItem);
  const setMetadata = useCartStore(state => state.setMetadata);
  const cartRestaurantId = useCartStore(state => state.restaurantId);
  const cartRestaurantName = useCartStore(state => state.restaurantName);
  const clearCart = useCartStore(state => state.clearCart);

  // Get only categories that exist in current dishes
  const existingCategories = categories.filter(category =>
    dishes.some(dish => dish.dishCategory?.id === category.id)
  );

  // Filter dishes based on selected category
  const filteredDishes = selectedCategory === 'all'
    ? dishes
    : dishes.filter(dish => dish.dishCategory?.id === selectedCategory);

  // Helper function to add item to cart
  const addToCartDirectly = (dish: any) => {
    setMetadata({
      restaurantId,
      restaurantName,
      tableNumber: null, // Will be set at checkout
      orderType: 'DINE_IN'
    });

    addItem({
      dishId: dish.id,
      dishName: dish.name,
      dishImage: dish.imageUrl,
      price: dish.price
    });
  };

  // Handle add to cart with restaurant check
  const handleAddToCart = (dish: any) => {
    // Check if switching restaurants
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      setPendingDish(dish);
      setShowSwitchDialog(true);
      return;
    }

    // Same restaurant or empty cart - add directly
    addToCartDirectly(dish);
  };

  // Handle confirm switching restaurants
  const handleConfirmSwitch = () => {
    clearCart();
    if (pendingDish) {
      addToCartDirectly(pendingDish);
    }
    setShowSwitchDialog(false);
    setPendingDish(null);
  };

  // Handle cancel switching
  const handleCancelSwitch = () => {
    setShowSwitchDialog(false);
    setPendingDish(null);
  };

  return (
    <>
      <AlertDialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تغيير المطعم؟</AlertDialogTitle>
            <AlertDialogDescription>
              لديك طلب من مطعم &quot;{cartRestaurantName}&quot;.
              هل تريد مسح الطلب الحالي والبدء بطلب جديد من &quot;{restaurantName}&quot;؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSwitch}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSwitch}>
              نعم، مسح الطلب السابق
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold">قائمة الطعام</h2>

          <div className="flex items-center gap-3">
            {/* Category Filter */}
            {existingCategories.length > 0 && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="كل الأصناف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأصناف</SelectItem>
                  {existingCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Link href={`/restaurant/${restaurantSlug}/menu`}>
              <button className="text-sm text-primary hover:underline">
                عرض القائمة الكاملة ←
              </button>
            </Link>
          </div>
        </div>

        {filteredDishes && filteredDishes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 bg-muted">
                  <Image
                    src={dish.imageUrl || '/placeholder.svg'}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                  {dish.outOfStock && (
                    <Badge className="absolute top-2 right-2" variant="destructive">
                      نفذ
                    </Badge>
                  )}
                  {dish.dishCategory && (
                    <Badge className="absolute top-2 left-2 bg-primary/90 text-white">
                      {dish.dishCategory.name}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{dish.name}</h3>
                  {dish.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {dish.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full shadow-md">
                      <span className="text-lg font-bold">{dish.price}</span>
                      <span className="text-sm font-medium">ريال</span>
                    </div>
                    <Link href={`/product/${dish.slug}`}>
                      <button className="text-sm text-primary hover:underline font-medium">
                        التفاصيل →
                      </button>
                    </Link>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(dish)}
                    disabled={dish.outOfStock}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
                    size="sm"
                  >
                    <Icon name="ShoppingCart" className="h-4 w-4 ml-2" />
                    {dish.outOfStock ? 'غير متوفر' : 'أضف إلى السلة'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {selectedCategory === 'all' ? 'لا توجد أطباق متاحة حالياً' : 'لا توجد أطباق في هذا الصنف'}
            </p>
          </Card>
        )}
      </div>
    </>
  );
}

