/**
 * Format currency values
 * @param valueMinor - Amount in minor units (cents)
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @param notation - 'standard' | 'compact' | 'scientific'
 */
export function formatCurrency(
  valueMinor: number,
  currencyCode: string = 'USD',
  notation: 'standard' | 'compact' | 'scientific' = 'standard'
): string {
  const value = valueMinor / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    notation,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number with optional notation
 */
export function formatNumber(
  value: number,
  notation: 'standard' | 'compact' | 'scientific' = 'standard'
): string {
  return new Intl.NumberFormat('en-US', {
    notation,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  }

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format month (e.g., "Oct 2025")
 */
export function formatMonth(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time (e.g., "2:30 PM")
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: 'short',
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(d, 'short');
}

/**
 * Convert minor units to major units
 */
export function minorToMajor(valueMinor: number): number {
  return valueMinor / 100;
}

/**
 * Convert major units to minor units
 */
export function majorToMinor(valueMajor: number): number {
  return Math.round(valueMajor * 100);
}

