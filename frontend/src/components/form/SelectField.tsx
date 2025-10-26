/**
 * Reusable Select Field Component
 * Wraps Select with consistent styling and error handling
 */

import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  error,
  required = false,
  helperText,
  disabled = false,
}: SelectFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth error={!!fieldError} disabled={disabled} sx={{
            width: '100%',
            '& .MuiInputLabel-root': {
              fontSize: '1rem',
              transform: 'translate(14px, 16px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -9px) scale(0.75)',
              },
            },
          }}>
            <InputLabel>{label}</InputLabel>
            <Select
              {...field}
              label={label}
              size="medium"
              sx={{
                width: '100%',
                fontSize: '1rem',
                minHeight: '56px',
                '& .MuiSelect-select': {
                  padding: '16.5px 14px',
                  minHeight: '23px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiOutlinedInput-notchedOutline legend': {
                  fontSize: '0.75em',
                },
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {fieldError && (
              <FormHelperText>
                {fieldError.message}
              </FormHelperText>
            )}
            {helperText && !fieldError && (
              <FormHelperText>
                {helperText}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
    />
  );
};

export default SelectField;

