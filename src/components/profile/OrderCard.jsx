import React from 'react';
import { RotateCcw, Clock, MapPin, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Reusable OrderCard component displaying order summary, status, thumbnails, and expandable details
 */
const OrderCard = ({ order }) => {
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
    <Card className="p-4 sm:p-5 bg-card border-border rounded-2xl shadow-none">
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
          variant="outline"
          size="sm"
          onClick={handleReorder}
          className="rounded-xl border-primary text-primary hover:bg-primary/10 gap-1.5 font-medium text-xs self-stretch sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reorder</span>
        </Button>
      </div>

      {/* Expandable Details Accordion */}
      <Accordion type="single" collapsible className="border-t border-border/60">
        <AccordionItem value="details" className="border-0">
          <AccordionTrigger className="py-2.5 text-xs font-medium text-primary hover:no-underline">
            <span>View order & delivery details</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0 space-y-4">
            {/* Items List */}
            <div className="rounded-xl bg-secondary/60 border border-border/60 p-3 space-y-2.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block mb-1">
                Ordered Items
              </span>
              <div className="divide-y divide-border/60">
                {order.items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="py-2 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-card border border-border p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {product.weight} × {quantity}
                        </span>
                      </div>
                    </div>

                    <span className="font-medium text-foreground shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill & Address Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Delivery Address */}
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Delivery Address</span>
                  <span className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                    {order.address}
                  </span>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item Total</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(order.itemTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>
                    {order.deliveryFee === 0 ? (
                      <strong className="text-success font-medium">FREE</strong>
                    ) : (
                      formatPrice(order.deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-foreground pt-1 border-t border-border/60">
                  <span>Total Paid</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default OrderCard;
