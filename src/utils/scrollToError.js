/**
 * Utility to smoothly scroll to and focus on the first invalid checkout section or input element.
 * Respects user's prefers-reduced-motion setting.
 *
 * @param {string} elementIdOrSelector - Element ID (without '#') or query selector
 * @param {Object} [options]
 * @param {number} [options.offset=100] - Top offset in pixels (for sticky headers)
 */
export const scrollToError = (elementIdOrSelector, { offset = 100 } = {}) => {
  if (typeof window === 'undefined') return;

  const target =
    document.getElementById(elementIdOrSelector) ||
    document.querySelector(elementIdOrSelector);

  if (!target) return;

  const rect = target.getBoundingClientRect();
  const absoluteTop = window.pageYOffset + rect.top - offset;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  window.scrollTo({
    top: Math.max(0, absoluteTop),
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });

  // Highlight and focus
  const focusable = target.querySelector(
    'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusable) {
    focusable.focus({ preventScroll: true });
  } else {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  // Add a temporary subtle error shake or outline pulse
  target.classList.add('ring-2', 'ring-destructive/70', 'ring-offset-2');
  setTimeout(() => {
    target.classList.remove('ring-2', 'ring-destructive/70', 'ring-offset-2');
  }, 2200);
};
