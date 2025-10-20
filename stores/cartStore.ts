import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  dishId: string;
  dishName: string;
  dishImage?: string;
  price: number;
  quantity: number;
  notes: string;
}

interface CartMetadata {
  restaurantId: string | null;
  restaurantName: string | null;
  tableNumber: number | null;
  orderType: 'DINE_IN' | 'DINE_OUT';
}

interface CartStore extends CartMetadata {
  items: CartItem[];
  setMetadata: (data: Partial<CartMetadata>) => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'notes'>) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  updateNotes: (dishId: string, notes: string) => void;
  removeItem: (dishId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      tableNumber: null,
      orderType: 'DINE_IN',

      setMetadata: (data) => {
        // Simply update metadata without clearing cart
        // Dialog will handle clearing when switching restaurants
        set(data);
      },

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(i => i.dishId === item.dishId);
        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          set({ items: [...items, { ...item, quantity: 1, notes: '' }] });
        }
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        set(state => ({
          items: state.items.map(item =>
            item.dishId === dishId ? { ...item, quantity } : item
          )
        }));
      },

      updateNotes: (dishId, notes) => {
        set(state => ({
          items: state.items.map(item =>
            item.dishId === dishId ? { ...item, notes } : item
          )
        }));
      },

      removeItem: (dishId) => {
        set(state => ({
          items: state.items.filter(item => item.dishId !== dishId)
        }));
      },

      clearCart: () => {
        set({
          items: [],
          restaurantId: null,
          restaurantName: null,
          tableNumber: null,
          orderType: 'DINE_IN'
        });
      },

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      getTax: () => get().getSubtotal() * 0.15,
      getTotal: () => get().getSubtotal() + get().getTax()
    }),
    {
      name: 'dine-in-cart',
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        tableNumber: state.tableNumber,
        orderType: state.orderType
      })
    }
  )
);

