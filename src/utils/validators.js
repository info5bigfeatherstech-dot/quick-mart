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

/**
 * Validates a UPI ID (e.g., user@bank, 9876543210@paytm, fail@upi).
 * @param {string} upi
 * @returns {boolean}
 */
export const isValidUpiId = (upi) => {
  if (!upi) return false;
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(String(upi).trim());
};

/**
 * Detects card brand from card number prefix.
 * @param {string} cardNumber
 * @returns {'visa'|'mastercard'|'rupay'|'amex'|'generic'}
 */
export const getCardBrand = (cardNumber) => {
  const digits = String(cardNumber || '').replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(digits)) return 'mastercard';
  if (/^(60|65|81|82|508)/.test(digits)) return 'rupay';
  if (/^3[47]/.test(digits)) return 'amex';
  return 'generic';
};

/**
 * Validates a credit/debit card number using the Luhn algorithm.
 * @param {string} cardNumber
 * @returns {boolean}
 */
export const isValidCardNumber = (cardNumber) => {
  const digits = String(cardNumber || '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

/**
 * Validates card expiry in MM/YY format.
 * Checks for valid month (01-12) and that expiry is in the current or future month.
 * @param {string} expiry - e.g. "12/28"
 * @returns {boolean}
 */
export const isValidCardExpiry = (expiry) => {
  if (!expiry) return false;
  const match = String(expiry).trim().match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100; // e.g. 26
  const currentMonth = now.getMonth() + 1; // 1-12

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

/**
 * Validates card CVV code (3 digits standard, 4 for Amex).
 * @param {string} cvv
 * @param {string} brand
 * @returns {boolean}
 */
export const isValidCardCvv = (cvv, brand = 'generic') => {
  const cleaned = String(cvv || '').trim();
  const expectedLen = brand === 'amex' ? 4 : 3;
  return new RegExp(`^\\d{${expectedLen}}$`).test(cleaned);
};

/**
 * Formats a card number with spaces every 4 digits.
 * @param {string} val
 * @returns {string}
 */
export const formatCardNumber = (val) => {
  const digits = String(val || '').replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/**
 * Formats card expiry as MM/YY automatically.
 * @param {string} val
 * @returns {string}
 */
export const formatCardExpiry = (val) => {
  const digits = String(val || '').replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};
