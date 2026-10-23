import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categoryApi';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    select: (response) => response.data || [],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
