import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress } from '@/api/addressApi';
import { toast } from 'sonner';

/**
 * Mutation hook to add a new address and invalidate 'addresses' query
 */
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAddress) => addAddress(newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address saved successfully');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to save address';
      toast.error(msg);
    },
  });
};
