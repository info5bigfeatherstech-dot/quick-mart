import React, { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { useAddresses } from '@/hooks/useAddresses';
import { useAddAddress } from '@/hooks/useAddAddress';
import { useUpdateAddress } from '@/hooks/useUpdateAddress';
import { useDeleteAddress } from '@/hooks/useDeleteAddress';
import { useSetDefaultAddress } from '@/hooks/useSetDefaultAddress';
import AddressCard from '@/components/profile/AddressCard';
import AddressForm from '@/components/profile/AddressForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

/**
 * Addresses management page with add/edit dialogs, delete confirmations, and default switcher
 */
const Addresses = () => {
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();

  const addMutation = useAddAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEdit = (address) => {
    setEditingAddress(address);
    setIsFormDialogOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingAddress) {
      updateMutation.mutate(
        { id: editingAddress.id, data: formData },
        {
          onSuccess: () => {
            setIsFormDialogOpen(false);
            setEditingAddress(null);
          },
        }
      );
    } else {
      addMutation.mutate(formData, {
        onSuccess: () => {
          setIsFormDialogOpen(false);
        },
      });
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Could not load addresses"
        message="Failed to retrieve your delivery locations. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5 pb-1">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="bg-card border border-border/80 rounded-2xl divide-y divide-border/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header matching screenshot */}
      <div className="space-y-1.5 pb-1">
        <h2 className="text-lg sm:text-xl font-medium text-foreground tracking-tight">
          My Addresses
        </h2>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses List matching screenshot */}
      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          message="You haven't added any delivery addresses yet. Add your home or office address for lightning-fast checkout."
          actionText="Add New Address"
          onAction={handleOpenAdd}
          className="py-12 bg-card border border-border rounded-2xl"
        />
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden divide-y divide-border/60 shadow-xs">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleOpenEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onSetDefault={(id) => setDefaultMutation.mutate(id)}
              isDeleting={deleteMutation.isPending}
              isSettingDefault={setDefaultMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Address Responsive Modal (Drawer on mobile, Dialog on desktop) */}
      <ResponsiveModal
        open={isFormDialogOpen}
        onOpenChange={(open) => {
          setIsFormDialogOpen(open);
          if (!open) setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Delivery Address' : 'Add New Address'}
        description="Provide complete address details so our delivery riders can reach you seamlessly."
      >
        <AddressForm
          initialData={editingAddress || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormDialogOpen(false);
            setEditingAddress(null);
          }}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
        />
      </ResponsiveModal>
    </div>
  );
};

export default Addresses;
