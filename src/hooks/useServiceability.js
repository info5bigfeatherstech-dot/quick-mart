import { useQuery } from '@tanstack/react-query';
import { checkServiceability } from '@/api/addressApi';

/**
 * Hook to check if a delivery pincode is serviceable
 * @param {string} pincode
 */
export const useServiceability = (pincode) => {
  const cleanPincode = String(pincode || '').trim();

  return useQuery({
    queryKey: ['serviceability', cleanPincode],
    queryFn: async () => {
      const response = await checkServiceability(cleanPincode);
      return response.data;
    },
    enabled: Boolean(cleanPincode && cleanPincode.length === 6),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
