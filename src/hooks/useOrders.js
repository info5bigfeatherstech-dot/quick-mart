import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/orderApi';

/**
 * Hook to retrieve user orders
 */
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
