import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/utils/constants';
import { toast } from 'sonner';

/**
 * Route wrapper that redirects unauthorized users to home and triggers the LoginDialog
 */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginDialog = useAuthStore((state) => state.openLoginDialog);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to continue');
      openLoginDialog();
    }
  }, [isLoggedIn, openLoginDialog]);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
