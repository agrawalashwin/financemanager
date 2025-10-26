import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Button,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { formatCurrency, formatDate, formatMonth } from '../utils/format';

const Reports = ({ userId }) => {
  const [tabValue, setTabValue] = useState(0);

  // Mock data
  const pnlData = [
    { month: '2025-10', revenue: 5000, expenses: 3000, net: 2000 },
    { month: '2025-11', revenue: 5500, expenses: 3200, net: 2300 },
    { month: '2025-12', revenue: 6000, expenses: 3500, net: 2500 },
  ];

  const cashFlowData = [
    { month: '2025-10', opening: 10000, inflows: 5000, outflows: 3000, closing: 12000 },
    { month: '2025-11', opening: 12000, inflows: 5500, outflows: 3200, closing: 14300 },
    { month: '2025-12', opening: 14300, inflows: 6000, outflows: 3500, closing: 16800 },
  ];

  const categoryData = [
    { category: 'Housing', amount: 2000, percentage: 40 },
    { category: 'Food', amount: 800, percentage: 16 },
    { category: 'Transport', amount: 400, percentage: 8 },
    { category: 'Entertainment', amount: 500, percentage: 10 },
    { category: 'Utilities', amount: 300, percentage: 6 },
    { category: 'Other', amount: 1000, percentage: 20 },
  ];

  const forecastData = [
    { month: '2025-10', actual: 2000, forecast: 2000 },
    { month: '2025-11', actual: 2300, forecast: 2300 },
    { month: '2025-12', actual: 2500, forecast: 2500 },
    { month: '2026-01', actual: null, forecast: 2600 },
    { month: '2026-02', actual: null, forecast: 2700 },
    { month: '2026-03', actual: null, forecast: 2800 },
  ];

  // Calculate totals
  const pnlTotals = useMemo(() => {
    return pnlData.reduce(
      (acc, row) => ({
        revenue: acc.revenue + row.revenue,
        expenses: acc.expenses + row.expenses,
        net: acc.net + row.net,
      }),
      { revenue: 0, expenses: 0, net: 0 }
    );
  }, []);

  // Export handlers
  const handleExportCSV = () => {
    let csv = '';
    
    if (tabValue === 0) {
      csv = 'Month,Revenue,Expenses,Net Income\n';
      pnlData.forEach(row => {
        csv += `${row.month},${row.revenue},${row.expenses},${row.net}\n`;
      });
    } else if (tabValue === 1) {
      csv = 'Month,Opening Balance,Inflows,Outflows,Closing Balance\n';
      cashFlowData.forEach(row => {
        csv += `${row.month},${row.opening},${row.inflows},${row.outflows},${row.closing}\n`;
      });
    } else if (tabValue === 2) {
      csv = 'Category,Amount,Percentage\n';
      categoryData.forEach(row => {
        csv += `${row.category},${row.amount},${row.percentage}%\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    alert('PDF export coming soon! (Requires jsPDF library)');
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="headlineMedium">Reports</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="P&L Statement" />
          <Tab label="Cash Flow" />
          <Tab label="Categories" />
          <Tab label="Forecast" />
        </Tabs>
      </Paper>

      {/* P&L Report */}
      {tabValue === 0 && (
        <Grid container spacing={2}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="headlineSmall" sx={{ color: 'success.main' }}>
                  {formatCurrency(pnlTotals.revenue * 100, 'USD')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="headlineSmall" sx={{ color: 'error.main' }}>
                  {formatCurrency(pnlTotals.expenses * 100, 'USD')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Net Income
                </Typography>
                <Typography variant="headlineSmall" sx={{ color: 'primary.main' }}>
                  {formatCurrency(pnlTotals.net * 100, 'USD')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Margin
                </Typography>
                <Typography variant="headlineSmall">
                  {((pnlTotals.net / pnlTotals.revenue) * 100).toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Month</strong></TableCell>
                    <TableCell align="right"><strong>Revenue</strong></TableCell>
                    <TableCell align="right"><strong>Expenses</strong></TableCell>
                    <TableCell align="right"><strong>Net Income</strong></TableCell>
                    <TableCell align="right"><strong>Margin</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pnlData.map(row => (
                    <TableRow key={row.month} hover>
                      <TableCell>{formatMonth(new Date(row.month))}</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>
                        {formatCurrency(row.revenue * 100, 'USD')}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600 }}>
                        {formatCurrency(row.expenses * 100, 'USD')}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(row.net * 100, 'USD')}
                      </TableCell>
                      <TableCell align="right">
                        {((row.net / row.revenue) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* Cash Flow Report */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Month</strong></TableCell>
                <TableCell align="right"><strong>Opening Balance</strong></TableCell>
                <TableCell align="right"><strong>Inflows</strong></TableCell>
                <TableCell align="right"><strong>Outflows</strong></TableCell>
                <TableCell align="right"><strong>Closing Balance</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cashFlowData.map(row => (
                <TableRow key={row.month} hover>
                  <TableCell>{formatMonth(new Date(row.month))}</TableCell>
                  <TableCell align="right">{formatCurrency(row.opening * 100, 'USD')}</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>
                    +{formatCurrency(row.inflows * 100, 'USD')}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600 }}>
                    -{formatCurrency(row.outflows * 100, 'USD')}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(row.closing * 100, 'USD')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Categories Report */}
      {tabValue === 2 && (
        <Grid container spacing={2}>
          {categoryData.map(row => (
            <Grid item xs={12} key={row.category}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="bodyMedium" fontWeight={600}>
                        {row.category}
                      </Typography>
                      <Chip
                        label={`${row.percentage}%`}
                        size="small"
                      />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={row.percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="bodySmall" color="text.secondary">
                      {formatCurrency(row.amount * 100, 'USD')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Forecast Report */}
      {tabValue === 3 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Month</strong></TableCell>
                <TableCell align="right"><strong>Actual</strong></TableCell>
                <TableCell align="right"><strong>Forecast</strong></TableCell>
                <TableCell align="right"><strong>Variance</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forecastData.map(row => {
                const variance = row.actual ? row.actual - row.forecast : null;
                const variancePercent = row.actual ? ((variance / row.forecast) * 100).toFixed(1) : null;

                return (
                  <TableRow key={row.month} hover>
                    <TableCell>{formatMonth(new Date(row.month))}</TableCell>
                    <TableCell align="right">
                      {row.actual ? formatCurrency(row.actual * 100, 'USD') : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.forecast * 100, 'USD')}
                    </TableCell>
                    <TableCell align="right">
                      {variance !== null ? (
                        <Typography
                          variant="bodySmall"
                          sx={{
                            color: variance >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          {variance >= 0 ? '+' : ''}{formatCurrency(variance * 100, 'USD')} ({variancePercent}%)
                        </Typography>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Reports;

