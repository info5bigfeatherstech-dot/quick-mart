import axiosInstance from './axiosInstance';
import { dummyOrders } from '@/data/orders';
import { USE_DUMMY_DATA } from '@/utils/constants';

/**
 * Fetch all customer orders
 * @returns {Promise<{ data: Array }>}
 */
export const getOrders = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...dummyOrders] });
      }, 500);
    });
  }

  const response = await axiosInstance.get('/orders');
  return response.data;
};

/**
 * Fetch a single order by ID
 * @param {string} orderId
 * @returns {Promise<{ data: Object }>}
 */
export const getOrderById = async (orderId) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = dummyOrders.find((o) => o.id === orderId);
        if (order) resolve({ data: order });
        else reject(new Error(`Order ${orderId} not found`));
      }, 400);
    });
  }

  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};
