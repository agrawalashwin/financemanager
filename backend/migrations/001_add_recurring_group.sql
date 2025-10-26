-- Add recurring_group_id to track recurring transaction series
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_group_id UUID;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_exception BOOLEAN DEFAULT FALSE;

-- Create index for recurring_group_id
CREATE INDEX IF NOT EXISTS idx_transactions_recurring_group_id ON transactions(recurring_group_id);

