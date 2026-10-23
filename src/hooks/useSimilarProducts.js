import { useQuery } from '@tanstack/react-query';
import { getSimilarProducts } from '../api/productApi';

/**
 * useSimilarProducts hook for fetching similar products
 * @param {string} slug
 */
export const useSimilarProducts = (slug) => {
  return useQuery({
    queryKey: ['similarProducts', slug],
    queryFn: () => getSimilarProducts(slug),
    select: (response) => response?.data || [],
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
};

export default useSimilarProducts;
