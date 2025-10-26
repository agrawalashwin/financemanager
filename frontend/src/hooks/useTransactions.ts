/**
 * Custom Hook for Transaction Data Management
 * Handles fetching, caching, and state management for transactions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_CONFIG } from '../config/constants';

const API_URL = API_CONFIG.BASE_URL;

interface Transaction {
  id: string;
  userId: string;
  type: 'expense' | 'revenue';
  category: string;
  vendor: string;
  amount: number;
  frequency: string;
  startDate: string;
  endDate?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all transactions for a user
 */
export const useTransactions = (userId: string) => {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}?userId=${userId}`
      );
      return response.data as Transaction[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch summary data for a user
 */
export const useSummary = (userId: string) => {
  return useQuery({
    queryKey: ['summary', userId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}${API_CONFIG.ENDPOINTS.SUMMARY}?userId=${userId}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create a new transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['transactions', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['summary', variables.userId],
      });
    },
  });
};

/**
 * Update a transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(
        `${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['summary'],
      });
    },
  });
};

/**
 * Delete a transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(
        `${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['summary'],
      });
    },
  });
};

