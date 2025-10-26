import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Paper,
  Grid,
  Alert,
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import { transactionSchema } from '../schemas/validationSchemas';
import { FormField, SelectField, DateField } from './form';
import { CATEGORIES, SUBCATEGORIES, TRANSACTION_TYPES, FREQUENCIES, FREQUENCY_LABELS, DEFAULT_VALUES, API_CONFIG, MESSAGES } from '../config/constants';
import { useLogger } from '../hooks/useLogger';
import { useAuth } from '../contexts/AuthContext';

const API_URL = API_CONFIG.BASE_URL;

// Helper function to get the last day of the current month
const getLastDayOfMonth = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split('T')[0];
};

const TransactionForm = ({ onTransactionAdded, budgets = [] }) => {
  const { user } = useAuth();
  const log = useLogger('TransactionForm');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      vendor: DEFAULT_VALUES.TRANSACTION.vendor,
      description: DEFAULT_VALUES.TRANSACTION.description,
      amount: DEFAULT_VALUES.TRANSACTION.amount,
      type: DEFAULT_VALUES.TRANSACTION.type,
      category: DEFAULT_VALUES.TRANSACTION.category,
      subcategory: DEFAULT_VALUES.TRANSACTION.subcategory,
      frequency: DEFAULT_VALUES.TRANSACTION.frequency,
      date: getLastDayOfMonth(),
      budgetName: '',
      notes: DEFAULT_VALUES.TRANSACTION.notes,
    },
  });

  const frequency = watch('frequency');

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      log.logFormSubmit('TransactionForm', data);

      // Map form data to API payload
      const payload = {
        userId: user?.id,
        type: data.type,
        category: data.category,
        subcategory: data.subcategory || null,
        vendor: data.vendor,
        amount: parseFloat(data.amount),
        frequency: data.frequency,
        startDate: data.date, // Map 'date' to 'startDate'
        description: data.description || null,
        notes: data.notes || null,
        budgetName: data.budgetName || null,
      };

      log.logRequest('POST', '/api/transactions', payload);

      const response = await axios.post(`${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`, payload);

      log.logResponse(response.status, { id: response.data.id });
      log.info('✅ Transaction added successfully', { id: response.data.id }, 'TransactionForm');

      setMessageType('success');
      setMessage(MESSAGES.SUCCESS.TRANSACTION_ADDED);
      reset({
        vendor: DEFAULT_VALUES.TRANSACTION.vendor,
        description: DEFAULT_VALUES.TRANSACTION.description,
        amount: DEFAULT_VALUES.TRANSACTION.amount,
        type: DEFAULT_VALUES.TRANSACTION.type,
        category: DEFAULT_VALUES.TRANSACTION.category,
        subcategory: DEFAULT_VALUES.TRANSACTION.subcategory,
        frequency: DEFAULT_VALUES.TRANSACTION.frequency,
        date: getLastDayOfMonth(),
        budgetName: '',
        notes: DEFAULT_VALUES.TRANSACTION.notes,
      });
      onTransactionAdded?.();
    } catch (error) {
      log.error('❌ Failed to add transaction', error, 'TransactionForm');
      setMessageType('error');
      setMessage(error.response?.data?.error || MESSAGES.ERROR.TRANSACTION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
    }}>
      <CardContent sx={{ p: 5 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Add Transaction
              </Typography>
              <Divider sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', height: 2 }} />
            </Box>

            {/* Alert Message */}
            {message && (
              <Alert
                severity={messageType}
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 500,
                }}
              >
                {message}
              </Alert>
            )}

            {/* Form Fields */}
            <Grid container spacing={2.5}>
              {/* Row 1: Type & Category */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <SelectField
                  control={control}
                  name="type"
                  label="Type"
                  options={TRANSACTION_TYPES.map(type => ({
                    value: type,
                    label: type.charAt(0).toUpperCase() + type.slice(1),
                  }))}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <SelectField
                  control={control}
                  name="category"
                  label="Category"
                  options={CATEGORIES.map(cat => ({
                    value: cat,
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  }))}
                  required
                />
              </Grid>

              {/* Row 2: Vendor/Source & Subcategory */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <FormField
                  control={control}
                  name="vendor"
                  label="Vendor/Source"
                  placeholder="e.g., Landlord, Netflix, AWS"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <SelectField
                  control={control}
                  name="subcategory"
                  label="Subcategory (optional)"
                  options={[
                    { value: '', label: 'None' },
                    ...SUBCATEGORIES.map(sub => ({
                      value: sub,
                      label: sub,
                    }))
                  ]}
                />
              </Grid>

              {/* Row 3: Description (optional) */}
              <Grid item xs={12}>
                <FormField
                  control={control}
                  name="description"
                  label="Description (optional)"
                  placeholder="e.g., Monthly rent, Netflix subscription"
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Row 4: Amount & Frequency */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <FormField
                  control={control}
                  name="amount"
                  label="Amount"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  placeholder="0.00"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <SelectField
                  control={control}
                  name="frequency"
                  label="Frequency"
                  options={FREQUENCIES.map(freq => ({
                    value: freq,
                    label: FREQUENCY_LABELS[freq],
                  }))}
                  required
                />
              </Grid>

              {/* Row 5: Date & Budget */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <DateField
                  control={control}
                  name="date"
                  label="Date"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <SelectField
                  control={control}
                  name="budgetName"
                  label="Budget (optional)"
                  options={[
                    { value: '', label: 'None' },
                    ...budgets.map(budget => ({
                      value: budget.name || budget.category,
                      label: budget.name || budget.category,
                    }))
                  ]}
                />
              </Grid>

              {/* Row 6: Notes */}
              <Grid item xs={12}>
                <FormField
                  control={control}
                  name="notes"
                  label="Notes (optional)"
                  multiline
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                      },
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset()}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderColor: '#667eea',
                      color: '#667eea',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#764ba2',
                        color: '#764ba2',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      },
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;

