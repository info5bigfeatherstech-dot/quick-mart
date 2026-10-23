import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

/**
 * ResponsiveSheet:
 * Desktop: Right-side sliding Sheet (~420px)
 * Mobile: Bottom-sliding Drawer (up to 90dvh)
 */
const ResponsiveSheet = ({
  open,
  onOpenChange,
  children,
  className = '',
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className={cn(
            'max-h-[90dvh] h-[88dvh] flex flex-col rounded-t-2xl border-t border-border bg-background p-0',
            className
          )}
        >
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn('w-full sm:max-w-md p-0 flex flex-col bg-background', className)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default ResponsiveSheet;
