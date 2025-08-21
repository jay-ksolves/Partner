import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { addToast } from '@/store/slices/uiSlice';
import { store } from '@/store';

export interface Transaction {
  id: string;
  partnerId: string;
  partnerName: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  createdAt: string;
  completedAt?: string;
}

export interface TransactionsListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  partnerId?: string;
}

// Transactions list query
export const useTransactionsQuery = (params: TransactionsListParams = {}) =>
  useQuery({
    queryKey: ['transactions', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/transactions', { params });
      return data;
    },
    keepPreviousData: true,
  });

// Single transaction query
export const useTransactionQuery = (id: string) =>
  useQuery({
    queryKey: ['transactions', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/transactions/${id}`);
      return data;
    },
    enabled: !!id,
  });

// Transaction stats query
export const useTransactionStatsQuery = (params: { dateFrom?: string; dateTo?: string } = {}) =>
  useQuery({
    queryKey: ['transactions', 'stats', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/transactions/stats', { params });
      return data;
    },
  });

// Export transactions mutation
export const useExportTransactionsMutation = () =>
  useMutation({
    mutationFn: async (params: TransactionsListParams & { format: 'csv' | 'xlsx' }) => {
      const response = await apiClient.get('/transactions/export', {
        params,
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions.${params.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
    onSuccess: () => {
      store.dispatch(
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Transactions exported successfully',
        })
      );
    },
  });