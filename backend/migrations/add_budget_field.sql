-- Add budget_name field to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS budget_name VARCHAR(100);

-- Create index for faster budget queries
CREATE INDEX IF NOT EXISTS idx_transactions_budget_name ON transactions(budget_name);

