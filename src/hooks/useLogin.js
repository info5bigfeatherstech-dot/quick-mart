import { useMutation } from '@tanstack/react-query';
import { loginWithPhone } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

/**
 * Custom mutation hook for logging in with phone number
 */
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (phone) => loginWithPhone(phone),
    onSuccess: (response) => {
      const { user, token } = response.data;
      login({ user, token });
      toast.success('Logged in successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    },
  });
};
