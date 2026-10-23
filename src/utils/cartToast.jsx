import React from 'react';
import { toast } from 'sonner';
import { Check, ShoppingBag, X, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

/**
 * showCartToast: Custom designed, sleek grocery toast notification
 * Displays product image, name, variant weight, status, and instant "View Cart" action.
 * Replaces ugly dark boxes with a modern, high-end quick-commerce toast.
 *
 * @param {Object} options
 * @param {Object} options.product - Product object
 * @param {Object} [options.variant] - Selected variant object
 * @param {string} [options.action='add'] - 'add' | 'increase' | 'decrease' | 'remove'
 */
export const showCartToast = ({
  product,
  variant = null,
  action = 'add',
}) => {
  if (!product) return;

  const displayImage =
    variant?.images?.[0] || product.image || product.images?.[0];
  const displayWeight = variant?.weight || product.weight;
  const isRemove = action === 'remove';

  const actionText =
    action === 'add'
      ? 'Added to cart'
      : action === 'increase'
      ? 'Quantity updated (+1)'
      : action === 'decrease'
      ? 'Quantity updated (-1)'
      : 'Removed from cart';

  toast.custom(
    (t) => (
      <div
        className="flex items-center gap-3 w-[340px] max-w-[calc(100vw-32px)] bg-white text-foreground border border-border/80 rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 select-none"
        role="status"
        aria-live="polite"
      >
        {/* Product Thumbnail */}
        <div className="h-11 w-11 shrink-0 rounded-xl bg-[#F7F7F8] border border-border/60 p-1 flex items-center justify-center overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <ShoppingBag className="h-5 w-5 text-primary" />
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            {isRemove ? (
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 className="h-2 w-2" />
              </span>
            ) : (
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            )}
            <span
              className={`text-[11px] font-bold tracking-tight uppercase ${
                isRemove ? 'text-destructive' : 'text-emerald-600'
              }`}
            >
              {actionText}
            </span>
          </div>

          <p className="text-xs font-semibold text-foreground truncate leading-tight">
            {product.name}
          </p>

          {displayWeight && (
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              {displayWeight}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!isRemove && (
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t);
                useCartStore.getState().openDrawer();
              }}
              className="text-[11px] font-bold text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              View Cart
            </button>
          )}

          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            className="p-1 text-muted-foreground/70 hover:text-foreground rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    ),
    {
      id: 'cart-notification', // Smoothly replace existing cart toast so they don't pile up
      duration: 2500,
    }
  );
};

export default showCartToast;
