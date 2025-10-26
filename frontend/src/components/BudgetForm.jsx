import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Alert,
} from '@mui/material';
import { budgetSchema } from '../schemas/validationSchemas';
import { CATEGORIES } from '../config/constants';

const BudgetForm = ({ open, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: initialData || {
      category: '',
      limit: '',
      threshold: 80,
    },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Budget' : 'Add Budget'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {/* Category */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category">
                  {CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Budget Limit */}
          <Controller
            name="limit"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Budget Limit"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                error={!!errors.limit}
                helperText={errors.limit?.message}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />

          {/* Alert Threshold */}
          <Controller
            name="threshold"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Alert Threshold (%)"
                type="number"
                inputProps={{ step: '1', min: '0', max: '100' }}
                error={!!errors.threshold}
                helperText={errors.threshold?.message || 'Alert when spending reaches this percentage'}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetForm;

