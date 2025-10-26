-- Add frequency field to budgets table
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS frequency VARCHAR(20) DEFAULT 'monthly';

-- Add check constraint for valid frequency values
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_frequency_check;
ALTER TABLE budgets ADD CONSTRAINT budgets_frequency_check 
  CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual'));

-- Create index on frequency for faster queries
CREATE INDEX IF NOT EXISTS idx_budgets_frequency ON budgets(frequency);

