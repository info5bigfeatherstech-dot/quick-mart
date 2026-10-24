import { useMutation } from '@tanstack/react-query';
import { validateCart } from '@/api/checkoutApi';

/**
 * Hook to validate cart items before checkout
 */
export const useValidateCart = () => {
  return useMutation({
    mutationFn: async (items) => {
      const response = await validateCart(items);
      return response.data;
    },
  });
};
