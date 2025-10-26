import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { queryClient } from './lib/queryClient';
import { CommandPaletteProvider } from './components/CommandPalette';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { DebugPanel } from './components/common/DebugPanel';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionFormWrapper from './components/TransactionFormWrapper';
import CSVImport from './components/CSVImport';
import Budgets from './pages/Budgets';
import Settings from './pages/Settings';
import ThemeShowcase from './pages/ThemeShowcase';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <CommandPaletteProvider>
                <Routes>
                  {/* Public route */}
                  <Route path="/login" element={<Login />} />

                  {/* Protected routes */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <AppShell>
                          <Box sx={{ p: { xs: 1, sm: 1.5, md: 2 }, maxWidth: '1800px', width: '100%', mx: 'auto' }}>
                            <Routes>
                              <Route path="/" element={<Navigate to="/dashboard" replace />} />

                              <Route
                                path="/dashboard"
                                element={
                                  <ProtectedRoute module="dashboard">
                                    <Dashboard />
                                  </ProtectedRoute>
                                }
                              />

                              <Route
                                path="/transactions"
                                element={
                                  <ProtectedRoute module="transactions">
                                    <TransactionList />
                                  </ProtectedRoute>
                                }
                              />

                              <Route
                                path="/add-transaction"
                                element={
                                  <ProtectedRoute module="transactions" action="edit">
                                    <TransactionFormWrapper />
                                  </ProtectedRoute>
                                }
                              />

                              <Route
                                path="/import"
                                element={
                                  <ProtectedRoute module="transactions" action="edit">
                                    <CSVImport />
                                  </ProtectedRoute>
                                }
                              />

                              <Route
                                path="/budgets"
                                element={
                                  <ProtectedRoute module="budgets">
                                    <Budgets />
                                  </ProtectedRoute>
                                }
                              />

                              <Route
                                path="/settings"
                                element={
                                  <ProtectedRoute module="settings">
                                    <Settings />
                                  </ProtectedRoute>
                                }
                              />

                              <Route path="/theme-showcase" element={<ThemeShowcase />} />
                            </Routes>
                          </Box>
                        </AppShell>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </CommandPaletteProvider>
            </Router>
            <DebugPanel />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
