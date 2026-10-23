import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '../api/productApi';

/**
 * useProduct hook for fetching a single product by slug
 * @param {string} slug
 */
export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    select: (response) => response?.data,
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // Do not retry on 404
      if (error?.response?.status === 404 || error?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

export default useProduct;
