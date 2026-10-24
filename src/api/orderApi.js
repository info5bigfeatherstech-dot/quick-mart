import axiosInstance from './axiosInstance';
import { dummyOrders } from '@/data/orders';
import { USE_DUMMY_DATA } from '@/utils/constants';

// In-memory orders array so newly placed orders appear instantly in session
let inMemoryOrders = [...dummyOrders];

/**
 * Fetch all customer orders
 * @returns {Promise<{ data: Array }>}
 */
export const getOrders = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...inMemoryOrders] });
      }, 400);
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
        const order = inMemoryOrders.find((o) => o.id === orderId);
        if (order) resolve({ data: order });
        else reject(new Error(`Order ${orderId} not found`));
      }, 400);
    });
  }

  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * Place a new grocery order.
 * In dummy mode:
 * - Simulates ~1500ms payment processing
 * - Triggers failure if UPI ID is 'fail@upi' to test failure path
 * - Pushes created order to inMemoryOrders so it appears in My Orders
 *
 * @param {Object} payload
 * @param {Array} payload.items
 * @param {string} payload.addressId
 * @param {Object} [payload.address]
 * @param {'now'|'scheduled'} payload.deliveryOption
 * @param {Object} [payload.slot]
 * @param {string} [payload.instructions]
 * @param {'upi'|'card'|'cod'} payload.paymentMethod
 * @param {string} [payload.upiId]
 * @param {Object} [payload.coupon]
 * @param {number} [payload.tip]
 * @param {Object} payload.bill
 * @returns {Promise<{ data: Object }>}
 */
export const placeOrder = async (payload) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Test failure trigger for 'fail@upi'
        if (payload.paymentMethod === 'upi' && payload.upiId?.trim() === 'fail@upi') {
          reject(
            new Error(
              'UPI Payment simulation failed for fail@upi. Please verify credentials or choose another payment method.'
            )
          );
          return;
        }

        const orderId = `ORD-${Date.now().toString().slice(-6)}`;
        const eta =
          payload.deliveryOption === 'scheduled' && payload.slot
            ? `${payload.slot.day === 'today' ? 'Today' : 'Tomorrow'}, ${payload.slot.time}`
            : '10 to 15 mins';

        const newOrder = {
          id: orderId,
          createdAt: new Date().toISOString(),
          status: 'Placed',
          items: payload.items || [],
          bill: payload.bill,
          itemTotal: payload.bill?.itemTotal,
          deliveryFee: payload.bill?.deliveryFee,
          handlingFee: payload.bill?.handlingFee,
          total: payload.bill?.grandTotal,
          address: payload.address,
          addressId: payload.addressId,
          deliveryOption: payload.deliveryOption,
          slot: payload.slot,
          instructions: payload.instructions,
          paymentMethod: payload.paymentMethod,
          eta,
        };

        inMemoryOrders = [newOrder, ...inMemoryOrders];
        resolve({ data: newOrder });
      }, 1500);
    });
  }

  const response = await axiosInstance.post('/orders', payload);
  return response.data;
};
