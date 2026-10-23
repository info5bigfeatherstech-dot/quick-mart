import { useAuthStore } from '@/store/authStore';

/**
 * Hook that returns a guard function to require authentication before executing an action
 * @returns {(callback: Function) => void}
 */
export const useRequireLogin = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginDialog = useAuthStore((state) => state.openLoginDialog);

  return (callback) => {
    if (isLoggedIn) {
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      openLoginDialog();
    }
  };
};
