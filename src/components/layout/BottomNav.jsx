import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bottomNavItems } from '@/data/bottomNav';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/lib/utils';

/**
 * BottomNav: Mobile bottom navigation bar (visible below md breakpoint)
 * Features 4 core navigation items with cart count badge and active states
 */
const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const totalItems = useCartStore((state) => state.getTotalItems());
  const openDrawer = useCartStore((state) => state.openDrawer);
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn || state.isAuthenticated);
  const openLoginDialog = useAuthStore((state) => state.openLoginDialog);

  // Hide on Product Detail page (which has its own action bar), cart drawer, checkout, and order success
  const isProductDetail = location.pathname.startsWith('/product/');
  const isCheckoutOrSuccess =
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/order-success');

  if (isProductDetail || isDrawerOpen || isCheckoutOrSuccess) {
    return null;
  }

  const handleItemClick = (item) => {
    if (item.type === 'cart') {
      openDrawer();
      return;
    }

    if (item.type === 'profile') {
      if (isLoggedIn) {
        navigate(ROUTES.PROFILE);
      } else {
        openLoginDialog();
      }
      return;
    }

    if (item.id === 'categories') {
      if (location.pathname === ROUTES.HOME) {
        const el = document.getElementById('categories-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(`${ROUTES.HOME}#categories-section`);
      }
      return;
    }

    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-2 pt-1 pb-[max(env(safe-area-inset-bottom,0px),8px)] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] select-none"
    >
      <div className="grid grid-cols-4 h-12 max-w-md mx-auto items-center">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;

          // Determine active status
          let isActive = false;
          if (item.id === 'home' && location.pathname === ROUTES.HOME && !location.hash) {
            isActive = true;
          } else if (item.id === 'categories' && location.hash === '#categories-section') {
            isActive = true;
          } else if (item.id === 'profile' && location.pathname.startsWith('/profile')) {
            isActive = true;
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={cn(
                'relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground font-medium'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-150',
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  )}
                />

                {/* Cart Badge */}
                {item.id === 'cart' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-in zoom-in-75">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>

              <span className="text-[11px] leading-tight mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
