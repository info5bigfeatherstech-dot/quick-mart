import { Package, MapPin, Heart, Wallet, HelpCircle } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

export const profileMenuItems = [
  {
    id: 'orders',
    label: 'My Orders',
    path: ROUTES.PROFILE_ORDERS,
    icon: Package,
    badge: null,
  },
  {
    id: 'addresses',
    label: 'Saved Addresses',
    path: ROUTES.PROFILE_ADDRESSES,
    icon: MapPin,
    badge: null,
  },
];
