import React, { useState } from 'react';
import { Tag, X, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import { useApplyCoupon, useCoupons } from '@/hooks/useApplyCoupon';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * CouponInput:
 * Code input with Apply button, removable chip for applied coupons,
 * and a modal listing available coupons.
 */
const CouponInput = ({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  cartTotal = 0,
}) => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applyMutation = useApplyCoupon();
  const { data: availableCoupons = [] } = useCoupons();

  const handleApply = (couponCode) => {
    const targetCode = String(couponCode || code).trim().toUpperCase();
    if (!targetCode) return;

    setErrorMessage('');
    applyMutation.mutate(
      { code: targetCode, cartTotal },
      {
        onSuccess: (data) => {
          onApplyCoupon?.(data.coupon);
          setCode('');
          setIsModalOpen(false);
          toast.success(data.message || `Coupon ${data.coupon.code} applied!`);
        },
        onError: (err) => {
          const msg = err.message || 'Invalid or expired coupon code';
          setErrorMessage(msg);
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="space-y-2.5">
      {/* If a coupon is applied: Removable Chip */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 text-emerald-950 transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Tag className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs tracking-wider text-emerald-900">
                  {appliedCoupon.code}
                </span>
                <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 h-4">
                  APPLIED
                </Badge>
              </div>
              <p className="text-[11px] text-emerald-800 truncate mt-0.5">
                {appliedCoupon.title}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveCoupon}
            className="h-7 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 rounded-lg cursor-pointer"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        /* If no coupon applied: Input + Apply + View all link */
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter coupon code (e.g. FIRST50)"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (errorMessage) setErrorMessage('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApply();
                  }
                }}
                className={cn(
                  'h-10 text-xs font-mono uppercase tracking-wider',
                  errorMessage && 'border-rose-400'
                )}
              />
            </div>
            <Button
              type="button"
              onClick={() => handleApply()}
              disabled={applyMutation.isPending || !code.trim()}
              className="h-10 px-4 text-xs font-bold cursor-pointer shrink-0"
            >
              {applyMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              <span>View all available coupons</span>
            </button>
          </div>
        </div>
      )}

      {/* Available Coupons Modal */}
      <ResponsiveModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Available Coupons"
        description="Select a coupon to apply discounts to your grocery cart"
      >
        <div className="space-y-3 py-1">
          {availableCoupons.map((coupon) => {
            const isEligible = cartTotal >= coupon.minOrder;
            const diff = coupon.minOrder - cartTotal;

            return (
              <div
                key={coupon.code}
                className={cn(
                  'p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3',
                  isEligible
                    ? 'border-border/80 bg-card hover:border-primary/50'
                    : 'border-border/40 bg-muted/20 opacity-75'
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {coupon.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {coupon.description}
                  </p>
                  {!isEligible && (
                    <p className="text-[11px] font-semibold text-amber-600 mt-1">
                      Add ₹{diff.toFixed(0)} more to unlock this coupon
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  size="sm"
                  disabled={!isEligible || applyMutation.isPending}
                  onClick={() => handleApply(coupon.code)}
                  className="h-8 text-xs font-bold shrink-0 rounded-xl cursor-pointer"
                >
                  Apply
                </Button>
              </div>
            );
          })}
        </div>
      </ResponsiveModal>
    </div>
  );
};

export default CouponInput;
