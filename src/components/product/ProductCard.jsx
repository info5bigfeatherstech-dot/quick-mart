import React from 'react';
import { Link } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatPrice';
import { ROUTES } from '@/utils/constants';
import AddToCartButton from './AddToCartButton';
import { cn } from '@/lib/utils';

/**
 * Reusable ProductCard component wrapping shadcn Card
 * Links image & title to ProductDetail page while keeping AddToCart outside the link
 */
const ProductCard = ({ product, className = '', inGrid = false }) => {
  if (!product) return null;

  const {
    name,
    slug,
    image,
    weight,
    price,
    mrp,
    discountPercent,
    deliveryTime = '10 mins',
    inStock = true,
  } = product;

  const isFullWidth = inGrid || className.includes('w-full');
  const widthClasses = isFullWidth
    ? 'w-full'
    : 'w-[130px] sm:w-[136px] md:w-[142px] lg:w-[148px] xl:w-[152px] shrink-0';

  return (
    <Card
      className={cn(
        'flex flex-col justify-between font-sans bg-card rounded-xl border-border transition-all duration-200 hover:border-primary select-none overflow-hidden p-0',
        widthClasses,
        className
      )}
    >
      {/* Clickable Image & Badges */}
      <Link
        to={ROUTES.PRODUCT_DETAIL(slug)}
        className="block relative aspect-square w-full bg-secondary overflow-hidden p-1.5 sm:p-2.5 group/link"
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover/link:scale-105"
        />

        {/* Delivery Time Badge */}
        {deliveryTime && (
          <div className="absolute top-1.5 left-1.5">
            <Badge variant="yellow" className="flex items-center gap-1 text-[9px] font-medium py-0.5 px-1.5 shadow-xs">
              <Timer className="h-2.5 w-2.5" />
              <span>{deliveryTime}</span>
            </Badge>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-1.5 right-1.5">
            <Badge variant="default" className="text-[9px] py-0.5 px-1.5 shadow-xs font-medium">
              {discountPercent}% OFF
            </Badge>
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[10px] font-medium text-muted-foreground bg-secondary border border-border px-1.5 py-0.5 rounded-lg">
              Out of stock
            </span>
          </div>
        )}
      </Link>

      {/* Content / Info */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-1 justify-between gap-1.5">
        <Link
          to={ROUTES.PRODUCT_DETAIL(slug)}
          className="group/title block focus-visible:outline-none"
        >
          {weight && (
            <span className="text-[11px] font-medium text-muted-foreground block mb-0.5 leading-normal truncate">
              {weight}
            </span>
          )}
          <h3
            className="font-sans text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-2 leading-[1.3] min-h-[2rem] group-hover/title:text-primary transition-colors"
            title={name}
          >
            {name}
          </h3>
        </Link>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between gap-1 pt-1.5 mt-auto border-t border-border/50">
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] sm:text-[14px] font-medium text-foreground leading-tight truncate">
              {formatPrice(price)}
            </span>
            {mrp && mrp > price && (
              <span className="text-[10px] text-muted-foreground line-through leading-tight">
                {formatPrice(mrp)}
              </span>
            )}
          </div>

          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
