import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Container from '../common/Container';
import CartDrawer from './CartDrawer';
import BottomNav from './BottomNav';
import LoginDialog from '../auth/LoginDialog';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * MainLayout:
 * - Navbar: Sticky top with two-row mobile header
 * - Main: centered container (max-w 1180px)
 * - Footer: with mobile bottom spacing for BottomNav
 * - Global Overlays: BottomNav, CartDrawer, LoginDialog, and Toaster
 */
const MainLayout = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 w-full">
        <Container>{children}</Container>
      </main>

      <Footer />

      {/* Global UI Overlays */}
      <CartDrawer />
      <BottomNav />
      <LoginDialog />

      {/* Responsive Toaster:
          Mobile: top-center (avoids hiding behind bottom-nav)
          Desktop: bottom-right
      */}
      <Toaster
        position={isMobile ? 'top-center' : 'bottom-right'}
        closeButton={false}
        duration={2500}
        offset={
          isMobile
            ? { top: 14 }
            : { bottom: 24, right: 24 }
        }
      />
    </div>
  );
};

export default MainLayout;
