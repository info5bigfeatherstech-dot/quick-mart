import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy,
  Check,
  MessageSquare,
  ChevronRight,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import ResponsiveSheet from '@/components/common/ResponsiveSheet';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

/**
 * OrderDetailsDrawer:
 * Slide-over drawer matching Blinkit/Zepto order details view with item breakdown,
 * bill details, order metadata (order ID with copy, delivery address, timestamp),
 * and customer support action.
 */
const OrderDetailsDrawer = ({ order, open, onOpenChange }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useCartStore((state) => state.openDrawer);
  const [hasCopied, setHasCopied] = useState(false);

  if (!order) return null;

  const totalItemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Format Order ID for display (e.g. ORD05891129736)
  const cleanId = order.id.replace(/[^0-9]/g, '');
  const displayOrderId = cleanId ? `ORD${cleanId.padStart(11, '0')}` : order.id;

  const handleCopyOrderId = (e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(displayOrderId);
    setHasCopied(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleReorder = () => {
    order.items?.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    });
    onOpenChange(false);
    openCartDrawer();
    toast.success(`Items from order ${order.id} added to cart`);
  };

  // Pricing calculations
  const totalMrp = order.items?.reduce(
    (sum, item) => sum + ((item.product.mrp || Math.round(item.product.price * 1.15)) * item.quantity),
    0
  ) || order.itemTotal + 25;
  const productDiscount = Math.max(17, totalMrp - order.itemTotal);
  const handlingFee = order.handlingFee || 4;
  const deliveryFee = order.deliveryFee || 0;

  // Status text and description
  const isCancelled = order.status?.toLowerCase() === 'cancelled';
  const isDelivered = order.status?.toLowerCase() === 'delivered';
  const isOnTheWay = order.status?.toLowerCase().includes('way');

  let statusTitle = `Order ${order.status?.toLowerCase() || 'placed'}`;
  let statusSubtitle = 'Thank you for ordering with QuickMart.';
  let statusSubtitleColor = 'text-muted-foreground';

  if (isCancelled) {
    statusTitle = 'Order cancelled';
    statusSubtitle = 'This order has been cancelled as per your request.';
    statusSubtitleColor = 'text-destructive';
  } else if (isDelivered) {
    statusTitle = 'Order delivered';
    statusSubtitle = `Delivered to your address on ${formatDate(order.createdAt)}.`;
    statusSubtitleColor = 'text-emerald-600';
  } else if (isOnTheWay) {
    statusTitle = 'Order on the way';
    statusSubtitle = 'Our delivery partner is arriving at your doorstep in 10 minutes.';
    statusSubtitleColor = 'text-primary';
  }

  // Format placed timestamp
  const orderPlacedText = `placed on ${formatDate(order.createdAt)}`;

  return (
    <ResponsiveSheet open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col h-full overflow-y-auto bg-background font-sans select-none">
        <div className="p-5 sm:p-6 space-y-5">
          {/* 1. Status Section */}
          <div className="pt-2">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {statusTitle}
            </h1>
            <p className={`text-xs font-medium mt-1 leading-relaxed ${statusSubtitleColor}`}>
              {statusSubtitle}
            </p>
          </div>

          {/* 2. Items in this order */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in this order
            </h2>

            <div className="space-y-3 divide-y divide-border/40">
              {order.items?.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-secondary/50 border border-border/80 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-foreground truncate" title={product.name}>
                        {product.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        {product.weight ? `${product.weight} × ${quantity}` : `${quantity} unit${quantity > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-foreground shrink-0">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gray Section Divider Band */}
        <div className="h-2.5 bg-secondary/70 w-full shrink-0 border-y border-border/60" />

        <div className="p-5 sm:p-6 space-y-5">
          {/* 3. Bill details */}
          <div className="space-y-3">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              Bill details
            </h2>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>MRP</span>
                <span className="text-foreground">{formatPrice(totalMrp)}</span>
              </div>

              <div className="flex items-center justify-between text-blue-600">
                <span>Product discount</span>
                <span className="font-medium">-₹{productDiscount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Item total</span>
                <span className="text-foreground">{formatPrice(order.itemTotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Handling charge</span>
                <span className="text-foreground">+{formatPrice(handlingFee)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Delivery charges</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-foreground font-medium">FREE</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/80 text-foreground font-bold text-sm">
                <span>Bill total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gray Section Divider Band */}
        <div className="h-2.5 bg-secondary/70 w-full shrink-0 border-y border-border/60" />

        <div className="p-5 sm:p-6 space-y-5">
          {/* 4. Order details */}
          <div className="space-y-3.5">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              Order details
            </h2>

            <div className="space-y-3 text-xs">
              {/* Order ID */}
              <div>
                <span className="text-[11px] text-muted-foreground block">Order id</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-medium text-foreground">{displayOrderId}</span>
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    aria-label="Copy order id"
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {hasCopied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Payment */}
              <div>
                <span className="text-[11px] text-muted-foreground block">Payment</span>
                <span className="font-medium text-foreground block mt-0.5">
                  Cash on delivery
                </span>
              </div>

              {/* Deliver to */}
              <div>
                <span className="text-[11px] text-muted-foreground block">Deliver to</span>
                <span className="font-medium text-foreground block mt-0.5 leading-relaxed">
                  {order.address}
                </span>
              </div>

              {/* Order placed */}
              <div>
                <span className="text-[11px] text-muted-foreground block">Order placed</span>
                <span className="font-medium text-foreground block mt-0.5">
                  {orderPlacedText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gray Section Divider Band */}
        <div className="h-2.5 bg-secondary/70 w-full shrink-0 border-y border-border/60" />

        <div className="p-5 sm:p-6 pb-8 space-y-4">
          {/* 5. Need help with your order? */}
          <div className="space-y-3">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              Need help with your order?
            </h2>

            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                navigate(ROUTES.CONTACT_US);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                    Chat with us
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    About any issues related to your order
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          {/* Reorder Button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReorder}
              className="w-full h-11 rounded-xl border-primary text-primary hover:bg-primary/10 gap-2 font-medium text-xs sm:text-sm cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reorder Items</span>
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveSheet>
  );
};

export default OrderDetailsDrawer;
