import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

export const bottomNavItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    route: ROUTES.HOME,
    type: 'link',
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: LayoutGrid,
    route: '#categories-section',
    type: 'action',
  },
  {
    id: 'cart',
    label: 'Cart',
    icon: ShoppingBag,
    type: 'cart',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    route: ROUTES.PROFILE,
    type: 'profile',
  },
];
