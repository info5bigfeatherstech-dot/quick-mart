/**
 * Validates an Indian mobile number.
 * Must be exactly 10 numeric digits and start with 6, 7, 8, or 9.
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidIndianMobile = (phone) => {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

/**
 * Validates an Indian postal PIN code (exactly 6 digits, numeric).
 * @param {string|number} pincode
 * @returns {boolean}
 */
export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  const cleaned = String(pincode).trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
};

/**
 * Formats a 10-digit phone number with mask, e.g. +91 98••••••12
 * @param {string} phone
 * @returns {string}
 */
export const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length >= 10) {
    const lastTen = digits.slice(-10);
    return `+91 ${lastTen.slice(0, 2)}••••••${lastTen.slice(8)}`;
  }
  return phone;
};
