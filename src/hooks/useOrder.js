import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/api/orderApi';

/**
 * Hook to fetch a single order by ID
 * @param {string} orderId
 */
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await getOrderById(orderId);
      return response.data;
    },
    enabled: Boolean(orderId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
