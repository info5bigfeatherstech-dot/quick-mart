import axiosInstance from './axiosInstance';
import { banners } from '../data/banners';
import { USE_DUMMY_DATA } from '../utils/constants';

/**
 * Fetch promotional carousel banners
 * @returns {Promise<{ data: Array }>}
 */
export const getBanners = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: banners });
      }, 600);
    });
  }

  const response = await axiosInstance.get('/banners');
  return response.data;
};
