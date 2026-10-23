import { useMediaQuery } from './useMediaQuery';

/**
 * useIsMobile: returns true when viewport width < 768px
 * SSR-safe, reactive on window resize
 */
export const useIsMobile = (breakpoint = 768) => {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
};

export default useIsMobile;
