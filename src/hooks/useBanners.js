import { useQuery } from '@tanstack/react-query';
import { getBanners } from '../api/bannerApi';

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
    select: (response) => response.data || [],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
