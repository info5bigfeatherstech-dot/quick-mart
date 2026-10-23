import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isAuthenticated: false,
      isLoginDialogOpen: false,

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
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          isAuthenticated: false,
        });
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
