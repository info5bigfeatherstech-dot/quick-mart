import { create } from 'zustand';

const initialCheckoutState = {
  selectedAddressId: null,
  deliveryOption: 'now', // 'now' | 'scheduled'
  selectedSlot: null, // { id, day: 'today'|'tomorrow', time }
  deliveryInstructions: '',
  paymentMethod: 'upi', // 'upi' | 'card' | 'cod'
  upiId: '',
  coupon: null, // applied coupon object or null
  tip: 0,
};

export const useCheckoutStore = create((set) => ({
  ...initialCheckoutState,

  setSelectedAddressId: (addressId) => set({ selectedAddressId: addressId }),

  setDeliveryOption: (option) => set({ deliveryOption: option }),

  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  setDeliveryInstructions: (instructions) =>
    set({ deliveryInstructions: instructions.slice(0, 200) }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setUpiId: (id) => set({ upiId: id }),

  setCoupon: (coupon) => set({ coupon }),

  setTip: (tip) => set({ tip: Number(tip) || 0 }),

  resetCheckout: () => set({ ...initialCheckoutState }),
}));
