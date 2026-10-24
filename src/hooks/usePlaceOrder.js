import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { placeOrder } from '@/api/orderApi';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { ROUTES } from '@/utils/constants';

/**
 * Hook to execute order placement mutation.
 * Handles cache invalidation, cart clearing, checkout reset, and navigation to order success.
 */
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  return useMutation({
    mutationFn: (payload) => placeOrder(payload),
    onSuccess: (response) => {
      const order = response.data;
      clearCart();
      resetCheckout();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully! ⚡');
      navigate(ROUTES.ORDER_SUCCESS(order.id), { replace: true });
    },
    onError: (error) => {
      const message = error?.message || 'Payment failed. Please try again.';
      toast.error(message);
    },
  });
};
