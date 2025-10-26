import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, module, action = 'view', requireAdmin = false }) => {
  const { isAuthenticated, loading, hasPermission, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">
          You do not have permission to access this page. Admin access required.
        </Alert>
      </Container>
    );
  }

  // Check module permission
  if (module && !hasPermission(module, action)) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">
          You do not have permission to {action} this module.
        </Alert>
      </Container>
    );
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;

