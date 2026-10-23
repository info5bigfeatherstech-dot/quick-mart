import { useQuery } from '@tanstack/react-query';
import { getCategoryProducts } from '../api/categoryApi';

/**
 * Hook to fetch products and metadata for a category slug
 * @param {string} slug
 */
export const useCategoryProducts = (slug) => {
  return useQuery({
    queryKey: ['category-products', slug],
    queryFn: () => getCategoryProducts(slug),
    select: (response) => response.data,
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 1,
  });
};
