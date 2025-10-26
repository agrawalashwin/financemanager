const jwt = require('jsonwebtoken');

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Check if auth bypass is enabled (localhost development only)
const AUTH_BYPASS = process.env.AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Bypass auth for localhost development if enabled
  if (AUTH_BYPASS) {
    console.log('⚠️  AUTH BYPASS ENABLED - Development mode only');
    req.user = {
      id: 'dev-user-id',
      email: 'dev@localhost',
      role: 'admin'
    };
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user has permission for a module
const checkPermission = (module, action = 'view') => {
  return async (req, res, next) => {
    try {
      const { pool } = req.app.locals;
      const userId = req.user.id;

      // Get user's role
      const userResult = await pool.query(
        'SELECT role FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const role = userResult.rows[0].role;

      // Check permissions
      const permissionResult = await pool.query(
        'SELECT * FROM role_permissions WHERE role = $1 AND module = $2',
        [role, module]
      );

      if (permissionResult.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied to this module' });
      }

      const permissions = permissionResult.rows[0];

      // Check specific action
      if (action === 'view' && !permissions.can_view) {
        return res.status(403).json({ error: 'No view permission' });
      }
      if (action === 'edit' && !permissions.can_edit) {
        return res.status(403).json({ error: 'No edit permission' });
      }
      if (action === 'delete' && !permissions.can_delete) {
        return res.status(403).json({ error: 'No delete permission' });
      }

      // Store permissions in request for later use
      req.permissions = permissions;
      req.userRole = role;

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const { pool } = req.app.locals;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Admin check failed' });
  }
};

module.exports = {
  authenticateToken,
  checkPermission,
  requireAdmin,
  JWT_SECRET
};

