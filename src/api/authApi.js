import axiosInstance from './axiosInstance';
import { USE_DUMMY_DATA } from '@/utils/constants';

/**
 * Authenticates user using mobile number.
 * @param {string} phone - 10-digit mobile number
 * @returns {Promise<{ data: { user: Object, token: string } }>}
 */
export const loginWithPhone = async (phone) => {
  const cleanPhone = String(phone).replace(/\D/g, '');

  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              id: `usr-${Date.now()}`,
              phone: `+91${cleanPhone}`,
              name: null,
            },
            token: `qm_token_${cleanPhone}_${Date.now()}`,
          },
        });
      }, 500);
    });
  }

  const response = await axiosInstance.post('/auth/login', { phone: cleanPhone });
  return response.data;
};
