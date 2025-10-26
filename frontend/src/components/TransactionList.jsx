import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Stack, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransactionGrid from './TransactionGrid';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TransactionList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await axios.get(`${API_URL}/transactions?userId=${user.id}`);
      return response.data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <Box>
      {/* Header with Add Button */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="headlineMedium">Transactions</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/add-transaction')}
            sx={{ py: 1 }}
          >
            Add Transaction
          </Button>
        </Stack>
      </Paper>

      {/* Transaction Grid */}
      <TransactionGrid
        userId={user?.id}
        data={transactions}
        isLoading={isLoading}
        onRefresh={() => refetch()}
      />
    </Box>
  );
};

export default TransactionList;

