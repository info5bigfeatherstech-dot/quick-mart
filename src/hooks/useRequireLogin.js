import { useAuthStore } from '@/store/authStore';

/**
 * Hook that returns a guard function to require authentication before executing an action
 * @returns {(callback: Function) => void}
 */
export const useRequireLogin = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginDialog = useAuthStore((state) => state.openLoginDialog);
  const setRedirectAfterLogin = useAuthStore((state) => state.setRedirectAfterLogin);

  return (callback, redirectPath = null) => {
    if (isLoggedIn) {
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      if (redirectPath) {
        setRedirectAfterLogin(redirectPath);
      }
      openLoginDialog();
    }
  };
};
