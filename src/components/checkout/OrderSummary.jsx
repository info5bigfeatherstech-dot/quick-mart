import React from 'react';
import { ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import CouponInput from './CouponInput';
import TipSelector from './TipSelector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * OrderSummary:
 * Displays full itemized bill breakdown, coupon input, tip selector,
 * total savings highlight, and the Place Order button.
 */
const OrderSummary = ({
  bill,
  items = [],
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
  tip = 0,
  onTipChange,
  onPlaceOrder,
  isSubmitting = false,
  disabled = false,
  disabledReason = '',
  hideSubmitButton = false,
  className = '',
}) => {
  if (!bill) return null;

  const {
    itemTotal = 0,
    mrpTotal = 0,
    couponDiscount = 0,
    deliveryFee = 0,
    handlingFee = 0,
    smallCartFee = 0,
    grandTotal = 0,
    totalSavings = 0,
  } = bill;

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">
          Order Summary
        </h3>
        {Array.isArray(items) && items.length > 0 && (
          <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
            {items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0)}{' '}
            {items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0) === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* Cart Items Preview with Product Images */}
      {Array.isArray(items) && items.length > 0 && (
        <div className="space-y-2.5">
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-border/40 scrollbar-thin">
            {items.map((item, idx) => {
              const key = item?.key || item?.product?.id || `item-${idx}`;
              const price = Number(item?.selectedVariant?.price ?? item?.product?.price ?? 0);
              const qty = Number(item?.quantity) || 1;
              const image = item?.product?.image;
              const name = item?.product?.name || 'Item';
              const weight =
                item?.selectedVariant?.weight ||
                item?.product?.weight ||
                item?.selectedVariant?.label ||
                '';

              return (
                <div key={key} className="flex items-center justify-between gap-3 pt-2.5 first:pt-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Product Image Thumbnail */}
                    <div className="relative w-12 h-12 rounded-xl bg-muted/40 border border-border/80 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary/50 rounded flex items-center justify-center text-[10px] text-muted-foreground font-semibold">
                          Item
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[9px] font-extrabold px-1.5 py-0.5 rounded-tl-md shadow-2xs">
                        {qty}x
                      </span>
                    </div>

                    {/* Product Name & Variant */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate" title={name}>
                        {name}
                      </p>
                      {weight && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {weight}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-foreground">
                      ₹{(price * qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="bg-border/60" />
        </div>
      )}

      {/* Coupon section */}
      <CouponInput
        appliedCoupon={coupon}
        onApplyCoupon={onApplyCoupon}
        onRemoveCoupon={onRemoveCoupon}
        cartTotal={itemTotal}
      />

      <Separator className="bg-border/60" />

      {/* Tip section */}
      <TipSelector value={tip} onChange={onTipChange} />

      <Separator className="bg-border/60" />

      {/* Price breakdown rows */}
      <div className="space-y-2.5 text-xs">
        {/* Item Total */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Item total</span>
          <div className="flex items-center gap-2">
            {mrpTotal > itemTotal && (
              <span className="line-through text-muted-foreground/60 text-[11px]">
                ₹{mrpTotal.toFixed(2)}
              </span>
            )}
            <span className="font-semibold text-foreground">
              ₹{itemTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Fee */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Delivery fee</span>
          {deliveryFee === 0 ? (
            <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-foreground">
              ₹{deliveryFee.toFixed(2)}
            </span>
          )}
        </div>

        {/* Handling Fee */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Handling fee</span>
          <span className="font-semibold text-foreground">
            ₹{handlingFee.toFixed(2)}
          </span>
        </div>

        {/* Small Cart Fee (if applicable) */}
        {smallCartFee > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Small cart fee</span>
            <span className="font-semibold text-foreground">
              ₹{smallCartFee.toFixed(2)}
            </span>
          </div>
        )}

        {/* Coupon Discount (if applied) */}
        {couponDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-semibold">
            <span>Coupon discount</span>
            <span>-₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Tip (if any) */}
        {tip > 0 && (
          <div className="flex items-center justify-between text-foreground">
            <span className="text-muted-foreground">Delivery partner tip</span>
            <span className="font-semibold">₹{tip.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Separator className="bg-border/80" />

      {/* Grand Total ("To pay") */}
      <div className="flex items-center justify-between pt-0.5">
        <div>
          <span className="text-sm font-bold text-foreground">To Pay</span>
          <p className="text-[10px] text-muted-foreground">Inclusive of all taxes</p>
        </div>
        <span className="text-lg font-extrabold text-foreground tracking-tight">
          ₹{grandTotal.toFixed(2)}
        </span>
      </div>

      {/* Savings strip */}
      {totalSavings > 0 && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>You saved ₹{totalSavings.toFixed(2)} on this order!</span>
        </div>
      )}

      {/* Desktop Submit Button */}
      {!hideSubmitButton && (
        <div className="pt-2 space-y-2">
          <Button
            type="button"
            size="lg"
            disabled={disabled || isSubmitting}
            onClick={onPlaceOrder}
            className="w-full h-12 text-sm font-bold shadow-md cursor-pointer rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing order...
              </>
            ) : (
              <span>Place order • ₹{grandTotal.toFixed(2)}</span>
            )}
          </Button>

          {disabled && disabledReason && (
            <p className="text-[11px] text-center font-medium text-amber-600">
              {disabledReason}
            </p>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Safe & Secure 256-bit Encrypted Checkout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
