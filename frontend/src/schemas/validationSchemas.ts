import { z } from 'zod';

/**
 * Transaction Form Validation Schema
 * Validates transaction data with proper error messages
 */
export const transactionSchema = z.object({
  vendor: z
    .string()
    .min(1, 'Vendor/Source is required')
    .min(2, 'Vendor must be at least 2 characters')
    .max(100, 'Vendor must be less than 100 characters'),

  description: z
    .string()
    .max(100, 'Description must be less than 100 characters')
    .optional(),

  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount is too large'),

  type: z
    .enum(['revenue', 'expense'], {
      errorMap: () => ({ message: 'Type must be revenue or expense' }),
    }),

  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),

  subcategory: z
    .string()
    .max(50, 'Subcategory must be less than 50 characters')
    .optional(),

  frequency: z
    .enum(['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annual', 'one-time'], {
      errorMap: () => ({ message: 'Invalid frequency' }),
    }),

  date: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),

  budgetName: z
    .string()
    .max(100, 'Budget name must be less than 100 characters')
    .optional(),

  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

/**
 * Budget Form Validation Schema
 * Validates budget data with proper error messages
 */
export const budgetSchema = z.object({
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  
  limit: z
    .number()
    .min(0.01, 'Budget limit must be greater than 0')
    .max(999999.99, 'Budget limit is too large'),
  
  threshold: z
    .number()
    .min(0, 'Threshold must be at least 0%')
    .max(100, 'Threshold must be at most 100%'),
}).refine(
  (data) => data.threshold > 0,
  {
    message: 'Alert threshold must be greater than 0%',
    path: ['threshold'],
  }
);

export type BudgetFormData = z.infer<typeof budgetSchema>;

/**
 * CSV Import Validation Schema
 * Validates CSV file data
 */
export const csvImportSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'File is empty')
    .refine((file) => file.type === 'text/csv' || file.name.endsWith('.csv'), 'File must be a CSV'),
});

export type CSVImportData = z.infer<typeof csvImportSchema>;

/**
 * Settings Form Validation Schema
 * Validates user settings
 */
export const settingsSchema = z.object({
  currency: z
    .enum(['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF'], {
      errorMap: () => ({ message: 'Invalid currency' }),
    }),
  
  locale: z
    .enum(['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'ja-JP', 'zh-CN'], {
      errorMap: () => ({ message: 'Invalid locale' }),
    }),
  
  theme: z
    .enum(['light', 'dark', 'system'], {
      errorMap: () => ({ message: 'Invalid theme' }),
    }),
  
  notifications: z
    .boolean()
    .default(true),
  
  emailNotifications: z
    .boolean()
    .default(false),
  
  autoBackup: z
    .boolean()
    .default(true),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

/**
 * Category Form Validation Schema
 * Validates category data
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be less than 50 characters'),
  
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  
  icon: z
    .string()
    .max(50, 'Icon must be less than 50 characters')
    .optional(),
  
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

/**
 * Utility function to format Zod errors for display
 */
export const formatZodErrors = (errors: z.ZodIssue[]) => {
  const formatted: Record<string, string> = {};
  errors.forEach((error) => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });
  return formatted;
};

/**
 * Utility function to get first error message
 */
export const getFirstErrorMessage = (errors: z.ZodIssue[]): string => {
  return errors[0]?.message || 'Validation failed';
};

