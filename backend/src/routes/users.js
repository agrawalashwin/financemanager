const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /users - Get all users
router.get('/', async (req, res) => {
  try {
    const { pool } = req.app.locals;

    const result = await pool.query(
      `SELECT id, email, name, picture, role, created_at, last_login, is_active
       FROM users
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// GET /users/:id - Get specific user
router.get('/:id', async (req, res) => {
  try {
    const { pool } = req.app.locals;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, email, name, picture, role, created_at, last_login, is_active
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PATCH /users/:id/role - Update user role
router.patch('/:id/role', async (req, res) => {
  try {
    const { pool } = req.app.locals;
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['admin', 'manager', 'analyst', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent user from changing their own role
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const result = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING id, email, name, picture, role, created_at, last_login, is_active`,
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User role updated: ${result.rows[0].email} -> ${role}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// PATCH /users/:id/status - Activate/deactivate user
router.patch('/:id/status', async (req, res) => {
  try {
    const { pool } = req.app.locals;
    const { id } = req.params;
    const { is_active } = req.body;

    // Prevent user from deactivating themselves
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }

    const result = await pool.query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2
       RETURNING id, email, name, picture, role, created_at, last_login, is_active`,
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User status updated: ${result.rows[0].email} -> ${is_active ? 'active' : 'inactive'}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE /users/:id - Delete user (soft delete by deactivating)
router.delete('/:id', async (req, res) => {
  try {
    const { pool } = req.app.locals;
    const { id } = req.params;

    // Prevent user from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const result = await pool.query(
      `UPDATE users
       SET is_active = false
       WHERE id = $1
       RETURNING id, email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User deleted: ${result.rows[0].email}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;

