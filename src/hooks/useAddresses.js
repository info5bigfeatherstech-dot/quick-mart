import { useQuery } from '@tanstack/react-query';
import { getAddresses } from '@/api/addressApi';

/**
 * Hook to retrieve user saved delivery addresses
 */
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
