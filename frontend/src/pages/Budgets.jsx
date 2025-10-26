import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Chip,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { formatCurrency, formatMonth } from '../utils/format';
import { CATEGORIES, API_CONFIG } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';

const API_URL = API_CONFIG.BASE_URL;

const Budgets = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ name: '', limit: '', threshold: 80, frequency: 'monthly' });
  const [message, setMessage] = useState('');

  // Fetch budgets and transactions on mount
  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, [userId]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${API_CONFIG.ENDPOINTS.BUDGETS}?userId=${userId}`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setMessage('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}?userId=${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Calculate spent amount for each budget based on transactions
  const budgetsWithSpent = useMemo(() => {
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.budget_name === budget.name && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return { ...budget, spent };
    });
  }, [budgets, transactions]);

  // Calculate month navigation
  const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

  // Calculate totals
  const totals = useMemo(() => {
    return budgetsWithSpent.reduce(
      (acc, budget) => ({
        limit: acc.limit + budget.limit,
        spent: acc.spent + budget.spent,
      }),
      { limit: 0, spent: 0 }
    );
  }, [budgetsWithSpent]);

  const percentageUsed = totals.limit > 0 ? (totals.spent / totals.limit) * 100 : 0;

  // Get budget status
  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return 'error';
    if (percentage >= budget.threshold) return 'warning';
    return 'success';
  };

  // Get progress color
  const getProgressColor = (budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return 'error';
    if (percentage >= budget.threshold) return 'warning';
    return 'success';
  };

  // Handlers
  const handleAddBudget = () => {
    setEditingBudget(null);
    setFormData({ name: '', limit: '', threshold: 80, frequency: 'monthly' });
    setMessage('');
    setOpenDialog(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      limit: budget.limit,
      threshold: budget.threshold,
      frequency: budget.frequency || 'monthly',
    });
    setMessage('');
    setOpenDialog(true);
  };

  const handleDeleteBudget = async (id) => {
    try {
      await axios.delete(`${API_URL}${API_CONFIG.ENDPOINTS.BUDGETS}/${id}`);
      setBudgets(budgets.filter(b => b.id !== id));
      setMessage('Budget deleted successfully');
    } catch (error) {
      console.error('Error deleting budget:', error);
      setMessage('Failed to delete budget');
    }
  };

  const handleSaveBudget = async () => {
    if (!formData.name || !formData.limit) {
      setMessage('Please fill in budget name and limit');
      return;
    }

    try {
      if (editingBudget) {
        // Update existing budget
        console.log('Updating budget:', {
          url: `${API_URL}${API_CONFIG.ENDPOINTS.BUDGETS}/${editingBudget.id}`,
          data: {
            name: formData.name,
            category: formData.name,
            limit: parseFloat(formData.limit),
            threshold: parseInt(formData.threshold),
            frequency: formData.frequency,
          }
        });
        const response = await axios.put(
          `${API_URL}${API_CONFIG.ENDPOINTS.BUDGETS}/${editingBudget.id}`,
          {
            name: formData.name,
            category: formData.name,
            limit: parseFloat(formData.limit),
            threshold: parseInt(formData.threshold),
            frequency: formData.frequency,
          }
        );
        console.log('Update response:', response.data);
        setBudgets(budgets.map(b => b.id === editingBudget.id ? response.data : b));
        setMessage('Budget updated successfully');
      } else {
        // Create new budget
        console.log('Creating budget:', {
          url: `${API_URL}${API_CONFIG.ENDPOINTS.BUDGETS}`,
          data: {
            userId,
            name: formData.name,
            category: formData.name,
            limit: parseFloat(formData.limit),
            threshold: parseInt(formData.threshold),
            frequency: formData.frequency,
          }
        });
        const response = await axios.post(`${API_URL}${API_CONFIG.ENDPOINTS.BUDGETS}`, {
          userId,
          name: formData.name,
          category: formData.name,
          limit: parseFloat(formData.limit),
          threshold: parseInt(formData.threshold),
          frequency: formData.frequency,
        });
        console.log('Create response:', response.data);
        setBudgets([...budgets, response.data]);
        setMessage('Budget created successfully');
      }

      setOpenDialog(false);
      setFormData({ name: '', limit: '', threshold: 80, frequency: 'monthly' });
    } catch (error) {
      console.error('Error saving budget:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      if (error.response?.status === 409) {
        setMessage('Budget with this name already exists');
      } else {
        setMessage(`Failed to save budget: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'limit' || name === 'threshold' ? parseFloat(value) : value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {message && (
        <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="headlineMedium">Budgets</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBudget}
          >
            Add Budget
          </Button>
        </Stack>

        {/* Month Navigation */}
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconButton onClick={() => setCurrentMonth(prevMonth)}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="titleLarge" sx={{ minWidth: 150, textAlign: 'center' }}>
            {formatMonth(currentMonth)}
          </Typography>
          <IconButton onClick={() => setCurrentMonth(nextMonth)}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>

        {/* Overall Progress */}
        <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="bodyMedium" color="text.secondary">
                  Total Budget
                </Typography>
                <Typography variant="bodyMedium" fontWeight={600}>
                  {formatCurrency(totals.spent * 100, 'USD')} / {formatCurrency(totals.limit * 100, 'USD')}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min(percentageUsed, 100)}
                color={percentageUsed >= 100 ? 'error' : percentageUsed >= 80 ? 'warning' : 'success'}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageUsed.toFixed(1)}% of budget used
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Paper>

      {/* Budget Cards Grid */}
      <Grid container spacing={2}>
        {budgetsWithSpent.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="bodyLarge" color="text.secondary">
                No budgets yet. Click "Add Budget" to create your first budget.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          budgetsWithSpent.map(budget => {
            const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
            const status = getBudgetStatus(budget);

            return (
              <Grid item xs={12} sm={6} md={4} key={budget.id}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title={budget.name || budget.category}
                  action={
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditBudget(budget)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                  subheader={
                    <Chip
                      label={`${percentage.toFixed(0)}% used`}
                      size="small"
                      color={status}
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    {/* Amount */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="bodySmall" color="text.secondary">
                        Spent
                      </Typography>
                      <Typography variant="bodySmall" fontWeight={600}>
                        {formatCurrency(budget.spent * 100, 'USD')}
                      </Typography>
                    </Stack>

                    {/* Progress Bar */}
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      color={getProgressColor(budget)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />

                    {/* Limit */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="bodySmall" color="text.secondary">
                        Limit
                      </Typography>
                      <Typography variant="bodySmall" fontWeight={600}>
                        {formatCurrency(budget.limit * 100, 'USD')}
                      </Typography>
                    </Stack>

                    {/* Remaining */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="bodySmall" color="text.secondary">
                        Remaining
                      </Typography>
                      <Typography
                        variant="bodySmall"
                        fontWeight={600}
                        color={budget.spent > budget.limit ? 'error.main' : 'success.main'}
                      >
                        {formatCurrency(Math.max(0, (budget.limit - budget.spent) * 100), 'USD')}
                      </Typography>
                    </Stack>

                    {/* Alert Threshold */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        Alert at {budget.threshold}%
                      </Typography>
                    </Stack>

                    {/* Status Alert */}
                    {percentage >= budget.threshold && (
                      <Alert
                        severity={status}
                        sx={{ mt: 1 }}
                      >
                        {percentage >= 100
                          ? 'Budget exceeded!'
                          : `${(percentage - budget.threshold).toFixed(0)}% over alert threshold`}
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Add Budget'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Budget Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., Housing, Food, Entertainment"
              helperText="Enter a custom name for this budget"
            />

            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                name="frequency"
                value={formData.frequency}
                onChange={handleFormChange}
                label="Frequency"
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annual">Annual</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Budget Limit"
              name="limit"
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              value={formData.limit}
              onChange={handleFormChange}
            />

            <TextField
              fullWidth
              label="Alert Threshold (%)"
              name="threshold"
              type="number"
              inputProps={{ step: '1', min: '0', max: '100' }}
              value={formData.threshold}
              onChange={handleFormChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveBudget} variant="contained">
            {editingBudget ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Budgets;

