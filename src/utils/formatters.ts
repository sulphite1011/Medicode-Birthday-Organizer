/**
 * WishCraft Studio - Price & Currency Formatting Utilities
 * Standardizes price representation in PKR across both Admin and Client portals.
 */

export function formatPrice(price?: string | number | null): string {
  if (price === undefined || price === null) return 'PKR 1,500';
  const str = String(price).trim();
  if (!str) return 'PKR 1,500';

  // If already prefixed with currency indicators like PKR, Rs, $, etc.
  if (/^(pkr|rs\.?|\$|£|€)/i.test(str)) {
    return str;
  }

  // If purely numeric (e.g. "2000" or "1500" or "2,000")
  const numericOnly = str.replace(/,/g, '');
  const num = Number(numericOnly);
  if (!isNaN(num) && num > 0) {
    return `PKR ${num.toLocaleString('en-US')}`;
  }

  return `PKR ${str}`;
}
