import React, { useState } from 'react';
import { Zap, Calendar, Clock, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeliverySlots } from '@/hooks/useDeliverySlots';
import { cn } from '@/lib/utils';

/**
 * DeliverySlotPicker:
 * Offers "Deliver now (10 to 15 mins)" and "Schedule for later" with Day and Time slot selection.
 */
const DeliverySlotPicker = ({
  deliveryOption = 'now',
  onDeliveryOptionChange,
  selectedSlot,
  onSlotChange,
}) => {
  const [scheduledDay, setScheduledDay] = useState(selectedSlot?.day || 'today');
  const { data: slots = [], isLoading, isError } = useDeliverySlots(scheduledDay);

  const handleDaySelect = (day) => {
    setScheduledDay(day);
    // Clear slot if switching day
    if (selectedSlot?.day !== day) {
      onSlotChange?.(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* RadioGroup for Deliver Now vs Schedule */}
      <RadioGroup
        value={deliveryOption}
        onValueChange={(val) => {
          onDeliveryOptionChange(val);
          if (val === 'now') {
            onSlotChange?.(null);
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {/* Deliver Now Option */}
        <Label
          htmlFor="delivery-option-now"
          className={cn(
            'flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all select-none',
            deliveryOption === 'now'
              ? 'border-primary/70 bg-primary/5 ring-1 ring-primary/40 shadow-2xs'
              : 'border-border/70 hover:border-primary/40 hover:bg-secondary/20'
          )}
        >
          <RadioGroupItem value="now" id="delivery-option-now" />
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 fill-amber-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-foreground">
                Deliver now
              </span>
              <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/20 border-0 text-[10px] px-1.5 py-0">
                Fastest
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Arriving in 10 to 15 mins
            </p>
          </div>
        </Label>

        {/* Schedule for Later Option */}
        <Label
          htmlFor="delivery-option-scheduled"
          className={cn(
            'flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all select-none',
            deliveryOption === 'scheduled'
              ? 'border-primary/70 bg-primary/5 ring-1 ring-primary/40 shadow-2xs'
              : 'border-border/70 hover:border-primary/40 hover:bg-secondary/20'
          )}
        >
          <RadioGroupItem value="scheduled" id="delivery-option-scheduled" />
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              Schedule for later
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Choose day and time slot
            </p>
          </div>
        </Label>
      </RadioGroup>

      {/* Schedule Picker Panel */}
      {deliveryOption === 'scheduled' && (
        <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3.5 animate-in fade-in-50 duration-200">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDaySelect('today')}
              className={cn(
                'flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                scheduledDay === 'today'
                  ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                  : 'border-border/70 bg-card text-muted-foreground hover:text-foreground'
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleDaySelect('tomorrow')}
              className={cn(
                'flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                scheduledDay === 'tomorrow'
                  ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                  : 'border-border/70 bg-card text-muted-foreground hover:text-foreground'
              )}
            >
              Tomorrow
            </button>
          </div>

          {/* Slot Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground/80">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Select delivery time slot
              </span>
              {selectedSlot && (
                <span className="text-primary font-bold text-[11px]">
                  Selected: {selectedSlot.time}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Failed to load delivery slots. Please try again.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const isSelected =
                    selectedSlot?.slotId === slot.id && selectedSlot?.day === scheduledDay;
                  const isDisabled = slot.isDisabled;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() =>
                        onSlotChange({
                          day: scheduledDay,
                          slotId: slot.id,
                          time: slot.label,
                        })
                      }
                      className={cn(
                        'relative p-2.5 rounded-lg border text-left transition-all select-none',
                        isDisabled
                          ? 'border-border/40 bg-muted/40 opacity-50 cursor-not-allowed text-muted-foreground'
                          : isSelected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary text-primary font-bold cursor-pointer'
                          : 'border-border/70 bg-card hover:border-primary/40 hover:bg-secondary/20 cursor-pointer'
                      )}
                    >
                      <div className="text-xs font-semibold truncate">{slot.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {slot.isPast ? (
                          <span className="text-rose-500 font-medium">Slot passed</span>
                        ) : slot.isFull ? (
                          <span className="text-amber-600 font-medium">Slot full</span>
                        ) : (
                          'Available'
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverySlotPicker;
