'use client';

import { useEffect } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import { CurrencyCode } from '@/lib/formatCurrency';

interface CurrencyInitializerProps {
  currency: CurrencyCode;
}

export function CurrencyInitializer({ currency }: CurrencyInitializerProps) {
  const initializeCurrency = useCurrencyStore((state) => state.initializeCurrency);

  useEffect(() => {
    // Initialize currency store with server-provided currency
    initializeCurrency(currency);
  }, [currency, initializeCurrency]);

  // This component doesn't render anything visible
  return null;
}
