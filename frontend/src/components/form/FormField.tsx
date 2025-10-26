/**
 * Reusable Form Field Component
 * Wraps TextField with consistent styling and error handling
 */

import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import {
  TextField,
  TextFieldProps,
  FormHelperText,
  Box,
} from '@mui/material';

interface FormFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  required = false,
  helperText,
  ...props
}: FormFieldProps<T>) => {
  const isNumberInput = props.type === 'number';

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Box sx={{ width: '100%' }}>
          <TextField
            {...field}
            {...props}
            label={label}
            fullWidth
            error={!!fieldError}
            required={required}
            size="medium"
            onChange={(e) => {
              if (isNumberInput) {
                field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value));
              } else {
                field.onChange(e);
              }
            }}
            sx={{
              width: '100%',
              '& .MuiInputLabel-root': {
                fontSize: '1rem',
                transform: 'translate(14px, 16px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)',
                },
              },
              '& .MuiOutlinedInput-root': {
                fontSize: '1rem',
                minHeight: '56px',
              },
              '& .MuiOutlinedInput-input': {
                padding: '16.5px 14px',
                height: 'auto',
                minHeight: '23px',
              },
              '& .MuiOutlinedInput-notchedOutline legend': {
                fontSize: '0.75em',
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

export default FormField;

