import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/utils/constants';
import { toast } from 'sonner';

/**
 * Route wrapper that redirects unauthorized users to home and triggers the LoginDialog
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginDialog = useAuthStore((state) => state.openLoginDialog);
  const setRedirectAfterLogin = useAuthStore((state) => state.setRedirectAfterLogin);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to continue');
      setRedirectAfterLogin(location.pathname + location.search);
      openLoginDialog();
    }
  }, [isLoggedIn, openLoginDialog, location, setRedirectAfterLogin]);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
