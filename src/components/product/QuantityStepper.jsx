import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * Reusable Quantity Stepper with minus, count, and plus controls
 */
const QuantityStepper = ({
  quantity,
  onIncrease,
  onDecrease,
  size = 'md',
  className = '',
}) => {
  const isSmall = size === 'sm';

  const containerSizes = isSmall
    ? 'h-8 px-1.5 min-w-[76px] text-[12px]'
    : 'h-9 px-2 min-w-[88px] text-[13px]';

  const iconSizes = isSmall ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-between rounded-xl bg-primary text-primary-foreground font-medium select-none ${containerSizes} ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={(e) => {
          e.stopPropagation();
          onDecrease?.();
        }}
        className="flex items-center justify-center min-w-[28px] min-h-[28px] rounded-lg hover:bg-primary-hover active:scale-95 transition-transform cursor-pointer"
      >
        <Minus className={iconSizes} />
      </button>

      <span className="px-1 text-center font-medium tracking-tight">
        {quantity}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={(e) => {
          e.stopPropagation();
          onIncrease?.();
        }}
        className="flex items-center justify-center min-w-[28px] min-h-[28px] rounded-lg hover:bg-primary-hover active:scale-95 transition-transform cursor-pointer"
      >
        <Plus className={iconSizes} />
      </button>
    </div>
  );
};

export default QuantityStepper;
