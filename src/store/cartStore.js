import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const getItemKey = (productId, variantId) =>
  variantId ? `${productId}-${variantId}` : productId;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      // Actions
      addItem: (product, variant = null) => {
        set((state) => {
          const key = getItemKey(product.id, variant?.id);
          const existingIndex = state.items.findIndex(
            (item) => (item.key || item.product.id) === key
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + 1,
            };
            return { items: updated };
          }

          return {
            items: [
              ...state.items,
              {
                key,
                product,
                selectedVariant: variant || null,
                quantity: 1,
              },
            ],
          };
        });
      },

      increaseQty: (key) => {
        set((state) => {
          const updated = state.items.map((item) => {
            if ((item.key || item.product.id) === key) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          });
          return { items: updated };
        });
      },

      decreaseQty: (key) => {
        set((state) => {
          const existing = state.items.find(
            (item) => (item.key || item.product.id) === key
          );
          if (!existing) return state;

          if (existing.quantity <= 1) {
            return {
              items: state.items.filter(
                (item) => (item.key || item.product.id) !== key
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              (item.key || item.product.id) === key
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          };
        });
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter(
            (item) => (item.key || item.product.id) !== key
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openDrawer: () => {
        set({ isDrawerOpen: true });
      },

      closeDrawer: () => {
        set({ isDrawerOpen: false });
      },

      // Helper Getters / Selectors
      getQuantity: (productId, variantId = null) => {
        const key = getItemKey(productId, variantId);
        const item = get().items.find(
          (i) => (i.key || i.product.id) === key
        );
        return item ? item.quantity : 0;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => {
          const price = item.selectedVariant?.price ?? item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getTotalSavings: () => {
        return get().items.reduce((sum, item) => {
          const price = item.selectedVariant?.price ?? item.product.price;
          const mrp =
            item.selectedVariant?.mrp ?? item.product.mrp ?? price;
          const savingsPerUnit = Math.max(0, mrp - price);
          return sum + savingsPerUnit * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'quickmart-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
