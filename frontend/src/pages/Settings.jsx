import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
  Stack,
  Typography,
  Divider,
  Alert,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Backup as BackupIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { settingsSchema } from '../schemas/validationSchemas';
import { useUIStore } from '../store/uiStore';

const Settings = ({ userId }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { themeMode, setThemeMode, currency, setCurrency } = useUIStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      currency: currency || 'USD',
      locale: 'en-US',
      theme: themeMode || 'system',
      notifications: true,
      emailNotifications: false,
      autoBackup: true,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Update theme
      if (data.theme !== themeMode) {
        setThemeMode(data.theme);
      }

      // Update currency
      if (data.currency !== currency) {
        setCurrency(data.currency);
      }

      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(data));

      setMessageType('success');
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      userId,
      // In a real app, fetch actual data from API
      transactions: [],
      budgets: [],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleBackupData = () => {
    setMessage('Backup feature coming soon!');
    setMessageType('info');
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      setMessage('Data deletion feature coming soon!');
      setMessageType('warning');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="headlineMedium">Settings</Typography>
      </Paper>

      {message && <Alert severity={messageType} sx={{ mb: 3 }}>{message}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Preferences Section */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Preferences" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {/* Currency */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.currency}>
                          <InputLabel>Currency</InputLabel>
                          <Select {...field} label="Currency">
                            <MenuItem value="USD">USD ($)</MenuItem>
                            <MenuItem value="EUR">EUR (€)</MenuItem>
                            <MenuItem value="GBP">GBP (£)</MenuItem>
                            <MenuItem value="INR">INR (₹)</MenuItem>
                            <MenuItem value="JPY">JPY (¥)</MenuItem>
                            <MenuItem value="AUD">AUD (A$)</MenuItem>
                            <MenuItem value="CAD">CAD (C$)</MenuItem>
                            <MenuItem value="CHF">CHF (CHF)</MenuItem>
                          </Select>
                          {errors.currency && <FormHelperText>{errors.currency.message}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Locale */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="locale"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.locale}>
                          <InputLabel>Language</InputLabel>
                          <Select {...field} label="Language">
                            <MenuItem value="en-US">English (US)</MenuItem>
                            <MenuItem value="en-GB">English (UK)</MenuItem>
                            <MenuItem value="de-DE">Deutsch</MenuItem>
                            <MenuItem value="fr-FR">Français</MenuItem>
                            <MenuItem value="es-ES">Español</MenuItem>
                            <MenuItem value="it-IT">Italiano</MenuItem>
                            <MenuItem value="ja-JP">日本語</MenuItem>
                            <MenuItem value="zh-CN">中文</MenuItem>
                          </Select>
                          {errors.locale && <FormHelperText>{errors.locale.message}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Theme */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="theme"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.theme}>
                          <InputLabel>Theme</InputLabel>
                          <Select {...field} label="Theme">
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                            <MenuItem value="system">System</MenuItem>
                          </Select>
                          {errors.theme && <FormHelperText>{errors.theme.message}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications Section */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Notifications" />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Controller
                    name="notifications"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Enable in-app notifications"
                      />
                    )}
                  />

                  <Controller
                    name="emailNotifications"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Enable email notifications"
                      />
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Backup Section */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Data Management" />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Controller
                    name="autoBackup"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Enable automatic daily backups"
                      />
                    )}
                  />

                  <Divider />

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportData}
                    >
                      Export Data
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<BackupIcon />}
                      onClick={handleBackupData}
                    >
                      Backup Now
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteData}
                    >
                      Delete All Data
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ py: 1.5 }}
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Settings;

