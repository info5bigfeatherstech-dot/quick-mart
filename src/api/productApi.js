import axiosInstance from './axiosInstance';
import { productSections, getAllProducts } from '../data/products';
import { USE_DUMMY_DATA } from '../utils/constants';

/**
 * Fetch all product sections with products
 * @returns {Promise<{ data: Array }>}
 */
export const getProductSections = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: productSections });
      }, 600);
    });
  }

  const response = await axiosInstance.get('/product-sections');
  return response.data;
};

/**
 * Fetch products for a specific section or category
 * @param {string} slug
 * @returns {Promise<{ data: Object }>}
 */
export const getProductSectionBySlug = async (slug) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const section = productSections.find((sec) => sec.slug === slug);
        if (section) {
          resolve({ data: section });
        } else {
          reject(new Error(`Section ${slug} not found`));
        }
      }, 600);
    });
  }

  const response = await axiosInstance.get(`/product-sections/${slug}`);
  return response.data;
};

/**
 * Fetch product details by slug or id
 * @param {string} slug
 * @returns {Promise<{ data: Object }>}
 */
export const getProductBySlug = async (slug) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const all = getAllProducts();
        const product = all.find((p) => p.slug === slug || p.id === slug);
        if (product) {
          resolve({ data: product });
        } else {
          const err = new Error(`Product ${slug} not found`);
          err.response = { status: 404 };
          err.status = 404;
          reject(err);
        }
      }, 600);
    });
  }

  const response = await axiosInstance.get(`/products/${slug}`);
  return response.data;
};

/**
 * Fetch similar products by product slug
 * @param {string} slug
 * @returns {Promise<{ data: Array }>}
 */
export const getSimilarProducts = async (slug) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getAllProducts();
        const current = all.find((p) => p.slug === slug || p.id === slug);
        if (!current) {
          resolve({ data: [] });
          return;
        }

        let similar = all.filter(
          (p) => p.categorySlug === current.categorySlug && p.id !== current.id
        );

        if (similar.length < 4) {
          const otherProducts = all.filter(
            (p) => p.categorySlug !== current.categorySlug && p.id !== current.id
          );
          similar = [...similar, ...otherProducts];
        }

        resolve({ data: similar.slice(0, 8) });
      }, 600);
    });
  }

  const response = await axiosInstance.get(`/products/${slug}/similar`);
  return response.data;
};
