import axiosInstance from './axiosInstance';
import { categories } from '../data/categories';
import { getProductsByCategorySlug, getAllProducts } from '../data/products';
import { USE_DUMMY_DATA } from '../utils/constants';

/**
 * Fetch all grocery categories
 * @returns {Promise<{ data: Array }>}
 */
export const getCategories = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: categories });
      }, 300);
    });
  }

  const response = await axiosInstance.get('/categories');
  return response.data;
};

/**
 * Fetch category metadata by slug
 * @param {string} slug
 * @returns {Promise<{ data: Object }>}
 */
export const getCategoryBySlug = async (slug) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cat = categories.find((c) => c.slug === slug);
        if (cat) {
          resolve({ data: cat });
        } else {
          const err = new Error(`Category ${slug} not found`);
          err.response = { status: 404 };
          err.status = 404;
          reject(err);
        }
      }, 300);
    });
  }

  const response = await axiosInstance.get(`/categories/${slug}`);
  return response.data;
};

/**
 * Fetch products belonging to a category
 * @param {string} slug
 * @returns {Promise<{ data: { category: Object, products: Array } }>}
 */
export const getCategoryProducts = async (slug) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cat = categories.find((c) => c.slug === slug);
        if (!cat) {
          const err = new Error(`Category ${slug} not found`);
          err.response = { status: 404 };
          err.status = 404;
          reject(err);
          return;
        }

        let products = getProductsByCategorySlug(slug);

        // If category has few products, supplement with popular general items marked for quick-browse
        if (products.length === 0) {
          const all = getAllProducts();
          products = all.slice(0, 8).map((p) => ({
            ...p,
            categorySlug: slug,
            categoryName: cat.name,
          }));
        }

        resolve({
          data: {
            category: cat,
            products,
          },
        });
      }, 400);
    });
  }

  const response = await axiosInstance.get(`/categories/${slug}/products`);
  return response.data;
};

