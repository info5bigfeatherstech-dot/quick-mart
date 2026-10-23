import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import OrderCard from '@/components/profile/OrderCard';
import OrderDetailsView from '@/components/profile/OrderDetailsView';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { ROUTES } from '@/utils/constants';

/**
 * Orders page displaying order history, status filter tabs, and reorder functionality.
 * Switches seamlessly to in-place OrderDetailsView upon selecting an order.
 */
const Orders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdParam = searchParams.get('orderId');

  const { data: orders = [], isLoading, isError, refetch } = useOrders();
  const [filterTab, setFilterTab] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState(orderIdParam || null);

  // Sync selectedOrderId if URL param changes
  const activeOrderId = selectedOrderId || orderIdParam;
  const selectedOrder = orders.find((order) => order.id === activeOrderId);

  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setSearchParams({ orderId });
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setSearchParams({});
  };

  if (isError) {
    return (
      <ErrorState
        title="Could not load orders"
        message="Failed to fetch your past order history. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-5 border border-border rounded-2xl bg-card space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    );
  }

  // If an order is selected, display the full details view in-place (no modal/drawer)
  if (selectedOrder) {
    return (
      <OrderDetailsView
        order={selectedOrder}
        onBack={handleBackToOrders}
      />
    );
  }

  // Filter orders based on status
  const filteredOrders = orders
    .filter((order) => {
      if (filterTab === 'delivered') return order.status === 'Delivered';
      if (filterTab === 'cancelled') return order.status === 'Cancelled';
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-5">
      {/* Top Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60">
        <div>
          <h2 className="text-base sm:text-lg font-medium text-foreground">
            Order History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            View items, track dispatch status, and reorder daily groceries
          </p>
        </div>

        <Tabs value={filterTab} onValueChange={setFilterTab}>
          <TabsList className="bg-secondary rounded-xl p-1 h-9">
            <TabsTrigger
              value="all"
              className="text-xs rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-primary"
            >
              All ({orders.length})
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              className="text-xs rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-primary"
            >
              Delivered
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="text-xs rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-primary"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={filterTab === 'all' ? 'No orders yet' : `No ${filterTab} orders`}
          message="Items you purchase for 10-minute doorstep delivery will appear here."
          actionText="Start Shopping"
          onAction={() => navigate(ROUTES.HOME)}
          className="py-12 bg-card border border-border rounded-2xl"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={() => handleSelectOrder(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
