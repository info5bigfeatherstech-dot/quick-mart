import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setDefaultAddress } from '@/api/addressApi';
import { toast } from 'sonner';

/**
 * Mutation hook to set an address as default and invalidate 'addresses' query
 */
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default delivery address updated');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to set default address';
      toast.error(msg);
    },
  });
};
