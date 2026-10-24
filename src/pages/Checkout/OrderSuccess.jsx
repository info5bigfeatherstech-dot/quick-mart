import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useOrder } from '@/hooks/useOrder';
import OrderTimeline from '@/components/checkout/OrderTimeline';
import ErrorState from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/utils/constants';
import { formatPhone } from '@/utils/formatPhone';
import { cn } from '@/lib/utils';

/**
 * OrderSuccess page:
 * Displayed immediately upon successful order placement.
 * Features animated checkmark, ETA, status timeline, collapsible items summary,
 * address & payment details, and tracking buttons.
 */
const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isItemsOpen, setIsItemsOpen] = useState(false);

  const { data: order, isLoading, isError, refetch } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-48 h-8 rounded-lg" />
            <Skeleton className="w-32 h-4 rounded-md" />
          </div>
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorState
            title="Order Not Found"
            message={`We could not locate order "${orderId}". It may not exist or belongs to another session.`}
            onRetry={() => refetch()}
          />
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.HOME)}
              className="rounded-xl cursor-pointer"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    id,
    eta = '10 to 15 mins',
    status = 'Placed',
    address,
    paymentMethod,
    bill,
    items = [],
    createdAt,
  } = order;

  const totalAmount = bill?.grandTotal || order.total || 0;
  const isCod = paymentMethod === 'cod';

  return (
    <div className="min-h-screen bg-muted/20 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Animated Success Header */}
        <div className="text-center space-y-2">
          {/* Animated checkmark circle */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 shadow-md animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2] animate-in spin-in-12 duration-700" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Order Placed!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Thank you! Your groceries are being prepped by the local store.
          </p>
          <div className="pt-1">
            <span className="font-mono text-xs font-bold text-foreground bg-secondary px-3 py-1 rounded-full border border-border">
              Order ID: #{id}
            </span>
          </div>
        </div>

        {/* Status Tracker Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-bold text-foreground">
                Estimated Delivery
              </span>
            </div>
            <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5">
              {eta}
            </Badge>
          </div>

          <OrderTimeline currentStatus={status} />

          <p className="text-[11px] text-muted-foreground text-center">
            You will receive live delivery updates on WhatsApp & SMS
          </p>
        </div>

        {/* Delivery Details Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-foreground">
            Delivery & Payment Details
          </h2>

          <div className="space-y-3">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-foreground">
                  Delivering to {address?.type || 'Home'}
                </span>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                  {[
                    address?.houseNo,
                    address?.streetArea,
                    address?.landmark,
                    `${address?.city}${address?.pincode ? ` - ${address?.pincode}` : ''}`,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {address?.phone && (
                  <p className="text-muted-foreground/80 mt-0.5">
                    Contact: {address.name} ({formatPhone(address.phone)})
                  </p>
                )}
              </div>
            </div>

            <Separator className="bg-border/60" />

            {/* Payment Method */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground capitalize">
                    {paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : paymentMethod === 'upi'
                      ? 'UPI Payment'
                      : 'Credit / Debit Card'}
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    {isCod ? 'Pay on delivery via cash/UPI' : 'Payment confirmed'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] font-bold uppercase',
                    isCod
                      ? 'border-amber-400 text-amber-700 bg-amber-50'
                      : 'border-emerald-400 text-emerald-700 bg-emerald-50'
                  )}
                >
                  {isCod ? 'COD Pending' : 'Paid'}
                </Badge>
                <div className="text-sm font-extrabold text-foreground mt-0.5">
                  ₹{Number(totalAmount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Order Items */}
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setIsItemsOpen(!isItemsOpen)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-bold text-foreground">
                Itemized Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                ₹{Number(totalAmount).toFixed(2)}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform duration-200',
                  isItemsOpen && 'rotate-180'
                )}
              />
            </div>
          </button>

          {isItemsOpen && (
            <div className="p-4 sm:p-5 pt-0 border-t border-border/60 divide-y divide-border/40 text-xs animate-in fade-in-50 duration-200">
              {items.map((item, idx) => {
                const price =
                  item.selectedVariant?.price ?? item.product?.price ?? 0;
                return (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img
                        src={item?.product?.image || ''}
                        alt={item?.product?.name || 'Product'}
                        className="w-10 h-10 rounded-md object-contain bg-muted/40 p-1 border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {item?.product?.name || 'Item'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Qty: {item?.quantity || 1} •{' '}
                          {item?.selectedVariant?.weight ||
                            item?.product?.weight ||
                            item?.selectedVariant?.label ||
                            ''}
                        </p>
                      </div>
                    </div>

                    <span className="font-bold text-foreground shrink-0">
                      ₹{(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            size="lg"
            onClick={() => navigate(ROUTES.ORDERS || '/profile/orders')}
            className="h-12 rounded-xl text-xs sm:text-sm font-bold shadow-sm cursor-pointer"
          >
            <Package className="w-4 h-4 mr-2" />
            Track Order
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate(ROUTES.HOME)}
            className="h-12 rounded-xl text-xs sm:text-sm font-bold border-border hover:bg-secondary cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
