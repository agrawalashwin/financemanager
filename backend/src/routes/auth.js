const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Google OAuth client - will be initialized with client ID from env
let googleClient = null;

const initGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId) {
    googleClient = new OAuth2Client(clientId);
    console.log('Google OAuth client initialized');
  } else {
    console.warn('GOOGLE_CLIENT_ID not set in environment variables');
  }
};

// Initialize on module load
initGoogleClient();

// POST /auth/google - Verify Google token and create/login user
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!googleClient) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const { pool } = req.app.locals;

    // Check if user exists
    let userResult = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    let user;

    if (userResult.rows.length === 0) {
      // Create new user
      // First user becomes admin, others become viewer by default
      const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
      const userCount = parseInt(userCountResult.rows[0].count);
      const role = userCount === 0 ? 'admin' : 'viewer';

      const insertResult = await pool.query(
        `INSERT INTO users (google_id, email, name, picture, role, last_login)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [googleId, email, name, picture, role]
      );

      user = insertResult.rows[0];
      console.log(`New user created: ${email} with role: ${role}`);
    } else {
      // Update existing user
      user = userResult.rows[0];

      // Update last login and sync Google data
      await pool.query(
        `UPDATE users 
         SET last_login = NOW(), 
             google_id = COALESCE(google_id, $1),
             name = $2,
             picture = $3
         WHERE id = $4`,
        [googleId, name, picture, user.id]
      );

      console.log(`User logged in: ${email}`);
    }

    // Get user permissions
    const permissionsResult = await pool.query(
      'SELECT module, can_view, can_edit, can_delete FROM role_permissions WHERE role = $1',
      [user.role]
    );

    const permissions = {};
    permissionsResult.rows.forEach(row => {
      permissions[row.module] = {
        view: row.can_view,
        edit: row.can_edit,
        delete: row.can_delete
      };
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Return user data and token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        permissions
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Authentication failed', details: error.message });
  }
});

// GET /auth/me - Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { pool } = req.app.locals;
    const userId = req.user.id;

    const userResult = await pool.query(
      'SELECT id, email, name, picture, role, created_at, last_login FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get permissions
    const permissionsResult = await pool.query(
      'SELECT module, can_view, can_edit, can_delete FROM role_permissions WHERE role = $1',
      [user.role]
    );

    const permissions = {};
    permissionsResult.rows.forEach(row => {
      permissions[row.module] = {
        view: row.can_view,
        edit: row.can_edit,
        delete: row.can_delete
      };
    });

    res.json({
      user: {
        ...user,
        permissions
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// POST /auth/logout - Logout (client-side token removal, but we log it)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    console.log(`User logged out: ${req.user.email}`);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;

