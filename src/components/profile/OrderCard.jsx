import React from 'react';
import { RotateCcw, Clock, CheckCircle2, Truck, XCircle, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Reusable OrderCard component displaying order summary, status, thumbnails,
 * and triggering in-place order details view on click matching the design.
 */
const OrderCard = ({ order, onViewDetails }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  if (!order) return null;

  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleReorder = () => {
    order.items.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    });
    openDrawer();
    toast.success(`Items from order ${order.id} added to cart`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20 font-medium text-[11px] uppercase tracking-wide gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Delivered</span>
          </Badge>
        );
      case 'On the way':
        return (
          <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20 font-medium text-[11px] uppercase tracking-wide gap-1">
            <Truck className="h-3 w-3" />
            <span>On the way</span>
          </Badge>
        );
      case 'Cancelled':
        return (
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20 font-medium text-[11px] uppercase tracking-wide gap-1">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-medium text-[11px]">
            {status}
          </Badge>
        );
    }
  };

  const visibleThumbnails = order.items.slice(0, 4);
  const extraItemsCount = order.items.length - 4;

  return (
    <Card
      onClick={onViewDetails}
      className="p-4 sm:p-5 bg-card border-border rounded-2xl shadow-none hover:border-primary/50 transition-all cursor-pointer group"
    >
      {/* Top Bar: Order ID, Date, and Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-border/80">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-medium text-foreground">
            Order #{order.id}
          </span>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="h-3 w-3" />
            <span>{formatDate(order.createdAt)}</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {getStatusBadge(order.status)}
        </div>
      </div>

      {/* Middle Bar: Thumbnails preview & Total Price */}
      <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Thumbnails */}
        <div className="flex items-center gap-2 flex-wrap">
          {visibleThumbnails.map((item, idx) => (
            <div
              key={idx}
              className="h-12 w-12 rounded-xl bg-secondary border border-border p-1 flex items-center justify-center overflow-hidden shrink-0"
              title={`${item.product.name} (x${item.quantity})`}
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-full w-full object-contain"
              />
            </div>
          ))}

          {extraItemsCount > 0 && (
            <div className="h-12 w-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
              +{extraItemsCount}
            </div>
          )}

          <div className="ml-2 flex flex-col">
            <span className="text-xs font-medium text-foreground">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
            </span>
            <span className="text-sm sm:text-base font-medium text-foreground">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Reorder Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleReorder();
          }}
          className="rounded-xl border-primary text-primary hover:bg-primary/10 gap-1.5 font-medium text-xs self-stretch sm:self-auto cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reorder</span>
        </Button>
      </div>

      {/* Bottom Bar: View order & delivery details link */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails?.();
        }}
        className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-medium text-primary hover:text-primary/85 transition-colors"
      >
        <span>View order & delivery details</span>
        <ChevronDown className="h-4 w-4 text-primary transition-transform group-hover:translate-y-0.5" />
      </div>
    </Card>
  );
};

export default OrderCard;
