import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { profileMenuItems } from '@/data/profileMenu';
import { ROUTES } from '@/utils/constants';
import { toast } from 'sonner';

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
 * ProfileSidebar component matching the clean Blinkit-style account navigation:
 * - Top header with user phone number pill
 * - Edge-to-edge bordered navigation rows
 * - Subtle active state and hover transitions
 * - Matching logout row with confirmation dialog
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

  // Clean phone number display (matching screenshot +917536063814)
  const displayPhone = user?.phone || '+917536063814';

  return (
    <>
      <div
        className={cn(
          'w-full bg-white border border-[#e8ebed] rounded-2xl shadow-none overflow-hidden select-none',
          className
        )}
      >
        {/* Top Header: Phone Number Pill */}
        <div className="py-4 px-5 flex items-center justify-center border-b border-[#eef0f2] bg-white">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#e2e8f0] bg-white text-xs sm:text-[13px] font-medium text-neutral-600 tracking-wide">
            {displayPhone}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col">
          {profileMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group w-full flex items-center gap-3.5 px-6 py-4 text-xs sm:text-[13px] transition-colors border-b border-[#eef0f2]',
                    isActive
                      ? 'bg-neutral-50/80 text-neutral-900 font-medium'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50 font-normal'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-neutral-800'
                          : 'text-neutral-400 group-hover:text-neutral-600'
                      )}
                      strokeWidth={1.75}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={() => setIsLogoutDialogOpen(true)}
            className="group w-full flex items-center gap-3.5 px-6 py-4 text-xs sm:text-[13px] font-normal text-neutral-500 hover:text-red-600 hover:bg-red-50/60 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
          >
            <LogOut
              className="w-4 h-4 shrink-0 text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
              strokeWidth={1.75}
            />
            <span>Logout</span>
          </button>
        </nav>
      </div>

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
