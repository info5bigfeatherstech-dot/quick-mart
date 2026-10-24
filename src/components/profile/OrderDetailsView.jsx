import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  MessageSquare,
  ChevronRight,
  RotateCcw,
  Plus,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import OrderTimeline from '@/components/checkout/OrderTimeline';

/**
 * OrderDetailsView:
 * In-place full page order details matching the Blinkit-style profile view.
 * Interactive product rows, full mouse text selection (copy-pasteable),
 * status headers, and direct add-to-cart actions.
 */
const OrderDetailsView = ({ order, onBack }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useCartStore((state) => state.openDrawer);
  const [hasCopiedId, setHasCopiedId] = useState(false);
  const [hasCopiedAddress, setHasCopiedAddress] = useState(false);

  if (!order) return null;

  const totalItemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Format Order ID for display (e.g. ORD05891129736)
  const cleanId = order.id.replace(/[^0-9]/g, '');
  const displayOrderId = cleanId ? `ORD${cleanId.padStart(11, '0')}` : order.id;

  const handleCopyOrderId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayOrderId);
    setHasCopiedId(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setHasCopiedId(false), 2000);
  };

  const handleCopyAddress = (e) => {
    e.stopPropagation();
    if (order.address) {
      navigator.clipboard.writeText(order.address);
      setHasCopiedAddress(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setHasCopiedAddress(false), 2000);
    }
  };

  const handleReorder = () => {
    order.items?.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    });
    openCartDrawer();
    toast.success(`Items from order ${order.id} added to cart`);
  };

  const handleAddSingleItem = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`Added ${product.name} to cart`);
  };

  // Pricing calculations
  const totalMrp =
    order.items?.reduce(
      (sum, item) =>
        sum +
        (item.product.mrp || Math.round(item.product.price * 1.15)) * item.quantity,
      0
    ) || order.itemTotal + 25;
  const productDiscount = Math.max(17, totalMrp - order.itemTotal);
  const handlingFee = order.handlingFee || 4;
  const deliveryFee = order.deliveryFee || 0;

  // Status config
  const statusLower = order.status?.toLowerCase() || '';
  const isCancelled = statusLower === 'cancelled';
  const isDelivered = statusLower === 'delivered';
  const isOnTheWay = statusLower.includes('way');

  let statusTitle = `Order ${order.status || 'Placed'}`;
  let statusSubtitle = 'Thank you for ordering with QuickMart.';
  let statusSubtitleColor = 'text-muted-foreground';
  let StatusIcon = Truck;

  if (isCancelled) {
    statusTitle = 'Order cancelled';
    statusSubtitle = 'This order has been cancelled as per your request.';
    statusSubtitleColor = 'text-rose-500';
    StatusIcon = XCircle;
  } else if (isDelivered) {
    statusTitle = 'Order delivered';
    statusSubtitle = `Delivered to your address on ${formatDate(order.createdAt)}.`;
    statusSubtitleColor = 'text-emerald-600';
    StatusIcon = CheckCircle2;
  } else if (isOnTheWay) {
    statusTitle = 'Order on the way';
    statusSubtitle = 'Our delivery partner is arriving at your doorstep in 10 minutes.';
    statusSubtitleColor = 'text-primary';
    StatusIcon = Truck;
  }

  const orderPlacedText = `placed on ${formatDate(order.createdAt)}`;

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-7 space-y-6 font-sans select-text shadow-xs">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to order history"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs sm:text-sm font-medium text-foreground transition-all cursor-pointer shadow-2xs group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Orders</span>
        </button>

        <span className="text-xs font-medium text-muted-foreground select-text">
          Order #{order.id}
        </span>
      </div>

      {/* 1. Status Section */}
      <div className="pt-1">
        <div className="flex items-center gap-2.5">
          <StatusIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${statusSubtitleColor} shrink-0`} />
          <h1 className="text-xl sm:text-2xl font-medium text-foreground tracking-tight select-text">
            {statusTitle}
          </h1>
        </div>
        <p className={`text-xs sm:text-sm font-medium mt-1.5 leading-relaxed select-text capitalize ${statusSubtitleColor}`}>
          {statusSubtitle}
        </p>

        {/* Reusable Order Timeline */}
        <div className="pt-2 px-1">
          <OrderTimeline currentStatus={order.status || 'Placed'} />
        </div>
      </div>

      {/* 2. Items in this order */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-medium text-foreground select-text">
            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in this order
          </h2>
          <span className="text-[11px] font-medium text-muted-foreground">
            Click item to view product
          </span>
        </div>

        <div className="space-y-2 divide-y divide-border/40">
          {order.items?.map(({ product, quantity }) => {
            const productHref = ROUTES.PRODUCT_DETAIL(product.slug || product.id);
            return (
              <Link
                key={product.id}
                to={productHref}
                className="pt-3 first:pt-0 flex items-center justify-between gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-secondary/60 transition-all cursor-pointer group select-text"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-secondary/70 border border-border/80 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors select-text"
                      title={product.name}
                    >
                      {product.name}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground mt-0.5 select-text">
                      {product.weight
                        ? `${product.weight} × ${quantity}`
                        : `${quantity} unit${quantity > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-foreground select-text">
                    {formatPrice(product.price * quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleAddSingleItem(e, product)}
                    aria-label={`Add ${product.name} to cart`}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 text-[11px] font-medium transition-colors cursor-pointer"
                    title="Add item again"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gray Section Divider Band */}
      <div className="h-2.5 bg-secondary/60 -mx-4 sm:-mx-7 my-5 border-y border-border/60" />

      {/* 3. Bill details */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-medium text-foreground select-text">
          Bill details
        </h2>

        <div className="space-y-2.5 text-xs text-muted-foreground font-medium select-text">
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

          <div className="flex items-center justify-between pt-2.5 border-t border-border/80 text-foreground font-medium text-sm">
            <span>Bill total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Gray Section Divider Band */}
      <div className="h-2.5 bg-secondary/60 -mx-4 sm:-mx-7 my-5 border-y border-border/60" />

      {/* 4. Order details */}
      <div className="space-y-3.5">
        <h2 className="text-xs sm:text-sm font-medium text-foreground select-text">
          Order details
        </h2>

        <div className="space-y-3 text-xs select-text">
          {/* Order ID */}
          <div>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Order id
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-medium text-foreground select-all tracking-wide">
                {displayOrderId}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                aria-label="Copy order id"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                title="Click to copy order ID"
              >
                {hasCopiedId ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Payment */}
          <div>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Payment
            </span>
            <span className="font-medium text-foreground block mt-0.5 select-text">
              Cash on delivery
            </span>
          </div>

          {/* Deliver to */}
          <div>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Deliver to
            </span>
            <div className="flex items-start justify-between gap-2 mt-0.5">
              <span className="font-medium text-foreground leading-relaxed select-text">
                {order.address}
              </span>
              <button
                type="button"
                onClick={handleCopyAddress}
                aria-label="Copy address"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
                title="Click to copy address"
              >
                {hasCopiedAddress ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Order placed */}
          <div>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Order placed
            </span>
            <span className="font-medium text-foreground block mt-0.5 select-text">
              {orderPlacedText}
            </span>
          </div>
        </div>
      </div>

      {/* Gray Section Divider Band */}
      <div className="h-2.5 bg-secondary/60 -mx-4 sm:-mx-7 my-5 border-y border-border/60" />

      {/* 5. Need help with your order? */}
      <div className="space-y-3 pt-1">
        <h2 className="text-xs sm:text-sm font-medium text-foreground select-text">
          Need help with your order?
        </h2>

        <button
          type="button"
          onClick={() => navigate(ROUTES.CONTACT_US)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-medium text-foreground truncate select-text">
                Chat with us
              </span>
              <span className="text-[11px] font-medium text-muted-foreground mt-0.5 truncate select-text">
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
  );
};

export default OrderDetailsView;
