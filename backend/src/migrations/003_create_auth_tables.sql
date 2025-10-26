-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  picture TEXT,
  role VARCHAR(50) DEFAULT 'viewer',
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  module VARCHAR(50) NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  UNIQUE(role, module)
);

-- Insert default role permissions
-- Admin: Full access to everything
INSERT INTO role_permissions (role, module, can_view, can_edit, can_delete) VALUES
('admin', 'dashboard', true, true, true),
('admin', 'transactions', true, true, true),
('admin', 'budgets', true, true, true),
('admin', 'reports', true, true, true),
('admin', 'settings', true, true, true),
('admin', 'users', true, true, true);

-- Manager: Edit access to most modules, no settings
INSERT INTO role_permissions (role, module, can_view, can_edit, can_delete) VALUES
('manager', 'dashboard', true, true, false),
('manager', 'transactions', true, true, true),
('manager', 'budgets', true, true, true),
('manager', 'reports', true, true, false),
('manager', 'settings', false, false, false),
('manager', 'users', false, false, false);

-- Analyst: View and edit transactions/budgets, view reports
INSERT INTO role_permissions (role, module, can_view, can_edit, can_delete) VALUES
('analyst', 'dashboard', true, false, false),
('analyst', 'transactions', true, true, false),
('analyst', 'budgets', true, true, false),
('analyst', 'reports', true, false, false),
('analyst', 'settings', false, false, false),
('analyst', 'users', false, false, false);

-- Viewer: Read-only access to dashboard and transactions
INSERT INTO role_permissions (role, module, can_view, can_edit, can_delete) VALUES
('viewer', 'dashboard', true, false, false),
('viewer', 'transactions', true, false, false),
('viewer', 'budgets', false, false, false),
('viewer', 'reports', false, false, false),
('viewer', 'settings', false, false, false),
('viewer', 'users', false, false, false);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);

