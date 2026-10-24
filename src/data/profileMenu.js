import { MapPin, FileText } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

export const profileMenuItems = [
  {
    id: 'addresses',
    label: 'My Addresses',
    path: ROUTES.PROFILE_ADDRESSES,
    icon: MapPin,
  },
  {
    id: 'orders',
    label: 'My Orders',
    path: ROUTES.PROFILE_ORDERS,
    icon: FileText,
  },
];
