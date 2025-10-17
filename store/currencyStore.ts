// Zustand currency store: global currency state management
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrencyCode } from '@/lib/formatCurrency';

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  initializeCurrency: (currency: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'SAR', // Default fallback
      setCurrency: (currency) => set({ currency }),
      initializeCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'currency-storage', // localStorage key
      partialize: (state) => ({ currency: state.currency }),
    }
  )
);

// Convenience hook for easier usage
export const useCurrency = () => {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  return { currency, setCurrency };
};
