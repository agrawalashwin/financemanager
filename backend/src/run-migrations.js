const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || '/cloudsql/mobiuschatgpt:us-central1:financialmanager-db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'financialmanager',
  port: process.env.DB_PORT || 5432,
});

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // Read and execute the migration
    const migrationPath = path.join(__dirname, '../migrations/add_budget_field.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(migrationSQL);
    console.log('✅ Migration completed successfully');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();

