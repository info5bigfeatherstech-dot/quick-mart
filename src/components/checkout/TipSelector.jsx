import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIP_OPTIONS = [
  { label: '₹10', value: 10 },
  { label: '₹20', value: 20 },
  { label: '₹30', value: 30 },
  { label: '₹50', value: 50 },
  { label: 'No tip', value: 0 },
];

/**
 * TipSelector: Delivery partner tip selection chips
 */
const TipSelector = ({ value = 0, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Tip your delivery partner
        </label>
        {value > 0 && (
          <span className="text-[11px] font-bold text-emerald-600">
            +₹{value} added
          </span>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground leading-normal">
        100% of this tip goes directly to your delivery partner.
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {TIP_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'py-1.5 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer select-none active:scale-95',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                  : 'border-border/70 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TipSelector;
