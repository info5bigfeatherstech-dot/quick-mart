import axiosInstance from './axiosInstance';
import { pagesData } from '@/data/pages';
import { USE_DUMMY_DATA } from '@/utils/constants';

/**
 * Fetch static policy page content by slug
 * @param {string} slug - e.g. 'privacy-policy', 'terms-and-conditions'
 * @returns {Promise<{ data: Object }>}
 */
export const getPageContent = async (slug) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const page = pagesData[slug];
        if (page) {
          resolve({ data: page });
        } else {
          reject(new Error(`Page '${slug}' not found`));
        }
      }, 400);
    });
  }

  const response = await axiosInstance.get(`/pages/${slug}`);
  return response.data;
};
