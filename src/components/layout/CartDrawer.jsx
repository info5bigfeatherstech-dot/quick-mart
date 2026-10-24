import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingBag, ArrowRight, ShieldCheck, Clock, Trash2, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLocationStore } from '@/store/locationStore';
import { useRequireLogin } from '@/hooks/useRequireLogin';
import { formatPrice } from '@/utils/formatPrice';
import { calculateBill } from '@/utils/billCalculator';
import { ROUTES, BILL_CONFIG } from '@/utils/constants';

import ResponsiveSheet from '@/components/common/ResponsiveSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QuantityStepper from '../product/QuantityStepper';
import EmptyState from '../common/EmptyState';

/**
 * CartDrawer using ResponsiveSheet:
 * Mobile: Slide-up Drawer bottom sheet (up to 90dvh) with sticky bill footer
 * Desktop: Slide-out right Sheet (~420px)
 */
const CartDrawer = () => {
  const navigate = useNavigate();
  const requireLogin = useRequireLogin();

  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const items = useCartStore((state) => state.items);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const { address, deliveryTime } = useLocationStore();

  // Consistent bill calculations across cart & checkout
  const bill = calculateBill({ items });
  const { itemTotal, deliveryFee, handlingFee, smallCartFee, grandTotal, totalSavings } = bill;

  const handleProceedToCheckout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    closeDrawer();
    requireLogin(() => {
      navigate(ROUTES.CHECKOUT);
    }, ROUTES.CHECKOUT);
  };

  return (
    <ResponsiveSheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-border bg-background flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            My Cart {totalItems > 0 && `(${totalItems})`}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearCart();
                toast.info('Cart cleared');
              }}
              className="text-xs text-muted-foreground hover:text-destructive h-8 px-2 rounded-lg"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>Clear</span>
            </Button>
          )}

          <button
            type="button"
            onClick={closeDrawer}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delivery Time & Location Banner */}
      <div className="px-5 py-2.5 bg-secondary/70 border-b border-border flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate">
            Delivery in {deliveryTime}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground truncate max-w-[130px] sm:max-w-[180px]">
          {address}
        </span>
      </div>

      {/* Main Content Body */}
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            message="You have no items in your grocery basket. Add items from our daily essentials to get delivery in 10 minutes!"
            actionText="Start Shopping"
            onAction={closeDrawer}
          />
        </div>
      ) : (
        <>
          {/* Free Delivery Banner */}
          {itemTotal < BILL_CONFIG.FREE_DELIVERY_THRESHOLD && (
            <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 text-xs flex items-center justify-between shrink-0">
              <span className="text-amber-900 dark:text-amber-300">
                Add items worth{' '}
                <strong className="font-bold">
                  {formatPrice(BILL_CONFIG.FREE_DELIVERY_THRESHOLD - itemTotal)}
                </strong>{' '}
                for free delivery
              </span>
              <Badge variant="yellow" className="text-[9px] font-bold py-0.5">
                FREE DELIVERY
              </Badge>
            </div>
          )}

          {/* Scrollable Item List & Bill Details */}
          <div className="flex-1 overflow-y-auto px-5 divide-y divide-border/60">
            {/* Items */}
            <div className="py-2 divide-y divide-border/60">
              {items.map((item) => {
                const itemKey = item.key || item.product.id;
                const { product, selectedVariant, quantity } = item;
                const itemPrice = selectedVariant?.price ?? product.price;
                const itemMrp = selectedVariant?.mrp ?? product.mrp;
                const displayWeight = selectedVariant?.weight || product.weight;

                return (
                  <div
                    key={itemKey}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl bg-secondary border border-border p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                          {product.name}
                          {selectedVariant?.weight && (
                            <span className="text-muted-foreground ml-1 font-normal">
                              ({selectedVariant.weight})
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-foreground">
                            {formatPrice(itemPrice * quantity)}
                          </span>
                          {itemMrp && itemMrp > itemPrice && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              {formatPrice(itemMrp * quantity)}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            • {displayWeight}
                          </span>
                        </div>
                      </div>
                    </div>

                    <QuantityStepper
                      quantity={quantity}
                      onIncrease={() => increaseQty(itemKey)}
                      onDecrease={() => decreaseQty(itemKey)}
                      size="sm"
                      className="shrink-0"
                    />
                  </div>
                );
              })}
            </div>

            {/* Bill Details Section */}
            <div className="py-4 space-y-2 text-xs">
              <h5 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">
                Bill Details
              </h5>

              <div className="flex justify-between text-muted-foreground">
                <span>Items Total</span>
                <span className="text-foreground font-medium">
                  {formatPrice(itemTotal)}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charge</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Handling Charge</span>
                <span className="text-foreground font-medium">
                  {formatPrice(handlingFee)}
                </span>
              </div>

              {smallCartFee > 0 && (
                <div className="flex justify-between text-amber-700 dark:text-amber-400">
                  <span>Small Cart Charge</span>
                  <span className="font-medium">{formatPrice(smallCartFee)}</span>
                </div>
              )}

              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-border/60">
                  <span>Total Savings</span>
                  <span>-{formatPrice(totalSavings)}</span>
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                <span>To Pay</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Guarantee note */}
            <div className="py-3 mb-2 flex items-center gap-2 p-3 rounded-xl bg-secondary/60 border border-border/60 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>
                Orders cannot be cancelled once packed to ensure 10-minute instant delivery.
              </span>
            </div>
          </div>

          {/* Sticky Footer Checkout Button */}
          <div className="p-4 border-t border-border bg-background flex flex-col gap-2 shrink-0 safe-bottom">
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={handleProceedToCheckout}
              className="w-full py-5 sm:py-6 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-between shadow-md hover:bg-primary/95 cursor-pointer active:scale-[0.99] transition-transform select-none"
            >
              <div className="flex flex-col text-left pointer-events-none">
                <span className="text-[11px] font-normal opacity-90">Total Amount</span>
                <span className="font-black text-base">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary-foreground/20 py-1.5 px-3 rounded-lg pointer-events-none">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">
              ⚡ 10-minute instant delivery guaranteed
            </p>
          </div>
        </>
      )}
    </ResponsiveSheet>
  );
};

export default CartDrawer;
