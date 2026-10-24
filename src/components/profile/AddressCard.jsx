import React, { useState } from 'react';
import {
  Home,
  Briefcase,
  MapPin,
  Pencil,
  Trash2,
  CheckCircle2,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPhone } from '@/utils/formatPhone';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * AddressCard: Single row address item matching quick-commerce style
 * Features warm category icon, title, full address string, and a 3-dots actions menu
 * Supports selectable mode for checkout flow
 */
const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
  selectable = false,
  selected = false,
  onSelect,
  serviceable = true,
  serviceabilityMessage,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!address) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Work':
        return <Briefcase className="h-4 w-4" />;
      case 'Other':
        return <MapPin className="h-4 w-4" />;
      case 'Home':
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const fullAddressString = [
    address.houseNo,
    address.streetArea,
    address.landmark,
    `${address.city}${address.pincode ? ` - ${address.pincode}` : ''}`,
  ]
    .filter(Boolean)
    .join(', ');

  const handleCardClick = (e) => {
    if (selectable && onSelect) {
      onSelect(address);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        role={selectable ? 'radio' : undefined}
        aria-checked={selectable ? selected : undefined}
        tabIndex={selectable ? 0 : undefined}
        onKeyDown={(e) => {
          if (selectable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSelect?.(address);
          }
        }}
        className={cn(
          'flex items-start justify-between gap-3 p-4 sm:p-5 transition-all select-none group',
          selectable
            ? 'cursor-pointer rounded-2xl border'
            : 'hover:bg-secondary/30',
          selectable && selected
            ? 'border-primary/70 bg-primary/5 ring-1 ring-primary/40 shadow-xs'
            : selectable
            ? 'border-border/70 bg-card hover:border-primary/40 hover:bg-secondary/15'
            : '',
          selectable && !serviceable && 'border-amber-300/80 bg-amber-50/20'
        )}
      >
        {/* Left Radio (in selectable mode), Icon and Address Details */}
        <div className="flex items-start gap-3 sm:gap-3.5 min-w-0 flex-1">
          {selectable && (
            <div className="shrink-0 flex items-center pt-2.5 pr-0.5">
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  selected
                    ? 'border-primary bg-primary text-white shadow-2xs'
                    : 'border-muted-foreground/35 bg-background group-hover:border-primary/60'
                )}
              >
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          )}

          {/* Warm Amber Icon Container */}
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-[#FDF6E7] border border-[#FBEAC4] text-[#B88714] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            {getTypeIcon(address.type)}
          </div>

          {/* Text Information */}
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">
                {address.type || 'Home'}
              </h4>

              {address.isDefault && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                  Default
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
              {fullAddressString}
            </p>

            {(address.name || address.phone) && (
              <p className="text-[11px] text-muted-foreground/75 font-medium mt-1">
                {address.name} {address.phone ? `• ${formatPhone(address.phone)}` : ''}
              </p>
            )}

            {!serviceable && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-200/80 px-2 py-1 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{serviceabilityMessage || "We don't deliver here yet"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Three Dots Action Menu */}
        <div
          className="shrink-0 pt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus-visible:ring-1 focus-visible:ring-emerald-500 cursor-pointer"
                aria-label="Address actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl border-border bg-popover p-1 shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => onEdit?.(address)}
                className="flex items-center gap-2 text-xs font-semibold py-2 px-2.5 cursor-pointer rounded-lg hover:bg-accent"
              >
                <Pencil className="h-3.5 w-3.5 text-primary" />
                <span>Edit address</span>
              </DropdownMenuItem>

              {!address.isDefault && (
                <DropdownMenuItem
                  onClick={() => onSetDefault?.(address.id)}
                  disabled={isSettingDefault}
                  className="flex items-center gap-2 text-xs font-semibold py-2 px-2.5 cursor-pointer rounded-lg hover:bg-accent"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Set as default</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="my-1 bg-border/60" />

              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
                className="flex items-center gap-2 text-xs font-semibold py-2 px-2.5 text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete address</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border sm:max-w-[420px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground">
              Delete Delivery Address?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to remove this address ({address.houseNo}, {address.city})?
              {address.isDefault &&
                ' Since this is your default address, another saved address will automatically be selected.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel className="text-xs font-semibold rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(address.id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold rounded-xl"
            >
              Delete Address
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddressCard;
