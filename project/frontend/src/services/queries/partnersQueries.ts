import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { addToast } from '@/store/slices/uiSlice';
import { store } from '@/store';

export interface Partner {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  gst?: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  isVerified: boolean;
}

export interface PartnersListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  kycStatus?: string;
}

// Partners list query
export const usePartnersQuery = (params: PartnersListParams = {}) =>
  useQuery({
    queryKey: ['partners', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/partners', { params });
      return data;
    },
    keepPreviousData: true,
  });

// Single partner query
export const usePartnerQuery = (id: string) =>
  useQuery({
    queryKey: ['partners', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/partners/${id}`);
      return data;
    },
    enabled: !!id,
  });

// Partner profile (current user)
export const usePartnerProfileQuery = () =>
  useQuery({
    queryKey: ['partners', 'profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/partners/me');
      return data;
    },
  });

// Bank details query
export const useBankDetailsQuery = () =>
  useQuery({
    queryKey: ['partners', 'bank'],
    queryFn: async () => {
      const { data } = await apiClient.get('/partners/bank');
      return data;
    },
  });

// Update partner mutation
export const useUpdatePartnerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Partner> & { id: string }) => {
      const { id, ...updateData } = data;
      const response = await apiClient.put(`/partners/${id}`, updateData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['partners', 'list']);
      queryClient.invalidateQueries(['partners', 'detail', variables.id]);
      queryClient.invalidateQueries(['partners', 'profile']);
      
      store.dispatch(
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Partner profile updated successfully',
        })
      );
    },
  });
};

// Update bank details mutation
export const useUpdateBankDetailsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<BankDetails>) => {
      const response = await apiClient.put('/partners/bank', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partners', 'bank']);
      
      store.dispatch(
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Bank details updated successfully',
        })
      );
    },
  });
};