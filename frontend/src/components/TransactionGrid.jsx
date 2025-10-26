import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { formatCurrency, formatDate } from '../utils/format';
import { CATEGORIES, SUBCATEGORIES, API_CONFIG } from '../config/constants';
import EditFutureTransactionsDialog from './EditFutureTransactionsDialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TransactionGrid = ({ userId, data = [], isLoading = false, onRefresh }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openFutureDialog, setOpenFutureDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editMessage, setEditMessage] = useState('');
  const [editMessageType, setEditMessageType] = useState('');
  const [editAllInSeries, setEditAllInSeries] = useState(false);
  const [futureOccurrences, setFutureOccurrences] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`${API_URL}/budgets?userId=${userId}`);
        setBudgets(response.data || []);
      } catch (error) {
        console.error('Error fetching budgets:', error);
        setBudgets([]);
      }
    };

    fetchBudgets();
  }, [userId]);

  // Column definitions
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => (
          <Chip
            label={info.getValue()}
            color={info.getValue() === 'revenue' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        ),
        size: 100,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => (
          <Chip label={info.getValue()} size="small" />
        ),
        size: 120,
      },
      {
        accessorKey: 'vendor',
        header: 'Vendor',
        size: 150,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: (info) => (
          <Box sx={{ textAlign: 'right', fontWeight: 600 }}>
            {formatCurrency(info.getValue() * 100, 'USD')}
          </Box>
        ),
        size: 120,
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
        size: 110,
      },
      {
        accessorKey: 'start_date',
        header: 'Start Date',
        cell: (info) => formatDate(info.getValue(), 'short'),
        size: 120,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => (
          <Tooltip title={info.getValue() || '-'}>
            <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {info.getValue() || '-'}
            </Box>
          </Tooltip>
        ),
        size: 200,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit this transaction">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEditClick(row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {row.original.frequency !== 'one-time' && (
              <Tooltip title="Edit future occurrences">
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => handleEditFutureClick(row.original)}
                >
                  <CalendarTodayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(row.original.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
        size: 130,
      },
    ],
    []
  );

  // Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      rowSelection: Object.fromEntries(selectedRows),
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const { rows } = table.getRowModel();

  // Handlers
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setEditFormData({
      type: transaction.type,
      category: transaction.category,
      subcategory: transaction.subcategory || '',
      vendor: transaction.vendor,
      amount: transaction.amount,
      frequency: transaction.frequency,
      startDate: new Date(transaction.start_date).toISOString().split('T')[0],
      endDate: transaction.end_date ? new Date(transaction.end_date).toISOString().split('T')[0] : '',
      description: transaction.description || '',
      budgetName: transaction.budget_name || '',
    });
    setEditMessage('');
    setOpenEditDialog(true);
  };

  const handleEditFutureClick = async (transaction) => {
    try {
      // Fetch future occurrences of this recurring transaction
      const response = await axios.get(`${API_URL}/transactions/${transaction.id}/future`);
      setFutureOccurrences(response.data);
      setEditingTransaction(transaction);
      setOpenFutureDialog(true);
    } catch (error) {
      console.error('Error fetching future occurrences:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/transactions/${deleteId}`);
      setOpenDeleteDialog(false);
      setDeleteId(null);
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/transactions/${editingTransaction.id}`, {
        ...editFormData,
        editAllInSeries
      });
      setEditMessage('Transaction updated successfully!');
      setEditMessageType('success');
      setTimeout(() => {
        setOpenEditDialog(false);
        setEditAllInSeries(false);
        onRefresh?.();
      }, 1000);
    } catch (error) {
      setEditMessage(error.response?.data?.error || 'Failed to update transaction');
      setEditMessageType('error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return;
    
    try {
      await Promise.all(
        Array.from(selectedRows).map(rowIndex =>
          axios.delete(`${API_URL}/transactions/${rows[rowIndex].original.id}`)
        )
      );
      setSelectedRows(new Set());
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting transactions:', error);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Search transactions..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: globalFilter && (
                  <IconButton size="small" onClick={() => setGlobalFilter('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            {selectedRows.size > 0 && (
              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
              >
                Delete {selectedRows.size}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} style={{ backgroundColor: '#f5f5f5' }}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: 600,
                        borderBottom: '2px solid #e0e0e0',
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: selectedRows.has(index) ? '#f0f0f0' : index % 2 === 0 ? 'white' : '#fafafa',
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        padding: '12px',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editMessage && <Alert severity={editMessageType} sx={{ mb: 2 }}>{editMessage}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={editFormData.type || ''}
                  onChange={handleEditFormChange}
                  label="Type"
                >
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={editFormData.category || ''}
                  onChange={handleEditFormChange}
                  label="Category"
                >
                  {CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vendor/Source"
                name="vendor"
                value={editFormData.vendor || ''}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                inputProps={{ step: '0.01' }}
                value={editFormData.amount || ''}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  name="frequency"
                  value={editFormData.frequency || ''}
                  onChange={handleEditFormChange}
                  label="Frequency"
                >
                  <MenuItem value="one-time">One-time</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Bi-weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Subcategory (optional)</InputLabel>
                <Select
                  name="subcategory"
                  value={editFormData.subcategory || ''}
                  onChange={handleEditFormChange}
                  label="Subcategory (optional)"
                >
                  <MenuItem value="">None</MenuItem>
                  {SUBCATEGORIES.map(sub => (
                    <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={editFormData.startDate || ''}
                onChange={handleEditFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Date (optional)"
                name="endDate"
                type="date"
                value={editFormData.endDate || ''}
                onChange={handleEditFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Budget (optional)</InputLabel>
                <Select
                  name="budgetName"
                  value={editFormData.budgetName || ''}
                  onChange={handleEditFormChange}
                  label="Budget (optional)"
                >
                  <MenuItem value="">None</MenuItem>
                  {budgets.map(budget => (
                    <MenuItem key={budget.id} value={budget.name || budget.category}>
                      {budget.name || budget.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                name="description"
                value={editFormData.description || ''}
                onChange={handleEditFormChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editAllInSeries}
                    onChange={(e) => setEditAllInSeries(e.target.checked)}
                  />
                }
                label="Apply changes to all transactions in this recurring series"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenEditDialog(false);
            setEditAllInSeries(false);
          }}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this transaction?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Future Transactions Dialog */}
      <EditFutureTransactionsDialog
        open={openFutureDialog}
        onClose={() => {
          setOpenFutureDialog(false);
          setFutureOccurrences([]);
        }}
        transaction={editingTransaction}
        futureOccurrences={futureOccurrences}
        onSave={() => {
          onRefresh?.();
          setOpenFutureDialog(false);
        }}
      />
    </Box>
  );
};

export default TransactionGrid;

