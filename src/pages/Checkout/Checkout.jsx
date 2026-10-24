import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Lock,
  Plus,
  AlertTriangle,
  Loader2,
  Trash2,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useAddresses } from '@/hooks/useAddresses';
import { useAddAddress } from '@/hooks/useAddAddress';
import { useUpdateAddress } from '@/hooks/useUpdateAddress';
import { useServiceability } from '@/hooks/useServiceability';
import { useValidateCart } from '@/hooks/useValidateCart';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { calculateBill } from '@/utils/billCalculator';
import { scrollToError } from '@/utils/scrollToError';
import { isValidUpiId } from '@/utils/validators';
import { ROUTES } from '@/utils/constants';

import CheckoutSection from '@/components/checkout/CheckoutSection';
import DeliveryInstructions from '@/components/checkout/DeliveryInstructions';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentFailed from '@/components/checkout/PaymentFailed';
import AddressCard from '@/components/profile/AddressCard';
import AddressForm from '@/components/profile/AddressForm';
import QuantityStepper from '@/components/product/QuantityStepper';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Checkout = () => {
  const navigate = useNavigate();

  // --- Cart Store ---
  const items = useCartStore((state) => state.items);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeItem = useCartStore((state) => state.removeItem);

  // --- Checkout Store ---
  const {
    selectedAddressId,
    deliveryOption,
    selectedSlot,
    deliveryInstructions,
    paymentMethod,
    upiId,
    coupon,
    tip,
    setSelectedAddressId,
    setDeliveryOption,
    setSelectedSlot,
    setDeliveryInstructions,
    setPaymentMethod,
    setUpiId,
    setCoupon,
    setTip,
  } = useCheckoutStore();

  // --- Section Open State ---
  // Address & Review collapsed by default, Payment Method is open
  const [openSection, setOpenSection] = useState('payment');
  const [sectionErrors, setSectionErrors] = useState({});

  // --- Address State & Mutations ---
  const { data: addresses = [], isLoading: isLoadingAddresses } = useAddresses();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // If user has no saved addresses, automatically open Address section
  useEffect(() => {
    if (!isLoadingAddresses && addresses.length === 0) {
      setOpenSection('address');
    }
  }, [isLoadingAddresses, addresses.length]);

  // Preselect default address if none selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

  // Current selected address object
  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  // Check serviceability of selected address
  const { data: serviceabilityData, isLoading: isCheckingServiceability } =
    useServiceability(selectedAddress?.pincode);
  const isAddressServiceable =
    serviceabilityData?.serviceable ?? true;

  // --- Cart Revalidation ---
  const [cartValidationResult, setCartValidationResult] = useState({ valid: true, errors: [] });
  const validateCartMutation = useValidateCart();

  useEffect(() => {
    if (items.length > 0) {
      validateCartMutation.mutate(items, {
        onSuccess: (data) => {
          setCartValidationResult(data);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Empty cart redirect rule
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [items, navigate]);

  // --- Payment Validation ---
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isCardFormValid, setIsCardFormValid] = useState(false);

  // --- Bill Calculation ---
  const bill = useMemo(() => {
    return calculateBill({
      items,
      coupon,
      tip,
      deliveryOption,
    });
  }, [items, coupon, tip, deliveryOption]);

  // --- Place Order Mutation ---
  const placeOrderMutation = usePlaceOrder();
  const [paymentError, setPaymentError] = useState('');

  // Auto-verify UPI if valid format (or dummy test)
  useEffect(() => {
    if (paymentMethod === 'upi' && isValidUpiId(upiId)) {
      setIsUpiVerified(true);
    }
  }, [paymentMethod, upiId]);

  // Determine section completion
  const isAddressCompleted = Boolean(selectedAddress && isAddressServiceable);
  const isReviewCompleted = items.length > 0 && cartValidationResult.valid;
  const isPaymentCompleted =
    paymentMethod === 'cod'
      ? bill.grandTotal <= 5000
      : paymentMethod === 'upi'
      ? isValidUpiId(upiId)
      : paymentMethod === 'card'
      ? isCardFormValid
      : false;

  // Validation function before placing order
  const validateBeforeSubmit = () => {
    const errors = {};

    if (!selectedAddress) {
      errors.address = 'Please select a delivery address';
    } else if (!isAddressServiceable) {
      errors.address = "Selected address is not in QuickMart's delivery zone";
    }

    if (items.length === 0) {
      errors.review = 'Your cart is empty';
    } else if (!cartValidationResult.valid) {
      errors.review = 'Please remove out of stock items to proceed';
    }

    if (!paymentMethod) {
      errors.payment = 'Please select a payment method';
    } else if (paymentMethod === 'upi' && !isValidUpiId(upiId)) {
      errors.payment = 'Please enter a valid UPI ID';
    } else if (paymentMethod === 'card' && !isCardFormValid) {
      errors.payment = 'Please enter valid card details';
    } else if (paymentMethod === 'cod' && bill.grandTotal > 5000) {
      errors.payment = 'Cash on delivery is not allowed above ₹5,000';
    }

    setSectionErrors(errors);

    if (errors.address) {
      setOpenSection('address');
      scrollToError('section-address');
      return false;
    }
    if (errors.review) {
      setOpenSection('review');
      scrollToError('section-review');
      return false;
    }
    if (errors.payment) {
      setOpenSection('payment');
      scrollToError('section-payment');
      return false;
    }

    return true;
  };

  // Place order trigger
  const handlePlaceOrder = () => {
    if (!validateBeforeSubmit()) return;

    setPaymentError('');
    const payload = {
      items,
      addressId: selectedAddress.id,
      address: selectedAddress,
      deliveryOption: 'now',
      instructions: deliveryInstructions,
      paymentMethod,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
      coupon,
      tip,
      bill,
    };

    placeOrderMutation.mutate(payload, {
      onError: (err) => {
        const msg = err.message || 'Payment processing failed. Please try again.';
        setPaymentError(msg);
        toast.error(msg);
        // Scroll to payment section
        setOpenSection('payment');
        scrollToError('section-payment');
      },
    });
  };

  // Handle address save in modal
  const handleSaveAddress = async (formData) => {
    try {
      if (editingAddress?.id) {
        const res = await updateAddressMutation.mutateAsync({
          id: editingAddress.id,
          data: formData,
        });
        setSelectedAddressId(res.data?.id || editingAddress.id);
      } else {
        const res = await addAddressMutation.mutateAsync(formData);
        if (res.data?.id) {
          setSelectedAddressId(res.data.id);
        }
      }
      setIsAddressModalOpen(false);
      setEditingAddress(null);
    } catch {
      // Error handled by mutation
    }
  };

  // Section summary lines
  const addressSummary = selectedAddress
    ? `${selectedAddress.type || 'Home'} • ${selectedAddress.name} (${selectedAddress.houseNo}, ${selectedAddress.city})`
    : 'No address selected';

  const reviewSummary = `${items.length} ${items.length === 1 ? 'item' : 'items'} • ₹${bill.itemTotal.toFixed(2)}`;

  const paymentSummary =
    paymentMethod === 'upi'
      ? `UPI ${upiId ? `(${upiId})` : ''}`
      : paymentMethod === 'card'
      ? 'Credit/Debit Card'
      : paymentMethod === 'cod'
      ? 'Cash on Delivery'
      : 'No payment selected';

  // Disabled reason for submit button
  const getDisabledReason = () => {
    if (!selectedAddress) return 'Please choose a delivery address';
    if (!isAddressServiceable) return 'Address outside serviceable area';
    if (!cartValidationResult.valid) return 'Review your cart items';
    if (paymentMethod === 'upi' && !isValidUpiId(upiId)) return 'Enter a valid UPI ID';
    if (paymentMethod === 'card' && !isCardFormValid) return 'Complete card details';
    if (paymentMethod === 'cod' && bill.grandTotal > 5000) return 'COD unavailable above ₹5,000';
    return '';
  };

  const disabledReason = getDisabledReason();
  const isSubmitDisabled = Boolean(disabledReason);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Your cart is empty. Redirecting to home...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-24 lg:pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.HOME}
              className="p-2 -ml-2 rounded-full hover:bg-secondary text-foreground transition-colors"
              aria-label="Back to shopping"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Checkout
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Review your order and pay securely
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-bit checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Sections (~62% = 7.5 cols approx, lg:col-span-7 or 8) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Delivery Address */}
            <CheckoutSection
              id="section-address"
              title="Delivery Address"
              icon={<MapPin className="h-4 w-4" />}
              isOpen={openSection === 'address'}
              onToggle={() => setOpenSection(openSection === 'address' ? '' : 'address')}
              isCompleted={isAddressCompleted}
              summary={addressSummary}
              onChange={() => setOpenSection('address')}
              error={sectionErrors.address}
            >
              <div className="space-y-4">
                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading saved addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  /* No addresses: Inline Form */
                  <div className="p-4 rounded-xl border border-dashed border-border bg-card">
                    <h4 className="text-xs font-bold text-foreground mb-3">
                      Add your first delivery address
                    </h4>
                    <AddressForm
                      onSubmit={handleSaveAddress}
                      isSubmitting={addAddressMutation.isPending}
                    />
                  </div>
                ) : (
                  /* Address Cards Radio List */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2.5">
                      {addresses.map((addr) => {
                        const isSelected = addr.id === selectedAddressId;
                        const isThisServiceable =
                          isSelected ? isAddressServiceable : true;

                        return (
                          <AddressCard
                            key={addr.id}
                            address={addr}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              setSelectedAddressId(addr.id);
                              setSectionErrors((p) => ({ ...p, address: '' }));
                            }}
                            onEdit={(a) => {
                              setEditingAddress(a);
                              setIsAddressModalOpen(true);
                            }}
                            serviceable={isThisServiceable}
                            serviceabilityMessage="We don't deliver to this pincode yet"
                          />
                        );
                      })}
                    </div>

                    {/* Add New Address Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="w-full h-10 rounded-xl text-xs font-bold border-dashed border-primary/40 text-primary hover:bg-primary/5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add new address
                    </Button>
                  </div>
                )}

                {/* Delivery Instructions */}
                <div className="pt-2 border-t border-border/60">
                  <DeliveryInstructions
                    value={deliveryInstructions}
                    onChange={setDeliveryInstructions}
                  />
                </div>

                {/* Continue to Payment */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={!selectedAddress || !isAddressServiceable}
                    onClick={() => setOpenSection('payment')}
                    className="text-xs font-bold rounded-xl px-5 cursor-pointer"
                  >
                    Confirm & Continue
                  </Button>
                </div>
              </div>
            </CheckoutSection>

            {/* Order Review */}
            <CheckoutSection
              id="section-review"
              title="Order Review"
              icon={<ShoppingBag className="h-4 w-4" />}
              isOpen={openSection === 'review'}
              onToggle={() => setOpenSection(openSection === 'review' ? '' : 'review')}
              isCompleted={isReviewCompleted}
              summary={reviewSummary}
              onChange={() => setOpenSection('review')}
              error={sectionErrors.review}
            >
              <div className="space-y-4">
                {/* Out of stock warning banner if revalidation failed */}
                {!cartValidationResult.valid && (
                  <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/70 text-rose-900 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Item availability alert:</span>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5">
                        {cartValidationResult.errors.map((err, idx) => (
                          <li key={idx}>{err.message}</li>
                        ))}
                      </ul>
                      <p className="mt-1 text-[11px] font-medium text-rose-700">
                        Please remove or update unavailable items to continue.
                      </p>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-background overflow-hidden">
                  {items.map((item) => {
                    const itemKey = item.key || item.product?.id;
                    const price = item.selectedVariant?.price ?? item.product?.price ?? 0;
                    const isUnavailable = cartValidationResult.errors?.some(
                      (e) => e.key === itemKey
                    );

                    return (
                      <div
                        key={itemKey}
                        className={cn(
                          'p-3 sm:p-4 flex items-center justify-between gap-3',
                          isUnavailable && 'bg-rose-50/40'
                        )}
                      >
                        {/* Thumbnail & Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={item?.product?.image || ''}
                            alt={item?.product?.name || 'Product'}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-contain bg-muted/40 p-1 border shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                              {item?.product?.name || 'Item'}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item?.selectedVariant?.weight ||
                                item?.product?.weight ||
                                item?.selectedVariant?.label ||
                                ''}
                            </p>
                            {isUnavailable && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper & Price */}
                        <div className="flex items-center gap-3 shrink-0">
                          <QuantityStepper
                            size="sm"
                            quantity={item.quantity}
                            onIncrease={() => increaseQty(itemKey)}
                            onDecrease={() => decreaseQty(itemKey)}
                          />

                          <div className="text-right min-w-[60px]">
                            <span className="text-xs sm:text-sm font-bold text-foreground">
                              ₹{(price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(itemKey)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={!isReviewCompleted}
                    onClick={() => setOpenSection('payment')}
                    className="text-xs font-bold rounded-xl px-5 cursor-pointer"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </CheckoutSection>

            {/* Payment Method */}
            <CheckoutSection
              id="section-payment"
              title="Payment Method"
              icon={<CreditCard className="h-4 w-4" />}
              isOpen={openSection === 'payment'}
              onToggle={() => setOpenSection(openSection === 'payment' ? '' : 'payment')}
              isCompleted={isPaymentCompleted}
              summary={paymentSummary}
              onChange={() => setOpenSection('payment')}
              error={sectionErrors.payment}
            >
              <div className="space-y-4">
                {/* Inline Payment Failed alert if previous attempt errored */}
                {paymentError && (
                  <PaymentFailed
                    error={paymentError}
                    onRetry={handlePlaceOrder}
                    onChangePaymentMethod={() => {
                      setPaymentError('');
                      setPaymentMethod('cod');
                    }}
                    isRetrying={placeOrderMutation.isPending}
                  />
                )}

                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={(m) => {
                    setPaymentMethod(m);
                    setSectionErrors((p) => ({ ...p, payment: '' }));
                    if (paymentError) setPaymentError('');
                  }}
                  upiId={upiId}
                  onUpiIdChange={setUpiId}
                  isUpiVerified={isUpiVerified}
                  onUpiVerifiedChange={setIsUpiVerified}
                  cartTotal={bill.grandTotal}
                  onCardValidChange={setIsCardFormValid}
                />
              </div>
            </CheckoutSection>
          </div>

          {/* Right Column: Sticky Order Summary (~38% = 5 or 4 cols, lg:col-span-5 xl:col-span-4) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 space-y-4">
            <OrderSummary
              bill={bill}
              items={items}
              coupon={coupon}
              onApplyCoupon={setCoupon}
              onRemoveCoupon={() => setCoupon(null)}
              tip={tip}
              onTipChange={setTip}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={placeOrderMutation.isPending}
              disabled={isSubmitDisabled}
              disabledReason={disabledReason}
              hideSubmitButton={false} // Shown on desktop, mobile has sticky bar
              className="hidden lg:block"
            />

            {/* Mobile Compact Bill Details */}
            <OrderSummary
              bill={bill}
              items={items}
              coupon={coupon}
              onApplyCoupon={setCoupon}
              onRemoveCoupon={() => setCoupon(null)}
              tip={tip}
              onTipChange={setTip}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={placeOrderMutation.isPending}
              disabled={isSubmitDisabled}
              disabledReason={disabledReason}
              hideSubmitButton={true} // Hidden inside card on mobile, handled by fixed bottom bar
              className="lg:hidden"
            />
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Bar (safe-area padding) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 safe-bottom shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Total to pay
            </div>
            <div className="text-base font-extrabold text-foreground">
              ₹{bill.grandTotal.toFixed(2)}
            </div>
          </div>

          <div className="flex-1 max-w-[220px]">
            <Button
              type="button"
              size="lg"
              disabled={isSubmitDisabled || placeOrderMutation.isPending}
              onClick={handlePlaceOrder}
              className="w-full h-11 text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Placing order...
                </>
              ) : (
                'Place order'
              )}
            </Button>
          </div>
        </div>

        {disabledReason && (
          <p className="text-[10px] text-center font-medium text-amber-600 mt-1 max-w-md mx-auto truncate">
            {disabledReason}
          </p>
        )}
      </div>

      {/* Address Add / Edit Modal (ResponsiveModal: Drawer on mobile, Dialog on desktop) */}
      <ResponsiveModal
        open={isAddressModalOpen}
        onOpenChange={(open) => {
          setIsAddressModalOpen(open);
          if (!open) setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Delivery Address' : 'Add New Address'}
        description="Enter full address details for quick 10-minute grocery delivery"
      >
        <AddressForm
          initialData={editingAddress || {}}
          onSubmit={handleSaveAddress}
          onCancel={() => {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
          }}
          isSubmitting={
            addAddressMutation.isPending || updateAddressMutation.isPending
          }
        />
      </ResponsiveModal>
    </div>
  );
};

export default Checkout;
