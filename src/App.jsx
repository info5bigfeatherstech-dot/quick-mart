import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Skeleton } from './components/ui/skeleton';
import { ROUTES } from './utils/constants';

// Route-level code splitting for enhanced mobile network performance
const Home = React.lazy(() => import('./pages/Home'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const ProfileLayout = React.lazy(() => import('./pages/Profile/ProfileLayout'));
const Orders = React.lazy(() => import('./pages/Profile/Orders'));
const Addresses = React.lazy(() => import('./pages/Profile/Addresses'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const CategoryDetail = React.lazy(() => import('./pages/CategoryDetail'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

/**
 * Mobile-optimized Page Skeleton fallback for Suspense
 */
const PageLoadingFallback = () => (
  <div className="py-4 md:py-6 space-y-5 animate-pulse w-full">
    <Skeleton className="h-40 sm:h-52 w-full rounded-2xl" />
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </div>
    <div className="space-y-3 pt-2">
      <Skeleton className="h-6 w-48 rounded-lg" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-[145px] sm:w-[176px] h-52 shrink-0 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

/**
 * App: Configures application routes with Suspense code splitting inside MainLayout
 */
function App() {
  return (
    <MainLayout>
      <ScrollToTop />
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CONTACT_US} element={<ContactUs />} />
          <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
          <Route path={ROUTES.TERMS_AND_CONDITIONS} element={<TermsAndConditions />} />
          <Route path={ROUTES.PRODUCT_DETAIL(':slug')} element={<ProductDetail />} />
          <Route path={ROUTES.CATEGORY(':slug')} element={<CategoryDetail />} />

          {/* Protected Profile Section */}
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.PROFILE_ORDERS} replace />} />
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
