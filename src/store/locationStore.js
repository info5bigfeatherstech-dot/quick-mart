import { create } from 'zustand';

export const useLocationStore = create((set) => ({
  address: 'Connaught Place, New Delhi',
  pincode: '110001',
  deliveryTime: '10 mins',

  setLocation: ({ address, pincode, deliveryTime }) => {
    set((state) => ({
      address: address !== undefined ? address : state.address,
      pincode: pincode !== undefined ? pincode : state.pincode,
      deliveryTime: deliveryTime !== undefined ? deliveryTime : state.deliveryTime,
    }));
  },
}));
