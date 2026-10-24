import React from 'react';
import { AlertTriangle, RefreshCw, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Inline PaymentFailed alert state showing failure message,
 * "Try again" button and "Choose another payment method" button.
 */
const PaymentFailed = ({
  error,
  onRetry,
  onChangePaymentMethod,
  isRetrying = false,
}) => {
  return (
    <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-4 sm:p-5 text-rose-950 space-y-3 shadow-xs animate-in fade-in-50 duration-200">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-rose-900">
            Payment Simulation Failed
          </h3>
          <p className="text-xs text-rose-800 leading-relaxed mt-1">
            {error ||
              'We were unable to complete your payment. Don’t worry, your cart and order details are safe.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 pl-12">
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-9 px-4 rounded-xl cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRetrying ? 'animate-spin' : ''}`} />
          Try Again
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onChangePaymentMethod}
          className="border-rose-300 text-rose-900 hover:bg-rose-100/60 text-xs font-semibold h-9 px-4 rounded-xl cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5 mr-1.5 text-rose-700" />
          Choose another method
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailed;
