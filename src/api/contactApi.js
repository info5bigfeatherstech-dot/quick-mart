import axiosInstance from './axiosInstance';
import { contactInfo } from '@/data/contact';
import { USE_DUMMY_DATA } from '@/utils/constants';

/**
 * Fetch company contact details
 * @returns {Promise<{ data: Object }>}
 */
export const getContactInfo = async () => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: contactInfo });
      }, 400);
    });
  }

  const response = await axiosInstance.get('/contact');
  return response.data;
};

/**
 * Submit contact inquiry form
 * @param {Object} formData - { name, phone, email, message }
 * @returns {Promise<{ data: { success: boolean, message: string } }>}
 */
export const submitContactForm = async (formData) => {
  if (USE_DUMMY_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: 'Inquiry received successfully',
            ticketId: `QM-${Date.now().toString().slice(-6)}`,
          },
        });
      }, 600);
    });
  }

  const response = await axiosInstance.post('/contact', formData);
  return response.data;
};
