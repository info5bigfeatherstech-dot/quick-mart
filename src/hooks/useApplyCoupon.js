import { useMutation, useQuery } from '@tanstack/react-query';
import { applyCoupon, getAvailableCoupons } from '@/api/checkoutApi';

/**
 * Hook to apply a coupon code against the current cart total
 */
export const useApplyCoupon = () => {
  return useMutation({
    mutationFn: async ({ code, cartTotal }) => {
      const response = await applyCoupon(code, cartTotal);
      return response.data;
    },
  });
};

/**
 * Hook to fetch all available coupons
 */
export const useCoupons = () => {
  return useQuery({
    queryKey: ['availableCoupons'],
    queryFn: async () => {
      const response = await getAvailableCoupons();
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
