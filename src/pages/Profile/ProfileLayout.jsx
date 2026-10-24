import React from 'react';
import { Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import PageHeader from '@/components/common/PageHeader';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ROUTES } from '@/utils/constants';

/**
 * ProfileLayout component:
 * Desktop: Sticky sidebar on the left, active sub-view on the right
 * Mobile: Full-screen menu at /profile, and child pages have a back arrow to /profile
 */
const ProfileLayout = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  const isRootProfile = pathname === ROUTES.PROFILE || pathname === `${ROUTES.PROFILE}/`;

  // On desktop, redirect /profile root to /profile/orders
  if (!isMobile && isRootProfile) {
    return <Navigate to={ROUTES.PROFILE_ORDERS} replace />;
  }

  // On mobile at /profile, render the menu list directly
  if (isMobile && isRootProfile) {
    return (
      <div className="py-4 pb-24 space-y-4">
        <h1 className="text-xl font-medium text-foreground">My Account</h1>
        <ProfileSidebar />
      </div>
    );
  }

  const isAddressesPage = pathname.includes('addresses');
  const activeTitle = isAddressesPage ? 'My Addresses' : 'My Orders';

  return (
    <div className="pb-24 lg:pb-16 pt-2">
      {/* Mobile Back Button */}
      <div className="lg:hidden mb-2">
        <Link
          to={ROUTES.PROFILE}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline py-1 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Account</span>
        </Link>
      </div>

      <div className="hidden lg:block">
        <PageHeader
          title="My Account"
          subtitle="Manage your quick grocery orders, delivery addresses, and account details"
          breadcrumbs={[
            { label: 'Profile', href: ROUTES.PROFILE_ORDERS },
            { label: activeTitle },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Profile Navigation Sidebar (hidden on mobile sub-pages) */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
          <ProfileSidebar />
        </aside>

        {/* Right Column: Active Sub-section */}
        <section className="lg:col-span-8 xl:col-span-9 min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default ProfileLayout;
