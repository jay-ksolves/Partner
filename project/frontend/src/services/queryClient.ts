import { QueryClient } from '@tanstack/react-query';
import { addToast } from '@/store/slices/uiSlice';
import { store } from '@/store';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false; // Don't retry client errors
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Something went wrong';
        store.dispatch(
          addToast({
            type: 'error',
            title: 'Error',
            message,
          })
        );
      },
    },
  },
});