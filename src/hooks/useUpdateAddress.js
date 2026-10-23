import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAddress } from '@/api/addressApi';
import { toast } from 'sonner';

/**
 * Mutation hook to update an address and invalidate 'addresses' query
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated successfully');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to update address';
      toast.error(msg);
    },
  });
};
