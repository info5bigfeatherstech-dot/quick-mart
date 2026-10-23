import React from 'react';
import { formatPrice } from '@/utils/formatPrice';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * VariantSelector: Reusable chips for selecting product pack sizes / variants
 * @param {Array} variants - Array of variant objects { id, label, weight, price, mrp, discountPercent, inStock, images }
 * @param {Object} selectedVariant - Currently selected variant
 * @param {Function} onSelectVariant - Callback when variant changes
 */
const VariantSelector = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
  className = '',
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground tracking-wide">
          Select Unit / Pack Size
        </span>
        <span className="text-muted-foreground text-[11px]">
          {variants.length} option{variants.length > 1 ? 's' : ''} available
        </span>
      </div>

      <ToggleGroup
        type="single"
        value={selectedVariant?.id || variants[0]?.id}
        onValueChange={(val) => {
          if (!val) return;
          const found = variants.find((v) => v.id === val);
          if (found && onSelectVariant) {
            onSelectVariant(found);
          }
        }}
        className="flex flex-wrap items-center justify-start gap-2.5"
      >
        {variants.map((v) => {
          const isSelected = (selectedVariant?.id || variants[0]?.id) === v.id;
          const isOutOfStock = v.inStock === false;

          return (
            <ToggleGroupItem
              key={v.id}
              value={v.id}
              disabled={isOutOfStock}
              className={cn(
                'relative flex flex-col items-start justify-center h-auto py-2 px-3.5 rounded-xl border text-left transition-all duration-150',
                isSelected
                  ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary'
                  : 'border-border bg-card hover:bg-secondary hover:border-border/80 text-foreground',
                isOutOfStock && 'opacity-50 cursor-not-allowed bg-muted'
              )}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-xs font-semibold tracking-tight text-foreground">
                  {v.weight || v.label}
                </span>
                {v.discountPercent > 0 && !isOutOfStock && (
                  <Badge
                    variant="yellow"
                    className="text-[9px] px-1 py-0 h-4 font-bold uppercase tracking-wider"
                  >
                    {v.discountPercent}% OFF
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                <span className={cn('font-bold', isSelected ? 'text-primary' : 'text-foreground')}>
                  {formatPrice(v.price)}
                </span>
                {v.mrp && v.mrp > v.price && (
                  <span className="text-[11px] text-muted-foreground line-through">
                    {formatPrice(v.mrp)}
                  </span>
                )}
              </div>

              {isOutOfStock && (
                <span className="text-[10px] text-destructive font-medium mt-0.5">
                  Out of stock
                </span>
              )}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};

export default VariantSelector;
