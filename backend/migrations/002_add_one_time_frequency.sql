-- Add one-time frequency option
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_frequency_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_frequency_check 
  CHECK (frequency IN ('one-time', 'daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annual'));

