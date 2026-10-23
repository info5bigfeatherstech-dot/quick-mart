import { useState, useEffect } from 'react';

/**
 * useMediaQuery: React hook to detect CSS media query matches
 * SSR-safe and updates on window resize
 * @param {string} query
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const updateMatch = (e) => setMatches(e.matches);

    // Initial check
    setMatches(mediaQueryList.matches);

    // Modern and fallback listeners
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updateMatch);
      return () => mediaQueryList.removeEventListener('change', updateMatch);
    } else {
      mediaQueryList.addListener(updateMatch);
      return () => mediaQueryList.removeListener(updateMatch);
    }
  }, [query]);

  return matches;
};

export default useMediaQuery;
