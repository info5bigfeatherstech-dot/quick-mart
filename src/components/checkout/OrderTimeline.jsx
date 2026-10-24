import React from 'react';
import { CheckCircle2, PackageCheck, Bike, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'Placed', label: 'Order Placed', icon: CheckCircle2 },
  { id: 'Packed', label: 'Packed', icon: PackageCheck },
  { id: 'On the way', label: 'On the Way', icon: Bike },
  { id: 'Delivered', label: 'Delivered', icon: Home },
];

/**
 * OrderTimeline:
 * Status progression timeline (Placed -> Packed -> On the way -> Delivered).
 */
const OrderTimeline = ({ currentStatus = 'Placed', className = '' }) => {
  const currentIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.id.toLowerCase() === currentStatus.toLowerCase())
  );

  return (
    <div className={cn('w-full py-4', className)}>
      <div className="relative flex items-center justify-between">
        {/* Connecting track background */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full -z-0" />

        {/* Connecting active bar */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full transition-all duration-500 -z-0"
          style={{
            width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-background border-border text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs font-semibold whitespace-nowrap',
                  isCurrent
                    ? 'text-foreground font-bold'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
