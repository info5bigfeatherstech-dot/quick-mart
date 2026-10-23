import { useQuery } from '@tanstack/react-query';
import { getProductSections } from '../api/productApi';

export const useProductSections = () => {
  return useQuery({
    queryKey: ['productSections'],
    queryFn: getProductSections,
    select: (response) => response.data || [],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
