import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Search,
  MapPin,
  ChevronDown,
  User,
  Zap,
  LogOut,
  Package,
  Headphones,
  MapPinned,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLocationStore } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import { useAddresses } from '@/hooks/useAddresses';
import { formatPrice } from '@/utils/formatPrice';
import { ROUTES } from '@/utils/constants';
import { maskPhoneNumber } from '@/utils/validators';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

import ResponsiveModal from '@/components/common/ResponsiveModal';

/**
 * Navbar component: Full width, sticky top, with location selector, search, auth dropdown, and cart
 */
const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');

  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const openDrawer = useCartStore((state) => state.openDrawer);

  const { address, deliveryTime, setLocation } = useLocationStore();
  const { isLoggedIn, user, logout, openLoginDialog } = useAuthStore();

  // Fetch saved addresses if logged in to show default address in location bar
  const { data: savedAddresses = [] } = useAddresses();
  const defaultSavedAddress = savedAddresses.find((a) => a.isDefault);

  const displayLocation =
    isLoggedIn && defaultSavedAddress
      ? `${defaultSavedAddress.houseNo}, ${defaultSavedAddress.city}`
      : address;

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;

    setLocation({
      address: `Area Hub, PIN ${pincodeInput.trim()}`,
      pincode: pincodeInput.trim(),
      deliveryTime: '10 mins',
    });
    setIsLocationDialogOpen(false);
    setPincodeInput('');
    toast.success('Delivery location updated');
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate(ROUTES.HOME);
    toast.info('Logged out successfully');
  };

  const displayName = user?.name || (user?.phone ? maskPhoneNumber(user.phone) : 'My Account');

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border transition-shadow select-none">
        {/* Main Header Container */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 sm:h-18 md:h-20 flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Brand Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-1.5 sm:gap-2 group shrink-0"
            aria-label="QuickMart Home"
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 fill-current text-brand-yellow" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-lg sm:text-2xl font-black tracking-tight text-primary leading-none">
                Quick<span className="text-foreground">Mart</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-muted-foreground hidden sm:block">
                10 Min Delivery
              </span>
            </div>
          </Link>

          {/* Location Selector (tappable on mobile & desktop) */}
          <button
            type="button"
            onClick={() => setIsLocationDialogOpen(true)}
            className="flex items-center gap-1.5 text-left py-1 px-1.5 sm:px-2.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border transition-colors min-w-0 max-w-[160px] sm:max-w-[240px] cursor-pointer"
            aria-label="Change delivery location"
          >
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-bold text-foreground whitespace-nowrap">
                  {deliveryTime}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                {displayLocation}
              </span>
            </div>
          </button>

          {/* Desktop Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for 'milk', 'chips', 'tomatoes'..."
                className="pl-10 pr-4 py-2 bg-secondary text-sm w-full rounded-xl border-border focus-visible:ring-primary"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Right: Auth Profile/Login and Desktop Cart Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isLoggedIn ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-1.5 sm:gap-2 h-9 px-2 sm:px-3 rounded-xl border-border bg-background hover:bg-secondary select-none cursor-pointer"
                    aria-label="User Account Menu"
                  >
                    <Avatar className="h-6 w-6 pointer-events-none">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" />
                      <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-medium">
                        {user?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-xs font-medium text-foreground pointer-events-none">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block pointer-events-none" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-background border-border z-50 shadow-lg"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DropdownMenuLabel className="text-xs">
                    <p className="font-medium text-foreground">
                      {user?.name || 'QuickMart Shopper'}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {user?.phone ? maskPhoneNumber(user.phone) : 'Mobile customer'}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => navigate(ROUTES.PROFILE)}
                    className="text-xs cursor-pointer font-medium"
                  >
                    <User className="h-3.5 w-3.5 mr-2 text-primary" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate(ROUTES.PROFILE_ORDERS)}
                    className="text-xs cursor-pointer font-medium"
                  >
                    <Package className="h-3.5 w-3.5 mr-2 text-primary" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate(ROUTES.PROFILE_ADDRESSES)}
                    className="text-xs cursor-pointer font-medium"
                  >
                    <MapPinned className="h-3.5 w-3.5 mr-2 text-primary" />
                    <span>Saved Addresses</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate(ROUTES.CONTACT_US)}
                    className="text-xs cursor-pointer font-medium"
                  >
                    <Headphones className="h-3.5 w-3.5 mr-2 text-primary" />
                    <span>Contact Us</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      setTimeout(() => setIsLogoutDialogOpen(true), 100);
                    }}
                    className="text-xs text-destructive cursor-pointer hover:bg-destructive/10 font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={openLoginDialog}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border-border text-xs font-semibold select-none hover:border-primary flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Login</span>
              </Button>
            )}

            {/* Desktop-only Cart Button (hidden below md, since mobile uses FloatingCartBar / BottomNav) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  onClick={openDrawer}
                  className="hidden md:flex items-center gap-2 sm:gap-2.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 shadow-sm"
                  aria-label={`Open shopping cart with ${totalItems} items`}
                >
                  <div className="relative flex items-center">
                    <ShoppingBag className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-brand-yellow text-foreground text-[10px] font-black flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col text-left leading-tight">
                    {totalItems > 0 ? (
                      <>
                        <span className="text-[11px] font-medium opacity-90">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                        <span className="font-bold">{formatPrice(totalPrice)}</span>
                      </>
                    ) : (
                      <span>My Cart</span>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {totalItems > 0
                  ? `${totalItems} items (${formatPrice(totalPrice)})`
                  : 'Your cart is empty'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mobile Row 2: Full-width search bar */}
        <div className="md:hidden px-4 pb-2.5 pt-0.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries..."
              className="pl-10 pr-4 py-2 bg-secondary text-sm w-full rounded-xl border-border"
              aria-label="Search groceries on mobile"
            />
          </div>
        </div>

        {/* Responsive Location Selector Modal (Drawer on mobile, Dialog on desktop) */}
        <ResponsiveModal
          open={isLocationDialogOpen}
          onOpenChange={setIsLocationDialogOpen}
          title="Choose Delivery Location"
          description="Enter your delivery pincode or select a popular hub for 10-minute instant delivery."
        >
          <form onSubmit={handlePincodeSubmit} className="space-y-4 pt-1">
            <div className="flex gap-2">
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="Enter 6-digit Pincode"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                maxLength={6}
                className="text-base sm:text-sm h-11"
              />
              <Button type="submit" variant="default" className="h-11 px-5 font-bold">
                Confirm
              </Button>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground block">
                Popular Delivery Hubs
              </span>
              {[
                { address: 'Connaught Place, New Delhi', pincode: '110001', deliveryTime: '10 mins' },
                { address: 'Indiranagar, Bengaluru', pincode: '560038', deliveryTime: '8 mins' },
                { address: 'Bandra West, Mumbai', pincode: '400050', deliveryTime: '11 mins' },
              ].map((loc) => (
                <button
                  key={loc.pincode}
                  type="button"
                  onClick={() => {
                    setLocation(loc);
                    setIsLocationDialogOpen(false);
                    toast.success(`Location set to ${loc.address}`);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                    address === loc.address
                      ? 'border-primary bg-primary/10 font-semibold text-primary'
                      : 'border-border hover:bg-secondary text-foreground'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{loc.address}</p>
                    <span className="text-[11px] text-muted-foreground">{loc.pincode}</span>
                  </div>
                  <Badge variant="yellow" className="text-[10px] font-bold">
                    {loc.deliveryTime}
                  </Badge>
                </button>
              ))}
            </div>
          </form>
        </ResponsiveModal>
      </header>

      {/* Logout Confirmation AlertDialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="bg-background border-border sm:max-w-[420px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground">
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              You will need to verify your phone number again to access your orders and saved addresses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel className="text-xs font-semibold rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold rounded-xl"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default Navbar;
