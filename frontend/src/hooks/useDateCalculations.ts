/**
 * Custom Hook for Date Calculations
 * Provides utilities for date manipulation and month range calculations
 */

import { useMemo } from 'react';
import { CHART_CONFIG, FREQUENCY_MULTIPLIERS, Frequency } from '../config/constants';

interface Transaction {
  start_date: string;
  end_date?: string;
  frequency: Frequency;
}

/**
 * Generate month range (past and future)
 */
export const useMonthRange = (
  monthsBack: number = CHART_CONFIG.MONTHS_HISTORY,
  monthsForward: number = CHART_CONFIG.MONTHS_FORECAST
) => {
  return useMemo(() => {
    const months: string[] = [];

    // Past months
    for (let i = monthsBack; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthKey);
    }

    // Future months
    for (let i = 1; i <= monthsForward; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthKey);
    }

    return months;
  }, [monthsBack, monthsForward]);
};

/**
 * Get current month key (YYYY-MM format)
 */
export const useCurrentMonthKey = () => {
  return useMemo(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }, []);
};

/**
 * Calculate occurrences of a transaction in a given month
 */
export const useOccurrencesInMonth = (transaction: Transaction, monthKey: string) => {
  return useMemo(() => {
    const [year, month] = monthKey.split('-').map(Number);
    const startDate = new Date(transaction.start_date);
    const endDate = transaction.end_date ? new Date(transaction.end_date) : null;

    // Check if transaction is active in this month
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    if (startDate > monthEnd || (endDate && endDate < monthStart)) {
      return 0;
    }

    const freq = transaction.frequency as Frequency;
    if (freq === 'one-time') {
      const txMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
      return txMonth === monthKey ? 1 : 0;
    }

    // For recurring transactions, use multiplier
    return FREQUENCY_MULTIPLIERS[freq] || 0;
  }, [transaction, monthKey]);
};

/**
 * Format month key to readable format (e.g., "2024-10" -> "Oct 24")
 */
export const useFormatMonth = (monthKey: string) => {
  return useMemo(() => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }, [monthKey]);
};

/**
 * Check if a month is in the past
 */
export const useIsMonthInPast = (monthKey: string) => {
  const currentMonthKey = useCurrentMonthKey();
  return useMemo(() => {
    return monthKey <= currentMonthKey;
  }, [monthKey, currentMonthKey]);
};

