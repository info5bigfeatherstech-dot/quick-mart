/**
 * Formats a number to Indian Rupee (INR) representation.
 * @param {number|string} amount
 * @returns {string} e.g. "₹149" or "₹1,249"
 */
export const formatPrice = (amount) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return '₹0';
  return `₹${numericAmount.toLocaleString('en-IN')}`;
};
