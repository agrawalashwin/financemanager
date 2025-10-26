const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo mode
let demoTransactions = [];

// Database connection
let pool = null;
let useDemo = false;

// Async function to run migrations
async function runMigrations() {
  // Run auth tables migration
  try {
    const authMigrationPath = path.join(__dirname, 'migrations', '003_create_auth_tables.sql');
    if (fs.existsSync(authMigrationPath)) {
      const migrationSQL = fs.readFileSync(authMigrationPath, 'utf8');
      await pool.query(migrationSQL);
      console.log('✅ Auth tables migration completed');
    }
  } catch (error) {
    // Ignore duplicate key errors (migration already ran)
    if (error.code !== '23505') {
      console.error('❌ Auth migration error:', error.message);
    }
  }

  // Run budget field migration
  try {
    const budgetMigrationPath = path.join(__dirname, '../migrations/add_budget_field.sql');
    if (fs.existsSync(budgetMigrationPath)) {
      const migrationSQL = fs.readFileSync(budgetMigrationPath, 'utf8');
      await pool.query(migrationSQL);
      console.log('✅ Budget field migration completed');
    }
  } catch (error) {
    console.error('❌ Budget field migration error:', error.message);
  }

  // Run budgets table migration
  try {
    const budgetsTableMigrationPath = path.join(__dirname, '../migrations/004_create_budgets_table.sql');
    if (fs.existsSync(budgetsTableMigrationPath)) {
      const migrationSQL = fs.readFileSync(budgetsTableMigrationPath, 'utf8');
      await pool.query(migrationSQL);
      console.log('✅ Budgets table migration completed');
    }
  } catch (error) {
    console.error('❌ Budgets table migration error:', error.message);
  }

  // Run budget frequency migration
  try {
    const budgetFrequencyMigrationPath = path.join(__dirname, '../migrations/005_add_budget_frequency.sql');
    if (fs.existsSync(budgetFrequencyMigrationPath)) {
      const migrationSQL = fs.readFileSync(budgetFrequencyMigrationPath, 'utf8');
      await pool.query(migrationSQL);
      console.log('✅ Budget frequency migration completed');
    } else {
      console.log('⚠️ Budget frequency migration file not found at:', budgetFrequencyMigrationPath);
    }
  } catch (error) {
    console.error('❌ Budget frequency migration error:', error.message);
  }
}

try {
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
  });

  // Run migrations synchronously
  runMigrations().catch(err => console.error('Failed to run migrations:', err));
} catch (error) {
  console.warn('Database connection failed, using demo mode');
  useDemo = true;
}

// Make pool available to routes
app.locals.pool = pool;

// Import auth routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Auth routes (no authentication required)
app.use('/api/auth', authRoutes);

