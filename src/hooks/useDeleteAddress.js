import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAddress } from '@/api/addressApi';
import { toast } from 'sonner';

/**
 * Mutation hook to delete an address and invalidate 'addresses' query
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address removed');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to remove address';
      toast.error(msg);
    },
  });
};
