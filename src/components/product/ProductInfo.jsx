import React from 'react';
import { Timer, Zap, ShieldCheck, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/formatPrice';
import RatingStars from './RatingStars';
import VariantSelector from './VariantSelector';
import AddToCartButton from './AddToCartButton';
import { cn } from '@/lib/utils';

/**
 * ProductInfo: Sticky sidebar/column containing product metadata, pricing, variants, and CTA
 */
const ProductInfo = ({
  product,
  selectedVariant,
  onSelectVariant,
  className = '',
}) => {
  if (!product) return null;

  const {
    brand,
    name,
    weight,
    deliveryTime = '10 mins',
    rating = 4.5,
    reviewCount = 120,
    variants = [],
    highlights = [],
  } = product;

  // Active pricing derived from selected variant or base product
  const activePrice = selectedVariant?.price ?? product.price;
  const activeMrp = selectedVariant?.mrp ?? product.mrp;
  const activeDiscount =
    selectedVariant?.discountPercent ?? product.discountPercent;
  const activeWeight = selectedVariant?.weight || weight;
  const isOutOfStock = selectedVariant
    ? selectedVariant.inStock === false
    : product.inStock === false;

  return (
    <div className={cn('flex flex-col gap-5 text-foreground select-none', className)}>
      {/* Brand & Title */}
      <div className="space-y-1">
        {brand && (
          <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
            {brand}
          </span>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug">
          {name}
        </h1>
        {activeWeight && !variants?.length && (
          <p className="text-sm font-medium text-muted-foreground">
            {activeWeight}
          </p>
        )}
      </div>

      {/* Ratings & Delivery Badge Row */}
      <div className="flex flex-wrap items-center gap-3">
        {rating && <RatingStars rating={rating} reviewCount={reviewCount} />}

        {deliveryTime && (
          <Badge
            variant="yellow"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold shadow-xs uppercase tracking-wider"
          >
            <Timer className="h-3.5 w-3.5" />
            <span>{deliveryTime}</span>
          </Badge>
        )}
      </div>

      <Separator className="bg-border/60" />

      {/* Price Block */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {formatPrice(activePrice)}
          </span>

          {activeMrp && activeMrp > activePrice && (
            <span className="text-base sm:text-lg text-muted-foreground line-through font-normal">
              {formatPrice(activeMrp)}
            </span>
          )}

          {activeDiscount > 0 && (
            <Badge
              variant="default"
              className="text-xs font-bold py-0.5 px-2 bg-primary text-primary-foreground"
            >
              {activeDiscount}% OFF
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground font-medium">
          (Inclusive of all taxes)
        </p>
      </div>

      {/* Variant Selector (shown only if variants exist) */}
      {variants && variants.length > 0 && (
        <div className="pt-1">
          <VariantSelector
            variants={variants}
            selectedVariant={selectedVariant}
            onSelectVariant={onSelectVariant}
          />
        </div>
      )}

      {/* Action CTA Button */}
      <div className="pt-2">
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
        />
      </div>

      <Separator className="bg-border/60 my-1" />

      {/* Highlights / Why Shop With Us */}
      <div className="space-y-3 bg-[#F7F7F8] p-4 rounded-xl border border-border/70">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Why shop from QuickMart?
        </h4>

        <div className="grid grid-cols-1 gap-2.5 text-xs text-foreground">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium">Superfast 10-minute doorstep delivery</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium">100% Genuine, freshly packed products</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <RotateCcw className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium">No-questions-asked refund & easy replacement</span>
          </div>

          {highlights &&
            highlights.length > 0 &&
            highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-snug">{h}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
