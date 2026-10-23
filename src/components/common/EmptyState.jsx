import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Reusable EmptyState component for zero items in cart, products, etc.
 */
const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'No items found',
  message = 'There is nothing to display here right now.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 px-4 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mb-4">{message}</p>
      {actionText && onAction && (
        <Button variant="default" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
