import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Reusable checkout section wrapper.
 * Displays step number badge, title, completed summary with "Change" button,
 * and collapsible body with smooth expansion.
 */
const CheckoutSection = ({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  isCompleted,
  summary,
  onChange,
  children,
  error,
  className,
}) => {
  return (
    <section
      id={id}
      className={cn(
        'rounded-2xl border bg-card text-card-foreground shadow-xs transition-all duration-300 overflow-hidden',
        isOpen ? 'border-primary/40 ring-1 ring-primary/20 shadow-sm' : 'border-border/80',
        error && 'border-rose-400 ring-1 ring-rose-200',
        className
      )}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between p-4 sm:p-5 transition-colors cursor-pointer hover:bg-muted/30 select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Status / Icon indicator (no numbers) */}
          {isCompleted && !isOpen ? (
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 bg-emerald-600 text-white shadow-xs">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
          ) : icon ? (
            <div
              className={cn(
                'h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                isOpen
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {icon}
            </div>
          ) : null}

          {/* Title and summary */}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
              {title}
            </h2>

            {/* Collapsed summary state */}
            {!isOpen && isCompleted && summary && (
              <div className="text-xs text-muted-foreground truncate mt-0.5 pr-2 font-normal">
                {summary}
              </div>
            )}

            {error && (
              <p className="text-xs font-semibold text-rose-600 mt-0.5 animate-in fade-in duration-200">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Action Button: "Change" if completed & collapsed, else Chevron */}
        <div className="shrink-0 flex items-center gap-2 pl-2">
          {!isOpen && isCompleted ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange();
                else onToggle?.();
              }}
              className="text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 h-8 px-3 rounded-xl cursor-pointer"
            >
              Change
            </Button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-transform duration-200"
              aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* Body content with smooth height collapse */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isOpen
            ? 'max-h-[3000px] opacity-100 border-t border-border/60 p-4 sm:p-5'
            : 'max-h-0 opacity-0 p-0 pointer-events-none'
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default CheckoutSection;
