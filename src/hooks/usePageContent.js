import { useQuery } from '@tanstack/react-query';
import { getPageContent } from '@/api/pageApi';

/**
 * Hook to retrieve structured content for a static policy page
 * @param {string} slug
 */
export const usePageContent = (slug) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: () => getPageContent(slug),
    select: (response) => response.data,
    enabled: !!slug,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