// User management routes (admin only)
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all transactions for a user
app.get('/api/transactions', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY start_date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { userId, type, category, subcategory, vendor, amount, frequency, startDate, endDate, description, recurringGroupId, budgetName } = req.body;

    if (!userId || !type || !category || !vendor || !amount || !frequency || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, category, subcategory, vendor, amount, frequency, start_date, end_date, description, recurring_group_id, budget_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        userId,
        type,
        category,
        subcategory || null,
        vendor,
        amount,
        frequency,
        startDate,
        endDate || null,
        description || null,
        recurringGroupId || null,
        budgetName || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, subcategory, vendor, amount, frequency, startDate, endDate, description, editAllInSeries, budgetName } = req.body;

    // If editAllInSeries is true and transaction has a recurring_group_id, update all in the series
    if (editAllInSeries) {
      const transaction = await pool.query('SELECT recurring_group_id FROM transactions WHERE id = $1', [id]);

      if (transaction.rows.length > 0 && transaction.rows[0].recurring_group_id) {
        const result = await pool.query(
          `UPDATE transactions
           SET type = $1, category = $2, subcategory = $3, vendor = $4, amount = $5, frequency = $6, start_date = $7, end_date = $8, description = $9, budget_name = $10, updated_at = CURRENT_TIMESTAMP
           WHERE recurring_group_id = $11 AND is_exception = FALSE
           RETURNING *`,
          [
            type,
            category,
            subcategory || null,
            vendor,
            amount,
            frequency,
            startDate,
            endDate || null,
            description || null,
            budgetName || null,
            transaction.rows[0].recurring_group_id
          ]
        );
        return res.json(result.rows);
      }
    }

    // Update only this transaction (mark as exception if it's part of a series)
    const result = await pool.query(
      `UPDATE transactions
       SET type = $1, category = $2, subcategory = $3, vendor = $4, amount = $5, frequency = $6, start_date = $7, end_date = $8, description = $9, budget_name = $10, is_exception = TRUE, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        type,
        category,
        subcategory || null,
        vendor,
        amount,
        frequency,
        startDate,
        endDate || null,
        description || null,
        budgetName || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Get summary data for dashboard
app.get('/api/summary', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await pool.query(
      `SELECT type, category, SUM(amount) as total
       FROM transactions
       WHERE user_id = $1
       GROUP BY type, category`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Get all budgets for a user
app.get('/api/budgets', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await pool.query(
      `SELECT id, name, category, limit_amount as limit, threshold, frequency, created_at, updated_at
       FROM budgets
       WHERE user_id = $1
       ORDER BY name`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create a new budget
app.post('/api/budgets', async (req, res) => {
  try {
    const { userId, name, category, limit, threshold, frequency } = req.body;

    console.log('📝 Create budget request:', {
      userId,
      name,
      category,
      limit,
      threshold,
      frequency,
      fullBody: req.body
    });

    if (!userId || !name || !limit) {
      console.error('❌ Missing required fields:', { userId, name, limit });
      return res.status(400).json({
        error: 'Missing required fields: userId, name, limit',
        received: { userId, name, limit }
      });
    }

    const result = await pool.query(
      `INSERT INTO budgets (user_id, name, category, limit_amount, threshold, frequency)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, category, limit_amount as limit, threshold, frequency, created_at, updated_at`,
      [userId, name, category || name, parseFloat(limit), threshold || 80, frequency || 'monthly']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'Budget with this name already exists' });
    }
    console.error('Error creating budget:', error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Update a budget
app.put('/api/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, limit, threshold, frequency } = req.body;

    const result = await pool.query(
      `UPDATE budgets
       SET name = $1, category = $2, limit_amount = $3, threshold = $4, frequency = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, name, category, limit_amount as limit, threshold, frequency, created_at, updated_at`,
      [name, category || name, parseFloat(limit), threshold, frequency || 'monthly', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete a budget
app.delete('/api/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM budgets WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// Get future occurrences of a recurring transaction
app.get('/api/transactions/:id/future', async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date();

    // Get the transaction details
    const txResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (txResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = txResult.rows[0];

    // If it's a one-time transaction, return empty
    if (transaction.frequency === 'one-time') {
      return res.json([]);
    }

    // Check if there are actual future occurrences in the database
    const existingResult = await pool.query(
      `SELECT id, start_date as date, amount, description, frequency
       FROM transactions
       WHERE recurring_group_id = $1 AND start_date > $2
       ORDER BY start_date ASC
       LIMIT 12`,
      [transaction.recurring_group_id || id, today.toISOString().split('T')[0]]
    );

    // If there are existing future occurrences, return them
    if (existingResult.rows.length > 0) {
      return res.json(existingResult.rows);
    }

    // Otherwise, generate future occurrences on-the-fly
    const futureOccurrences = [];
    const startDate = new Date(transaction.start_date);
    const endDate = transaction.end_date ? new Date(transaction.end_date) : null;

    let currentDate = new Date(startDate);

    // Generate next 12 occurrences
    for (let i = 0; i < 12; i++) {
      // Calculate next occurrence based on frequency
      switch (transaction.frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'bi-weekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'quarterly':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case 'semi-annually':
          currentDate.setMonth(currentDate.getMonth() + 6);
          break;
        case 'annually':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }

      // Only include future dates
      if (currentDate > today) {
        // Check if we've passed the end date
        if (endDate && currentDate > endDate) {
          break;
        }

        futureOccurrences.push({
          id: transaction.id, // Use the same ID since these are virtual occurrences
          date: currentDate.toISOString().split('T')[0],
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          frequency: transaction.frequency,
          isVirtual: true // Flag to indicate this is a generated occurrence
        });
      }
    }

    res.json(futureOccurrences);
  } catch (error) {
    console.error('Error fetching future occurrences:', error);
    res.status(500).json({ error: 'Failed to fetch future occurrences' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

