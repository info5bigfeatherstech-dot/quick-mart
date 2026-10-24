import React from 'react';
import { Bell, DoorOpen, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_CHIPS = [
  { label: 'Ring the bell', icon: Bell },
  { label: 'Leave at the door', icon: DoorOpen },
  { label: 'Call before arriving', icon: PhoneCall },
];

/**
 * DeliveryInstructions: Textarea (max 200 chars) with quick chips
 */
const DeliveryInstructions = ({ value = '', onChange }) => {
  const handleChipClick = (chipText) => {
    if (!value.trim()) {
      onChange(chipText);
      return;
    }

    if (value.includes(chipText)) {
      // Toggle off chip text
      const newText = value
        .replace(chipText, '')
        .replace(/,\s*,/g, ',')
        .replace(/^,\s*|,\s*$/g, '')
        .trim();
      onChange(newText);
    } else {
      // Append chip text up to max 200 chars
      const newText = `${value.trim()}, ${chipText}`;
      if (newText.length <= 200) {
        onChange(newText);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="delivery-instructions"
          className="text-xs font-semibold text-foreground/80"
        >
          Delivery instructions (optional)
        </label>
        <span
          className={cn(
            'text-[11px] tabular-nums',
            (value?.length || 0) >= 190
              ? 'text-rose-500 font-semibold'
              : 'text-muted-foreground'
          )}
        >
          {value?.length || 0}/200
        </span>
      </div>

      <textarea
        id="delivery-instructions"
        rows={2}
        maxLength={200}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Please leave the package with the security guard"
        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 resize-none transition-all leading-relaxed"
      />

      {/* Quick chips */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        {QUICK_CHIPS.map(({ label, icon: Icon }) => {
          const isSelected = value.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => handleChipClick(label)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer select-none active:scale-95',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryInstructions;
