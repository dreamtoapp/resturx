/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (defaults to SAR for backward compatibility)
 * @returns Formatted currency string
 */
export type CurrencyCode = 'SAR' | 'USD' | 'EGP' | 'AED';

const CURRENCY_CONFIG: Record<CurrencyCode, { locale: string; symbol: string }> = {
  SAR: { locale: 'ar-SA', symbol: 'ر.س' },
  USD: { locale: 'en-US', symbol: '$' },
  EGP: { locale: 'ar-EG', symbol: 'ج.م' },
  AED: { locale: 'ar-AE', symbol: 'د.إ' },
};

export function formatCurrency(amount: number, currency: CurrencyCode = 'SAR'): string {
  const config = CURRENCY_CONFIG[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code
 * @returns Currency symbol string
 */
export function getCurrencySymbol(currency: CurrencyCode = 'SAR'): string {
  return CURRENCY_CONFIG[currency].symbol;
}
