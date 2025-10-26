import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_BYPASS = import.meta.env.VITE_AUTH_BYPASS === 'true';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    // Bypass auth for localhost development if enabled
    if (AUTH_BYPASS) {
      console.log('⚠️  AUTH BYPASS ENABLED - Development mode only');
      setUser({
        id: 'dev-user-id',
        email: 'dev@localhost',
        name: 'Dev User',
        role: 'admin',
        picture: null
      });
      setPermissions({
        dashboard: { view: true, edit: true, delete: true },
        transactions: { view: true, edit: true, delete: true },
        budgets: { view: true, edit: true, delete: true },
        reports: { view: true, edit: true, delete: true },
        settings: { view: true, edit: true, delete: true }
      });
      setLoading(false);
      return;
    }

    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired, clearing...');
          logout();
        } else {
          setToken(storedToken);
          // Fetch user data
          fetchUserData(storedToken);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data from backend
  const fetchUserData = async (authToken) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      setUser(response.data.user);
      setPermissions(response.data.user.permissions || {});
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  };

  // Login with Google credential
  const loginWithGoogle = async (credential) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/google`, {
        credential
      });

      const { token: authToken, user: userData } = response.data;

      // Store token
      localStorage.setItem('authToken', authToken);
      setToken(authToken);
      setUser(userData);
      setPermissions(userData.permissions || {});
      setLoading(false);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setPermissions({});
      setLoading(false);
    }
  };

  // Check if user has permission for a module
  const hasPermission = (module, action = 'view') => {
    if (!permissions[module]) return false;
    return permissions[module][action] === true;
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    token,
    permissions,
    loading,
    loginWithGoogle,
    logout,
    hasPermission,
    hasRole,
    isAdmin,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

