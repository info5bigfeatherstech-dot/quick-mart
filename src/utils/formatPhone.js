/**
 * Formats a 10-digit or prefixed mobile number to standard Indian format: +91 XXXXX XXXXX
 * @param {string} phone
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  const tenDigits = digits.length > 10 ? digits.slice(-10) : digits;

  if (tenDigits.length === 10) {
    return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
  }

  return phone;
};
