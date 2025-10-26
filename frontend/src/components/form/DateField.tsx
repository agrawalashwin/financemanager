/**
 * Reusable Date Field Component
 * Wraps TextField with date input and consistent styling
 */

import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import {
  TextField,
  FormHelperText,
  Box,
} from '@mui/material';

interface DateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  minDate?: string;
  maxDate?: string;
}

export const DateField = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  required = false,
  helperText,
  minDate,
  maxDate,
}: DateFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Box sx={{ width: '100%' }}>
          <TextField
            {...field}
            label={label}
            type="date"
            fullWidth
            error={!!fieldError}
            required={required}
            size="medium"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: minDate,
              max: maxDate,
            }}
            sx={{
              width: '100%',
              fontSize: '1rem',
              '& .MuiOutlinedInput-input': {
                padding: '16px 14px',
              },
            }}
          />
          {fieldError && (
            <FormHelperText error>
              {fieldError.message}
            </FormHelperText>
          )}
          {helperText && !fieldError && (
            <FormHelperText>
              {helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default DateField;

