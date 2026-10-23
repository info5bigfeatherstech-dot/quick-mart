import { useQuery } from '@tanstack/react-query';
import { getContactInfo } from '@/api/contactApi';

/**
 * Hook to retrieve company contact details
 */
export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: getContactInfo,
    select: (response) => response.data,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
