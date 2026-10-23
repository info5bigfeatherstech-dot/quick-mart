import axiosInstance from './axiosInstance';
import { dummyAddresses } from '@/data/addresses';
import { USE_DUMMY_DATA } from '@/utils/constants';

// Module-level in-memory array so add/edit/delete works interactively in the session
let inMemoryAddresses = [...dummyAddresses];

/**
 * Fetch all saved delivery addresses
 * @returns {Promise<{ data: Array }>}
 */
export const getAddresses = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...inMemoryAddresses] });
      }, 400);
    });
  }

  const response = await axiosInstance.get('/addresses');
  return response.data;
};

/**
 * Add a new delivery address
 * @param {Object} addressData
 * @returns {Promise<{ data: Object }>}
 */
export const addAddress = async (addressData) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isFirst = inMemoryAddresses.length === 0;
        const willBeDefault = isFirst || !!addressData.isDefault;

        if (willBeDefault) {
          inMemoryAddresses = inMemoryAddresses.map((a) => ({ ...a, isDefault: false }));
        }

        const newAddress = {
          ...addressData,
          id: `addr-${Date.now()}`,
          isDefault: willBeDefault,
        };

        inMemoryAddresses = [newAddress, ...inMemoryAddresses];
        resolve({ data: newAddress });
      }, 500);
    });
  }

  const response = await axiosInstance.post('/addresses', addressData);
  return response.data;
};

/**
 * Update an existing delivery address
 * @param {string} id
 * @param {Object} updatedFields
 * @returns {Promise<{ data: Object }>}
 */
export const updateAddress = async (id, updatedFields) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = inMemoryAddresses.findIndex((a) => a.id === id);
        if (index === -1) {
          reject(new Error(`Address ${id} not found`));
          return;
        }

        if (updatedFields.isDefault) {
          inMemoryAddresses = inMemoryAddresses.map((a) => ({ ...a, isDefault: false }));
        }

        inMemoryAddresses[index] = {
          ...inMemoryAddresses[index],
          ...updatedFields,
          id, // ensure ID is preserved
        };

        resolve({ data: inMemoryAddresses[index] });
      }, 500);
    });
  }

  const response = await axiosInstance.put(`/addresses/${id}`, updatedFields);
  return response.data;
};

/**
 * Delete a delivery address
 * Rule: only one default address at a time. Deleting the default makes the next one default.
 * @param {string} id
 * @returns {Promise<{ data: { success: boolean } }>}
 */
export const deleteAddress = async (id) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const target = inMemoryAddresses.find((a) => a.id === id);
        if (!target) {
          reject(new Error(`Address ${id} not found`));
          return;
        }

        const wasDefault = target.isDefault;
        inMemoryAddresses = inMemoryAddresses.filter((a) => a.id !== id);

        // If deleted address was default and others remain, make the first one default
        if (wasDefault && inMemoryAddresses.length > 0) {
          inMemoryAddresses[0] = { ...inMemoryAddresses[0], isDefault: true };
        }

        resolve({ data: { success: true } });
      }, 500);
    });
  }

  const response = await axiosInstance.delete(`/addresses/${id}`);
  return response.data;
};

/**
 * Set an address as the default delivery location
 * @param {string} id
 * @returns {Promise<{ data: { success: boolean } }>}
 */
export const setDefaultAddress = async (id) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = inMemoryAddresses.some((a) => a.id === id);
        if (!exists) {
          reject(new Error(`Address ${id} not found`));
          return;
        }

        inMemoryAddresses = inMemoryAddresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));

        resolve({ data: { success: true } });
      }, 400);
    });
  }

  const response = await axiosInstance.patch(`/addresses/${id}/default`);
  return response.data;
};
