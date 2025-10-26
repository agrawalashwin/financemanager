import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { formatCurrency, formatDate } from '../utils/format';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * EditFutureTransactionsDialog
 * 
 * Provides a simple, inline way to edit individual future transactions in a recurring series.
 * Shows upcoming occurrences and allows quick edits to amount or other fields.
 */
export const EditFutureTransactionsDialog = ({
  open,
  onClose,
  transaction,
  futureOccurrences = [],
  onSave,
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleEditClick = (index, occurrence) => {
    setEditingIndex(index);
    setEditValues({
      amount: occurrence.amount,
      description: occurrence.description,
    });
    setMessage('');
  };

  const handleEditChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (index, occurrence) => {
    try {
      // If this is a virtual occurrence, we need to create a new transaction for this specific date
      if (occurrence.isVirtual) {
        // Create a new transaction for this specific date with the modified values
        await axios.post(`${API_URL}/transactions`, {
          userId: transaction.user_id,
          type: transaction.type,
          category: transaction.category,
          subcategory: transaction.subcategory,
          vendor: transaction.vendor,
          amount: parseFloat(editValues.amount),
          frequency: 'one-time', // Make it one-time since it's a specific override
          startDate: occurrence.date,
          endDate: null,
          description: editValues.description || transaction.description,
          recurringGroupId: transaction.id, // Link it to the original transaction
        });
      } else {
        // Update existing transaction
        await axios.put(`${API_URL}/transactions/${occurrence.id}`, {
          amount: parseFloat(editValues.amount),
          description: editValues.description,
        });
      }

      setMessage('✓ Transaction updated');
      setMessageType('success');
      setEditingIndex(null);

      // Refresh the parent data
      onSave?.();

      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update');
      setMessageType('error');
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditValues({});
    setMessage('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Edit Future Transactions</Typography>
            <Typography variant="caption" color="textSecondary">
              {transaction?.vendor} • {transaction?.frequency}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {message && (
          <Alert severity={messageType} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {futureOccurrences.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
            No future transactions to edit
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {futureOccurrences.map((occurrence, index) => (
              <Card
                key={occurrence.id}
                variant="outlined"
                sx={{
                  backgroundColor: editingIndex === index ? '#f5f5f5' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  {editingIndex === index ? (
                    // Edit Mode
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(occurrence.date, 'long')}
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        inputProps={{ step: '0.01' }}
                        value={editValues.amount}
                        onChange={(e) => handleEditChange('amount', e.target.value)}
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Description (optional)"
                        value={editValues.description}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                        size="small"
                        multiline
                        rows={2}
                      />
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          onClick={handleCancel}
                          startIcon={<CloseIcon />}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveEdit(index, occurrence)}
                          startIcon={<CheckIcon />}
                        >
                          Save
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    // View Mode
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDate(occurrence.date, 'short')}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {occurrence.description || 'No description'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(occurrence.amount * 100, 'USD')}
                        </Typography>
                      </Box>
                      <Tooltip title="Edit this transaction">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(index, occurrence)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFutureTransactionsDialog;

