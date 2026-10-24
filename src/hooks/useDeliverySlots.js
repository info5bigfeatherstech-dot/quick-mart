import { useQuery } from '@tanstack/react-query';
import { getDeliverySlots } from '@/api/checkoutApi';

/**
 * Hook to fetch delivery slots for today or tomorrow
 * @param {'today'|'tomorrow'} day
 */
export const useDeliverySlots = (day = 'today') => {
  return useQuery({
    queryKey: ['deliverySlots', day],
    queryFn: async () => {
      const response = await getDeliverySlots(day);
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
