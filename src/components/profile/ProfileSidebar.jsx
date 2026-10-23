import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { profileMenuItems } from '@/data/profileMenu';
import { formatPhone } from '@/utils/formatPhone';
import { ROUTES } from '@/utils/constants';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

/**
 * ProfileSidebar for navigation between orders, saved addresses, and account actions
 */
const ProfileSidebar = ({ className = '' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    navigate(ROUTES.HOME);
    toast.info('Logged out successfully');
  };

  const displayName = user?.name || 'QuickMart Customer';
  const displayPhone = user?.phone ? formatPhone(user.phone) : '+91 98765 43210';
  const initial = (user?.name?.[0] || 'U').toUpperCase();

  return (
    <>
      <Card className={cn('p-4 sm:p-5 bg-card border-border rounded-2xl shadow-none', className)}>
        {/* User Card Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-border">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm sm:text-base font-medium text-foreground truncate">
              {displayName}
            </h2>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">
              {displayPhone}
            </span>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <nav className="pt-3 space-y-1">
          {profileMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-primary text-primary-foreground font-medium px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={() => setIsLogoutDialogOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </nav>
      </Card>

      {/* Logout Confirmation AlertDialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="bg-background border-border sm:max-w-[420px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-medium text-foreground">
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              You will need to enter your phone number to access your order history and saved addresses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel className="text-xs font-medium rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium rounded-xl"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileSidebar;
