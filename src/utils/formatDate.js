/**
 * Formats an ISO string, timestamp, or Date object to a readable Indian format
 * e.g. "23 Oct 2026, 02:30 PM"
 * @param {string|number|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);

  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
