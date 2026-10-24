import axiosInstance from './axiosInstance';
import { dummyDeliverySlots } from '@/data/deliverySlots';
import { dummyCoupons } from '@/data/coupons';
import { USE_DUMMY_DATA } from '@/utils/constants';

/**
 * Fetch available delivery slots for the selected day ('today' | 'tomorrow')
 * Automatically disables past slots for today.
 *
 * @param {'today'|'tomorrow'} day
 * @returns {Promise<{ data: Array }>}
 */
export const getDeliverySlots = async (day = 'today') => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const currentHour = now.getHours();

        const processedSlots = dummyDeliverySlots.map((slot) => {
          // If scheduling for today, slots that have already started are past
          const isPast = day === 'today' && slot.startHour <= currentHour;
          return {
            ...slot,
            day,
            isPast,
            isDisabled: isPast || slot.isFull,
          };
        });

        resolve({ data: processedSlots });
      }, 350);
    });
  }

  const response = await axiosInstance.get('/checkout/slots', { params: { day } });
  return response.data;
};

/**
 * Validates cart items for availability and price integrity before placing order.
 * In dummy mode: marks 1 item out of stock ONLY when flag window.__TEST_CART_OUT_OF_STOCK__ is true.
 *
 * @param {Array} items - Cart items
 * @returns {Promise<{ data: { valid: boolean, errors: Array, items: Array } }>}
 */
export const validateCart = async (items = []) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const errors = [];
        const validatedItems = items.map((item, index) => {
          // Test harness flag to simulate stock / price change testing
          if (typeof window !== 'undefined' && window.__TEST_CART_OUT_OF_STOCK__ && index === 0) {
            errors.push({
              key: item.key || item.product?.id,
              name: item.product?.name,
              reason: 'out_of_stock',
              message: `${item.product?.name} just went out of stock`,
            });
            return { ...item, isOutOfStock: true };
          }
          return { ...item, isOutOfStock: false };
        });

        resolve({
          data: {
            valid: errors.length === 0,
            errors,
            items: validatedItems,
          },
        });
      }, 400);
    });
  }

  const response = await axiosInstance.post('/checkout/validate-cart', { items });
  return response.data;
};

/**
 * Apply coupon code and calculate discount amount
 *
 * @param {string} code
 * @param {number} cartTotal
 * @returns {Promise<{ data: { valid: boolean, coupon: Object, message: string } }>}
 */
export const applyCoupon = async (code, cartTotal = 0) => {
  const cleanCode = String(code || '').trim().toUpperCase();

  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const coupon = dummyCoupons.find((c) => c.code === cleanCode);
        if (!coupon) {
          reject(new Error(`Invalid coupon code "${cleanCode}"`));
          return;
        }

        if (cartTotal < coupon.minOrder) {
          reject(
            new Error(
              `Minimum cart value of ₹${coupon.minOrder} required for coupon ${cleanCode}`
            )
          );
          return;
        }

        resolve({
          data: {
            valid: true,
            coupon,
            message: `Coupon ${coupon.code} applied successfully!`,
          },
        });
      }, 450);
    });
  }

  const response = await axiosInstance.post('/checkout/apply-coupon', {
    code: cleanCode,
    cartTotal,
  });
  return response.data;
};

/**
 * Fetch all available dummy coupons list for modal view
 * @returns {Promise<{ data: Array }>}
 */
export const getAvailableCoupons = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...dummyCoupons] });
      }, 300);
    });
  }

  const response = await axiosInstance.get('/checkout/coupons');
  return response.data;
};
