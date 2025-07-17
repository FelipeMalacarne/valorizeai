export function formatCurrency(
  cents: number,
  currency: string = 'USD',
  locale: string = navigator.language || 'en-US'
): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}
