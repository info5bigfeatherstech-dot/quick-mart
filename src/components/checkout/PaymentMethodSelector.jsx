import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { paymentMethods } from '@/data/paymentMethods';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  isValidUpiId,
  getCardBrand,
  isValidCardNumber,
  isValidCardExpiry,
  isValidCardCvv,
  formatCardNumber,
  formatCardExpiry,
} from '@/utils/validators';
import { cn } from '@/lib/utils';

/**
 * PaymentMethodSelector:
 * Radio cards for UPI, Card, and COD.
 * Card details are strictly kept in local component state (never in Zustand or localStorage).
 */
const PaymentMethodSelector = ({
  paymentMethod = 'upi',
  onPaymentMethodChange,
  upiId = '',
  onUpiIdChange,
  isUpiVerified = false,
  onUpiVerifiedChange,
  cartTotal = 0,
  onCardValidChange,
}) => {
  // --- UPI Local State ---
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiError, setUpiError] = useState('');

  // --- Card Local State (NEVER persisted or logged) ---
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardTouched, setCardTouched] = useState({
    number: false,
    expiry: false,
    cvv: false,
    name: false,
  });

  const cardBrand = getCardBrand(cardNumber);
  const isNumberValid = isValidCardNumber(cardNumber);
  const isExpiryValid = isValidCardExpiry(cardExpiry);
  const isCvvValid = isValidCardCvv(cardCvv, cardBrand);
  const isNameValid = cardName.trim().length >= 3;
  const isCardFormValid = isNumberValid && isExpiryValid && isCvvValid && isNameValid;

  // Inform parent of card validity
  useEffect(() => {
    onCardValidChange?.(isCardFormValid);
  }, [isCardFormValid, onCardValidChange]);

  // Handle UPI Verification dummy simulation
  const handleVerifyUpi = () => {
    if (!isValidUpiId(upiId)) {
      setUpiError('Please enter a valid UPI ID (e.g. name@okhdfcbank)');
      onUpiVerifiedChange?.(false);
      return;
    }

    setUpiError('');
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      onUpiVerifiedChange?.(true);
    }, 500);
  };

  const handleUpiInputChange = (e) => {
    const val = e.target.value.trim().toLowerCase();
    onUpiIdChange?.(val);
    if (isUpiVerified) onUpiVerifiedChange?.(false);
    if (upiError) setUpiError('');
  };

  const isCodDisabled = cartTotal > 5000;

  return (
    <div className="space-y-4">
      <RadioGroup
        value={paymentMethod}
        onValueChange={(val) => {
          onPaymentMethodChange?.(val);
        }}
        className="space-y-3"
      >
        {paymentMethods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const isDisabled = method.id === 'cod' && isCodDisabled;

          return (
            <div
              key={method.id}
              className={cn(
                'rounded-xl border transition-all overflow-hidden',
                isSelected
                  ? 'border-primary/70 bg-primary/5 ring-1 ring-primary/40 shadow-2xs'
                  : 'border-border/70 bg-card hover:border-primary/40',
                isDisabled && 'opacity-60 bg-muted/30 cursor-not-allowed hover:border-border/70'
              )}
            >
              <Label
                htmlFor={`payment-${method.id}`}
                className={cn(
                  'flex items-center gap-3.5 p-4 select-none',
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                )}
              >
                <RadioGroupItem
                  value={method.id}
                  id={`payment-${method.id}`}
                  disabled={isDisabled}
                />

                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {method.id === 'upi' && <Smartphone className="h-4 w-4" />}
                  {method.id === 'card' && <CreditCard className="h-4 w-4" />}
                  {method.id === 'cod' && <Banknote className="h-4 w-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {method.name}
                    </span>
                    {method.badge && (
                      <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/20 border-0 text-[10px] px-1.5 py-0">
                        {method.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {method.description}
                  </p>
                  {isDisabled && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-0.5">
                      COD is not available for orders above ₹5,000
                    </p>
                  )}
                </div>
              </Label>

              {/* Sub-Panel: UPI Form */}
              {isSelected && method.id === 'upi' && (
                <div className="px-4 pb-4 pt-1 border-t border-border/50 bg-background/50 space-y-2.5 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="upi-id-input"
                      className="text-xs font-semibold text-foreground/80"
                    >
                      Enter your UPI ID / VPA
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      e.g. mobile@upi, name@okaxis
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="upi-id-input"
                        type="text"
                        placeholder="username@bank"
                        value={upiId}
                        onChange={handleUpiInputChange}
                        className={cn(
                          'text-xs h-10',
                          isUpiVerified && 'border-emerald-500 pr-8',
                          upiError && 'border-rose-400'
                        )}
                      />
                      {isUpiVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant={isUpiVerified ? 'outline' : 'default'}
                      size="sm"
                      onClick={handleVerifyUpi}
                      disabled={isVerifyingUpi || !upiId.trim()}
                      className="h-10 px-4 text-xs font-bold cursor-pointer shrink-0"
                    >
                      {isVerifyingUpi ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : isUpiVerified ? (
                        'Verified'
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>

                  {upiError && (
                    <p className="text-xs font-medium text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {upiError}
                    </p>
                  )}

                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Test failure path with <code className="font-mono text-foreground font-semibold">fail@upi</code></span>
                  </div>
                </div>
              )}

              {/* Sub-Panel: Card Form */}
              {isSelected && method.id === 'card' && (
                <div className="px-4 pb-4 pt-1 border-t border-border/50 bg-background/50 space-y-3 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                    <span>Card Information</span>
                    {cardBrand !== 'generic' && (
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary">
                        {cardBrand}
                      </Badge>
                    )}
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Card number (xxxx xxxx xxxx xxxx)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      onBlur={() => setCardTouched((p) => ({ ...p, number: true }))}
                      className={cn(
                        'text-xs h-10',
                        cardTouched.number && !isNumberValid && 'border-rose-400'
                      )}
                      maxLength={23}
                    />
                    {cardTouched.number && !isNumberValid && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        Please enter a valid card number (Luhn verified)
                      </p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                        onBlur={() => setCardTouched((p) => ({ ...p, expiry: true }))}
                        className={cn(
                          'text-xs h-10',
                          cardTouched.expiry && !isExpiryValid && 'border-rose-400'
                        )}
                        maxLength={5}
                      />
                      {cardTouched.expiry && !isExpiryValid && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          Valid future MM/YY
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Input
                        type="password"
                        inputMode="numeric"
                        placeholder={cardBrand === 'amex' ? 'CVV (4 digits)' : 'CVV (3 digits)'}
                        value={cardCvv}
                        onChange={(e) =>
                          setCardCvv(e.target.value.replace(/\D/g, '').slice(0, cardBrand === 'amex' ? 4 : 3))
                        }
                        onBlur={() => setCardTouched((p) => ({ ...p, cvv: true }))}
                        className={cn(
                          'text-xs h-10',
                          cardTouched.cvv && !isCvvValid && 'border-rose-400'
                        )}
                        maxLength={cardBrand === 'amex' ? 4 : 3}
                      />
                      {cardTouched.cvv && !isCvvValid && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          Invalid CVV
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Name on Card */}
                  <div className="space-y-1">
                    <Input
                      type="text"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onBlur={() => setCardTouched((p) => ({ ...p, name: true }))}
                      className={cn(
                        'text-xs h-10',
                        cardTouched.name && !isNameValid && 'border-rose-400'
                      )}
                    />
                    {cardTouched.name && !isNameValid && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        Enter the cardholder name
                      </p>
                    )}
                  </div>

                  {/* Demo Disclaimer */}
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 text-emerald-800 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Demo mode: Card details stay local and no real transaction is processed.</span>
                  </div>
                </div>
              )}

              {/* Sub-Panel: COD Note */}
              {isSelected && method.id === 'cod' && (
                <div className="px-4 pb-4 pt-1 border-t border-border/50 bg-background/50 space-y-1 animate-in fade-in-50 duration-200">
                  <p className="text-xs text-muted-foreground">
                    💵 Pay with cash or scan delivery partner's UPI QR code upon arrival at your doorstep.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
