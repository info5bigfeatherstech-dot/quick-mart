import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

/**
 * ResponsiveModal:
 * Desktop (>= 768px): Centered shadcn Dialog
 * Mobile (< 768px): Bottom Sheet shadcn Drawer with drag handle, max 90dvh, scrollable
 */
const ResponsiveModal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  trigger,
  className = '',
  contentClassName = '',
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent
          className={cn(
            'max-h-[90dvh] flex flex-col rounded-t-2xl border-t border-border bg-background',
            className
          )}
        >
          {(title || description) && (
            <DrawerHeader className="text-left px-5 pt-3 pb-2 shrink-0 border-b border-border/40">
              {title && (
                <DrawerTitle className="text-base font-bold text-foreground">
                  {title}
                </DrawerTitle>
              )}
              {description && (
                <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </DrawerDescription>
              )}
            </DrawerHeader>
          )}

          <div
            className={cn(
              'flex-1 overflow-y-auto px-5 py-4 overscroll-contain text-sm',
              contentClassName
            )}
          >
            {children}
          </div>

          {footer && (
            <DrawerFooter className="px-5 py-3 border-t border-border/40 shrink-0 bg-background/95 backdrop-blur-sm safe-bottom">
              {footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          'sm:max-w-md bg-background border-border rounded-2xl p-6 shadow-xl',
          className
        )}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-base font-bold text-foreground">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className={cn('text-sm py-1', contentClassName)}>{children}</div>

        {footer && <DialogFooter className="pt-2">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveModal;
