import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCheckoutStore } from './checkoutStore';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isAuthenticated: false,
      isLoginDialogOpen: false,
      redirectAfterLogin: null,

      // Actions
      login: ({ user, token }) => {
        set({
          user,
          token: token || 'quickmart-auth-token',
          isLoggedIn: true,
          isAuthenticated: true,
          isLoginDialogOpen: false,
        });
      },

      logout: () => {
        useCheckoutStore.getState().resetCheckout();
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          isAuthenticated: false,
          redirectAfterLogin: null,
        });
      },

      setRedirectAfterLogin: (path) => {
        set({ redirectAfterLogin: path });
      },

      openLoginDialog: () => {
        set({ isLoginDialogOpen: true });
      },

      closeLoginDialog: () => {
        set({ isLoginDialogOpen: false });
      },
    }),
    {
      name: 'quickmart-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        isAuthenticated: state.isLoggedIn,
      }),
    }
  )
);
